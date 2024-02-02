import React, { useState } from "react";
import { Image, Modal } from "antd";
import Button from "@/constants/Form/Button";
import styles from "@/css/DeleteMeeting.module.css";
import axios from "axios";
import customstyle from "@/css/CompanyList.module.css";
import api from "@/axiosService";

const DeleteCompany = ({ company_id, onDeleteSuccess }: any) => {
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // const t = useTranslations('Delete');
  // const locale = useLocale();

  const showPopup = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setErrorMessage("");
    setVisible(false);
  };
  // headers: {
  //     'Accept': 'application/vnd.api+json',
  //     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  //     'Authorization': 'Bearer ' + bearerToken
  // }
  const deleteRoom = async () => {
    try {
      const response = await api.delete(`delete-company/${company_id}`);
      if (response.status === 200) {
        console.log("Company deleted successfully.");
        onDeleteSuccess();
      } else {
        console.error(
          "Error deleting company:",
          response.status,
          response.data
        );
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setVisible(false);
    }
  };
  return (
    <>
      <button
        key="delete"
        className={customstyle.custombutton}
        style={{ backgroundColor: "#E56353" }}
        onClick={showPopup}
      >
        <Image src="/delete.svg" alt="" preview={false}/>
      </button>
      <Modal
        title={
          <div className={styles.warningTitle}>
            Are you sure to delete this company?
          </div>
        }
        open={visible}
        footer={null}
        closable={false}
        width={626}
        centered
      >
        {errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}
        <div className={styles.buttonContainer}>
          <div>
            <Button
              className={styles.buttonDelete}
              onClick={deleteRoom}
              label="DELETE COMPANY"
            />
          </div>
          <div>
            <Button
              className={styles.buttonCancel}
              htmltype="submit"
              onClick={handleCancel}
              label="CANCEL"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
export default DeleteCompany;
