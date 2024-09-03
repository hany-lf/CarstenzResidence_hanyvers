import { actionTypes } from '../actions/MenuActions';

const initialState = {
  menus: [],
};

const MenuReducer = (state = initialState, { type, payload }) => {
  // console.log("payload menu reducer", payload);
  switch (type) {
    case actionTypes.MENU_REQUEST:
      return {
        ...state,
      };
    case actionTypes.MENU_SUCCESS:
      return {
        ...state,
        menus: payload,
      };
    case actionTypes.MENU_ERROR:
      return {
        ...state,
        menus: [],
      };

    default:
      return state;
  }
};

export default MenuReducer;
