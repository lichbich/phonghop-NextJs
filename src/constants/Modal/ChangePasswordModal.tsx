import React from "react";
import styles from "@/css/CompanyList.module.css";
import { useState } from "react";
import Button from "../ButtonDefault/Button";
import Modal from "@/constants/Modal/ProfileModal";
import customstyles from "@/constants/Modal/ChangeModal.module.css";
import api from "@/axiosService";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import customstyle2 from "@/css/InternalChangePass.module.css";
import { Image } from "antd";

const ChangePasswordModal = ({ title, onClose, children, isOpen }: any) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessage1, setErrorMessage1] = useState("");
  const [errorMessage2, setErrorMessage2] = useState("");
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmNewPasswordVisible, setConfirmNewPasswordVisible] =
    useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const user = useSelector((state: any) => state.user.value);
  const user_id = user.id;
  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSaveChangePassword = async () => {
    if (!validatePassword(newPassword)) {
      setErrorMessage(
        "New password must be at least 8 characters long, contain at least one uppercase letter, and one digit."
      );
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage1("Passwords are not the same");
      return;
    }
    if (newPassword === currentPassword) {
      setErrorMessage(
        "New password should be different from the current password"
      );
      return;
    }
    try {
      const res = await api.post("auth/user/reset-password", {
        user_id: user_id,
        old_password: currentPassword,
        new_password: newPassword,
      });
      closeModal();
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setErrorMessage2("Please re-enter current password");
      }
    }
  };

  const closeModal = () => {
    onClose();
  };
  return (
    <Modal title={title} onClose={closeModal} width="975">
      {
        <>
          <div className={styles.inputgroup}>
            <div className={styles.inputform1} style={{ marginBottom: "35px" }}>
              <label htmlFor="name">Current Password*</label>
              <Image src="/pass.svg" alt="" className={customstyles.icon} />
              <input
                type={currentPasswordVisible ? "text" : "password"}
                name="password"
                placeholder="Password"
                className={customstyles.inputsection}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <Image
                src={currentPasswordVisible ? "/showpass.svg" : "/hidepass.svg"}
                alt=""
                className={customstyles.showhide}
                onClick={() =>
                  setCurrentPasswordVisible(!currentPasswordVisible)
                }
              />
              <p className={customstyle2.error}>{errorMessage2}</p>
            </div>

            <div className={styles.inputform1} style={{ marginBottom: "35px" }}>
              <label htmlFor="title">New Password*</label>
              <Image src="/pass.svg" alt="" className={customstyles.icon} />
              <input
                type={newPasswordVisible ? "text" : "password"}
                name="password"
                placeholder="Password"
                className={customstyles.inputsection}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setErrorMessage("");
                }}
              />
              <Image
                src={newPasswordVisible ? "/showpass.svg" : "/hidepass.svg"}
                alt=""
                className={customstyles.showhide}
                onClick={() => setNewPasswordVisible(!newPasswordVisible)}
              />
              <p className={customstyle2.error}>{errorMessage}</p>
            </div>

            <div className={styles.inputform1} style={{ marginBottom: "50px" }}>
              <label htmlFor="company">Confirm Password*</label>
              <Image src="/pass.svg" alt="" className={customstyles.icon} />
              <input
                type={confirmNewPasswordVisible ? "text" : "password"}
                name="password"
                placeholder="Password"
                className={customstyles.inputsection}
                value={confirmNewPassword}
                onChange={(e) => {
                  setConfirmNewPassword(e.target.value);
                  setErrorMessage("");
                }}
              />
              <Image
                src={
                  confirmNewPasswordVisible ? "/showpass.svg" : "/hidepass.svg"
                }
                alt=""
                className={customstyles.showhide}
                onClick={() =>
                  setConfirmNewPasswordVisible(!confirmNewPasswordVisible)
                }
              />
              <p className={customstyle2.error}>{errorMessage1}</p>
            </div>
          </div>
          <div className={styles.btngroup}>
            <Button
              className={styles.passbtn}
              onClick={handleSaveChangePassword}
            >
              SAVE
            </Button>
            <Button
              color="#FFF"
              className={styles.closebtn}
              onClick={closeModal}
            >
              CLOSE
            </Button>
          </div>
        </>
      }
    </Modal>
  );
};
export default ChangePasswordModal;
