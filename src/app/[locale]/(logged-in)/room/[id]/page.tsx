"use client";
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  RefObject,
} from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Layout, Spin } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { get } from "lodash";
import moment from "moment";
import api from "@/axiosService";
import styles from "src/css/Calender.module.css";
import type { DatePickerProps } from "antd";
import { DatePicker, Space } from "antd";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import RoomDetailWeekly from "@/components/Booking/RoomDetailWeekly";
import DayView from "@/components/Room/DayView";
import BookRom from "@/components/Booking/BookRoom";
import { useDispatch } from "react-redux";
import { setSelectedRoom } from "@/lib/features/room/roomSlice";
import { useRouter } from "next/navigation";

const Index = () => {
  interface Room {
    id: number;
    name: string;
  }

  interface DayViewProps {
    calendarRef: RefObject<FullCalendar>;
    events: {}[];
    renderEventContent: (eventInfo: any) => Element;
    // Other props...
  }
  const dispatch = useDispatch();
  const dateFormatforButtonChangeWeek = moment().format("MMMM DD, YYYY");
  const [title, settitle] = useState<string>(dateFormatforButtonChangeWeek);
  const calendarRef = useRef<FullCalendar>(null);
  const [roomList, setRoomList] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<any | undefined>("");
  const [selectedCheckbox, setSelectedCheckbox] = useState("allMeetings");
  const [initialCheckbox, setInitialCheckbox] = useState("allMeetings");
  const [events, setEvents] = useState([{}]);
  const [selectView, setSelectView] = useState<string>("Day");
  const user = useSelector((state: any) => state.user.value);
  const company_id = user.company_id;
  const [selectedRoomInfo, setSelectedRoomInfo] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData().then(() => {
      setIsLoading(false);
    });
  }, []);

  const handleRoomSelectChange = (e: any) => {
    const selectedId = e.target.value;
    setSelectedRoomId(selectedId);
    let selectedRoom = roomList.find((room) => room.id == selectedId);
    setSelectedRoomInfo(selectedRoom);
    dispatch(setSelectedRoom(selectedRoom));
  };

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await api.get(`/meeting-rooms/listing`, {
          params: {
            company_id: company_id,
          },
        });
        const rooms = get(response, "data.data", []);
        setRoomList(rooms);
      } catch (error) {
        console.error(error);
        toast.error("Error");
      }
    };
    fetchRoom();
  }, [selectedRoomId, company_id]);

  const handleCheckboxChange = (id: any) => {
    setSelectedCheckbox(id);
  };

  const handleViewChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectView(event.target.value);
  };

  const handleCb = async () => {
    try {
      await fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    if (selectedCheckbox === "myMeeting") {
      const myBookings = await fetchMyBookingHistory();
      const eventMyBooking = myBookings.map((booking: any) => ({
        title: booking.room_status === 1 ? booking.topic : "Private Meeting",
        start: booking.from_time,
        end: booking.to_time,
        allDay: false,
        backgroundColor: booking.room_status === 1 ? "#388697" : "#323232",
        booking_user: user.name,
        booking_id: booking.id,
      }));
      setEvents(eventMyBooking);
    } else {
      const allBookings = await fetchAllBookingHistory();
      const eventAllBooking = allBookings.map((booking: any) => ({
        title: booking.room_status === 1 ? booking.topic : "Private Meeting",
        start: booking.from_time,
        end: booking.to_time,
        allDay: false,
        backgroundColor: booking.room_status === 1 ? "#388697" : "#323232",
        booking_user: user.name,
        booking_id: booking.id,
      }));
      setEvents(eventAllBooking);
    }
  };
  useEffect(() => {
    setInitialCheckbox(selectedCheckbox);
    handleCb();
  }, [selectedCheckbox]);

  const fetchMyBookingHistory = useCallback(async () => {
    try {
      const response = await api.get(`/bookings-history`, {
        params: {
          company_id: company_id,
          room_id: selectedRoomId,
        },
      });
      const myBookings = get(response, "data.data", []);
      return myBookings;
    } catch (error) {
      console.error(error);
      toast.error("Error");
    }
  }, [selectedRoomId, company_id]);
  useEffect(() => {
    fetchMyBookingHistory();
  }, [fetchMyBookingHistory]);

  const fetchAllBookingHistory = useCallback(async () => {
    try {
      const response = await api.get(`/bookings`, {
        params: {
          company_id: company_id,
          room_id: selectedRoomId,
        },
      });
      const allBookings = get(response, "data.data", []);
      return allBookings;
    } catch (error) {
      console.error(error);
      toast.error("Error");
    }
  }, [selectedRoomId, company_id]);

  const nextHandle = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next();
      settitle(calendarRef.current.getApi().view.title);
    }
  };

  const prevHandle = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev();
      settitle(calendarRef.current.getApi().view.title);
    }
  };

  const todayHandle = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().today();
      settitle(calendarRef.current.getApi().view.title);
    }
  };

  dayjs.extend(customParseFormat);
  const dateFormat = "dddd, DD MMMM YYYY";
  const customFormat: DatePickerProps["format"] = (value: any) =>
    ` ${value.format(dateFormat)}`;
  const customDayHeaderFormat = ({ date }: any) => {
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
    const formattedDate = date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return `${dayOfWeek} ${formattedDate}`;
  };

  const renderEventContent = (eventInfo: any) => {
    return (
      <>
        <p style={{ marginBottom: "0px" }}>
          <strong>Meeting: {eventInfo.event.title}</strong>
        </p>
        <p style={{ marginBottom: "0px" }}>
          Booked by {eventInfo.event.extendedProps.booking_user}
        </p>
        <p>{eventInfo.timeText}</p>
      </>
    );
  };

  return (
    <>
      {isLoading ? (
        <Spin fullscreen size="large"/>
      ) : (
        <Layout
          style={{
            padding: 20,
            backgroundColor: "#EAEEF6",
            width: "full-width",
          }}
        >
          <div className={styles.calendarContainer}>
            <div className={styles.headerContainer}>
              <div className={styles.square}></div>
              <h1 className={styles.labelsection}>Room Detail</h1>
            </div>
            <div className={styles.textContainer}>
              <div
                className={styles.childTextContainer}
                style={{ paddingLeft: "32px" }}
              >
                <p className={styles.text}>Date:</p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <button
                      onClick={() => prevHandle()}
                      style={{
                        borderRadius: "100px",
                        width: "24px",
                        height: "24px",
                        backgroundColor: "#388697",
                        padding: "0px",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{ padding: "0px 4px 4px 0px" }}
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8.29303 12.7073C8.10556 12.5198 8.00024 12.2655 8.00024 12.0003C8.00024 11.7352 8.10556 11.4809 8.29303 11.2933L13.95 5.63634C14.0423 5.54083 14.1526 5.46465 14.2746 5.41224C14.3966 5.35983 14.5279 5.33225 14.6606 5.33109C14.7934 5.32994 14.9251 5.35524 15.048 5.40552C15.1709 5.4558 15.2825 5.53006 15.3764 5.62395C15.4703 5.71784 15.5446 5.82949 15.5949 5.95239C15.6451 6.07529 15.6704 6.20696 15.6693 6.33974C15.6681 6.47252 15.6405 6.60374 15.5881 6.72575C15.5357 6.84775 15.4595 6.9581 15.364 7.05034L10.414 12.0003L15.364 16.9503C15.5462 17.1389 15.647 17.3915 15.6447 17.6537C15.6424 17.9159 15.5373 18.1668 15.3518 18.3522C15.1664 18.5376 14.9156 18.6427 14.6534 18.645C14.3912 18.6473 14.1386 18.5465 13.95 18.3643L8.29303 12.7073Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  </div>
                  <DatePicker
                    defaultValue={dayjs("Monday 15/01/2024", dateFormat)}
                    format={customFormat}
                    onClick={() => todayHandle()}
                  />
                  <div style={{ display: "flex" }}>
                    <button
                      onClick={() => nextHandle()}
                      style={{
                        borderRadius: "100px",
                        width: "24px",
                        height: "24px",
                        backgroundColor: "#388697",
                        padding: "0px",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{ padding: "0px 4px 4px 0px" }}
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M15.7071 11.2932C15.8946 11.4807 15.9999 11.735 15.9999 12.0002C15.9999 12.2653 15.8946 12.5197 15.7071 12.7072L10.0501 18.3642C9.95785 18.4597 9.84751 18.5359 9.7255 18.5883C9.6035 18.6407 9.47228 18.6683 9.3395 18.6694C9.20672 18.6706 9.07504 18.6453 8.95215 18.595C8.82925 18.5447 8.7176 18.4705 8.6237 18.3766C8.52981 18.2827 8.45556 18.171 8.40528 18.0481C8.355 17.9252 8.32969 17.7936 8.33085 17.6608C8.332 17.528 8.35959 17.3968 8.412 17.2748C8.46441 17.1528 8.54059 17.0424 8.6361 16.9502L13.5861 12.0002L8.6361 7.05018C8.45394 6.86158 8.35315 6.60898 8.35542 6.34678C8.3577 6.08458 8.46287 5.83377 8.64828 5.64836C8.83369 5.46295 9.0845 5.35778 9.3467 5.35551C9.60889 5.35323 9.8615 5.45402 10.0501 5.63618L15.7071 11.2932Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className={styles.childTextContainer}>
                <p className={styles.text}>View As:</p>
                <select
                  className={styles.roomPicker}
                  value={selectedRoomInfo ? selectedRoomInfo.id : ""}
                  onChange={handleRoomSelectChange}
                >
                  <option value="" disabled>
                    Select a room
                  </option>
                  {roomList.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.childTextContainer}>
                <p className={styles.text}>View:</p>
                <select
                  className={styles.weekPicker}
                  onChange={handleViewChange}
                  value={selectView}
                >
                  <option value="Day">Day</option>
                  <option value="Week">Week</option>
                </select>
              </div>
              <div
                className={styles.childTextContainer}
                style={{ marginLeft: "84px" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    id="myMeeting"
                    checked={selectedCheckbox === "myMeeting"}
                    onClick={() => handleCheckboxChange("myMeeting")}
                    style={{
                      marginRight: "3px",
                      backgroundColor:
                        selectedCheckbox === "myMeeting" ? "#225560" : "#fff",
                      color:
                        selectedCheckbox === "myMeeting" ? "#225560" : "#fff",
                    }}
                  />
                  <label htmlFor="myMeeting" className={styles.checkboxLabel}>
                    My meeting
                  </label>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    id="allMeetings"
                    checked={selectedCheckbox === "allMeetings"}
                    onClick={() => handleCheckboxChange("allMeetings")}
                    style={{
                      marginRight: "3px",
                      backgroundColor:
                        selectedCheckbox === "allMeetings" ? "#225560" : "#fff",
                      color:
                        selectedCheckbox === "allMeetings" ? "#225560" : "#fff",
                    }}
                  />
                  <label htmlFor="allMeetings" className={styles.checkboxLabel}>
                    All meetings
                  </label>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: "15px",
                }}
              >
                <BookRom />
              </div>
            </div>
            {selectView === "Week" ? (
              <RoomDetailWeekly
                calendarRef={calendarRef}
                events={events}
                renderEventContent={renderEventContent}
                bookingList={fetchAllBookingHistory}
              />
            ) : (
              <DayView
                calendarRef={calendarRef}
                events={events}
                renderEventContent={renderEventContent}
              />
            )}
          </div>
        </Layout>
      )}
    </>
  );
};
export default Index;
