import UserController from '../controllers/UserController';
import { Alert } from 'react-native';
import { Platform } from 'react-native';

export const actionTypes = {
  LOGIN: 'LOGIN',
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',

  RESETPASS: 'RESETPASS',
  RESETPASS_REQUEST: 'RESETPASS_REQUEST',
  RESETPASS_ERROR: 'RESETPASS_ERROR',
  RESETPASS_SUCCESS: 'RESETPASS_SUCCESS',

  CHANGEPASS: 'CHANGEPASS',
  CHANGEPASS_REQUEST: 'CHANGEPASS_REQUEST',
  CHANGEPASS_ERROR: 'CHANGEPASS_ERROR',
  CHANGEPASS_SUCCESS: 'CHANGEPASS_SUCCESS',

  EDIT: 'EDIT',
  CHANGE_FOTO: 'CHANGE_FOTO',

  REMOVE_USER: 'REMOVE_USER',

  // LOAD_LOTNO: 'LOAD_LOTNO'
};

const loginRequest = () => ({
  type: actionTypes.LOGIN_REQUEST,
});

const loginError = (error) => ({
  type: actionTypes.LOGIN_ERROR,
  error,
});

const loginSuccess = (user) => ({
  type: actionTypes.LOGIN_SUCCESS,
  user,
});

const resetPassRequest = () => ({
  type: actionTypes.RESETPASS_REQUEST,
});

const resetPassError = (error) => ({
  type: actionTypes.RESETPASS_ERROR,
  error,
});

const resetPassSuccess = (user) => ({
  type: actionTypes.RESETPASS_SUCCESS,
  user,
});

const changePassRequest = () => ({
  type: actionTypes.CHANGEPASS_REQUEST,
});

const changePassError = (error) => ({
  type: actionTypes.CHANGEPASS_ERROR,
  error,
});

const changePassSuccess = (user) => ({
  type: actionTypes.CHANGEPASS_SUCCESS,
  user,
});

const editRequest = (edits) => ({
  type: actionTypes.EDIT,
  edits,
});

const changeFoto = (edits) => ({
  type: actionTypes.CHANGE_FOTO,
  edits,
});

const logoutRequest = () => ({
  type: actionTypes.LOGOUT,
});

const removeUser = (user) => ({
  type: actionTypes.REMOVE_USER,
  user: null,
});

// const loadLotno = user => ({
//   type: actionTypes.LOAD_LOTNO,
//   user,
// });

