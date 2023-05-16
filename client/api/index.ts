import { Address } from "../dto/address.dto";

const _url: string = 'https://api-adresse.data.gouv.fr';
const _limit: string = '&limit=10';

const index = {
  searchAddresses(addressQuery: string): Promise<any> {
    return useFetch(`/search/?q=${addressQuery}${_limit}`, {
      method: 'GET',
      baseURL: _url
    });
  },

  async searchSituation(address: Address) {
    switch (address.properties.postcode.slice(0, 2)) {
      case '75':
        return {
          rank: 1
        };
      case '13':
        return {
          rank: 3
        };
      case '66':
        return {
          rank: 4
        };
      default:
        return {
          rank: 2
        };
    }
  }
}

export default index;