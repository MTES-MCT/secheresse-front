import { Address } from "../dto/address.dto";
import { Geo } from "../dto/geo.dto";

const _adresseOptions: string = '&limit=10';

const index = {
  searchAddresses(addressQuery: string): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/search/?q=${addressQuery}${_adresseOptions}`, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiAdresseUrl,
      parseResponse: _formatAddresses
    });
  },

  searchAddressByLatlon(lon: string, lat: string): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/reverse?lon=${lon}&lat=${lat}`, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiAdresseUrl
    });
  },

  searchGeoByLatlon(lon: string, lat: string): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/communes?lon=${lon}&lat=${lat}`, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiGeoUrl
    });
  },

  searchReglementationByAdress(address: Address, profile: string): Promise<any> {
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

  searchReglementationByGeo(geo: Geo, profile: string): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/reglementation?commune=${geo.code}&profil=${profile}`, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiSecheresseUrl
    });
  },

  searchZonesByAdress(address: Address, profile: string): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    let options = ['municipality'].includes(address.properties.type) ?
      `/zones?commune=${address.properties.citycode}` :
      `/zones?lon=${address.geometry.coordinates[0]}&lat=${address.geometry.coordinates[1]}&commune=${address.properties.citycode}`;
    options += `&profil=${profile}`;
    return useFetch(options, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiSecheresseUrl
    });
  },

  searchZonesByGeo(geo: Geo, profile: string): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/zones?commune=${geo.code}&profil=${profile}`, {
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
  },

  subscribeMail(form: any): Promise<any> {
    for (const key in form) {
      if (!form[key]) {
        delete form[key];
      }
    }
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/subscribe`, {
      method: 'POST',
      baseURL: runtimeConfig.public.apiSecheresseUrl,
      body: form
    });
  },

  getDepartmentsData(): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/departements`, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiSecheresseUrl
    });
  }
}

const _formatAddresses = (response: string): Address[] => {
  const addresses = JSON.parse(response);
  addresses.features.map((a: Address) => {
    if (a.properties.type === 'municipality') {
      a.properties.label = `${a.properties.label}, ${a.properties.citycode >= '97' ? a.properties.citycode.slice(0, 3) : a.properties.citycode.slice(0, 2)}`;
    }
    return a;
  });
  return addresses;
}

export default index;