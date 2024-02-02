import React, { useEffect, useState } from "react";
import {
  Modal,
  Input,
  Row,
  Col,
  Form,
  Card,
  Image,
  Layout,
  List,
  Skeleton,
  Avatar,
  Select,
  Flex,
} from "antd";
import Button from "@/constants/Form/Button";
import styles from "/src/css/BookingDetail.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "@/axiosService";
import customstyle from "@/css/CompanyList.module.css";
import { Form as Form2 } from "antd";
import Meta from "antd/es/card/Meta";
import { listenerCancelled } from "@reduxjs/toolkit/dist/listenerMiddleware/exceptions";
import TextArea from "antd/es/input/TextArea";
import "@/css/BookingDetail.css";
import momment from "moment";
import ModalBookingDetail from "@/components/Booking/ModalBookingDetail";

const BookingDetail = ({ rec }: any) => {
  const [visible, setVisible] = useState(false);
  const [formBookingDetail] = Form.useForm();

  const showPopup = () => {
    setVisible(true);
    formBookingDetail.resetFields();
  };

  const handleCancel = () => {
    formBookingDetail.resetFields();
    setVisible(false);
    formBookingDetail.resetFields();
  };

  useEffect(() => {
    formBookingDetail.setFieldsValue({
      topic: rec.topic,
      type: rec.type_of_booking,
      room: rec.room,
      date: rec.date,
      time: rec.time,
      guest: rec.guest,
      agenda: rec.agenda,
      objective: rec.objective,
      materials: rec.materials,
      meeting_room: rec.meeting_room,
    });
  }, [rec, formBookingDetail]);

  return (
    <>
      <button key="view" className={styles.custombutton} onClick={showPopup}>
        <Image src="/eye.svg" alt="" preview={false} />
      </button>
      <ModalBookingDetail
        rec={rec}
        formBookingDetail={formBookingDetail}
        visible={visible}
        handleCancel={handleCancel}
      ></ModalBookingDetail>
    </>
  );
};

export default BookingDetail;
