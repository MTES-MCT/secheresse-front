import { Zone } from '../dto/zone.dto';
import { Address } from '../dto/address.dto';
import api from '../api';
import { Ref } from 'vue';
import { useAddressStore } from '../store/address';
import { useZoneStore } from '../store/zone';
import { FetchError } from 'ofetch';
import { Geo } from '../dto/geo.dto';
import niveauxGravite from '../dto/niveauGravite';

const index = {
  debounce(fn: Function, delay: number) {
    let timeoutID: any = null;
    return function() {
      clearTimeout(timeoutID);
      // eslint-disable-next-line prefer-rest-params
      const args = arguments;
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      timeoutID = setTimeout(function() {
        fn.apply(that, args);
      }, delay);
    };
  },

  showRestrictions(zone: Zone): boolean {
    const departement = ['59', '62'];
    if (!zone || (zone.niveauGravite === 'vigilance' && !departement.includes(zone.departement))) {
      return false;
    }
    return (zone.usages && zone.usages.filter(u => u.thematique !== 'Autre').length > 0);
  },

  getRestrictionRank(niveauGravite: string | undefined | null): number {
    switch (niveauGravite) {
      case 'crise':
        return 4;
      case 'alerte_renforcee':
        return 3;
      case 'alerte':
        return 2;
      case 'vigilance':
        return 1;
      default:
        return 0;
    }
  },

  getSituationBadgeLabel(situationRank: number | undefined): string {
    console.log('SITUATION RANK', situationRank)
    if (!situationRank) {
      return 'Pas de restrictions';
    }
    let label = `${situationRank}/4 - `;
    label += this.getShortSituationLabel(situationRank);
    return label;
  },

  getShortSituationLabel(situationRank: number | undefined): string {
    if (!situationRank) {
      return 'Pas de restrictions';
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

  getProvenanceLabel(restriction: Zone, light: boolean = false, inverse: boolean = false): string | undefined {
    const type = !inverse ? restriction.type : restriction.type === 'SUP' ? 'SOU' : 'SUP';
    switch (type) {
      case 'SOU':
        return !light ? `Si j'utilise de l'eau qui provient de nappes souterraines (puits, forages ...) des restrictions différentes s'appliquent` :
          `de nappes souterraines (puits, forages ...)`;
      case 'SUP':
        return !light ? `Si j'utilise de l'eau qui provient des cours d'eau (rivières, mares, étangs ...) des restrictions différentes s'appliquent` :
          `des cours d'eau (rivières, mares, étangs ...)`;
    }
  },

  numberWithSpaces(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  },

  async searchZones(address: Address | null,
                    geo: Geo | null,
                    profile: string,
                    typeEau: string,
                    router: any,
                    modalTitle?: Ref<string>,
                    modalText?: Ref<string>,
                    modalIcon?: Ref<string>,
                    modalActions?: Ref<any[]>,
                    modalOpened?: Ref<boolean>,
                    loadingRestrictions?: Ref<boolean>) {
    const addressStore = useAddressStore();
    const restrictionStore = useZoneStore();
    const { setAddress, setGeo } = addressStore;
    const { setZones } = restrictionStore;

    if (loadingRestrictions) loadingRestrictions.value = true;

    const { data, error } = address ? await api.searchZonesByAdress(address, profile) : await api.searchZonesByGeo(geo, profile);

    // STATS MATOMO
    try {
      window._paq.push(['trackEvent', 'API CALL', 'CODE INSEE', address ? address.properties.citycode : geo?.code, 1]);
      window._paq.push(['trackEvent', 'API CALL', 'CODE DEPARTEMENT', address ? address.properties.citycode >= '97' ? address.properties.citycode.slice(0, 3) : address.properties.citycode.slice(0, 2) : geo.codeDepartement, 1]);
      window._paq.push(['trackEvent', 'API CALL', 'PROFIL', profile, 1]);
    } catch (e) {
    }

    if (loadingRestrictions) loadingRestrictions.value = false;

    // SI ERREUR
    if (error?.value && error.value.statusCode !== 404) {
      if (modalTitle && modalText && modalIcon && modalActions && modalOpened) {
        const {
          title,
          text,
          icon,
          actions,
        } = this.handleRestrictionError(error.value, data?.value, profile, modalOpened);
        modalTitle.value = title;
        modalText.value = text;
        modalIcon.value = icon;
        modalActions.value = actions;
        modalOpened.value = true;
      }
      return;
    }

    address ? setAddress(address) : setGeo(geo);
    addressStore.setProfile(profile);
    addressStore.setTypeEau(typeEau);
    setZones(data?.value ? data.value : []);
    let query: any = {};
    query.profil = profile;
    query.typeEau = typeEau;
    query.adresse = address ? address?.properties.label : `${geo?.nom}, ${geo?.codeDepartement}`;
    router.push({ path: '/situation', query });
  },

  handleRestrictionError(error: FetchError, data: Zone[], profile: string, modalOpened: Ref<boolean>): {
    title: string,
    text: string,
    icon: string,
    actions: any[]
  } {
    // Déclaration des fonctions à utiliser dans la modale
    const _closeModal = (): void => {
      modalOpened.value = false;
    };

    switch (error?.statusCode) {
      case 404:
      case undefined:
        return {
          title: `Pas d'arrêté en vigueur`,
          text: `Votre adresse n'est actuellement pas concernée par un arrêté préfectoral.
<br/>Aucune restriction n'est à appliquer à votre adresse, nous vous conseillons tout de même de suivre les eco-gestes présents sur notre site !`,
          icon: `ri-arrow-right-line`,
          actions: [],
        };
      case 409:
        return {
          title: `Nous avons besoin de plus de précision`,
          text: `Afin de vous communiquer des informations de qualité, nous avons besoin du : nom de votre rue, le code postal et le nom de votre ville.`,
          icon: `ri-map-pin-user-line`,
          actions: [{
            label: 'Entrer une adresse plus précise',
            onClick: _closeModal,
          }, { label: 'Fermer', onClick: _closeModal, secondary: true }],
        };
      default:
        return {
          title: `Cela n'a pas fonctionné comme prévu !`,
          text: `Nous sommes désolés, une erreur s'est glissée dans la saisie des données pour cette adresse. Nous ne pouvons pas traiter correctement votre demande. Nous faisons remonter le problème.`,
          icon: `ri-arrow-right-line`,
          actions: [],
        };
    }
  },

  openTally() {
    window.Tally.openPopup('w54YQZ', {
      width: 376,
      autoClose: 2000,
      emoji: {
        text: '👋',
        animation: 'wave',
      },
    });
  },

  generatePopupHtml(pmtilesData: any) {
    const niveauGravite = niveauxGravite.find(n => n.niveauGravite === pmtilesData.niveauGravite);
    let popupHtml = `
<div class="map-popup-zone">${pmtilesData.nom}</div>
<div class="fr-my-1w">
<p class="fr-badge situation-level-bg-${this.getRestrictionRank(pmtilesData.niveauGravite)}">${niveauGravite.text}</p>
</div>
<div>
<button class="fr-btn btn-map-popup">
Voir les restrictions
</button>
</div>
`;
    return popupHtml;
  },

  isWebglSupported() {
    if (window.WebGLRenderingContext) {
      const canvas = document.createElement('canvas');
      try {
        // Note that { failIfMajorPerformanceCaveat: true } can be passed as a second argument
        // to canvas.getContext(), causing the check to fail if hardware rendering is not available. See
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
        // for more details.
        const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
        if (context && typeof context.getParameter == 'function') {
          return true;
        }
      } catch (e) {
        // WebGL is supported, but disabled
      }
      return false;
    }
    // WebGL not supported
    return false;
  },
};
export default index;