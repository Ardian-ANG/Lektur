import React, { useState } from "react";

import styles from "../../styles/BannerBottom.module.css";
import Teacher from "../../assests/teacher-banner.png";
import { Link } from "react-router-dom";

const BannerBottom = () => {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <>
      {!isLogin ? (
        <div className={styles["banner-bottom"]}>
          <div className={styles.left}>
            <h2 className={styles.title}>Create Your Own Class</h2>
            <Link to="/register" className={styles.btn}>
              {" "}
              Register Now
            </Link>
          </div>
          <div className={styles.right}>
            <img src={Teacher} alt="Teacher" />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default BannerBottom;