export const login = (email, password, token_firebase) => async (dispatch) => {
  dispatch(loginRequest());
  // console.log('token_firebase action', token_firebase);

  const maxRetries = 3; // Jumlah maksimum percobaan
  let attempt = 0; // Inisialisasi percobaan

  while (attempt < maxRetries) {
    try {
      // console.log('try login action', email);
      const user = await UserController.login(email, password, token_firebase);
      dispatch(loginSuccess(user.data));
      // console.log('99 userrrrr', user);
      // alert("JSON.stringify(user)");
      return user; // Kembalikan user.data;
    } catch (error) {
      // const msgPesan = error.response.data.message;
      // Platform.OS == 'android'
      //   ? Alert.alert('Sorry!', msgPesan)
      //   : Alert.prompt('Sorry!', msgPesan);
      // // alert('error di login user action',error);
      // console.log('103 ini konsol eror', error.response.data);

      // dispatch(loginError(error));

      if (error.response.data.message.email != null) {
        const msgPesan = error.response.data.message.email[0];
        console.log('msgpesan email tidak null', msgPesan);

        // Platform.OS == 'android'
        //   ? Alert.alert('Sorry! Warning email tidak null', msgPesan)
        //   : Alert.prompt('Sorry! Warning ios email tidak null', msgPesan);
        Platform.OS == 'android'
          ? Alert.alert('Incorrect Username', msgPesan)
          : Alert.prompt('Incorrect Username', msgPesan);

        console.log('ini konsol eror', msgPesan);

        // kalo error email: munculnya {"email": ["The email format is invalid."]}
        // kalo error password: munculnya Wrong Password / User not found
      } else if (error.response.data.message.password != null) {
        const msgPesan = error.response.data.message.password[0];
        console.log('msgpesan password tidk null', msgPesan);

        // Platform.OS == 'android'
        //   ? Alert.alert('Sorry! Warning msgpesan password tidk null', msgPesan)
        //   : Alert.prompt(
        //       'Sorry! Warning ios msgpesan password tidk null',
        //       msgPesan,
        //     );

        Platform.OS == 'android'
          ? Alert.alert('Sorry! Warning', msgPesan)
          : Alert.prompt('Sorry! Warning', msgPesan);

        console.log('ini konsol eror', msgPesan);
        // kalo error email: munculnya {"email": ["The email format is invalid."]}
        // kalo error password: munculnya Wrong Password / User not found
      } else if (
        error.response.data.message === 'key must be a string when using hmac'
      ) {
        const msgPesan = 'Tidak bisa akses server, coba login kembali';
        //apakah saya bisa mengembalikan function / hit kembali API diatas? agar looping otomatis sampai bisa berhasil login selain error key must be a string when using hmac ?

        Platform.OS == 'android'
          ? Alert.alert('Sorry! Warning', msgPesan)
          : Alert.prompt('Sorry! Warning', msgPesan);

        attempt++; // Increment percobaan
        console.log(`Attempt ${attempt} failed. Retrying...`);

        // Tunggu sebelum mencoba lagi (misalnya 2 detik)
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } else {
        const msgPesan = error.response.data.message;
        console.log('msgpesan password null', msgPesan);

        // Platform.OS == 'android'
        //   ? Alert.alert('Sorry! Warning password dan email deh', msgPesan)
        //   : Alert.prompt('Sorry! Warning password dan email deh ios', msgPesan);

        Platform.OS == 'android'
          ? Alert.alert('Sorry! Warning', msgPesan)
          : Alert.prompt('Sorry! Warning', msgPesan);

        console.log('ini konsol eror', msgPesan);
        // kalo error email: munculnya {"email": ["The email format is invalid."]}
        // kalo error password: munculnya Wrong Password / User not found
        dispatch(loginError(error));
        return;
      }
    }
    // Jika semua percobaan gagal
    Alert.alert(
      'Error',
      'Semua percobaan login telah gagal. Silakan coba lagi nanti.',
    );
  }
};

export const reset = (newPass, conPass, email) => async (dispatch) => {
  dispatch(resetPassRequest());
  try {
    const user = await UserController.resetPassword(newPass, conPass, email);
    console.log(user);

    alert('Please Back to Login');
    dispatch(resetPassSuccess(user.data));
    dispatch(logout());
  } catch (error) {
    console.log(error);

    dispatch(resetPassError(error));
  }
};

export const logout = () => async (dispatch) => {
  UserController.logout();
  dispatch(logoutRequest());
  // dispatch(logout());
  dispatch(removeUser());
};

export const saveProfile = (data) => async (dispatch) => {
  console.log('user action save profile', data);
  const edits = await UserController.saveProfile(data);
  console.log('res save profil', edits);
  alert(edits.message);
  dispatch(editRequest(edits.data));
};

// export const saveFotoProfil = (data) => async (dispatch) => {
//   console.log("image change profil action save profile", data);
//   const foto = await UserController.saveFotoProfil(data);
//   console.log("res save profil", foto);
//   alert(foto.Pesan);
//   dispatch(changeFoto(foto.data));
// };
export const saveFotoProfil = (data) => async (dispatch) => {
  console.log('image change profil action save profile', data);
  const foto = await UserController.saveFotoProfil(data);
  console.log('res save foto profil', foto);
  // alert(foto.Pesan);
  dispatch(changeFoto(foto.data));
};

export const changePass = (email, pass, conpass) => async (dispatch) => {
  dispatch(changePassRequest());
  try {
    const res = await UserController.changePassword(email, pass, conpass);
    alert(res.Pesan);
    dispatch(changePassSuccess(res.data));
  } catch (error) {
    dispatch(changePassError(error));
  }
};

// export const loadLotno = () => async dispatch => {
//   dispatch(loginRequest());
//   try {
//     const user = await UserController.login(email, password, token_firebase);
//     dispatch(loginSuccess(user.Data));
//     console.log('userrrrr', user);
//     // alert("JSON.stringify(user)");
//   } catch (error) {
//     alert(error);
//     dispatch(loginError(error));
//   }
// };
