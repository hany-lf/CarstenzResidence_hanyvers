import axios from 'axios';
import { setAuthStorage } from '../config/Storage';
import httpClient from './HttpClient';
import { API_URL_LOKAL } from '@env';

class NotifController {
  constructor() {
    // this.basePath = '/login_mobile';
    // this.basePath = 'http://apps.pakubuwono-residence.com/apiwebpbi/api';
    this.basePath = API_URL_LOKAL;
  }

  notifikasi_nbadge = async ({
    email,
    entity_cd,
    project_no,
    token_firebase,
  }) => {
    console.log('email for notif di controller', email);
    console.log('entity for notir', entity_cd);
    console.log('project no for notif', project_no);

    try {
      const result = await httpClient.request({
        // url: '/notification',
        // url: `http://apps.pakubuwono-residence.com/apiwebpbi/api/notification?email=${email}&entity_cd=${entity_cd}&project_no=${project_no}`,
        url:
          API_URL_LOKAL +
          `/notification-badge?email=${email}&entity_cd=${entity_cd}&project_no=${project_no}`,
        // url: `http://apps.pakubuwono-residence.com/apiwebpbi/api/notification?email=${email}&entity_cd=${entity_cd}&project_no=${project_no}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token_firebase}`,
        },
        // timeout: 5000, // default is `0` (no timeout)
      });
      // alert(result.Pesan);
      // console.log('vardums result notifikasi -->', result);
      // ini ada isreset dalemnya, sementara dihilangin, buat biar ga nyangkut insert token firebase
      if (result.success) {
        return result;
      } else {
        return Promise.reject(result.message);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

export default new NotifController();
