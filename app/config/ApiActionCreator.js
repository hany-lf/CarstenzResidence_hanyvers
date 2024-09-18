import axios from 'axios';
import { fetchData, fetchSuccess, fetchError } from './ApiActions';

const apiActionCreator = (url, params) => (dispatch) => {
  console.log('token di apiactioncreator', params);
  console.log('urldi apiactioncreator', url);
  dispatch(fetchData());
  return new Promise(() => {
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
    // console.log('config', config);
    axios(config)
      // .get(url)
      .then((response) => {
        // console.log('response', response.data.data.notifications);
        dispatch(fetchSuccess(response.data.data.notifications));
        // console.log('response', response);
      })
      .catch((error) => {
        dispatch(fetchError(error));
        console.log('error api action creator', error.response);
      });
  });
};

export default apiActionCreator;
