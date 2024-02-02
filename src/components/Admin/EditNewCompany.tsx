import React, { useEffect, useState } from "react";
import { Image, Modal, message } from "antd";
import Input from "@/constants/Form/Input";
import Button from "@/constants/Form/Button";
import styles from "/src/css/AddUser.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "@/axiosService";
import customstyle from "@/css/CompanyList.module.css";
import { Form as Form } from "antd";
import stylecomfirm from "@/css/DeleteMeeting.module.css";

const EditNewCompany = ({ rec, onEditSuccess }: any) => {
  const [visible, setVisible] = useState(false);
  const [form1] = Form.useForm();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showPopup = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    //setVisible(false);
    setShowConfirmModal(true);
  };
  const handleConfirmCancel = (confirmed: boolean) => {
    if (confirmed) {
      setShowConfirmModal(false);
      setVisible(false);
    } else {
      setShowConfirmModal(false);
    }
  };

  useEffect(() => {
    form1.setFieldsValue({
      company_name: rec.name,
      company_address: rec.address,
      company_domain: rec.domain,
      company_taxcode: rec.taxcode,
      name: rec.manager.manager_name,
      title: rec.manager.manager_title,
      email: rec.manager.manager_email,
      phone: rec.manager.manager_phone,
    });
  }, [rec, form1]);

  function handleSubmit() {
    form1
      .validateFields()
      .then(async (values) => {
        try {
          const data = await api.put(`update-company/${rec.id}`, {
            ...values,
            manager_title: values.title,
            phone: values.phone,
          });
          if (data.status == 200) {
            message.success("User update successfully");
            setVisible(false);
            if (onEditSuccess) {
              onEditSuccess();
            }
          } else {
            message.error("Failed to create user");
          }
        } catch (e) {
          console.error("Error creating user:", e);
          message.error("Failed to create user");
        }
      })
      .catch((errorInfo) => {
        console.log(errorInfo);
      });
  }

  return (
    <>
      <button
        key="edit"
        className={customstyle.custombutton}
        onClick={showPopup}
      >
        <Image src="/edit.svg" alt="" preview={false} />
      </button>
      <Modal
        title={<div className={styles.formTitle}>Edit Company Infomation</div>}
        open={visible}
        onCancel={handleCancel}
        footer={null}
        closable={false}
        width={973}
      >
        <Form form={form1} name="Edit New Company" requiredMark={false}>
          <p className={styles.toplabel}>Company Information</p>
          <div className={styles.formControl}>
            <Form.Item
              label={<span className={styles.label}>Name*</span>}
              name="company_name"
              rules={[
                {
                  required: true,
                  message: (
                    <span className={styles.errorMessage}>
                      This field is required!
                    </span>
                  ),
                },
              ]}
              style={{ width: "100%" }}
            >
              <input className={styles.Input} disabled />
            </Form.Item>
          </div>
          <div className={styles.formControl}>
            <Form.Item
              label={<span className={styles.label}>Address*</span>}
              name="company_address"
              style={{ width: "100%" }}
              rules={[
                {
                  required: true,
                  message: (
                    <span className={styles.errorMessage}>
                      This field is required!
                    </span>
                  ),
                },
              ]}
            >
              <input className={styles.Input} />
            </Form.Item>
          </div>
          <div className={styles.formControl}>
            <Form.Item
              label={<span className={styles.label}>Domain*</span>}
              name="company_domain"
              rules={[
                {
                  required: true,
                  message: (
                    <span className={styles.errorMessage}>
                      This field is required!
                    </span>
                  ),
                },
              ]}
              style={{ width: "100%" }}
            >
              <input
                className={styles.Input}
                placeholder="IT Service/HealthCare"
              />
            </Form.Item>
          </div>
          <div className={styles.formControl}>
            <Form.Item
              label={<span className={styles.label}>Tax Code</span>}
              name="company_taxcode"
              style={{ width: "100%" }}
            >
              <input className={styles.Input} />
            </Form.Item>
          </div>
          <p className={styles.toplabel}>Company Manager Information</p>
          <div className={styles.formControl}>
            <Form.Item
              label={<span className={styles.label}>Name*</span>}
              name="name"
              rules={[
                {
                  required: true,
                  message: (
                    <span className={styles.errorMessage}>
                      This field is required!
                    </span>
                  ),
                },
              ]}
              style={{ width: "100%" }}
            >
              <input className={styles.Input} disabled />
            </Form.Item>
          </div>
          <div className={styles.formControl}>
            <Form.Item
              label={<span className={styles.label}>Title*</span>}
              name="title"
              style={{ width: "100%" }}
              rules={[
                {
                  required: true,
                  message: (
                    <span className={styles.errorMessage}>
                      This field is required!
                    </span>
                  ),
                },
              ]}
            >
              <input className={styles.Input} />
            </Form.Item>
          </div>
          <div className={styles.formControl}>
            <Form.Item
              label={<span className={styles.label}>Email*</span>}
              name="email"
              rules={[
                {
                  required: true,
                  message: (
                    <span className={styles.errorMessage}>
                      This field is required!
                    </span>
                  ),
                },
                {
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: (
                    <span className={styles.errorMessage}>
                      Please enter email
                    </span>
                  ),
                },
              ]}
              style={{ width: "100%" }}
            >
              <input className={styles.Input} disabled />
            </Form.Item>
          </div>
          <div className={styles.formControl}>
            <Form.Item
              label={<span className={styles.label}>Phone Number*</span>}
              name="phone"
              getValueFromEvent={(e) => e.target.value.slice(0, 12)}
              rules={[
                {
                  required: true,
                  message: (
                    <span className={styles.errorMessage}>
                      This field is required!
                    </span>
                  ),
                },
                {
                  max: 12,
                  message: (
                    <span className={styles.errorMessage}>
                      Maximum length is 12 digits.
                    </span>
                  ),
                },
              ]}
              style={{ width: "100%" }}
            >
              <input className={styles.Input} />
            </Form.Item>
          </div>
          <Form.Item>
            <div className={styles.buttonContainer}>
              <div>
                <Button
                  className={`${styles.buttonAdd} ${styles.formCompleted}`}
                  htmlType="submit"
                  onClick={handleSubmit}
                  label="SAVE"
                />
              </div>
              <div>
                <Button
                  className={styles.buttonCancel}
                  onClick={handleCancel}
                  label="CANCEL"
                />
              </div>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={
          <div className={stylecomfirm.warningTitle}>
            Are you sure to cancel editing?
          </div>
        }
        open={showConfirmModal}
        footer={null}
        closable={false}
        width={626}
        centered
      >
        <div className={stylecomfirm.buttonContainer}>
          <div>
            <Button
              className={stylecomfirm.buttonDelete}
              onClick={() => handleConfirmCancel(false)}
              label="GO BACK TO EDITING"
            />
          </div>
          <div>
            <Button
              className={stylecomfirm.buttonCancel}
              htmltype="submit"
              onClick={() => handleConfirmCancel(true)}
              label="CANCEL EDITING"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EditNewCompany;
