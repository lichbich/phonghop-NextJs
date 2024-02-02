"use client";
import styles from "@/css/CompanyList.module.css";
import { Table, Tag, Pagination, ConfigProvider, Skeleton } from "antd";
import Button from "@/constants/Form/Button";
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
import { setSelectedRoom } from "@/lib/features/room/roomSlice";
import BookingRoomGuest from "@/components/Guest/BookingRoomGuest";
import { useSearchParams } from 'next/navigation'

const CompanyList = () => {
  const locale = useLocale();
  const [allRoomsData, setAllRoomData] = useState<DataType[]>([]);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [filteredRooms, setFilteredRooms] = useState<DataType[]>([]);
  const [loading, setLoadingSkeleton] = useState(true);
  const [selectedTimeStartValue, setSelectedTimeStartValue] = useState("");
  const [selectedTimeEndValue, setSelectedTimeEndValue] = useState("");
  const [selectedDate, setSelectedDate] = useState("");


  const company_id  = useSearchParams().get('company_id');

  useEffect(() => {
    fetchData().then(() => setLoadingSkeleton(false));
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
    const [selectedRoomName, setSelectedRoomName] = useState('all');
    const handleSelectChange = (event:any) => {
      setSelectedRoomName(event.target.value);
      if (selectedRoomName === "all") {
        setFilteredRooms(allRoomsData);
      } else {
        const filteredRooms = allRoomsData.filter((room) => room.name === selectedRoomName);
        setFilteredRooms(filteredRooms);
      }
   };
   const handleTimeStartChange = (newTimeStart:any) => {
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
      columns = [
        {
          title: "No",
          dataIndex: "id",
          key: "id",
          render: (number) => <a>{number}</a>,
          sorter: (a, b) => a.no - b.no,
          width: 40,
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
          title: 'Action',
            key: 'action',
            align: 'center', 
            render: (_,record,availabilitys) => {
               const color = availabilitys ? '#8B8B8B' : '#388697';
               return (
                   <Tag key={record.key} color={color}>
                       <  >Book</>
                   </Tag>
               );
            },
            width: 154,
        },
        // {
        //   title: "Action",
        //   key: "action",
        //   align: "center",
        //   render: (_, record) => (
        //     <Space size="middle">
        //       <EditRoom
        //         rec={record}
        //         onEditSuccess={handleEditSuccess}
        //       ></EditRoom>
        //       <DeleteMeeting
        //         room_id={record.id}
        //         onDeleteSuccess={handleDeleteSuccess}
        //       ></DeleteMeeting>
        //     </Space>
        //   ),
        //   fixed: "right",
        //   width: 137,
        // },
      ];
  }
  return (
    <div className={styles.container}>
      <div className={styles.labelsection}>
        <div className={styles.square}></div>
        <h1 className={styles.label}>Meeting Room List</h1>
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
            <CustomTimePicker onChange={handleTimeEndChange}></CustomTimePicker>
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
                      <td className={styles.customTable}>{props.children}</td>
                    );
                  },
                },
              }}
            />
            <BookingRoomGuest></BookingRoomGuest>
          </ConfigProvider>
        )}
      </div>
    </div>
  );
};
export default CompanyList;
