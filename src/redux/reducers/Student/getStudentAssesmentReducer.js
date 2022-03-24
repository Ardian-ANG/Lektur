import { GET_STUDENT_ASSESSMENT_REQUEST, GET_STUDENT_ASSESSMENT_SUCCESS, GET_STUDENT_ASSESSMENT_FAILED } from "../../types";

const initialState = {
  isLoading: false,
  studentAssessments: [],
  error: "",
};

const studentAssessmentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_STUDENT_ASSESSMENT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case GET_STUDENT_ASSESSMENT_SUCCESS:
        // console.log(action.payload)
      return {
        ...state,
        studentAssessments: [...state.studentAssessments, ...action.payload],
        isLoading: false,
      };
    case GET_STUDENT_ASSESSMENT_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default studentAssessmentsReducer;
