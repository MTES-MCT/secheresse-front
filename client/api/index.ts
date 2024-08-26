import { Address } from '../dto/address.dto';
import { Geo } from '../dto/geo.dto';

const _adresseOptions: string = '&limit=10';

const index = {
  searchAddresses(addressQuery: string, exactAddress = false): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/search/?q=${addressQuery}${_adresseOptions}${exactAddress ? '&type=housenumber' : ''}`, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiAdresseUrl,
      parseResponse: _formatAddresses,
    });
  },

  searchAddressByLatlon(lon: string, lat: string): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/reverse?lon=${lon}&lat=${lat}`, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiAdresseUrl,
    });
  },

  searchGeoByLatlon(lon: string, lat: string): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/communes?lon=${lon}&lat=${lat}`, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiGeoUrl,
    });
  },

  searchZonesByAdress(address: Address): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    let options = ['municipality'].includes(address.properties.type) ?
      `/zones?commune=${address.properties.citycode}` :
      `/zones?lon=${address.geometry.coordinates[0]}&lat=${address.geometry.coordinates[1]}&commune=${address.properties.citycode}`;
    return useFetch(options, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiSecheresseUrl,
    });
  },

  searchZonesByGeo(geo: Geo): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/zones?commune=${geo.code}`, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiSecheresseUrl,
    });
  },

  subscribeMail(form: any): Promise<any> {
    for (const key in form) {
      if (!form[key]) {
        delete form[key];
      }
    }
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/subscriptions`, {
      method: 'POST',
      baseURL: runtimeConfig.public.apiSecheresseUrl,
      body: form,
    });
  },

  getRefData(): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/data`, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiSecheresseUrl,
    });
  },

  getDepartmentsData(date: string, area?: string): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/departements?date=${date}&${area ? area : ''}`, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiSecheresseUrl,
    });
  },

  getDataArea(dateDebut: string, dateFin: string, area?: string): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/data/area?dateDebut=${dateDebut}&dateFin=${dateFin}&${area ? area : ''}`, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiSecheresseUrl,
    });
  },

  getDataDepartement(dateDebut: string, dateFin: string, area?: string): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/data/departement?dateDebut=${dateDebut}&dateFin=${dateFin}&${area ? area : ''}`, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiSecheresseUrl,
    });
  },

  getDataDuree(): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/data/duree`, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiSecheresseUrl,
    });
  },

  getArretesRestrictions(date: string, area?: string): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/arretes_restrictions?date=${date}&${area ? area : ''}`, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiSecheresseUrl,
    });
  },

  getUserSubscriptions(token: string): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/subscriptions`, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiSecheresseUrl,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  unsubscribe(id: string, token: string): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/subscriptions/${id}`, {
      method: 'DELETE',
      baseURL: runtimeConfig.public.apiSecheresseUrl,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  unsubscribeAll(token: string): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/subscriptions/all`, {
      method: 'DELETE',
      baseURL: runtimeConfig.public.apiSecheresseUrl,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getStats(): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/statistics`, {
      method: 'GET',
      baseURL: runtimeConfig.public.apiSecheresseUrl,
    });
  },

  signalRestriction(usageId: number, feedbackComment: string): Promise<any> {
    const runtimeConfig = useRuntimeConfig();
    return useFetch(`/usage/feedback/${usageId}`, {
      method: 'POST',
      baseURL: runtimeConfig.public.apiSecheresseUrl,
      body: {
        feedback: feedbackComment,
      },
    });
  },
};

const _formatAddresses = (response: string): Address[] => {
  const addresses = JSON.parse(response);
  addresses.features.map((a: Address) => {
    if (a.properties.type === 'municipality') {
      a.properties.label = `${a.properties.label}, ${a.properties.citycode >= '97' ? a.properties.citycode.slice(0, 3) : a.properties.citycode.slice(0, 2)}`;
    }
    return a;
  });
  return addresses;
};

export default index;