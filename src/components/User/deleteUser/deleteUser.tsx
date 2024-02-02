import React, { useState } from "react";
import { Image, Modal } from "antd";
import Button from "@/constants/Form/Button";
import styles from "/src/css/DeleteUser.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "@/axiosService";
import { toast } from "react-hot-toast";
import { useLocale, useTranslations } from "next-intl";

const DeleteUser = ({ user_id, onDeleteSuccess }: any) => {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("Delete");
  const locale = useLocale();
  const showPopup = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const confirmDeleteAction = async () => {
    try {
      const response = await api.delete(`delete-users/${user_id}`);
      onDeleteSuccess();
      toast.success(t("success"));
    } catch (error) {
      console.log(error);
      toast.error(t("error"));
    } finally {
      setVisible(false);
    }
  };

  return (
    <>
      <button
        onClick={showPopup}
        className={styles.custombutton}
        style={{ backgroundColor: "#E56353" }}
      >
        <Image src="/delete.svg" alt="" preview={false} />
      </button>
      <Modal
        title={
          <div className={styles.warningTitle}>
            Are you sure to delete this staff?
          </div>
        }
        open={visible}
        footer={null}
        closable={false}
        width={626}
        centered
      >
        <div className={styles.buttonContainer}>
          <div>
            <Button
              className={styles.buttonDelete}
              onClick={() => confirmDeleteAction()}
              label="DELETE"
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

export default DeleteUser;
