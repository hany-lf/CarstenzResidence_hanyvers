import { actionTypes } from '../actions/UnitActions';

const initialState = {
  dataUnit: [],
};

const unitReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UNIT_SUCCESS:
      return {
        ...state,
        dataUnit: action.dataUnit,
      };

    case actionTypes.CHOOSED_UNIT:
      return {
        ...state,
        // dataUnit: action.dataUnit,
        dataUnit: {
          ...state.dataUnit,
          unitUser: action.dataUnit,
        },
      };

    default:
      return state;
  }
};

export default unitReducer;
