import React, { useEffect, useState } from "react";
import { Image, Modal } from "antd";
import styles from "/src/css/AddUser.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import customstyle from "@/css/CompanyList.module.css";
import { Form as Form3 } from "antd";

const InfomationCompany = ({ rec }: any) => {
  const [visible, setVisible] = useState(false);
  const [form3] = Form3.useForm();
  console.log(rec);
  const showPopup = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    form3.setFieldsValue({
      company_name: rec.name,
      company_address: rec.address,
      company_domain: rec.domain,
      company_taxcode: rec.taxcode,
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
        title={<div className={styles.formTitle}>View Company Infomation</div>}
        open={visible}
        onCancel={handleCancel}
        footer={null}
        closable={false}
        width={973}
      >
        <Form3 form={form3} name="Company Infomation aa" requiredMark={false}>
          <div className={styles.formControl}>
            <Form3.Item
              label={<span className={styles.label}>Name*</span>}
              name="company_name"
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
              label={<span className={styles.label}>Address*</span>}
              name="company_address"
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
              label={<span className={styles.label}>Domain*</span>}
              name="company_domain"
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
              label={<span className={styles.label}>Tax Code</span>}
              name="company_taxcode"
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

export default InfomationCompany;
