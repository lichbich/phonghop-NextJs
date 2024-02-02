"use client";
import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "/src/css/BookingDetail.module.css";
import Checkbox, { CheckboxChangeEvent } from "antd/es/checkbox/Checkbox";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import CustomTimePicker from "../Booking/TimePickerBook";
import Meta from "antd/es/card/Meta";
import type { DatePickerProps } from "antd";
import { ConfigProvider, DatePicker, Space } from "antd";
import "rc-time-picker/assets/index.css";
import Selects from "react-select";
import type { UploadProps } from "antd";
import "@/css/BookingAdd.css";
import moment from "moment";
import TextArea from "antd/es/input/TextArea";
import { Input, Row, Col, Form, List, Skeleton, Avatar } from "antd";
import api from "@/axiosService";
import { Card, Image, Layout, Select, Progress, message } from "antd";
// import AddInforGuest from "./AddInforGuest";

import Modal from "antd/es/modal/Modal";
import Button from "@/constants/Form/Button";
import BookingSuccess from "./BookingSuccess";

export default function BookRoom({ onAddSuccess }: any) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.min.js");
  }, []);
  interface DataType {
    id: number;
    name: string;
  }

  const [redirect, setRedirect] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(50);

  const updateProgress = (progress: number) => {
    setCurrentProgress(progress);
  };

  const [startTime, setStartTime] = useState<moment.Moment | null>(null);
  const handleStartTimeChange = (value: moment.Moment | undefined) => {
    setStartTime(value || null);
  };
  const [endTime, setEndTime] = useState<moment.Moment | null>(null);
  const handleEndTimeChange = (value: moment.Moment | undefined) => {
    setEndTime(value || null);
  };

  const [selectedMaterial, setSelectedMaterial] = useState<string[]>([]);
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);

  const [form] = Form.useForm();
  const [allRoomsData, setAllRoomData] = useState<DataType[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<DataType[]>([]);
  const user = useSelector((state: any) => state.user.value);
  const [selectedDate, setSelectedDate] = useState("");
  const [roomData, setRoomData] = useState<DataType[]>([]);
  const [step1Data, setStep1Data] = useState<any>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [step, setStep] = useState(1);
  const [visible, setVisible] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>("");
  const [selectedRoomInfo, setSelectedRoomInfo] = useState<any>(null);
  const [isChecked, setIsChecked] = useState(true);

  

  const handleCheckboxChange = (e: any) => {
    setIsChecked(e.target.checked);
  };

  const handleOpenSuccessModal = () => {
    setShowSuccessModal(true);
  };
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const removeGuest = (index: number) => {
    const updatedGuests = [...selectedGuests];
    updatedGuests.splice(index, 1);
    setSelectedGuests(updatedGuests);
  };

  const today = moment();
  const handleRoomSelectChange = (value: any) => {
    setSelectedRoomId(value);
    const selectedRoom = roomData?.find((room) => room.id === value);
    setSelectedRoomInfo(selectedRoom);
  };

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    setSelectedDate(dateString);
  };

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.get(`UnauthorizedUser/2`);
        setRoomData(response.data.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);


  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const company_id = user.company_id;
        const response = await api.get(`allroom/${company_id}`);
        if (response.status === 200) {
          setRoomData(response.data.data);
        } else {
          console.error("Failed to fetch rooms");
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, [user.company_id]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          const meetingRoomsResponse = await api.get("meeting-rooms/listing");

          if (meetingRoomsResponse.status === 200) {
            const meetingRooms = meetingRoomsResponse.data.data;

            const selectedMeetingRoomId =
              meetingRooms.length > 0 ? meetingRooms[0].id : null;

            values = {
              ...form.getFieldsValue(),
              booking_name: user.name,
              booking_email: user.email,
              booking_title: user.title,
              meeting_room_id: 1,
              from_time: `${selectedDate} ${moment(startTime, "HH:mm A").format(
                "HH:mm:ss"
              )}`,
              to_time: `${selectedDate} ${moment(endTime, "HH:mm A").format(
                "HH:mm:ss"
              )}`,
              repeat_type: 1,
              room_status: isChecked ? 1 : 0,
            };

            const bookingResponse = await api.post(
              "external-bookings",
              values,
              {
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              }
            );

            if (bookingResponse.status === 200) {
              message.success("Booking created successfully");
              form.resetFields();
              setVisible(false);
              setStep1Data(form.getFieldsValue());
              setStep(2);
              if (onAddSuccess) {
                onAddSuccess();
              }
            } else {
              message.error("Failed to create booking");
            }

            setFilteredRooms(bookingResponse.data.data);
          }
        } catch (e) {
          console.error("Error creating booking:", e);
          message.error("Failed to create booking");
        }
      })
      .catch((errorInfo) => {
        console.log(errorInfo);
      });
  };

  return (
    <>
      <button
        type="button"
        className={styles.addbtn}
        onClick={() => setVisible(true)}
      >
        Book A Room
      </button>
      {step === 1 && (
        <Modal
          title={<div className={styles.formTitle}>New Booking Session</div>}
          open={visible}
          onCancel={handleCancel}
          footer={null}
          closable={false}
          width={1296}
          forceRender={true}
        >
          <div className={styles.labelinfor}>
            <h3>Meeting Information</h3>
          </div>
          <Form
            labelAlign="left"
            form={form}
            labelCol={{ flex: "200px" }}
            name=" Guest Booking"
            requiredMark={false}
          >
            <Row>
              <Col span={12}>
                <Form.Item
                  label="Meeting topic*:"
                  name="topic"
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
                  colon={false}
                >
                  <Input className="bookingInput" />
                </Form.Item>
                <Form.Item
                  label="Type of booking*:"
                  name="type_of_booking"
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
                  colon={false}
                >
                  <select className="bookingInput">
                    <option selected>Choose type of booking</option>
                    <option value="1">Meeting</option>
                    <option value="2">Personal use</option>
                    <option value="3">Unavailable</option>
                  </select>
                </Form.Item>
                <Form.Item
                  label="Room*:"
                  name="room"
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
                  colon={false}
                >
                  <Select
                    showSearch
                    placeholder="Meeting Room"
                    defaultActiveFirstOption={false}
                    suffixIcon={null}
                    filterOption={false}
                    onChange={handleRoomSelectChange}
                    value={selectedRoomId}
                  >
                    {roomData?.map((room) => (
                      <Select.Option key={room.id} value={room.id}>
                        {room.name}
                      </Select.Option>
                    ))}
                  </Select>
                  {selectedRoomInfo && (
                    <Layout
                      style={{
                        backgroundColor: "#EAEEF6",
                        width: 370,

                        borderRadius: 8,
                        marginTop: 16,
                        padding: 8,
                      }}
                      content="center"
                    >
                      <Card
                        bordered={false}
                        style={{
                          backgroundColor: "#EAEEF6",
                          padding: 0,
                          boxShadow: "none",
                        }}
                        cover={
                          <Image
                            alt="example"
                            src="https://explore.zoom.us/media/what-are-zoom-rooms.jpg"
                            width={354}
                            height={197}
                            preview={true}
                          />
                        }
                      >
                        <Meta />
                        <div className="inforRoom">
                          <span>
                            <strong>Capacity: </strong>
                            {selectedRoomInfo.capacity}
                          </span>
                          <br />
                          <span>
                            <strong>Location: </strong>
                            {selectedRoomInfo.location}
                          </span>
                          <br />
                          <span>
                            <strong>Floor: </strong>
                            {selectedRoomInfo.floor}
                          </span>
                          <br />
                          <span>
                            <strong>Equipment: </strong>
                            {selectedRoomInfo.equipment}
                          </span>
                        </div>
                      </Card>
                    </Layout>
                  )}
                </Form.Item>
                <Form.Item label="Date*:" colon={false}>
                  <Row gutter={30}>
                    <Col className="gutter-row">
                      {/* <Form.Item name="date" 
                    > */}
                      <DatePicker
                        style={{
                          width: 181,
                          height: 44,
                          borderRadius: 8,
                          textAlign: "center",
                        }}
                        placeholder={today.format("DD MMM YYYY")}
                        onChange={onChange}
                      ></DatePicker>
                      {/* </Form.Item> */}
                    </Col>
                    <Col className="gutter-row">
                      <Input
                        style={{
                          width: 181,
                          height: 44,
                          borderRadius: 8,
                          textAlign: "center",
                        }}
                      />
                    </Col>
                  </Row>
                </Form.Item>
                {/* ===============time================== */}
                <Form.Item
                  label="Time*:"
                  style={{ fontWeight: 600, fontSize: 16 }}
                  colon={false}
                >
                  <div
                    style={{
                      width: 370,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Form.Item name="from_time" className={styles.inputt}>
                      <CustomTimePicker
                        onChange={handleStartTimeChange}
                        style={{
                          width: 140,
                          height: 44,
                          borderRadius: 8,
                          textAlign: "center",
                        }}
                      />
                    </Form.Item>
                    <p style={{ margin: 0 }}>TO</p>
                    <Form.Item name="to_time" className={styles.inputt}>
                      <CustomTimePicker
                        onChange={handleEndTimeChange}
                        style={{
                          width: 140,
                          height: 44,
                          borderRadius: 8,
                          textAlign: "center",
                        }}
                      />
                    </Form.Item>
                  </div>
                </Form.Item>
              </Col>
              {/* ===================================== */}
              <Col span={12}>
                <Form.Item label="Guest:" colon={false}>
                  <Select
                    showSearch
                    // value={value}
                    placeholder="Invitee's email"
                    defaultActiveFirstOption={false}
                    suffixIcon={null}
                    filterOption={false}
                    //  onSearch={handleSearch}
                    //  onChange={handleChange}
                    // notFoundContent={null}
                    // options={(data || []).map((d) => ({
                    //   value: d.value,
                    //   label: d.text,
                    // }))}
                  />
                  {selectedGuests.length > 0 && (
                    <List
                      style={{
                        backgroundColor: "#EAEEF6",
                        borderRadius: 8,
                        width: 370,
                        marginTop: 16,
                      }}
                      className="demo-loadmore-list"
                      itemLayout="horizontal"
                      // dataSource={selectedGuests}
                      renderItem={(item, index) => (
                        <List.Item
                          actions={[
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              key={`list-loadmore-remove-${index}`}
                              onClick={() => removeGuest(index)}
                            >
                              <path
                                d="M15.5459 13.954C15.7572 14.1653 15.876 14.452 15.876 14.7509C15.876 15.0497 15.7572 15.3364 15.5459 15.5477C15.3346 15.7591 15.0479 15.8778 14.749 15.8778C14.4501 15.8778 14.1635 15.7591 13.9521 15.5477L7.99996 9.59367L2.0459 15.5459C1.83455 15.7572 1.54791 15.8759 1.24902 15.8759C0.950136 15.8759 0.663491 15.7572 0.452147 15.5459C0.240802 15.3345 0.12207 15.0479 0.12207 14.749C0.12207 14.4501 0.240802 14.1635 0.452147 13.9521L6.40621 7.99992L0.454022 2.04586C0.242677 1.83451 0.123945 1.54787 0.123945 1.24898C0.123945 0.950097 0.242677 0.663452 0.454022 0.452108C0.665366 0.240763 0.95201 0.122031 1.2509 0.122031C1.54978 0.122031 1.83643 0.240763 2.04777 0.452108L7.99996 6.40617L13.954 0.45117C14.1654 0.239826 14.452 0.121094 14.7509 0.121094C15.0498 0.121094 15.3364 0.239826 15.5478 0.45117C15.7591 0.662514 15.8778 0.949159 15.8778 1.24804C15.8778 1.54693 15.7591 1.83358 15.5478 2.04492L9.59371 7.99992L15.5459 13.954Z"
                                fill="#323232"
                              />
                            </svg>,
                          ]}
                        >
                          <List.Item.Meta
                            style={{ display: "flex", alignItems: "center" }}
                            avatar={
                              <Avatar
                                src={
                                  "https://sm.ign.com/t/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.300.jpg"
                                }
                              />
                            }
                            // title={<p className={styles.itemlist}>{item}</p>}
                          />
                        </List.Item>
                      )}
                    />
                  )}
                </Form.Item>
                <Form.Item label="Agenda:" name="agenda" colon={false}>
                  <TextArea
                    placeholder="Enter agenda"
                    autoSize={{ minRows: 5, maxRows: 5 }}
                    style={{ width: "370px" }}
                  />
                </Form.Item>
                <Form.Item label="Objective:" name="objective" colon={false}>
                  <TextArea
                    placeholder="Enter objective"
                    autoSize={{ minRows: 7, maxRows: 10 }}
                    style={{ width: "370px" }}
                  />
                </Form.Item>
                <Form.Item label="Materials:" name="materials" colon={false}>
                  <div className={styles.materialsSection}>
                    <Button label="Choose a file"></Button>
                    <Button label="Share a link"></Button>
                  </div>
                  {selectedMaterial.length > 0 && (
                    <List
                      style={{
                        backgroundColor: "#EAEEF6",
                        borderRadius: 8,
                        width: 370,
                        marginTop: 16,
                      }}
                      className="demo-loadmore-list"
                      itemLayout="horizontal"
                      // dataSource={selectedGuests}
                      renderItem={(item, index) => (
                        <List.Item
                          actions={[
                            <a key="list-loadmore-edit">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                              >
                                <path
                                  d="M15.5459 13.954C15.7572 14.1653 15.876 14.452 15.876 14.7509C15.876 15.0497 15.7572 15.3364 15.5459 15.5477C15.3346 15.7591 15.0479 15.8778 14.749 15.8778C14.4501 15.8778 14.1635 15.7591 13.9521 15.5477L7.99996 9.59367L2.0459 15.5459C1.83455 15.7572 1.54791 15.8759 1.24902 15.8759C0.950136 15.8759 0.663491 15.7572 0.452147 15.5459C0.240802 15.3345 0.12207 15.0479 0.12207 14.749C0.12207 14.4501 0.240802 14.1635 0.452147 13.9521L6.40621 7.99992L0.454022 2.04586C0.242677 1.83451 0.123945 1.54787 0.123945 1.24898C0.123945 0.950097 0.242677 0.663452 0.454022 0.452108C0.665366 0.240763 0.95201 0.122031 1.2509 0.122031C1.54978 0.122031 1.83643 0.240763 2.04777 0.452108L7.99996 6.40617L13.954 0.45117C14.1654 0.239826 14.452 0.121094 14.7509 0.121094C15.0498 0.121094 15.3364 0.239826 15.5478 0.45117C15.7591 0.662514 15.8778 0.949159 15.8778 1.24804C15.8778 1.54693 15.7591 1.83358 15.5478 2.04492L9.59371 7.99992L15.5459 13.954Z"
                                  fill="#323232"
                                />
                              </svg>
                            </a>,
                          ]}
                        >
                          <List.Item.Meta
                            avatar={
                              <Avatar
                                src={
                                  "https://sm.ign.com/t/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.300.jpg"
                                }
                              />
                            }
                            title={<p>Baka</p>}
                          />
                        </List.Item>
                      )}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          {/* =================== */}
          <div className={styles.autocheckbox}>
            <input type="checkbox"
                   name=""
                   id=""
                   className={styles.check}
                   checked={isChecked}
                   onChange={handleCheckboxChange}/>
            <h6>Share meeting information to the organization</h6>
          </div>
          <div className={styles.buttonContainer}>
            <Button
              className={styles.buttonClose}
              label="BOOK NOW"
              onClick={handleSubmit}
            />
            <Button
              className={styles.buttonClose}
              onClick={handleCancel}
              style={{ backgroundColor: "#FFFFFF", color: "#225560" }}
              label="CLOSE"
            />
          </div>
        </Modal>
      )}
    </>
  );
}
