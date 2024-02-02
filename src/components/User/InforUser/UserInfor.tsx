import React, { useEffect, useState } from "react";
import { Image, Modal, message } from "antd";
import styles from "/src/css/AddUser.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import customstyle from "@/css/CompanyList.module.css";
import { Form as Form3 } from "antd";

const StaffInfomation = ({ rec }: any) => {
  const [visible, setVisible] = useState(false);
  const [form3] = Form3.useForm();
  const showPopup = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    form3.setFieldsValue({
      name: rec.name,
      title: rec.title,
      email: rec.email,
      phone: rec.phone,
    });
  }, [rec, form3]);
  return (
    <>
      <button
        key="view"
        className={customstyle.custombutton}
        onClick={showPopup}
      >
        <Image src="/eye.svg" alt="" preview={false} />
      </button>
      <Modal
        title={<div className={styles.formTitle}>Sraff Detail Infomation</div>}
        open={visible}
        onCancel={handleCancel}
        footer={null}
        closable={false}
        width={973}
      >
        <Form3 form={form3} name="Staff Infomation" requiredMark={false}>
          <div className={styles.formControl}>
            <Form3.Item
              label={<span className={styles.label}>Name*</span>}
              name="name"
              style={{ width: "100%" }}
            >
              <input
                className={`${styles.Input} ${styles.customInput}`}
                disabled={true}
                readOnly
              />
            </Form3.Item>
          </div>
          <div className={styles.formControl}>
            <Form3.Item
              label={<span className={styles.label}>Role</span>}
              name="title"
              style={{ width: "100%" }}
            >
              <input
                className={`${styles.Input} ${styles.customInput}`}
                disabled={true}
              />
            </Form3.Item>
          </div>
          <div className={styles.formControl}>
            <Form3.Item
              label={<span className={styles.label}>Email*</span>}
              name="email"
              style={{ width: "100%" }}
            >
              <input
                className={`${styles.Input} ${styles.customInput}`}
                disabled={true}
              />
            </Form3.Item>
          </div>
          <div className={styles.formControl}>
            <Form3.Item
              label={<span className={styles.label}>Phone Number</span>}
              name="phone"
              style={{ width: "100%" }}
            >
              <input
                className={`${styles.Input} ${styles.customInput}`}
                disabled={true}
              />
            </Form3.Item>
          </div>
          <div className={styles.buttonsingle}>
            <button
              color="#FFF"
              className={styles.buttonClose}
              onClick={handleCancel}
            >
              CLOSE
            </button>
          </div>
        </Form3>
      </Modal>
    </>
  );
};

export default StaffInfomation;
