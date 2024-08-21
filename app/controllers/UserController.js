import axios from 'axios';
import { setAuthStorage } from '../config/Storage';
import httpClient from './HttpClient';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { API_URL_LOKAL } from '@env';

class UserController {
  constructor() {
    // this.basePath = '/login_mobile';
    this.basePath = API_URL_LOKAL;
  }

  login = async (email, password, token_firebase) => {
    //var anyString = '';
    //var functionToText = anyString + httpClient;
    // console.log(
    //   "16 api request: \n email:",
    //   email,
    //   "\n password:",
    //   password,
    //   "\n token_firebase:",
    //   token_firebase
    // );
    console.log(' login user controller', email);
    try {
      // console.log("25 try controller login begin");
      // console.log("API: " + API_URL_LOKAL);
      console.log('try login user controller', email);
      const result = await httpClient.request({
        url: '/auth/login',
        method: 'POST',
        data: {
          email: email,
          password: password,

          device: 'ios',
          mac: '',
          token_firebase: token_firebase,
          apps_type: 'S',
        },
        headers: {
          Authorization: `Bearer ${token_firebase}`,
        },
      });
      console.log('result login user controller', result);
      // // alert(result.Pesan);
      // console.log("39 after try");
      // console.log("31 login response -->", result);
      // // ini ada isreset dalemnya, sementara dihilangin, buat biar ga nyangkut insert token firebase
      if (result.success) {
        console.log('37 if succes', result);
        return result;
      } else {
        console.log('34 first pesan', result.message);
        return Promise.reject(result.message);
      }
    } catch (error) {
      console.log('41 if errorz', error.response);
      return Promise.reject(error);
    }
  };

  resetPassword = async (conPass, newPass, email) => {
    try {
      const result = await httpClient.request({
        url: `${this.basePath}/auth/reset-pass`,

        method: 'POST',
        data: {
          conpass: conPass,
          newpass: newPass,
          email: email,
        },
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  logout = () => {
    try {
      //  const result = await httpClient.request({
      //    url: '/login_mobile',
      //    method: 'POST',
      //    data: {
      //      email,
      //      password,
      //      token: '',
      //      device: 'ios',
      //      mac: 'mac',
      //      token_firebase,
      //    },
      //  });
      //  // alert(result.Pesan);

      //  if (result.Error) {
      //    return Promise.reject(result.Pesan);
      //  } else {
      //    return result;
      //  }
      console.log('logout');
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // logout = () => null;

  saveProfile = async (data) => {
    console.log('save profile daata controler', data);
    try {
      const result = await httpClient.request({
        url: API_URL_LOKAL + `/auth/change-profile`,

        method: 'POST',
        data: {
          email: data.emails,
          name: data.name,
          hp: data.phone,
          gender: data.genders,
        },
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  saveFotoProfil = async (data) => {
    console.log('data akan save foto profil', data);
    // const tempImageDate = data.image + new Date().getTime();
    console.log('isi images', data.image);
    let fileName = 'profile.png';

    const b64 = await ReactNativeBlobUtil.fs.readFile(data.image, 'base64');

    try {
      const result = await httpClient.request({
        url: `/auth/change-photo`,
        // url: `/changephoto_mobile`,
        method: 'POST',
        data: {
          dataPhoto: 'data:image/png;base64,' + b64,
          email: data.email,
        },
        headers: {
          Authorization: `Bearer ${data.token_firebase}`,
        },
      });

      return result;
    } catch (error) {
      console.log('error save foto profil', error.response);
      return Promise.reject(error);
    }
  };
}

export default new UserController();
