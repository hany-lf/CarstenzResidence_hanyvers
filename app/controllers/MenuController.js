import axios from "axios";
import { setAuthStorage } from "../config/Storage";
import httpClient from "./HttpClient";
import { API_URL_LOKAL } from "@env";

class MenuController {
  constructor() {
    // this.basePath = '/login_mobile';
    this.basePath = API_URL_LOKAL;
  }

  get_menu_controller = async (datas) => {
    console.log("datas for menu controler", datas);

    const config = {
      method: 'GET',
    
      url: API_URL_LOKAL + `/home/menu`,
      headers: {
        'content-type': 'application/json',
        // 'X-Requested-With': 'XMLHttpRequest',
        Authorization: `Bearer ${datas.token_firebase}`,
      },
  
      params: {group_cd: datas.group_cd},
    };

    try {
      const result = await httpClient.request(config);
      // alert(result.Pesan);
      console.log("vardums result menu -->", result);
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

export default new MenuController();
