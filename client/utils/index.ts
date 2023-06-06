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

  async searchRestriction(address: Address,
                          modalTitle: Ref<string>,
                          modalText: Ref<string>,
                          modalOpened: Ref<boolean>,
                          router: any,
                          loadingRestrictions: Ref<boolean>) {
    const addressStore = useAddressStore();
    const restrictionsStore = useRestrictionsStore();
    const {setAddress} = addressStore;
    const {setRestrictions} = restrictionsStore;

    loadingRestrictions.value = true;
    const {data, error} = await api.searchRestriction(address);
    loadingRestrictions.value = false;
    if (error.value || data.value?.length < 1) {
      const {title, text} = this.handleRestrictionError(error.value);
      modalTitle.value = title;
      modalText.value = text;
      modalOpened.value = true;
    }
    if (data.value && data.value.length > 0) {
      setAddress(address);
      setRestrictions(data.value);
      router.push({path: '/situation/adresse'});
    }
  },

  getArretes(restrictions: Restriction[]): Arrete[] {
    const arretes: Arrete[] = restrictions.map(r => r.arrete);
    return arretes.filter((arrete, index, arretes) => {
      return arretes.findIndex(a => a.idArrete === arrete.idArrete) === index;
    });
  },

  handleRestrictionError(error: FetchError): { title: string, text: string } {
    switch (error?.statusCode) {
      case 404:
      case undefined:
        return {
          title: `C’est pour bientôt ...`,
          text: `Malheureusement, nous n’avons pas encore synchronisé les données de votre territoire. Afin de recevoir des informations sur les restrictions, vous pouvez télécharger l’arrêté préfectoral lié à votre adresse !`
        };
      case 409:
        return {
          title: `Nous avons besoin de plus de précision`,
          text: `Afin de vous communiquer des informations de qualité, nous avons besoin du : nom de votre rue, le code postal et le nom de votre ville.`
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