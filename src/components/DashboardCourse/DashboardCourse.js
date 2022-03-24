import React from "react";
import { useState } from "react";
// import { ProgressBar } from "react-bootstrap";

import styles from "../../styles/DashboardCourse.module.css";
import Loader from "../../components/Loader/Loader";
import playWhite from "../../assests/play-white.svg";
import editIcon from "../../assests/edit-icon-orange.svg";
import ContentModal from "../CourseModal/ContentModal";
import MaterialModal from "../CourseModal/MaterialModal";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getEnrolledCoursesAction } from "../../redux/actions/Courses/enrollCourseAction";
import { getUserProfileAction } from "../../redux/actions/User/getUserProfileAction";
import { updateProfileAction } from "../../redux/actions/User/updateUserProfile";
import { getPopUpContentAction, getPopUpMaterialAction } from "../../redux/actions/Student/popUpAction";
import { uploadImageAction } from "../../redux/actions/User/updateUserProfile";
import { Link, useLocation } from "react-router-dom";
import postStudentProgress from "../../redux/actions/Student/postStudentProgress";
import getStudentAssessment from "../../redux/actions/Student/getStudentAssessment";

let token = localStorage.getItem("token");

const DashboardCourse = () => {
  const { enrolledCourses } = useSelector((state) => state.enrollCourse);
  const { user, isLoading } = useSelector((state) => state.userProfile);
  const { isLoading: updateLoading, error } = useSelector((state) => state.updateUserProfile);

  // State
  const [inputedName, setInputedName] = useState("");
  const [inputedEmail, setInputedEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [preview, setPreview] = useState();
  const [edit, setEdit] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("courses");
  //show modal State
  const [showContentModal, setShowContentModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const { state } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getEnrolledCoursesAction(token));
    dispatch(getStudentAssessment());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getUserProfileAction(token));
  }, [dispatch]);

  //IMAGE PREVIEW BEFORE UPLOAD
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  // Modal handler
  const contentModalHandler = (id) => {
    dispatch(getPopUpContentAction(id));
    setShowContentModal(true);
  };
  const closeContentModalHandler = (val) => {
    setShowContentModal(val);
  };

  const materialModalHandler = (id) => {
    dispatch(getPopUpMaterialAction(id));
    setShowMaterialModal(true);
  };
  const closeMaterialModalHandler = (val) => {
    setShowMaterialModal(val);
  };

  // Form Handler
  const inputedNameHandler = (e) => {
    setInputedName(e.target.value);
  };

  const inputedEmailHandler = (e) => {
    setInputedEmail(e.target.value);
  };

  const uploadHandler = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  //   Handle submit on profile change

  const submitHandler = (e) => {
    e.preventDefault();
    if (selectedFile) {
      dispatch(uploadImageAction(selectedFile));
    }
    dispatch(updateProfileAction(inputedName, inputedEmail));
    setInputedName("");
    setInputedEmail("");
    dispatch(getUserProfileAction(token));
    setEdit(false);
  };

  /* Conditional render for User Profile start */
  let content;
  const userData = user && (
    <div className={styles["user-data"]}>
      <p className={styles.name}>{user.fullName}</p>
      <p className={styles.email}>{user.email}</p>
      <button
        onClick={() => {
          setEdit(true);
        }}
        className={styles["btn-edit"]}
      >
        Edit Profile
      </button>
    </div>
  );
  const userForm = (
    <div className={styles["user-form"]}>
      <label className={styles["form-control"]}>
        Name<span style={{ color: "red" }}>*</span>
        <input type="text" name="name" autoComplete="off" required value={inputedName} onChange={inputedNameHandler} />
      </label>
      <label className={styles["form-control"]}>
        Email<span style={{ color: "red" }}>*</span>
        <input type="email" name="email" autoComplete="off" required value={inputedEmail} onChange={inputedEmailHandler} />
      </label>
    </div>
  );
  content = !edit ? userData : userForm;

  /* Conditional render for User Profile end */

  /* Pas di bagian courses start */
  let courses = (
    <>
      {enrolledCourses.map((course) => {
        let barWidth = Math.floor((course?.progress.length / course.contents.length) * 100);

        return (
          <div
            className={styles["course-control"]}
            key={course.id}
            style={course.status.status === 0 ? { justifyContent: "space-between" } : { justifyContent: "flex-start" }}
          >
            <div className={styles["course-control-left"]}>
              <div className={styles["img-course-wrapper"]}>
                <img src={course.image} alt={course.title} />
              </div>
              <div className={styles["course-detail"]}>
                <h3>{course.title}</h3>
                <p>By {course.by.fullName}</p>
                {course.status.status === 0 ? null : <button onClick={() => materialModalHandler(course.id)}>See course materials</button>}
              </div>
            </div>
            {course.status.status === 0 ? (
              <p className={styles.waiting}>Waiting for approval...</p>
            ) : (
              <div className={styles["course-control-right"]}>
                {/* <ProgressBar now={20} className={styles.progress} /> */}
                <div className={styles.progress}>
                  <div className={styles["progress-bar"]} style={{ width: `${barWidth}%` }}></div>
                </div>
                <button onClick={() => contentModalHandler(course.id)} className={styles["completed-task"]}>
                  {course.progress.length}/{course.contents.length} Course Complete
                </button>

                {course.progress.length === 0 ? (
                  <Link
                    to={`/course-content/${course.contents[0].id}`}
                    className={styles["progress-btn"]}
                    // onClick={() => {
                    //   dispatch(postStudentProgress(course.id, course.contents[0].id));
                    // }}
                  >
                    <img src={playWhite} alt="play button" />
                    {course.contents[0].title < 25 ? course.contents[0].title.trim() : `${course.contents[0].title.slice(0, 20).trim()}...`}
                  </Link>
                ) : (
                  <Link to={`/course-content/${course.progress[course.progress.length - 1]?.content.id}`} className={styles["progress-btn"]}>
                    <img src={playWhite} alt="play button" />
                    {course.progress[course.progress.length - 1].content.title < 25
                      ? course.progress[course.progress.length - 1].content.title.trim()
                      : `${course.progress[course.progress.length - 1].content.title.slice(0, 20).trim()}...`}
                  </Link>
                )}
              </div>
            )}
          </div>
        );
      })}
    </>
  );

  /* Pas di bagian courses end */

  /* Pas di bagian assesment start*/
  let assessment = (
    <div className={styles["assessment-wrapper"]}>
      {/* Taken test start*/}
      <div className={styles["assessment-control"]}>
        <div className={styles.detail}>
          <h3 className={styles.title}>{state?.title}</h3>
          <p className={styles.author}>{state?.teacher}</p>
          <p className={styles.date}>Completed at: {state?.date}</p>
        </div>
        <div className={styles.completed}>
          <p className={styles.number}>{state?.score}</p>
          <p className={styles["correct-amount"]}>
            {state?.answer}/{state?.questions} Question Correct
          </p>
        </div>
      </div>
      {/* <div className={styles["assessment-control"]}>
        <div className={styles.detail}>
          <h3 className={styles.title}>React Crash Course</h3>
          <p className={styles.author}>Traversy Media</p>
          <p className={styles.date}>Completed at: 28 January 2021 08:00pm</p>
        </div>
        <div className={styles.completed}>
          <p className={styles.number}>73%</p>
          <p className={styles["correct-amount"]}>11/15 Question Correct</p>
        </div>
      </div> */}
      {/* Taken test end */}

      {/* Untaken test start */}
      {/* <div className={styles["assessment-control"]}>
        <div className={styles.detail}>
          <h3 className={styles.title}>Create Cinematic Music Video</h3>
          <p className={styles.author}>John Doe</p>
          <p className={styles.date}>Completed at: -</p>
        </div>
        <div className={styles.completed}>
          <p className={styles["correct-amount"]}>No result yet</p>
          <a href="#" className={styles["btn-take-test"]}>
            Take test
          </a>
        </div>
      </div>
      <div className={styles["assessment-control"]}>
        <div className={styles.detail}>
          <h3 className={styles.title}>Create Cinematic Music Video</h3>
          <p className={styles.author}>John Doe</p>
          <p className={styles.date}>Completed at: -</p>
        </div>
        <div className={styles.completed}>
          <p className={styles["correct-amount"]}>No result yet</p>
          <a href="#" className={styles["btn-take-test"]}>
            Take test
          </a>
        </div>
      </div> */}
      {/* Untaken test end */}
    </div>
  );

  /* Pas di bagian assessment end*/

  return (
    <>
      {showContentModal && <ContentModal closeModal={closeContentModalHandler} />}
      {showMaterialModal && <MaterialModal closeModal={closeMaterialModalHandler} />}
      <main className={styles.dashboard}>
        <div className={styles.container}>
          <div className={styles["left-box"]}>
            {isLoading || updateLoading ? (
              <Loader />
            ) : (
              <form className={styles["user-profile"]} onSubmit={submitHandler}>
                <div className={styles["img-wrapper"]}>
                  <img src={preview ? preview : user.image} alt="kang seulgi" className={styles["user-avatar"]} />
                  {edit && (
                    <>
                      <label htmlFor="image-upload">
                        <img src={editIcon} alt="edit icon" className={styles["edit-icon"]} />
                      </label>
                      <input type="file" id="image-upload" name="filename" style={{ display: "none" }} value="" onChange={uploadHandler} />
                    </>
                  )}
                </div>
                {content}
                {edit ? (
                  <button type="submit" className={styles["user-btn"]}>
                    Save Changes
                  </button>
                ) : null}
              </form>
            )}
          </div>
          <div className={styles["right-box"]}>
            <div className={styles["right-box-header"]}>
              <h3
                style={{ fontWeight: selectedTitle === "courses" ? "700" : "400" }}
                onClick={() => {
                  setSelectedTitle("courses");
                }}
              >
                Courses
              </h3>
              <h3
                style={{ fontWeight: selectedTitle === "assessment" ? "700" : "400" }}
                onClick={() => {
                  setSelectedTitle("assessment");
                }}
              >
                Assesment
              </h3>
            </div>
            {isLoading ? (
              <div style={{ marginTop: "22%" }}>
                <Loader />
              </div>
            ) : enrolledCourses?.length !== 0 ? (
              <div className={styles["right-box-body"]}>{selectedTitle === "courses" ? courses : assessment}</div>
            ) : (
              <p className={styles["no-courses"]}>
                You haven't enrolled any courses yet. Back to <Link to="/">home</Link> to pick any.
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default DashboardCourse;
