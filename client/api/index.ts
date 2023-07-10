import { Address } from "../dto/address.dto";
import { Geo } from "../dto/geo.dto";

const _adresseOptions: string = '&limit=10';

const index = {
  searchAddresses(addressQuery: string): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/search/?q=${addressQuery}${_adresseOptions}`, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiAdresseUrl
    });
  },

  searchGeoByCitycode(citycode: string): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/communes/${citycode}?fields=code,nom,codeDepartement`, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiGeoUrl
    });
  },

  searchAdressByLonLat(lon: string, lat: string, citycode: string): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/reverse/?lat=${lat}&lon=${lon}&type=housenumber&limit=1`, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiAdresseUrl
    });
  },

  searchRestrictionByAdress(address: Address, profile: string): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    let options = ['municipality'].includes(address.properties.type) ?
      `/reglementation?commune=${address.properties.citycode}` :
      `/reglementation?lon=${address.geometry.coordinates[0]}&lat=${address.geometry.coordinates[1]}&commune=${address.properties.citycode}`;
    options += `&profil=${profile}`;
    return useFetch(options, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiSecheresseUrl
    });
  },

  searchRestrictionByGeo(geo: Geo, profile: string): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/reglementation?commune=${geo.code}&profil=${profile}`, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiSecheresseUrl
    });
  },

  searchDepartementConfig(codeDepartement: string): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/departements/${codeDepartement}`, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiSecheresseUrl
    });
  }
}

export default index;