import { Restriction } from "../dto/restriction.dto";
import { Address } from "../dto/address.dto";
import api from "../api";
import { Ref } from "vue";
import { useAddressStore } from "../store/address";
import { useRestrictionsStore } from "../store/restrictions";
import { FetchError } from "ofetch";
import { Arrete } from "../dto/arrete.dto";

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
        label += `En état d'alerte renforcé`;
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
        label += `alerte renforcé`;
        break;
      case 4:
        label += `crise`;
        break;
    }
    return label;
  },

  async searchRestriction(address: Address, modalTitle: Ref<string>, modalText: Ref<string>, modalOpened: Ref<boolean>, router: any) {
    const addressStore = useAddressStore();
    const restrictionsStore = useRestrictionsStore();
    const {setAddress} = addressStore;
    const {setRestrictions} = restrictionsStore;
    
    const {data, error} = await api.searchRestriction(address);
    if (error.value) {
      const {title, text} = this.handleRestrictionError(error.value);
      modalTitle.value = title;
      modalText.value = text;
      modalOpened.value = true;
    }
    console.log(data.value);
    if (data.value) {
      setAddress(address);
      setRestrictions(data.value);
      router.push({path: '/situation/adresse'});
    }
  },

  handleRestrictionError(error: FetchError): { title: string, text: string } {
    switch (error.statusCode) {
      case 404:
        return {
          title: `C’est pour bientôt ...`,
          text: `Malheureusement, nous n’avons pas encore synchronisé les données de votre territoire. Afin de recevoir des informations sur les restrictions, vous pouvez télécharger l’arrêté préfectoral lié à votre adresse !`
        };
      case 409:
        let html = `Plusieurs arrêtés sont en vigueurs sur votre territoire. Vous pouvez télécharger les arrêtés liés à votre adresse !`;
        if(error.data.arretes && error.data.arretes.length > 0) {
          html += `<div class="fr-grid-row fr-grid-row--right">`;
          error.data.arretes.forEach((a: Arrete, index: number) => {
            html += `<a class="fr-btn fr-my-1w"
         href="${a.cheminFichier}"
         target="_blank"
         rel="noopener">
        Télécharger l'arrêté préfectoral n°${index + 1}
      </a>`;
          });
          html += `</div>`
        }
        return {
          title: `Plusieurs arrêtés ...`,
          text: html
        };
      default:
        return {
          title: `Cela n'a pas fonctionné comme prévu !`,
          text: `Nous sommes désolés, une erreur s’est glissée dans notre système et nous n’avons pas pu traiter correctement votre requête`
        };
    }
  }
}

export default index;