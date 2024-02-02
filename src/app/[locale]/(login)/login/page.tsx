"use client";
import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Input from "@/constants/Form/Input";
import styles from "@/css/Login.module.css";
import Checkbox, { CheckboxChangeEvent } from "antd/es/checkbox/Checkbox";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Button from "@/constants/Form/Button";
import Modal from "@/constants/Modal/FirstLogModal";
import { toast } from "react-hot-toast";
import api from "@/axiosService";
import { useLocale, useTranslations } from "next-intl";
import { useAppDispatch } from "@/lib/hooks";
import { setLoading } from "@/lib/features/loadingSlice";
import { initializeUser } from "@/lib/features/user/userSlice";
import { Image } from "antd";

const LoginPage: React.FC<{}> = () => {
  const t = useTranslations("Login");
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useSelector((state: any) => state.user.value);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessage1, setErrorMessage1] = useState("");
  const [errorMessage2, setErrorMessage2] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewAccount, setIsNewAccount] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const user_id = user ? user.id ? user.id : 0 : 0;
  const isFormValid = email !== '' && password !== '';
  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };
  const handleLogin = async () => {
    const postData = {
      email: email,
      password: password,
    };

    try {
      dispatch(setLoading(true));
      const res = await api.post("auth/login", postData);
      toast.success(t("success"));
      sessionStorage.setItem("current_password", password);
      Cookies.set("token", res.data.data.token);
      Cookies.set("type", res.data.data.user.type);
      const user = res.data.data.user;
      dispatch(initializeUser(user));
      const first_login = user.is_first_login;
      if (first_login === 0) {
        setIsNewAccount(true);
        openModal();
      } else {
        if (user.type === 0) {
          router.push(`/${locale}/company`);
        } else {
          router.push(`/${locale}/room`);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(t("error"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
        old_password: sessionStorage.getItem("current_password"),
        new_password: newPassword,
      });
      closeModal();
      if (user.type === 0) {
        router.push(`/${locale}/company`);
      } else {
        router.push(`/${locale}/room`);
      }
      const first_login = user.is_first_login;
      if (first_login) {
        user.is_first_login = 1;
        try {
          const res = await api.post("store-users", {
            user_id: user_id,
            is_first_login: 1,
          });
        } catch (error: any) {}
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setErrorMessage2("Please re-enter current password");
      }
    }
  };
  const [passwordVisible, setpasswordVisible] = useState(false);
  const [changepasswordVisible, setchangepasswordVisible] = useState(false);
  const onChange = (e: CheckboxChangeEvent) => {
    console.log(`checked = ${e.target.checked}`);
  };
  return (
    <>
      <div className={styles.inputform}>
        <div className={styles.input}>
          <Image
            src="/mail.svg"
            alt=""
            className={styles.icon}
            preview={false}
          />
          <Input
            type="text"
            name="username"
            placeholder="Email"
            className={styles.inputsection}
            style={{ marginBottom: "24px" }}
            onChange={(e: any) => setEmail(e.target.value)}
            value={email}
          ></Input>{" "}
        </div>
        <div className={styles.input}>
          <Image
            src="/pass.svg"
            alt=""
            className={styles.icon}
            preview={false}
          />
          <Input
            type={passwordVisible ? "text" : "password"}
            name="password"
            placeholder="Password"
            className={styles.inputsection}
            style={{ marginBottom: "48px" }}
            onChange={(e: any) => setPassword(e.target.value)}
            value={password}
          ></Input>{" "}
          <Image
            src={passwordVisible ? "/showpass.svg" : "/hidepass.svg"}
            alt=""
            preview={false}
            className={styles.showhide}
            onClick={() => setpasswordVisible(!passwordVisible)}
          />
        </div>
        <div className={styles.forgot}>
          <Checkbox onChange={onChange}>Remember me</Checkbox>
          <Link
            href={`/${locale}/forgotpassword`}
            className={styles.customlink}
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="button"
          className={styles.loginbtn}
          onClick={handleLogin}
          style={{ backgroundColor: isFormValid ? "#225560" : "#8B8B8B" }}
        >
          LOG IN
        </Button>
        <div className={styles.account}>
          <p>Don't have an account?</p>
          <Link
            href={`/${locale}/manager`}
            className={styles.customlink}
            passHref
          >
            Register
          </Link>
        </div>
        <div>
          {isModalOpen && (
            <Modal
              title="Kindly change your password for first time log in."
              onClose={closeModal}
            >
              {
                <>
                  <div className={styles.inputgroup}>
                    <div className={styles.inputform1}>
                      <Image
                        src="/pass.svg"
                        alt=""
                        className={styles.icon1}
                        preview={false}
                      />
                      <input
                        type={changepasswordVisible ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        className={styles.inputsection}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setErrorMessage("");
                        }}
                      />
                      <Image
                        src={
                          changepasswordVisible
                            ? "/showpass.svg"
                            : "/hidepass.svg"
                        }
                        preview={false}
                        alt=""
                        className={styles.showhide2}
                        onClick={() =>
                          setchangepasswordVisible(!changepasswordVisible)
                        }
                      />
                      <p className={styles.error}>{errorMessage}</p>
                    </div>
                    <div className={styles.inputform1}>
                      <Image
                        src="/pass.svg"
                        alt=""
                        className={styles.icon1}
                        preview={false}
                      />
                      <input
                        type={changepasswordVisible ? "text" : "password"}
                        name="password"
                        placeholder="Confirm Password"
                        className={styles.inputsection}
                        value={confirmNewPassword}
                        onChange={(e) => {
                          setConfirmNewPassword(e.target.value);
                          setErrorMessage("");
                        }}
                      />
                      <Image
                        preview={false}
                        src={
                          changepasswordVisible
                            ? "/showpass.svg"
                            : "/hidepass.svg"
                        }
                        alt=""
                        className={styles.showhide2}
                        onClick={() =>
                          setchangepasswordVisible(!changepasswordVisible)
                        }
                      />
                      <p className={styles.error}>{errorMessage1}</p>
                    </div>
                  </div>
                  <div className={styles.btngroup}>
                    <Button
                      className={styles.passbtn}
                      onClick={handleSaveChangePassword}
                    >
                      CHANGE PASSWORD
                    </Button>
                  </div>
                </>
              }
            </Modal>
          )}
        </div>
      </div>
    </>
  );
};
export default LoginPage;
