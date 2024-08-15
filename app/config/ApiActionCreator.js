import axios from "axios";
import { fetchData, fetchSuccess, fetchError } from "./ApiActions";

const apiActionCreator = (url, token) => (dispatch) => {
  console.log("token di apiactioncreator", token);
  dispatch(fetchData());
  return new Promise(() => {
    const config = {
      method: "get",
      url: url,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    axios(config)
      // .get(url)
      .then((response) => {
        dispatch(fetchSuccess(response.data));
        // console.log('response', response);
      })
      .catch((error) => {
        dispatch(fetchError(error));
        console.log("error api action creator", error.response.data);
      });
  });
};

export default apiActionCreator;
