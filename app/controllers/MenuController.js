import axios from 'axios';
import { setAuthStorage } from '../config/Storage';
import httpClient from './HttpClient';
import { API_URL_LOKAL } from '@env';

class MenuController {
  constructor() {
    // this.basePath = '/login_mobile';
    this.basePath = API_URL_LOKAL;
  }

  get_menu_controller = async (datas) => {
    // console.log('datas for menu controler', datas);

    try {
      const result = await httpClient.request({
        url: API_URL_LOKAL + `/home/menu`,
        method: 'GET',
        params: { group_cd: datas.group_cd },
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${datas.token_firebase}`,
        },
      });
      const filteredResult = result.data.filter(
        (item) => item.OrderSeq !== null && item.OrderSeq !== undefined,
      );
      const sortedResult = filteredResult.sort(
        (a, b) => a.OrderSeq - b.OrderSeq,
      );
      const updatedResult = {
        ...result,
        data: sortedResult,
      };
      // alert(result.Pesan);
      // console.log('vardums result menu -->', updatedResult);

      // ini ada isreset dalemnya, sementara dihilangin, buat biar ga nyangkut insert token firebase
      if (result.success) {
        return updatedResult;
      } else {
        console.log('result get menu controller', result);
        return Promise.reject(result.message);
      }
    } catch (error) {
      console.log('error get menu controller', error.response);
      return Promise.reject(error);
    }
  };
}

export default new MenuController();
