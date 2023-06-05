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
    const options = ['municipality', 'locality'].includes(address.properties.type) ?
      `/zones?commune=${address.properties.citycode}` :
      `/zones?lon=${address.geometry.coordinates[0]}&lat=${address.geometry.coordinates[1]}`
    return useFetch(options, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiSecheresseUrl
    });
  }
}

export default index;