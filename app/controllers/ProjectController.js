import axios from 'axios';
import { setAuthStorage } from '../config/Storage';
import httpClient from './HttpClient';
import { API_URL_LOKAL } from '@env';

class ProjectController {
  constructor() {
    // this.basePath = '/login_mobile';
    this.basePath = API_URL_LOKAL;
  }

  data_project = async (datas) => {
    console.log('email for project di controller', datas);
    const data_app = 'O';
    const config = {
      method: 'GET',
      // url: 'http://dev.ifca.co.id:8080/apiciputra/api/approval/groupMenu?approval_user=MGR',
      url: API_URL_LOKAL + `/home/common-project`,
      headers: {
        'content-type': 'application/json',
        // 'X-Requested-With': 'XMLHttpRequest',
        Authorization: `Bearer ${datas.token_firebase}`,
      },
      // params: {approval_user: user.userIDToken.UserId},
      params: { email: datas.emails },
      timeout: 5000, // default is `0` (no timeout)
    };

    try {
      const result = await httpClient.request(config);
      // alert(result.Pesan);
      console.log('vardums result project -->', result);
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

export default new ProjectController();
