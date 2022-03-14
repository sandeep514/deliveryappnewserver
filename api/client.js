/* eslint-disable prettier/prettier */
import { create } from 'apisauce';

// export const BASE_URL = 'https://staging.tauruspress.co.uk/backend/public/api/',

export const BASE_URL = 'https://anugraam.com/api/public/index.php/api/';
//export const BASE_URL = 'https://delivery-app.ripungupta.com/backend/public/api/';

const apiClient = create({
  baseURL: BASE_URL,
  headers: {
    'x-api-key': 'WzXiux3SkPgm7bZe',
  },
});
export default apiClient;
