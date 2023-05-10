const _url: string = 'https://api-adresse.data.gouv.fr/search/?q=';
const _limit: string = '&limit=10';

const index = {
  async searchAddresses(addressQuery: string): Promise<any> {
    return await $fetch(`${_url}${addressQuery}${_limit}`);
  }
}

export default index;