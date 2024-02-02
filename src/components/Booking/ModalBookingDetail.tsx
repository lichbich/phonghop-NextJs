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
import customstyle from "@/css/CompanyList.module.css";
import { Form as Form2 } from "antd";
import Meta from "antd/es/card/Meta";
import { listenerCancelled } from "@reduxjs/toolkit/dist/listenerMiddleware/exceptions";
import TextArea from "antd/es/input/TextArea";
import "@/css/BookingDetail.css";
import momment from "moment";
import "bootstrap/dist/css/bootstrap.min.css";
const ModalBookingDetail = ({rec, formBookingDetail, visible, handleCancel}:any) => {
    const timeString = momment(rec.from_time).format("HH:mm A");
    const timeString2 = momment(rec.to_time).format("HH:mm A");
    const dateString = momment(rec.from_time).format("DD MMM YYYY");
    const dateString2 = momment(rec.to_time).format("dddd");

    return (
        <>
            <Modal
                title={<div className={styles.formTitle}>Booking Detail</div>}
                open={visible}
                onCancel={handleCancel}
                footer={null}
                closable={false}
                width={1296}
            >
                <Form
                    labelAlign="left"
                    form={formBookingDetail}
                    labelCol={{ flex: "200px" }}
                    requiredMark={false}
                >
                    <Row>
                        <Col span={12}>
                            <Form.Item label="Meeting topic">
                                <Input className="bookingInput" disabled value={rec.topic} />
                            </Form.Item>
                            <Form.Item label="Type of booking">
                                <Input
                                    className="bookingInput"
                                    disabled
                                    value={
                                        rec.type_of_booking == 1
                                            ? "Meeting"
                                            : rec.type_of_booking == 2
                                                ? "Personal use"
                                                : "Unavailable"
                                    }
                                />
                            </Form.Item>
                            <Form.Item label="Room" name="room">
                                <Input
                                    className="bookingInput"
                                    disabled
                                    value={rec.meeting_room.name}
                                />
                                <Layout
                                    style={{
                                        backgroundColor: "#EAEEF6",
                                        width: 370,

                                        borderRadius: 8,
                                        marginTop: 8,
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
                                        <Meta title={rec.meeting_room.name} />
                                        <div className="inforRoom">
                      <span>
                        <strong>Capacity: </strong>
                          {rec.meeting_room.capacity}
                      </span>
                                            <br />
                                            <span>
                        <strong>Location: </strong>
                                                {rec.meeting_room.location}
                      </span>
                                            <br />
                                            <span>
                        <strong>Floor: </strong>
                                                {rec.meeting_room.floor}
                      </span>
                                            <br />
                                            <span>
                        <strong>Equipment: </strong>
                                                {rec.meeting_room.equipment}
                      </span>
                                        </div>
                                    </Card>
                                </Layout>
                            </Form.Item>
                            <Form.Item label="Date" name="date">
                                <Row gutter={8}>
                                    <Col className="gutter-row" span={11}>
                                        <Input
                                            style={{ width: 181, height: 44, borderRadius: 8 }}
                                            disabled
                                            value={dateString}
                                        />
                                    </Col>
                                    <Col className="gutter-row" span={12}>
                                        <Input
                                            style={{ width: 181, height: 44, borderRadius: 8 }}
                                            disabled
                                            value={dateString2}
                                        />
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Form.Item
                                label="Time"
                                name="time"
                                style={{ fontWeight: 600, fontSize: 16 }}
                            >
                                <div
                                    style={{
                                        width: 370,
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Input
                                        style={{ width: 140, height: 44, borderRadius: 8 }}
                                        disabled
                                        value={timeString}
                                    />
                                    <p style={{ margin: 0 }}>TO</p>
                                    <Input
                                        style={{ width: 140, height: 44, borderRadius: 8 }}
                                        disabled
                                        value={timeString2}
                                    />
                                </div>
                            </Form.Item>
                        </Col>
                        {/* ===================================== */}
                        <Col span={12}>
                            <Form.Item label="Guest" name="guest">
                                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                    <h6>{rec.booking_name} (Booking Owner)</h6>
                                </div>

                                <List
                                    style={{
                                        backgroundColor: "none",
                                        borderRadius: 8,
                                        width: 370,
                                        padding: 0,
                                    }}
                                    split={false}
                                    className="demo-loadmore-list"
                                    itemLayout="horizontal"
                                    dataSource={rec.guests}
                                    renderItem={(item: any) => (
                                        <List.Item>
                                            <Skeleton
                                                style={{ padding: 0 }}
                                                avatar
                                                title={true}
                                                loading={(item as { loading: boolean }).loading}
                                                active
                                            >
                                                <List.Item.Meta
                                                    style={{ padding: 0 }}
                                                    avatar={
                                                        <Avatar
                                                            src={
                                                                "https://sm.ign.com/t/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.300.jpg"
                                                            }
                                                        />
                                                    }
                                                    title={<p>{(item as { email: string }).email}</p>}

                                                    // description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                                />
                                            </Skeleton>
                                        </List.Item>
                                    )}
                                />
                            </Form.Item>
                            <Form.Item label="Agenda">
                                <TextArea
                                    className="bookingTextArea"
                                    value={rec.agenda}
                                    // onChange={(e) => setValue(e.target.value)}
                                    placeholder="Enter agenda"
                                    autoSize={{ minRows: 3, maxRows: 5 }}
                                    disabled
                                />
                            </Form.Item>
                            <Form.Item label="Objective" name="objective">
                                <TextArea
                                    className="bookingTextArea"
                                    value={""}
                                    // onChange={(e) => setValue(e.target.value)}
                                    placeholder="Enter objective"
                                    autoSize={{ minRows: 3, maxRows: 5 }}
                                    disabled
                                />
                            </Form.Item>
                            <Form.Item label="Materials" name="materials">
                                {/* <div>Button</div> */}
                                <List
                                    style={{
                                        backgroundColor: "#EAEEF6",
                                        borderRadius: 8,
                                        width: 370,
                                        marginTop: 8,
                                    }}
                                    className="demo-loadmore-list"
                                    itemLayout="horizontal"
                                    dataSource={rec.material}
                                    renderItem={(item) => (
                                        <List.Item actions={[<a key="list-loadmore-edit">edit</a>]}>
                                            <Skeleton
                                                avatar
                                                title={true}
                                                loading={(item as { loading: boolean }).loading}
                                                active
                                            >
                                                <List.Item.Meta
                                                    avatar={
                                                        <Avatar
                                                            src={
                                                                "https://sm.ign.com/t/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.300.jpg"
                                                            }
                                                        />
                                                    }
                                                    title={<p>{item as string}</p>}
                                                    // description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                                />
                                            </Skeleton>
                                        </List.Item>
                                    )}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                {/* =================== */}
                <Form2.Item>
                    <div className={styles.buttonContainer}>
                        <div>
                            <Button
                                className={styles.buttonClose}
                                onClick={handleCancel}
                                label="Close"
                            />
                        </div>
                    </div>
                </Form2.Item>
            </Modal>
        </>
    );
}
export default ModalBookingDetail;