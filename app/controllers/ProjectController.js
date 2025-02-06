import axios from 'axios';
import { setAuthStorage } from '../config/Storage';
import httpClient from './HttpClient';
import { API_URL_LOKAL } from '@env';

class ProjectController {
  constructor() {
    // this.basePath = '/login_mobile';
    this.basePath = API_URL_LOKAL;
  }

  //data_project ini pertama dipanggil ketika login, ketika login sukses maka di screen sign in ada panggil function ini
  data_project = async (datas) => {
    // console.log(
    //   'token_firebase for project di controller',
    //   datas.token_firebases,
    // );

    // // Cek apakah email dan token_firebase ada
    // if (!datas.emails && !datas.token_firebases) {
    //   console.error('Email atau token_firebase tidak ada');
    //   return; // Keluar dari fungsi jika data tidak lengkap
    // }

    try {
      const paramData = {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${datas.token_firebases}`,
        },
        params: {
          email: datas.emails,
        },
      };
      // const result = await httpClient.request(config);
      const result = await axios.get(
        `${API_URL_LOKAL}/home/common-project`,
        paramData,
      );

      // console.log('vardums result project -->', result.data.success);

      // ini ada isreset dalemnya, sementara dihilangin, buat biar ga nyangkut insert token firebase
      if (result.data.success) {
        return result.data;
      } else {
        return Promise.reject(result.data.message);
      }
    } catch (error) {
      console.log('error common project', error.response);
      return Promise.reject(error);
    }
  };

  data_unit = async (datas) => {
    // console.log('datas for controler unit', datas);
    try {
      const paramData = {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${datas.token_firebases}`,
        },
        params: {
          entity_cd: datas.entity_cd,
          project_no: datas.project_no,
          email: datas.email,
        },
      };
      // const result = await httpClient.request(config);
      const result = await axios.get(
        `${API_URL_LOKAL}/home/common-unit`,
        paramData,
      );

      // console.log('vardums result unit -->', result.data.success);

      // ini ada isreset dalemnya, sementara dihilangin, buat biar ga nyangkut insert token firebase
      if (result.data.success) {
        return result.data;
      } else {
        return Promise.reject(result.data.message);
      }
    } catch (error) {
      console.log('error common unit', error.response);
      return Promise.reject(error);
    }
  };
}

export default new ProjectController();
