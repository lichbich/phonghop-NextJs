"use client";
import styles from "@/css/CompanyList.module.css";
import {
  Table,
  Tag,
  Pagination,
  ConfigProvider,
  Skeleton,
  Spin,
  Button,
} from "antd";
import type { DatePickerProps } from "antd";
import { DatePicker, Space } from "antd";
import customstyle from "@/css/MeetingRoomList.module.css";
import CustomTimePicker from "@/components/Manager/TimePicker";
import type { ColumnsType } from "antd/es/table";
import api from "@/axiosService";
import { useEffect, useState, useCallback } from "react";
import AddNewRoom from "@/components/Room/createMeetingRoomModal";
import { get } from "lodash";
import toast from "react-hot-toast";
import DeleteMeeting from "@/components/DeleteMeeting/DeleteMeeting";
import EditRoom from "@/components/Room/EditMeetingRoomModal";
import { useSelector } from "react-redux";
import moment from "moment";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useDispatch } from "react-redux";
import { setSelectedRoom } from "@/lib/features/room/roomSlice";

const CompanyList = () => {
  const dispatch = useDispatch();
  const locale = useLocale();
  const [allRoomsData, setAllRoomData] = useState<DataType[]>([]);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [filteredRooms, setFilteredRooms] = useState<DataType[]>([]);
  const [loading, setLoadingSkeleton] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeStartValue, setSelectedTimeStartValue] = useState("");
  const [selectedTimeEndValue, setSelectedTimeEndValue] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const user = useSelector((state: any) => state.user.value);
  const company_id = user.company_id;
  const usertype = user.type;
  const link =
    "http://localhost:3000/" + locale + "/guest?company_id=" + company_id;
  const handleGetLink = () => {
    const textarea = document.createElement("textarea");
    textarea.value = link;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    toast.success("Copied to clipboard");
  };

  useEffect(() => {
    fetchData().then(() => {
      setLoadingSkeleton(false);
      setIsLoading(false);
    });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const formattedStartTime = moment(
        selectedTimeStartValue,
        "hh:mm A"
      ).format("HH:mm:ss");
      const formattedEndTime = moment(selectedTimeEndValue, "hh:mm A").format(
        "HH:mm:ss"
      );
      const data = await api.get(`allroom/${company_id}`, {
        params: {
          starttime: `${selectedDate} ${formattedStartTime}`,
          endtime: `${selectedDate} ${formattedEndTime}`,
        },
      });

      setAllRoomData(data.data.data);
      setFilteredRooms(data.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Error");
    }
  }, [selectedDate, selectedTimeStartValue, selectedTimeEndValue, company_id]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleDeleteSuccess = () => {
    setDeleteConfirmationVisible(false);
    fetchData();
  };
  const handleAddSuccess = () => {
    fetchData();
  };
  const handleEditSuccess = () => {
    fetchData();
  };
  const [selectedRoomName, setSelectedRoomName] = useState("all");
  const handleSelectChange = (event: any) => {
    setSelectedRoomName(event.target.value);
    if (selectedRoomName === "all") {
      setFilteredRooms(allRoomsData);
    } else {
      const filteredRooms = allRoomsData.filter(
        (room) => room.name === selectedRoomName
      );
      setFilteredRooms(filteredRooms);
    }
  };
  const handleTimeStartChange = (newTimeStart: any) => {
    setSelectedTimeStartValue(newTimeStart);
    fetchData();
  };
  const handleTimeEndChange = (newTimeEnd: any) => {
    setSelectedTimeEndValue(newTimeEnd);
    fetchData();
  };
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    setSelectedDate(dateString);
  };
  interface DataType {
    id: number;
    key: string;
    no: number;
    name: string;
    location: string;
    capacity: number;
    equipment: string;
    availabilitys: boolean;
    book: string;
  }
  let columns: ColumnsType<DataType> = [];
  {
    if (usertype === 1) {
      columns = [
        {
          title: "No",
          dataIndex: "id",
          key: "id",
          render: (number) => <a>{number}</a>,
          sorter: (a, b) => a.no - b.no,
          width: 70,
          fixed: "left",
        },
        {
          title: "Room Name",
          dataIndex: "name",
          key: "name",
          sorter: (a, b) => a.name.localeCompare(b.name),
          fixed: "left",
          width: 175,
        },
        {
          title: "Location",
          dataIndex: "location",
          key: "location",
          sorter: (a, b) => a.location.localeCompare(b.location),
          width: 165,
        },
        {
          title: "Capacity",
          dataIndex: "capacity",
          key: "capacity",
          sorter: (a, b) => a.capacity - b.capacity,
          width: 159,
        },
        {
          title: "Equipment",
          dataIndex: "equipment",
          key: "equipment",
          width: 251,
        },
        {
          title: "Room Availability",
          key: "availabilitys",
          dataIndex: "availabilitys",
          render: (_, { availabilitys }) => {
            let color = availabilitys ? "#E56353" : "#388697";
            return (
              <div>
                <Tag color={color} key={_}>
                  {availabilitys ? "Unavailable" : "Available"}
                </Tag>
              </div>
            );
          },
          width: 183,
        },
        {
          title: "View Room Detail",
          key: "book",
          render: (_, record, availabilitys) => {
            const color = "#388697";
            return (
              
                <Link
                  href={`/${locale}/room/${record.id}`}
                  style={{ textDecoration: "none" }}
                  onClick={() => dispatch(setSelectedRoom(record))}
                >
                  <Button
                
                style={{
                  boxShadow: "1px 2px 1px rgba(0, 0, 0, 0.25)",
                  border: "none",
                  width: "69px",
                  backgroundColor: "#388697",
                  color: "#ffffff",
                  fontWeight: "bold",
                  height: "36px",
                }}
                key={record.key}
                color={color}
              >
                  Book
                  </Button>
                </Link>
            );
          },
          width: 154,
        },
        {
          title: "Action",
          key: "action",
          align: "center",
          render: (_, record) => (
            <Space size="middle">
              <EditRoom
                rec={record}
                onEditSuccess={handleEditSuccess}
              ></EditRoom>
              <DeleteMeeting
                room_id={record.id}
                onDeleteSuccess={handleDeleteSuccess}
              ></DeleteMeeting>
            </Space>
          ),
          fixed: "right",
          width: 137,
        },
      ];
    }
  }

  {
    if (usertype === 2) {
      columns = [
        {
          title: "No",
          dataIndex: "id",
          key: "id",
          render: (number) => <a>{number}</a>,
          sorter: (a, b) => a.no - b.no,
          width: 80,
          fixed: "left",
        },
        {
          title: "Room Name",
          dataIndex: "name",
          key: "name",
          sorter: (a, b) => a.name.localeCompare(b.name),
          fixed: "left",
          width: 175,
        },
        {
          title: "Location",
          dataIndex: "location",
          key: "location",
          sorter: (a, b) => a.location.localeCompare(b.location),
          width: 165,
        },
        {
          title: "Capacity",
          dataIndex: "capacity",
          key: "capacity",
          sorter: (a, b) => a.capacity - b.capacity,
          width: 159,
        },
        {
          title: "Equipment",
          dataIndex: "equipment",
          key: "equipment",
          width: 251,
        },
        {
          title: "Room Availability",
          key: "availabilitys",
          dataIndex: "availabilitys",
          render: (_, { availabilitys }) => {
            let color = availabilitys ? "#E56353" : "#388697";
            return (
              <Tag color={color} className="">
                {availabilitys ? "Unavailable" : "Available"}
              </Tag>
            );
          },
          width: 183,
        },
        {
          title: "View Room Detail",
          key: "book",
          render: (_, record, availabilitys) => {
            const color = availabilitys ? "#8B8B8B" : "#388697";

            return (
              <Tag key={record.key} color={color}>
                <Link
                  href={`/${locale}/room/${record.id}`}
                  style={{ textDecoration: "none" }}
                  onClick={() => dispatch(setSelectedRoom(record))}
                >
                  Book
                </Link>
              </Tag>
            );
          },
          width: 154,
        },
      ];
    }
  }
  return (
    <>
      {isLoading ? (
        <Spin fullscreen size="large"/>
      ) : (
        <div className={styles.container}>
          <div className={styles.labelsection}>
            <div className={styles.square}></div>
            <h1 className={styles.label}>Meeting Room List</h1>
            <span onClick={handleGetLink}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </span>
          </div>
          <p className={customstyle.text}>View By:</p>
          <div className={customstyle.selectsection}>
            <div className={customstyle.dateTimePicker}>
              <div className={customstyle.date}>
                <p>Date:</p>
                <Space direction="vertical">
                  <ConfigProvider
                    theme={{
                      components: {
                        DatePicker: {
                          colorPrimary: "#225560",
                          algorithm: true, // Enable algorithm
                        },
                      },
                    }}
                  >
                    <DatePicker
                      style={{ width: "221px", height: "36px" }}
                      onChange={onChange}
                      showToday={false}
                    />
                  </ConfigProvider>
                </Space>
              </div>
              <div className={customstyle.time}>
                <p>Time:</p>
                <CustomTimePicker
                  onChange={handleTimeStartChange}
                ></CustomTimePicker>
                <p>To:</p>
                <CustomTimePicker
                  onChange={handleTimeEndChange}
                ></CustomTimePicker>
              </div>
            </div>
            <div className={customstyle.roomPicker}>
              <p>Choose a room</p>
              <select onChange={(e) => handleSelectChange(e)}>
                <option value="all">All Rooms</option>
                {allRoomsData.map((room) => (
                  <option key={room.id} value={room.name}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.companytable}>
            {loading ? (
              <Skeleton active />
            ) : (
              <ConfigProvider
                theme={{
                  components: {
                    Table: {
                      colorPrimary: "#225560",
                      borderColor: "#ffffff",
                      colorFillAlter: "ffffff",
                      bodySortBg: "ffffff",
                      headerSortActiveBg: "#ffffff",
                      algorithm: true, // Enable algorithm
                    },
                  },
                }}
              >
                <Table
                  columns={columns}
                  dataSource={filteredRooms}
                  bordered
                  scroll={{ x: 1000 }}
                  className={customstyle.customtable}
                  pagination={{ pageSize: 5 }}
                  components={{
                    header: {
                      cell: (props: any) => (
                        <th
                          style={{
                            width: "100%",
                            background: "#255D6A",
                            color: "#fff",
                          }}
                        >
                          {props.children}
                        </th>
                      ),
                    },
                    body: {
                      cell: (props: any) => {
                        const isEvenRow = props.index % 2 === 0;

                        return (
                          <td className={styles.customTable}>
                            {props.children}
                          </td>
                        );
                      },
                    },
                  }}
                />
              </ConfigProvider>
            )}
          </div>
          {usertype === 1 && (
            <div className={styles.addco}>
              <AddNewRoom onAddSuccess={handleAddSuccess}>
                ADD NEW ROOM
              </AddNewRoom>
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default CompanyList;
