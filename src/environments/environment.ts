let index: any = 'env';
let apiUrl: any = 'apiURL';
export const environment = {
  production: false,
  API_URL: window[index][apiUrl] || 'https://localhost:7250',
  name: window[index]['name'] || 'production',
};
