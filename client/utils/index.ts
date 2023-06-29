import { Restriction } from "../dto/restriction.dto";
import { Address } from "../dto/address.dto";
import api from "../api";
import { Ref } from "vue";
import { useAddressStore } from "../store/address";
import { useRestrictionsStore } from "../store/restrictions";
import { FetchError } from "ofetch";
import { Arrete } from "../dto/arrete.dto";
import { Geo } from "../dto/geo.dto";
import { Departement } from "../dto/departement.dto";

const index = {
  debounce(fn: Function, delay: number) {
    let timeoutID: any = null
    return function () {
      clearTimeout(timeoutID)
      // eslint-disable-next-line prefer-rest-params
      const args = arguments
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this
      timeoutID = setTimeout(function () {
        fn.apply(that, args)
      }, delay)
    }
  },

  showRestrictions(restrictions: Restriction[]): boolean {
    let show = false;
    restrictions.forEach((r: Restriction) => {
      if (r.usages && r.usages.filter(u => u.thematique !== 'Autre').length > 0) {
        show = true;
      }
    });
    return show;
  },

  getRestrictionRank(restriction: Restriction): number | undefined {
    switch (restriction.niveauAlerte) {
      case 'Crise':
        return 4;
      case 'Alerte renforcée':
        return 3;
      case 'Alerte':
        return 2;
      case 'Vigilance':
        return 1;
      default:
        return 0;
    }
  },

  getSituationBadgeLabel(situationRank: number | undefined): string {
    if (!situationRank) {
      return '';
    }
    let label = `${situationRank}/4 - `
    label += this.getShortSituationLabel(situationRank)
    return label;
  },

  getShortSituationLabel(situationRank: number | undefined): string {
    if (!situationRank) {
      return '';
    }
    let label = '';
    switch (situationRank) {
      case 1:
        label += 'vigilance';
        break;
      case 2:
        label += `alerte`;
        break;
      case 3:
        label += `alerte renforcée`;
        break;
      case 4:
        label += `crise`;
        break;
    }
    return label;
  },

  getProvenanceLabel(restriction: Restriction, light: boolean = false, inverse: boolean = false): string | undefined {
    const type = !inverse ? restriction.type : restriction.type === 'SUP' ? 'SOU' : 'SUP';
    switch (type) {
      case 'SOU':
        return !light ? `Si j'utilise de l'eau qui provient de nappes souterraines (puits, forages ...) des restrictions différentes s'appliquent` :
          `de nappes souterraines (puits, forages ...)`
      case 'SUP':
        return !light ? `Si j'utilise de l'eau qui provient des cours d'eau (rivières, mares, étangs ...) des restrictions différentes s'appliquent` :
          `des cours d'eau (rivières, mares, étangs ...)`
    }
  },

  async searchRestriction(address: Address | null,
                          geo: Geo | null,
                          profile: string,
                          modalTitle: Ref<string>,
                          modalText: Ref<string>,
                          modalIcon: Ref<string>,
                          modalActions: Ref<any[]>,
                          modalOpened: Ref<boolean>,
                          router: any,
                          loadingRestrictions: Ref<boolean>) {
    const addressStore = useAddressStore();
    const restrictionsStore = useRestrictionsStore();
    const {setAddress, setGeo} = addressStore;
    const {setRestrictions} = restrictionsStore;

    loadingRestrictions.value = true;
    const [{data, error}, {data: departementConfig, error: errorDepartement}] = await Promise.all([
      address ? api.searchRestrictionByAdress(address, profile) : await api.searchRestrictionByGeo(geo, profile),
      api.searchDepartementConfig(address ? address.properties.citycode >= '97' ? address.properties.citycode.slice(0, 3) : address.properties.citycode.slice(0, 2) : geo.codeDepartement)
    ]);
    try {
      window._paq.push(['trackEvent', 'API CALL', 'CODE INSEE', address ? address.properties.citycode : geo?.code, 1]);
      window._paq.push(['trackEvent', 'API CALL', 'CODE DEPARTEMENT', address ? address.properties.citycode >= '97' ? address.properties.citycode.slice(0, 3) : address.properties.citycode.slice(0, 2) : geo.codeDepartement, 1]);
      window._paq.push(['trackEvent', 'API CALL', 'PROFIL', profile, 1]);
    } catch (e) {
    }
    loadingRestrictions.value = false;

    // SI ERREUR
    if ((error?.value && error.value.statusCode !== 404) || profile !== 'particulier') {
      const {
        title,
        text,
        icon,
        actions
      } = this.handleRestrictionError(error.value, data?.value, profile, modalOpened, departementConfig);
      modalTitle.value = title;
      modalText.value = text;
      modalIcon.value = icon;
      modalActions.value = actions;
      modalOpened.value = true;
      return;
    }

    // SI DATA RENVOYEE
    address ? setAddress(address) : setGeo(geo);
    setRestrictions(data?.value ? data.value : [], profile, departementConfig.value);
    let query: any = {};
    query = address ? (['municipality', 'locality'].includes(address.properties.type) ?
      {code_insee: address.properties.citycode} : {
        lon: address.geometry.coordinates[0],
        lat: address.geometry.coordinates[1]
      }) : {code_insee: geo?.code};
    query.profil = profile;
    router.push({path: '/situation', query});
  },

  getArretes(restrictions: Restriction[]): Arrete[] {
    const arretes: Arrete[] = restrictions.map(r => r.arrete);
    return arretes.filter((arrete, index, arretes) => {
      return arretes.findIndex(a => a.idArrete === arrete.idArrete) === index;
    });
  },

  handleRestrictionError(error: FetchError, data: Restriction[], profile: string, modalOpened: Ref<boolean>, departementConfig: Departement): {
    title: string,
    text: string,
    icon: string,
    actions: any[]
  } {
    // Déclaration des fonctions à utiliser dans la modale
    const _closeModal = (): void => {
      modalOpened.value = false;
    };
    const _downloadArrete = (): void => {
      // @ts-ignore
      window.open(data[0].arrete.cheminFichier, '_blank').focus();
      modalOpened.value = false;
      try {
        window._paq.push(['trackEvent', 'TELECHARGEMENT ARRETE', 'PROFIL', profile, 1]);
      } catch (e) {
      }
    };
    if (profile !== 'particulier' && !error?.statusCode && data.length > 0) {
      return {
        title: `Télécharger l’arrêté préfectoral`,
        text: `Afin de recevoir des informations sur les restrictions, vous pouvez télécharger l’arrêté préfectoral lié à votre adresse !`,
        icon: `ri-download-2-line`,
        actions: [{label: "Consulter l'arrêté préfectoral", onClick: _downloadArrete}, {
          label: "Annuler",
          onClick: _closeModal,
          secondary: true
        }]
      };
    }
    switch (error?.statusCode) {
      case 404:
      case undefined:
        return {
          title: `Pas d'arrêté en vigueur`,
          text: `Votre adresse n'est actuellement pas concernée par un arrêté préfectoral.
<br/>Aucune restriction n'est à appliquer à votre adresse, nous vous conseillons tout de même de suivre les eco-gestes présents sur notre site !`,
          icon: `ri-arrow-right-line`,
          actions: []
        };
      case 409:
        return {
          title: `Nous avons besoin de plus de précision`,
          text: `Afin de vous communiquer des informations de qualité, nous avons besoin du : nom de votre rue, le code postal et le nom de votre ville.`,
          icon: `ri-map-pin-user-line`,
          actions: [{
            label: "Entrer une adresse plus précise",
            onClick: _closeModal
          }, {label: "Fermer", onClick: _closeModal, secondary: true}]
        };
      default:
        return {
          title: `Cela n'a pas fonctionné comme prévu !`,
          text: `Nous sommes désolés, une erreur s’est glissée dans notre système et nous n’avons pas pu traiter correctement votre requête`,
          icon: `ri-arrow-right-line`,
          actions: [{label: "Recommencer", onClick: _closeModal}]
        };
    }
  },
}
export default index;