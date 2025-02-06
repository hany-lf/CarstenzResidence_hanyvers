import ProjectController from '../controllers/ProjectController';

export const actionTypes = {
  CHOOSED_UNIT: 'CHOOSED_UNIT',
  UNIT_SUCCESS: 'UNIT_SUCCESS',
};

const unit_success = (dataUnit) => ({
  type: actionTypes.UNIT_SUCCESS,
  dataUnit,
});

const data_choosed_unit = (dataUnit) => ({
  type: actionTypes.CHOOSED_UNIT,
  dataUnit,
});

export const data_unit = (params) => async (dispatch) => {
  const dataunit = await ProjectController.data_unit(params);

  //   return dataunit;
  dispatch(unit_success(dataunit));
};

export const choosed_unit = (params) => async (dispatch) => {
  //   return dataunit;
  dispatch(data_choosed_unit(params));
};

// export const login = (email, password, token_firebase) => async dispatch => {
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
