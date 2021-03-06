import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import bg from "../assests/bg-detail.png";
import styles from "../styles/Detail.module.css";
import Card from "../components/CourseCards/Card";
import NavbarComponent from "../components/Header/NavbarComponent";
import Footer from "../components/Footer";
import { getCourseDetail, getRelatedCourse } from "../redux/actions/Courses/getCourseDetailAction";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import Errorpage from "../errorPage/ErrorPage";
import { getEnrolledCoursesAction, postEnrollCourseAction } from "../redux/actions/Courses/enrollCourseAction";
import Swal from "sweetalert2";
import ButtonEnroll from "../components/ButtonEnroll";

function Detail() {
  const [popUpDetail, setPopUpDetail] = useState(false);
  const { detail, isLoading, error, relatedCourse } = useSelector((state) => state.courseDetail);
  const { enrolledCourses } = useSelector((state) => state.enrollCourse);
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  //get user token
  let token = localStorage.getItem("token");
  let tokenGoogle = localStorage.getItem("loginGoogle");
  let tokenFb = localStorage.getItem("loginFacebook");
  let isToken = token || tokenGoogle || tokenFb;
  useEffect(() => {
    if (isToken !== null) {
      dispatch(getEnrolledCoursesAction(isToken));
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCourseDetail(params.id));
  }, [dispatch]);

  //CALL API RELATED COURSE
  useEffect(() => {
    if (detail.category?.name) {
      dispatch(getRelatedCourse(detail.category?.name));
    }
  }, [detail.category?.name]);

  // Sorted Contents
  let detailContents = detail.contents?.sort((a, b) => {
    let first = a.id,
      second = b.id;
    return first - second;
  });

  //get materials
  let totalMaterials = 0;
  let allContents = detail.contents?.map((content) => content);
  allContents?.map((material) => (totalMaterials += material.materials.length));

  //cek all course enroll
  let info = enrolledCourses.map((course) => course);
  let infoContent = info.filter((content) => content.id === detail.id);
  // console.log(infoContent);
  //cek approve from teacher
  const approveTeacher = infoContent[0]?.status.status;
  return (
    <>
      <NavbarComponent />
      {error ? (
        <Errorpage />
      ) : (
        <div className={styles.main}>
          <div className={styles.banner_detail} style={{ backgroundImage: `url(${bg})` }}>
            <div className={styles.contents}>
              <div className={`${styles.detail_content}`}>
                {isLoading ? (
                  <Loader />
                ) : (
                  <>
                    <p>{detail.category?.name}</p>
                    <h3>{detail.title}</h3>
                    <p>By {detail.by?.fullName}</p>
                   
                    <ButtonEnroll token={isToken} infoContent={infoContent} approveTeacher={approveTeacher} setPopUpDetail={setPopUpDetail} />
                    {/* <button
                      className={infoContent.length === 0 || isToken === null ? styles.btn_detail : styles.btn_detail_enroll}
                      onClick={() => {
                        if (isToken !== null) {
                          setPopUpDetail(true);
                          dispatch(postEnrollCourseAction(detail?.id));
                        } else {
                          Swal.fire({
                            icon: "info",
                            title: "Opsss...",
                            text: "Log In and Start Learning!",
                          }).then(({ isConfirmed }) => {
                            if (isConfirmed) {
                              navigate("/login");
                            }
                          });
                        }
                      }}
                    >
                      ENROLL NOW
                    </button> */}
                  </>
                )}
              </div>
              <div className={styles.detail_box}>
                {isLoading ? (
                  <Loader />
                ) : (
                  <>
                    <div
                      className={styles.content1}
                      onClick={() => {
                        if (approveTeacher === 0 && isToken !== null) {
                          Swal.fire({
                            icon: "info",
                            title: "Sorry...",
                            text: "The course has not been approved by the teacher!",
                          });
                        } else if (infoContent.length === 0 || isToken === null) {
                          Swal.fire({
                            icon: "warning",
                            title: "Opsss...",
                            text: "You haven't enrolled the course!",
                          });
                        } else {
                          navigate("/student-dashboard");
                        }
                      }}
                    >
                      <div>
                        <p className={styles.p1}>{detail.contents?.length}</p>
                        <p className={styles.p2}>Learning Videos</p>
                      </div>
                      <div>
                        <p className={styles.p1}>{totalMaterials}</p>
                        <p className={styles.p2}>Study Material</p>
                      </div>
                    </div>
                    <div className={`${styles.content2} overflow-auto`}>
                      <h5>Content</h5>
                      <ul style={{ padding: "0" }}>
                        <li>
                          {detailContents?.map((content) => (
                            <div className={styles.list_contents} key={content.id}>
                              <p
                                onClick={() => {
                                  if (approveTeacher === 0 && isToken !== null) {
                                    Swal.fire({
                                      icon: "info",
                                      title: "Sorry...",
                                      text: "The course has not been approved by the teacher!",
                                    });
                                  } else if (infoContent.length === 0 || isToken === null) {
                                    Swal.fire({
                                      icon: "warning",
                                      title: "Opsss...",
                                      text: "You haven't enrolled the course!",
                                    });
                                  } else {
                                    navigate("/course-content/" + content?.id);
                                  }
                                }}
                              >
                                {content.title}
                              </p>
                            </div>
                          ))}
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className={styles.description_detail}>
            <div className={styles.description_content}>
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  <h5>Description</h5>
                  <p>{detail.description}</p>
                </>
              )}
            </div>
          </div>

          {/* Cards gallery start */}
          <div className={styles.cards}>
            <div className={styles["card-container"]}>
              <h2>Related Course</h2>
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  <div className={styles["card-list"]}>
                    {relatedCourse?.map((course) => (
                      <a href={"/detail/" + course.id} key={course.id}>
                        <Card
                          key={course.id}
                          src={course.image}
                          title={course.title}
                          author={course.by?.fullName}
                          videos={course.contents?.length}
                          materials={totalMaterials}
                          description={course.description}
                          category={course.category?.name}
                        />
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Cards gallery end */}
          <div>
            <Modal show={popUpDetail} onHide={() => window.location.reload(setPopUpDetail(false))} size="lg" centered>
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body>
                <div className={styles.popup_contents}>
                  <div>
                    <img src={detail.image} alt="popup-detail" />
                  </div>
                  <div className={styles.popup_detail}>
                    <p className={styles.p1}>Successfully enrolled!</p>
                    <p className={styles.p2}>{detail.category?.name}</p>
                    <p className={styles.p3}>By {detail.by?.fullName}</p>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer style={{ background: "#FAFAFA" }}>
                <div style={{ margin: "0 auto" }}>
                  <p>Please wait coresponding {detail.by?.fullName} approve you!</p>
                </div>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Detail;
