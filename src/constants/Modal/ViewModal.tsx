import React from "react";
import styles from'./ViewModal.module.css'

const Modal = ({ title, height, width, onClose, children }:any) => {
  return (
    <div className={styles.modaloverlay}>
      <div className={styles.modal} style={{ width: width, height: height }}>
        <div className={styles.modalheader}>
          <h2>{title}</h2>
          {/* <button className={styles.closebutton} onClick={onClose}>
            Close
          </button> */}
        </div>
        <div className={styles.modalcontent}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
