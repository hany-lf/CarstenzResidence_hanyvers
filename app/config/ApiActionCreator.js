import axios from 'axios';
import { fetchData, fetchSuccess, fetchError } from './ApiActions';
import { logout } from '../actions/UserActions'; // Pastikan path ini sesuai dengan struktur proyek Anda

const apiActionCreator = (url, params) => async (dispatch) => {
  console.log('token di apiactioncreator', params);
  console.log('urldi apiactioncreator', url);
  dispatch(fetchData());

  let attempt = 0; // Inisialisasi percobaan
  const maxRetries = 3; // Jumlah maksimum percobaan

  while (attempt < maxRetries) {
    try {
      const config = {
        method: 'get',
        url: url,
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${params.token_firebase}`,
        },
        // timeout: 5000, // default is `0` (no timeout),
        params: {
          email: params.email,
          // entity_cd: '01', //hardcode
          // project_no: '02', //hardcode
          entity_cd: params.entity_cd,
          project_no: params.project_no,
        },
      };

      const res = await axios(config);
      dispatch(fetchSuccess(res.data.data.notifications));

      return;
    } catch (error) {
      console.log('error get menu action', error);
      // alert("error di menu action", error);
      if (
        error.response &&
        error.response.data.message === 'Token is Invalid'
      ) {
        //  dispatch(logoutRequest()); // Panggil action untuk logout
        dispatch(logout()); // Panggil fungsi logout
      }
      dispatch(fetchError(error));
      attempt++; // Increment percobaan
      console.log(`Attempt ${attempt} failed MenuAction. Retrying...`);

      // Tunggu sebelum mencoba lagi (misalnya 2 detik)
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
  // return new Promise(() => {
  //   const config = {
  //     method: 'get',
  //     url: url,
  //     headers: {
  //       'content-type': 'application/json',
  //       Authorization: `Bearer ${params.token_firebase}`,
  //     },
  //     // timeout: 5000, // default is `0` (no timeout),
  //     params: {
  //       email: params.email,
  //       // entity_cd: '01', //hardcode
  //       // project_no: '02', //hardcode
  //       entity_cd: params.entity_cd,
  //       project_no: params.project_no,
  //     },
  //   };
  //   // console.log('config', config);
  //   axios(config)
  //     // .get(url)
  //     .then((response) => {
  //       // console.log('response', response.data.data.notifications);
  //       dispatch(fetchSuccess(response.data.data.notifications));
  //       // console.log('response', response);
  //     })
  //     .catch((error) => {
  //       dispatch(fetchError(error));
  //       console.log('error api action creator', error.response.message);
  //     });
  // });
};

export default apiActionCreator;
