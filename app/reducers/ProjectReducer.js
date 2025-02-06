import { actionTypes } from '../actions/ProjectActions';

const initialState = {
  Dataproject: [],
};

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PROJECT_SUCCESS:
      return {
        ...state,
        Dataproject: action.Dataproject,
      };

    case actionTypes.CHOOSEN_PROJECT:
      return {
        ...state,
        Dataproject: {
          ...state.Dataproject,
          projectUser: action.project, // Mengupdate projectUser saja
        },
      };

    default:
      return state;
  }
};

export default projectReducer;
