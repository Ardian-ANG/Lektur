import axios from "axios";
import { GET_STUDENT_ASSESSMENT_REQUEST, GET_STUDENT_ASSESSMENT_SUCCESS, GET_STUDENT_ASSESSMENT_FAILED } from "../../types";
import { API } from "../../../api";

const getStudentAssessment = () => {
  const token = localStorage.getItem("token");
  return (dispatch) => {
    dispatch({ type: GET_STUDENT_ASSESSMENT_REQUEST });
    axios
      .get(`${API}api/v1/student/assessment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        dispatch({ type: GET_STUDENT_ASSESSMENT_SUCCESS, payload: response.data.result });
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: GET_STUDENT_ASSESSMENT_FAILED, payload: error });
      });
  };
};

export default getStudentAssessment;
