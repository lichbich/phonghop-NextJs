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
} from "antd";
import Button from "@/constants/Form/Button";
import styles from "/src/css/BookingDetail.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "@/axiosService";
import Meta from "antd/es/card/Meta";
import TextArea from "antd/es/input/TextArea";
import "@/css/BookingDetail.css";
import moment from "moment";
import type { SelectProps } from "antd";
import BookingDelete from "./BookingDelete";
import { useSelector } from "react-redux";

const BookingEditDetail = ({ rec, onEditSuccess, fetchBooking }: any) => {
  const [value, setValue] = useState<string>();
  const [data, setData] = useState<SelectProps['options']>([]);
  const [roomData,setRoomData] = useState<SelectProps['options']>([]);
  const [selectedRoomInfo, setSelectedRoomInfo] = useState<any>(rec.meeting_room);
  const [visible, setVisible] = useState(false);
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [form2] = Form.useForm();
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>(rec.meeting_room_id);


  const handleRoomSelectChange = (value: string) => {
    setSelectedRoomId(value);
    const selectedRoom = roomData?.find((room) => room.id === value);
    setSelectedRoomInfo(selectedRoom);
  };

  const user = useSelector((state:any) => state.user.value);
  const company_id = user.company_id;



  useEffect(() => {
    let arr_guest: Array<string> = [];
    rec?.guests.map((guest: any) => {
      arr_guest.push(guest.email);
    });
    setSelectedGuests(arr_guest);
  }, [rec.guests]);

  const fetch = async (value: string, callback: (data: any) => void) => {
    if (value === "") {
      callback([]);
    } else {
      try {
        const res = await api.get("search-user", {
          params: {
            keyword: value,
            company_id: company_id,
          },
        });
        const data = res.data.data.map((user: any) => ({
          value: user,
          text: user,
        }));
        callback(data);
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    const fetchMeetingRooms = async () => {
      try {
        const response = await api.get(`allroom/${company_id}`);
        setRoomData(response.data.data);
      } catch (error) {
        console.error('Error fetching meeting rooms:', error);
      }
    };
    fetchMeetingRooms();
  }, [company_id]);
  const handleDeleteSuccess = () => {
    setDeleteConfirmationVisible(false);
    setVisible(false);
    if (onEditSuccess) {
      onEditSuccess();
    }
  };
  const handleSearch = (newValue: string) => {
    fetch(newValue, setData);
  };
  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (newValue.trim() !== "") {
      setSelectedGuests((prevSelected) => [...prevSelected, newValue]);
    }
  };

  const handleDeleteConfirmation = () => {
    setDeleteConfirmationVisible(true);
  };

  const showPopup = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    form2.setFieldsValue({
      topic: rec.topic,
      type_of_booking: rec.type_of_booking,
      room: rec.meeting_room.name,
      date: moment(rec.from_time).format("DD/MM/YYYY"),
      from_time: moment(rec.from_time).format("hh:mm A"),
      to_time: moment(rec.to_time).format("hh:mm A"),
      guest: rec.guests,
      agenda: rec.agenda,
      objective: rec.objective,
      materials: rec.materials,
    });
  }, [rec, form2]);
  const removeGuest = (index: number) => {
    const updatedGuests = [...selectedGuests];
    updatedGuests.splice(index, 1);
    setSelectedGuests(updatedGuests);
  };
  function handleSave() {
    form2
      .validateFields()
      .then(async (values) => {
        try {
          const data = await api.put(`bookings/${rec.id}`, {
            ...values,
            from_time: `${moment(values.date, "DD/MM/YYYY").format(
              "YYYY/MM/DD"
            )} ${moment(values.from_time, "hh:mm A").format("HH:mm:ss")}`,
            to_time: `${moment(values.date, "DD/MM/YYYY").format(
              "YYYY/MM/DD"
            )} ${moment(values.to_time, "hh:mm A").format("HH:mm:ss")}`,
            meeting_room_id: rec.meeting_room_id,
            booking_name: rec.booking_name,
            booking_email: rec.booking_email,
            booking_title: rec.booking_title,
            guests: selectedGuests,
          });
          if (data.status == 200) {
            console.log(data);
            setVisible(false);
            if (onEditSuccess) {
              onEditSuccess();
            }
          } else {
          }
        } catch (e) {
          console.error("Error creating user:", e);
        }
      })
      .catch((errorInfo) => {
        console.log(errorInfo);
      });
  }
  return (
    <>
      <button key="edit" className={styles.custombutton} onClick={showPopup}>
        <Image src="/edit.svg" alt="" preview={false} />
      </button>
      <Modal
        title={<div className={styles.formTitle}>Edit Booking Detail</div>}
        open={visible}
        onCancel={handleCancel}
        footer={null}
        closable={false}
        width={1296}
        forceRender={true}
      >
        <Form
          labelAlign="left"
          form={form2}
          labelCol={{ flex: "200px" }}
          name="Booking Edit Detail aa"
          requiredMark={false}
        >
          <Row>
            <Col span={12}>
              <Form.Item label="Meeting topic" name="topic">
                <Input className="bookingInput" />
              </Form.Item>
              <Form.Item label="Type of booking" name="type_of_booking">
                <select className="bookingInput">
                  <option value="0">Meeting</option>
                  <option value="1">Personal Use</option>
                </select>
              </Form.Item>
              <Form.Item label="Room" name="room">
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
                  {selectedRoomInfo && (
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
                  )}
                </Layout>
              </Form.Item>
              <Form.Item label="Date">
                <Row gutter={30}>
                  <Col className="gutter-row">
                    <Form.Item name="date">
                      <Input
                        style={{
                          width: 181,
                          height: 44,
                          borderRadius: 8,
                          textAlign: "center",
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row">
                    <Input
                      style={{
                        width: 181,
                        height: 44,
                        borderRadius: 8,
                        textAlign: "center",
                      }}
                      value={moment(rec.from_time).format("dddd")}
                    />
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item label="Time" style={{ fontWeight: 600, fontSize: 16 }}>
                <div
                  style={{
                    width: 370,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Form.Item name="from_time" className={styles.inputt}>
                    <Input
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
                    <Input
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
              <Form.Item label="Guest">
                <Select
                  showSearch
                  value={value}
                  placeholder="Invitee's email"
                  defaultActiveFirstOption={false}
                  suffixIcon={null}
                  filterOption={false}
                  onSearch={handleSearch}
                  onChange={handleChange}
                  notFoundContent={null}
                  options={(data || []).map((d) => ({
                    value: d.value,
                    label: d.text,
                  }))}
                />
                <List
                  style={{
                    backgroundColor: "#EAEEF6",
                    borderRadius: 8,
                    width: 370,
                    marginTop: 16,
                  }}
                  className="demo-loadmore-list"
                  itemLayout="horizontal"
                  dataSource={selectedGuests}
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
                        title={<p className={styles.itemlist}>{item}</p>}
                      />
                    </List.Item>
                  )}
                />
              </Form.Item>
              <Form.Item label="Agenda" initialValue={rec.agenda} name="agenda">
                <TextArea
                  placeholder="Enter agenda"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
              </Form.Item>
              <Form.Item label="Objective" name="objective">
                <TextArea
                  placeholder="Enter objective"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
              </Form.Item>
              <Form.Item label="Materials" name="materials">
                <div className={styles.materialsSection}>
                  <Button label="Choose a file"></Button>
                  <Button label="Share a link"></Button>
                </div>
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
                        // description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                      />
                    </List.Item>
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {/* =================== */}
        <div className={styles.autocheckbox}>
          <input type="checkbox" id="scales" className={styles.check} />
          <label htmlFor="scales">
            <p>Share meeting information to the organization</p>
          </label>
        </div>
        <div className={styles.buttonContainer}>
          <Button
            className={styles.buttonClose}
            onClick={handleSave}
            label="SAVE"
          />
          <Button
            className={styles.buttonClose}
            onClick={handleDeleteConfirmation}
            label="DELETE"
          />
          <BookingDelete
            booking_id={rec.id}
            open={deleteConfirmationVisible}
            cancel={(data: any) => {
              handleCancel();
              setDeleteConfirmationVisible(false);
              fetchBooking();
            }}
            onDeleteSuccess={handleDeleteSuccess}
          ></BookingDelete>
          <Button
            className={styles.buttonClose}
            onClick={handleCancel}
            style={{ backgroundColor: "#FFFFFF", color: "#225560" }}
            label="CLOSE"
          />
        </div>
      </Modal>
    </>
  );
};

export default BookingEditDetail;
