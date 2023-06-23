import { Restriction } from "../dto/restriction.dto";
import { Address } from "../dto/address.dto";
import api from "../api";
import { Ref } from "vue";
import { useAddressStore } from "../store/address";
import { useRestrictionsStore } from "../store/restrictions";
import { FetchError } from "ofetch";
import { Arrete } from "../dto/arrete.dto";
import { Geo } from "../dto/geo.dto";

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
    }
  },

  getSituationBadgeLabel(situationRank: number | undefined): string {
    if (!situationRank) {
      return '';
    }
    let label = `${situationRank}/4 - `
    label += this.getSituationLabel(situationRank)
    return label;
  },

  getSituationLabel(situationRank: number | undefined): string {
    if (!situationRank) {
      return '';
    }
    let label = '';
    switch (situationRank) {
      case 1:
        label += 'En état de vigilance';
        break;
      case 2:
        label += `En état d'alerte`;
        break;
      case 3:
        label += `En état d'alerte renforcée`;
        break;
      case 4:
        label += `En état de crise`;
        break;
    }
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
          `de nappes souterraines (puits, forages, nappes ...)`
      case 'SUP':
        return !light ? `Si j'utilise de l'eau qui provient des cours d'eau (étangs, mares, rivières, lacs ...) des restrictions différentes s'appliquent` :
          `des cours d'eau (étangs, mares, rivières, lacs ...)`
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
    const {data, error} = address ? await api.searchRestrictionByAdress(address, profile) : await api.searchRestrictionByGeo(geo, profile);
    loadingRestrictions.value = false;

    // SI ERREUR
    if (error?.value || data?.value?.length < 1 || profile !== 'particulier') {
      const {title, text, icon, actions} = this.handleRestrictionError(error.value, data?.value, profile !== 'particulier', modalOpened);
      modalTitle.value = title;
      modalText.value = text;
      modalIcon.value = icon;
      modalActions.value = actions;
      modalOpened.value = true;
      return;
    }

    // SI DATA RENVOYEE
    if (data?.value && data?.value.length > 0) {
      address ? setAddress(address) : setGeo(geo);
      setRestrictions(data.value, profile);
      let query: any = {};
      query = address ? (['municipality', 'locality'].includes(address.properties.type) ?
        {code_insee: address.properties.citycode} : {
          lon: address.geometry.coordinates[0],
          lat: address.geometry.coordinates[1]
        }) : {code_insee: geo?.code};
      query.profil = profile;
      router.push({path: '/situation', query});
    }
  },

  getArretes(restrictions: Restriction[]): Arrete[] {
    const arretes: Arrete[] = restrictions.map(r => r.arrete);
    return arretes.filter((arrete, index, arretes) => {
      return arretes.findIndex(a => a.idArrete === arrete.idArrete) === index;
    });
  },

  handleRestrictionError(error: FetchError, data: Restriction[], professionels: boolean, modalOpened: Ref<boolean>): {
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
    };
    if (professionels && !error?.statusCode && data.length > 0) {
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
    if (!error?.statusCode && data.length < 1) {
      return {
        title: `Pas d'arrêté en vigueur`,
        text: `Votre adresse n'est actuellement pas concernée par un arrêté préfectoral.
<br/>Aucune restriction n'est à appliquer à votre adresse, nous vous conseillons tout de même de suivre les eco-gestes présents sur notre site !`,
        icon: `ri-arrow-right-line`,
        actions: []
      };
    }
    switch (error?.statusCode) {
      case 404:
      case undefined:
        return {
          title: `C’est pour bientôt ...`,
          text: `Malheureusement, nous n’avons pas encore synchronisé les données de votre zone géographique.`,
          icon: `ri-timer-line`,
          actions: [{label: "Fermer", onClick: _closeModal}]
        };
      case 409:
        return {
          title: `Nous avons besoin de plus de précision`,
          text: `Afin de vous communiquer des informations de qualité, nous avons besoin du : nom de votre rue, le code postal et le nom de votre ville.`,
          icon: `ri-map-pin-user-line`,
          actions: [{
            label: "Entrer une adresse plus précise",
            onClick: _closeModal
          }, {label: "Annuler", onClick: _closeModal, secondary: true}]
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