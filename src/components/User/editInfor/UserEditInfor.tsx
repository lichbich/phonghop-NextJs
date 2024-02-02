import { Form as Form1, Image, message, Modal } from "antd";
import React, { useState, useEffect } from "react";
import Input from "@/constants/Form/Input";
import Button from "@/constants/Form/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "src/css/UserEditInfor.module.css";
import api from "@/axiosService";
import { toast } from "react-hot-toast";
import { useLocale, useTranslations } from "next-intl";

const UserEditInfor = ({ user }: any) => {
  const [form] = Form1.useForm();
  const [formData, setFormData] = useState({ ...user });
  const [formCompleted, setFormCompleted] = useState(false);
  const [visible, setVisible] = useState(false);
  const t = useTranslations("Edit");
  const locale = useLocale();

  useEffect(() => {
    form.setFieldsValue({
      title: user.title,
      phone: user.phone,
      company: user.company.company_name,
    });
  }, [form, user.title, user.phone, user.company.company_name]);
  const showPopup = () => {
    setVisible(true);
  };
  const handleCancel = () => {
    setVisible(false);
  };
  const handleEdit = async () => {
    try {
      const values = await form.validateFields();
      const updateData = {
        phone: values.phone,
        title: values.title,
      };
      const response = await api.put(`update-user/${user.id}`, updateData);

      if (response.status === 200) {
        toast.success(t("success"));
      }
      setVisible(false);
    } catch (error) {
      console.error(error);
      toast.error(t("error"));
    }
  };
  return (
    <>
      <button onClick={showPopup} className={styles.custombutton}>
        <Image src="/edit.svg" alt="" />
      </button>
      <Modal
        title={
          <div className={styles.formTitle}>Edit Personal Information</div>
        }
        open={visible}
        onCancel={handleCancel}
        footer={null}
        closable={false}
        width={975}
      >
        <Form1
          form={form}
          name="Edit personal information"
          requiredMark={false}
          onValuesChange={(changedValues, allValues) => {
            console.log(changedValues, allValues);
            const isFormCompleted = Object.values(allValues).every(
              (value) => value !== undefined && value !== ""
            );
            setFormCompleted(isFormCompleted);
          }}
        >
          <div className={styles.formControl}>
            <Form1.Item
              label={<span className={styles.label}>Name*</span>}
              name="manager-name"
            >
              <p className={styles.formFields}>{user.name}</p>
            </Form1.Item>
          </div>
          <div className={styles.formControl}>
            <Form1.Item
              label={<span className={styles.label}>Title*</span>}
              name="title"
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
                className={styles.Input}
                type="text"
                value={formData.title}
                onChange={(e: any) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </Form1.Item>
          </div>
          <div className={styles.formControl}>
            <Form1.Item
              label={<span className={styles.label}>Company*</span>}
              name="company"
            >
              <p className={styles.formFields}>
                {user.company.data.company_name}
              </p>
            </Form1.Item>
          </div>
          <div className={styles.formControl}>
            <Form1.Item
              label={<span className={styles.label}>Email Address*</span>}
              name="email"
            >
              <p className={styles.formFields}>{user.email}</p>
            </Form1.Item>
          </div>
          <div className={styles.formControl}>
            <Form1.Item
              label={<span className={styles.label}>Phone Number*</span>}
              name="phone"
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
                  min: 10,
                  message: (
                    <span className={styles.phoneError}>
                      Please input a valid phone number
                    </span>
                  ),
                },
                {
                  max: 20,
                  message: (
                    <span className={styles.phoneError}>
                      Please input a valid phone number
                    </span>
                  ),
                },
              ]}
            >
              <Input
                className={styles.Input}
                type="text"
                value={formData.phone}
                onChange={(e: any) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </Form1.Item>
          </div>
          <Form1.Item>
            <div className={styles.buttonContainer}>
              <div>
                <Button
                  className={styles.buttonEdit}
                  htmlType="submit"
                  onClick={handleEdit}
                  label="SAVE"
                  style={
                    !formCompleted
                      ? { backgroundColor: "#8B8B8B" }
                      : { backgroundColor: "#225560" }
                  }
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
          </Form1.Item>
        </Form1>
      </Modal>
    </>
  );
};
export default UserEditInfor;
