import React, { useEffect, useState } from "react";
import { Modal, Input, Row, Col, Form, Card, Image, Layout, List, Skeleton, Avatar, Select, Flex, CheckboxProps, Checkbox, Progress, } from "antd";
import Button from "@/constants/Form/Button";
import styles from "/src/css/BookingDetail.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form as Form2 } from "antd";
import Meta from "antd/es/card/Meta";
import TextArea from "antd/es/input/TextArea";
import "@/css/BookingDetail.css";
import Link from "next/link";
import { useLocale } from "next-intl";
import api from "@/axiosService";
import { repeat, set } from "lodash";
import BookingSuccess from "../Booking/BookingSuccess";

const AddInforGuest = ({ openModal, closeModal, step1Data }: any) => {
  const locale = useLocale();
  const [visible, setVisible] = useState(false);
  const [formBookingDetail] = Form.useForm();
  const [checked1, setChecked1] = useState(0);
  const [checked2, setChecked2] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(70);
  const [saveSuccess, setSaveSuccess] = useState(false); 
  const [modalVisible, setModalVisible] = useState(false);
  const [result, setResult] = useState<any[]>([]);

  useEffect(() => {
    setCurrentProgress(checked1 ? 100 : 70)
  }, [checked1]);


  const onChange1 = (e: any) => {
    setChecked1(e.target.checked ? 1 : 0);
  };
  const onChange2 = (e: any) => {
    setChecked2(e.target.checked);
  };

  const showSuccessPopup = () => {
    setSaveSuccess(true);
  };

  const handleSave = async () => {
    try {
      const formData = formBookingDetail.getFieldsValue();
      const response = await api.post("bookings", {
        ...step1Data,
        ...formData,
        meeting_room_id: step1Data.room,
        register_status: checked1,
        repeat_type: 0,
        sharing_confirmation: 0,
      });
      if (checked1 === 1) {
        const permissionResponse = await api.get("set-role/2");
      }
      setResult(response.data);
      setSaveSuccess(true);
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving data:", error);
      // Handle the error or display an error message
    }
  };
  // const closeModal1 = (value: boolean) => {
  //   setOpenModal(value);
  // }
  const showPopup = () => {
    setVisible(true);
    formBookingDetail.resetFields();
  };

  const handleCancel = () => {
    setModalVisible(false);
    formBookingDetail.resetFields();
    closeModal(true);
  };
  return (
    <>
      <Modal
        title={<div className={styles.formTitle ? '' : 'inVisibleModal'}>New Booking Session</div>}
        open={openModal}
        footer={null}
        closable={false}
        width={1296}
        visible={modalVisible}
      >
        <h4 className="title-Guest">
          <i>User Information</i>
        </h4>
        <br />
        <Form
          labelAlign="left"
          form={formBookingDetail}
          labelCol={{ flex: "200px" }}
          requiredMark={false}
        >
          <Row>
            <Col span={12}>
              <Form.Item label="Name*" name="booking_name">
                <Input className="bookingInput" />
              </Form.Item>
              <Form.Item label="Email*" name="booking_email">
                <Input className="bookingInput" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Title" name="booking_title">
                <Input className="bookingInput" />
              </Form.Item>
              <Form.Item label="Company" name="booking_company">
                <Input className="bookingInput" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Checkbox onChange={onChange1}>
              <span>Create an account to skip this part next time or</span>
            </Checkbox>
            <Link href={`/${locale}/login`} className="SignIn-Guest">
              {" "}
              Sign In
            </Link>
          </Form.Item>
          {/* =======enter password======= */}
          {checked1 && (
            <Row className="checkToVisible">
              <Col span={12}>
                <Form.Item label="Password*">
                  <Input className="bookingInput" type="password" />
                </Form.Item>
                <Form.Item label="Confirm Password*">
                  <Input className="bookingInput" type="password" />
                </Form.Item>
              </Col>
              <Form.Item>
                <Checkbox checked={checked2} onChange={onChange2}>
                  <span>
                    By checking on this box I would like to register as member
                    of the system and agree with terms of usage
                  </span>
                </Checkbox>
              </Form.Item>
            </Row>
          )}
        </Form>

        {/* =================== */}
        <Form.Item>
          <div className="btnBookGroup">
            <Button className="btnBookNow" label="Book Now" onClick={handleSave} />
            <Button className="btnClose" onClick={handleCancel} label="Close" />
          </div>
        </Form.Item>
        <Progress
          style={{
            width: "50%",
            display: "flex",
            justifyContent: "center",
            margin: "24px auto",
          }}
          percent={currentProgress}
          status="active"
          showInfo={false}
          strokeColor="#388697"
        />
      </Modal>
      {saveSuccess && <BookingSuccess open={showSuccessPopup} result={result}/>} 
    </>
  );
};

export default AddInforGuest;
