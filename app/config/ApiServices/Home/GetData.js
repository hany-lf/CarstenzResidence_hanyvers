import axios from 'axios';
import { API_URL_LOKAL } from '@env'; // Sesuaikan path jika diperlukan
import EndPoint from './EndPoint';

export const getDataAboutUs = async (token) => {
  //   console.log('token getdata endpoint', token);
  //   console.log('endpoint getdata endpoint', EndPoint);
  try {
    const config = {
      method: 'GET',
      url: `${API_URL_LOKAL}${EndPoint.getDataAboutUs}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params: {},
    };
    // console.log('config getdata endpoint about us', config);

    const res = await axios(config);
    // console.log('res.data[0]: ', res.data.data[0]);
    return res.data.data[0]; // Mengembalikan data yang dibutuhkan
  } catch (error) {
    console.error('Error get about us', error);
    throw error; // Melempar error agar bisa di-handle di tempat lain jika perlu
  }
};
