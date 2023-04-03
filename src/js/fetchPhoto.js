// const BASE_URL = 'https://pixabay.com/api/';
// const API = 'key=8586853-360208b22f98fbf99c050b060';
// const API_FILTER = 'image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=40';

// export const fetchPhoto = searchInput => {
//   const url = `${BASE_URL}?${API}&q=${searchInput}&${API_FILTER}`;

//   return fetch(url).then(response => {
//     if (!response.ok) {
//       throw new Error(response.status);
//     }
//     return response.json();
//   });
// };

// query =null;
// page = 1;
// count = 40;

// export class PixabayAPI {
//   #BASE_URL = 'https://pixabay.com/api/';
//   #API = 'key=8586853-360208b22f98fbf99c050b060';
//   #API_FILTER = '&image_type=photo&orientation=horizontal&safesearch=true';

//   page = 1;
//   count = 40;
//   query = null

//   fetchPhoto() {
//     return fetch(`${this.#BASE_URL}?${this.#API}&q=${this.query}&${this.#API_FILTER}`).then(
//       response => {
//         if (!response.ok) {
//           throw new Error(response.status);
//         }
//         return response.json();
//       }
//     );
//   }
// }

import axios from 'axios';
export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API = '8586853-360208b22f98fbf99c050b060';

  page = 1;
  count = 40;
  query = '';

  async fetchPhoto() {
    try {
      return await axios.get(`${this.#BASE_URL}`, {
        params: {
          q: this.query,
          page: this.page,
          per_page: this.count,
          key: this.#API,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
