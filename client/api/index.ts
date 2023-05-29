import { Address } from "../dto/address.dto";

const _adresseOptions: string = '&limit=10';

const index = {
  searchAddresses(addressQuery: string): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/search/?q=${addressQuery}${_adresseOptions}`, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiAdresseUrl
    });
  },

  searchRestriction(address: Address): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/zone?lon=${address.geometry.coordinates[0]}&lat=${address.geometry.coordinates[1]}`, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiSecheresseUrl
    });
  }
}

export default index;