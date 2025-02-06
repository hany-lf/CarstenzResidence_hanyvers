import ProjectController from '../controllers/ProjectController';

export const actionTypes = {
  PROJECT_SUCCESS: 'PROJECT_SUCCESS',
  CHOOSEN_PROJECT: 'CHOOSEN_PROJECT',
};

const project_success = (Dataproject) => ({
  type: actionTypes.PROJECT_SUCCESS,
  //   user,'
  Dataproject,
});

const data_choosed_project = (project) => ({
  type: actionTypes.CHOOSEN_PROJECT,
  project,
});

export const data_project = (datas) => async (dispatch) => {
  // console.log('token_firebase data_project action', datas);
  const dataproject = await ProjectController.data_project(
    datas,
    // emails,
    // token_firebases,
  );
  // console.log('dataproject di project  action', dataproject.data);
  dispatch(project_success(dataproject));
  // console.log('notifikasi nbadge', notifnbadge);
  //   dispatch(editRequest());
};

export const choosed_project = (project) => async (dispatch) => {
  dispatch(data_choosed_project(project));
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
