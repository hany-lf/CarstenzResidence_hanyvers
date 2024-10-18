import { actionTypes } from '../actions/UserActions';

const initialState = {
  user: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_REQUEST:
      return {
        ...state,
      };
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.EDIT:
      return {
        ...state,
        // ...action.edits,
        // user: action.edits,
        user: {
          ...state.user,
          userData: {
            ...state.user.userData, // Memastikan objek userData yang ada tidak diganti
            // ...action.edits,
            Handphone: action.edits.handphone, // Mengupdate properti pict saja
            email: action.edits.user,
            name: action.edits.name,
          },
        },
        // pict: action.edits,
      };
    case actionTypes.CHANGE_FOTO:
      return {
        ...state,
        // ...user,
        // pict: action.edits, //ini yg sebelumnya
        // user: {
        //   ...state.user,
        //   pict: action.edits,
        // },
        user: {
          ...state.user,
          userData: {
            ...state.user.userData, // Memastikan objek userData yang ada tidak diganti
            pict: action.edits.pict, // Mengupdate properti pict saja
          },
        },

        // pict: action.edits.pict,
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        user: [],
      };
    case actionTypes.REMOVE_USER:
      return {
        //...state,
        user: [],
      };

    default:
      return state;
  }
};

export default userReducer;
