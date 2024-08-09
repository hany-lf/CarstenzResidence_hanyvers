import MenuController from '../controllers/MenuController';

export const actionTypes = {
  MENU_SUCCESS: 'MENU_SUCCESS',
  MENU_ERROR: 'MENU_ERROR',
  MENU_REQUEST: 'MENU_REQUEST',

};

const menu_success = menus => ({
  type: actionTypes.MENU_SUCCESS,
  payload: menus
});

const menu_request = () => ({
  type: actionTypes.MENU_REQUEST,
});

const menu_error = error => ({
  type: actionTypes.MENU_ERROR,
  payload: error,
});

export const get_menu_actions = (group_cd, token_firebase) => async dispatch => {
    dispatch(menu_request());
  
  try {
    console.log('group_cd di menu action', group_cd);
    console.log('token_firebase di menu action', token_firebase);
    const data_menu = await MenuController.get_menu_controller(group_cd, token_firebase);
    console.log('datamenu di menu action', data_menu.data);
    dispatch(menu_success(data_menu.data));
  } catch (error) {
    alert('error di menu action',error);
    dispatch(menu_error(error));
  }

};

