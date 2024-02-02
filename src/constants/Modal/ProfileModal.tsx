import React from "react";
import styles from "./ProfileModal.module.css";

const ProfileModal = ({ title, onClose, children }:any) => {
  return (
    <div className={styles.modaloverlay}>
      <div className={styles.modal}>
        <div className={styles.modalheader}>
          <h2>{title}</h2>
        </div>
        <div className={styles.modalcontent}>{children}</div>
      </div>
    </div>
  );
};

export default ProfileModal;