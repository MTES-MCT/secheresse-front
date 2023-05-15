const _url: string = 'https://api-adresse.data.gouv.fr/search/?q=';
const _limit: string = '&limit=10';

const index = {
  async searchAddresses(addressQuery: string): Promise<any> {
    return await $fetch(`${_url}${addressQuery}${_limit}`);
  },
  
  async searchSituation() {
    return {
      nbTerritories: 35,
      rank: 4
      // rank: Math.floor(Math.random() * (4 - 1 + 1) + 1)
    };
  }
}

export default index;