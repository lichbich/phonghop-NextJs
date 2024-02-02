import React from "react";
import styles from "./ModalCompany.module.css";

const Modal = ({ title, onClose, children }:any) => {
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

export default Modal;