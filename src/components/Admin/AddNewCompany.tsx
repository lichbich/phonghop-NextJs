import React, { useEffect, useState } from "react";
import { Modal, message, Input } from "antd";
import Button from "@/constants/Form/Button";
import styles from "/src/css/AddUser.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "@/axiosService";
import customstyle from "@/css/CompanyList.module.css";
import { Form } from "antd";

const AddNewCompany = ({ onAddSuccess }: any) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [formCompleted, setFormCompleted] = useState(false);
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const fieldsWithRules = ["company_name", "company_address", "company_domain", "name", "title", "email", "phone"];


  const handleInputChange = (event: any) => {
    setInputValues({
      ...inputValues,
      [event.target.name]: event.target.value,
    });
  };

  const handleKeyDown = (e: any) => {
    // Kiểm tra nếu ký tự không phải là số
    const inputValue = e.key;
    if (isNaN(inputValue) && inputValue !== "Backspace") {
      e.preventDefault();
    }
  };

  const showPopup = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setInputValues({});
    // form.setFieldsValue({
    //   input1: '',
    //   input2: '',
    //   input3: '',
    //   input4: '',
    //   input5: '',
    //   input6: '',
    //   input7: '',
    //   input8: '',
    // });
    setVisible(false);
  };

  function handleSubmit() {
    form
      .validateFields()
      .then(async (values) => {
        try {
          const password = Math.random().toString(36);
          values = {
            ...form.getFieldsValue(),
            password: password,
            password_confirmation: password,
          };
          const data = await api.post(`user/register/company`, values);
          if (data.status == 200) {
            message.success("User created successfully");
            form.resetFields();
            setVisible(false);
            if (onAddSuccess) {
              onAddSuccess();
            }
          } else {
            message.error("Failed to create user");
            form.resetFields();
            setVisible(false);
            if (onAddSuccess) {
              onAddSuccess();
            }
          }
        } catch (e) {
          console.error("Error creating user:", e);
          message.error("Failed to create user");
          console.log(values);
        }
      })
      .catch((errorInfo) => {
        console.log(errorInfo);
      });
  }

  return (
    <>
      <button key="add" className={customstyle.addbtn} onClick={showPopup}>
        ADD NEW COMPANY
      </button>
      <Modal
        title={<div className={styles.formTitle}>Add New Company</div>}
        open={visible}
        onCancel={handleCancel}
        footer={null}
        closable={false}
        width={973}
      >
        <Form
          form={form}
          name="Add new company"
          requiredMark={false}
          onValuesChange={(changedValues, allValues) => {
            const isFormCompleted = fieldsWithRules.every(
              (field) =>
                allValues[field] !== undefined && allValues[field] !== ""
            );
            setFormCompleted(isFormCompleted);
          }}
        >
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
              <Input
                type="text"
                name="input1"
                className={
                  inputValues["input1"] ? styles.Input : styles.InputEmpty
                }
                value={inputValues["input1"] || ""}
                onChange={handleInputChange}
              />
            </Form.Item>
          </div>
          <div className={styles.formControl}>
            <Form.Item
              label={<span className={styles.label}>Address*</span>}
              name="company_address"
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
              <Input
                type="text"
                name="input2"
                className={
                  inputValues["input2"] ? styles.Input : styles.InputEmpty
                }
                value={inputValues["input2"] || ""}
                onChange={handleInputChange}
              />
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
              <Input
                type="text"
                name="input3"
                className={
                  inputValues["input3"] ? styles.Input : styles.InputEmpty
                }
                value={inputValues["input3"] || ""}
                onChange={handleInputChange}
                placeholder="IT Service/Healthcare"
              />
            </Form.Item>
          </div>
          <div className={styles.formControl}>
            <Form.Item
              label={<span className={styles.label}>Tax Code</span>}
              name="company_taxcode"
              style={{ width: "100%" }}
            >
              <Input
                type="text"
                name="input4"
                className={
                  inputValues["input4"] ? styles.Input : styles.InputEmpty
                }
                value={inputValues["input4"] || ""}
                onChange={handleInputChange}
              />
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
              <Input
                type="text"
                name="input5"
                className={
                  inputValues["input5"] ? styles.Input : styles.InputEmpty
                }
                value={inputValues["input5"] || ""}
                onChange={handleInputChange}
              />
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
              <Input
                type="text"
                name="input6"
                className={
                  inputValues["input6"] ? styles.Input : styles.InputEmpty
                }
                value={inputValues["input6"] || ""}
                onChange={handleInputChange}
              />
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
              <Input
                type="text"
                name="input7"
                className={
                  inputValues["input7"] ? styles.Input : styles.InputEmpty
                }
                value={inputValues["input7"] || ""}
                onChange={handleInputChange}
              />
            </Form.Item>
          </div>
          <div className={styles.formControl}>
            <Form.Item
              label={<span className={styles.label}>Phone Number*</span>}
              name="phone"
              style={{ width: "100%" }}
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
            >
              <Input
                type="tel"
                name="input8"
                className={
                  inputValues["input8"] ? styles.InputNumber : styles.InputEmpty
                }
                value={inputValues["input8"] || ""}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
            </Form.Item>
          </div>
          <Form.Item>
            <div className={styles.buttonContainer}>
              <div>
                <Button
                  className={`${styles.buttonAdd} ${
                    formCompleted ? styles.formCompleted : ""
                  }`}
                  htmlType="submit"
                  onClick={handleSubmit}
                  label="ADD NEW USER"
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
    </>
  );
};

export default AddNewCompany;
