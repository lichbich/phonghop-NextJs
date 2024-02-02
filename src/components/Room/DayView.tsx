"use client";
import styles from "@/css/CompanyList.module.css";
import { Row, Col, Image, Card, Layout, DatePickerProps } from "antd";
import { DatePicker, Space } from "antd";
import customstyle from "@/css/MeetingRoomList.module.css";
import CustomTimePicker from "@/components/Manager/TimePicker";
import FullCalendar from "@fullcalendar/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import Meta from "antd/es/card/Meta";
import api from "@/axiosService";
import { get } from "lodash";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "@/css/DayView.css";

const DayView = ({calendarRef, events, renderEventContent}: any) => {
  const user = useSelector((state: any) => state.user.value);
  const room = useSelector((state:any) => state.room.selectedRoom);
  console.log("room", room);
  return (
    <>
      <div>
        <Layout style={{ padding: 20, backgroundColor: "white" }}>
            <div>
              <Row>
                <Col
                  span={13}
                  style={{
                    display: "flex",
                  }}
                >
                  <Layout className="infor-room-layout" content="center">
                    <Card
                      bordered={false}
                      className="card-info-room"
                      cover={
                        <Image
                          alt="example"
                          src="https://explore.zoom.us/media/what-are-zoom-rooms.jpg"
                          width={"100%"}
                          height={275}
                          preview={true}
                        />
                      }
                    >
                      <div className="title-Room">
                        <Meta title={room.name}/>
                      </div>
                      <div className="inforRoom">
                        <span className="infor-Room-element">
                          <strong>Capacity: {room.capacity}</strong>
                          
                        </span>
                        <br />
                        <span className="infor-Room-element">
                          <strong>Location: {room.location}</strong>
                        </span>
                        <br />
                        <span className="infor-Room-element">
                          <strong>Floor: {room.floor}</strong>
                        </span>
                        <br />
                        <span className="infor-Room-element">
                          <strong>Equipment: {room.equipment}</strong>
                        </span>
                      </div>
                    </Card>
                  </Layout>
                </Col>
                <Col span={10}>
                  <div className={styles.calender}>
                    <FullCalendar
                      ref={calendarRef}
                      plugins={[
                        dayGridPlugin,
                        timeGridPlugin,
                        interactionPlugin,
                      ]}
                      headerToolbar={false}
                      initialView={"timeGridDay"}
                      allDaySlot={false}
                      editable={false}
                      selectable
                      selectOverlap={false}
                      eventOverlap={false}
                      events={events}
                      eventMinHeight={66}
                      // dayPropGetter={calendarStyle}
                      expandRows={true}
                      slotMinTime={"08:00:00"}
                      slotMaxTime={"19:00:00"}
                      slotDuration={"01:00:00"}
                      slotLabelInterval={{ hours: 1 }}
                      slotLabelFormat={{
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      }}
                      dayHeaderContent={(args: any) => (
                        <div>
                          <div>
                            {moment(args.date).format("dddd, DD/MM/YYYY")}
                          </div>
                          {/* <div>{moment(args.date).format("DD/MM/YYYY")}</div> */}
                        </div>
                      )}
                      contentHeight={786}
                      eventContent={renderEventContent}
                    />
                  </div>
                </Col>
              </Row>
            </div>
        </Layout>
      </div>
    </>
  );
};
export default DayView;
