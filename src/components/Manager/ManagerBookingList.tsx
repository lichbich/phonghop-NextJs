"use client";
import React, { useCallback } from "react";
import styles from "@/css/CompanyList.module.css";
import BookRoom from "@/components/Booking/BookRoom";
import { Table, Tag, Select, ConfigProvider, Skeleton, Image, Spin, Space} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import moment from "moment";
import api from "@/axiosService";
import { get } from "lodash";
import toast from "react-hot-toast";
import BookingDetail from "./Booking/BookingDetail";
import BookingEditDetail from "./Booking/BookingEditDetail";
import { useSelector } from "react-redux";
import BookingSuccess from "../Booking/BookingSuccess";

const ManagerBookingList = () => {
  const [allStaffData, setAllStaffData] = useState<DataType[]>([]);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [statusButton, setStatusButton] = useState([
    { statusButton: 0, buttonColor: "#8B8B8B" },
  ]);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state: any) => state.user.value);
  const company_id = user.company_id;
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [filteredBooking, setFilteredBooking] = useState<DataType[]>([]);

  
  useEffect(() => {
    fetchData().then(() => {
      setLoadingSkeleton(false);
      setIsLoading(false);
    });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const data = await api.get("bookings", {
        params: {
          company_id: company_id,
        },
      });
      let res = get(data, "data.data");

      setAllStaffData(res);
      setFilteredBooking(res);
    } catch (error) {
      console.error(error);
      toast.error("Error");
    }
  }, [company_id]);
  useEffect(() => {
    fetchData();
  }, []);
  const handleStatusChange = (e: any) => {
    const selectedBooking = e.target.value;
    if (selectedBooking === "all") {
      setFilteredBooking(allStaffData);
    } else {
      const filteredData = allStaffData.filter((item: any) => {
        return item.register_status.toString() === selectedBooking;
      });
      setFilteredBooking(filteredData);
    }
  };
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
  const [buttonColor, setButtonColor] = useState("red"); // Initial color

  const getBtnColor = (bookingStatus: number, type: string): string => {
    if (type === "confirm") {
      if (bookingStatus === 1) {
        return "#388697";
      } else {
        return "#8B8B8B";
      }
    } else {
      if (bookingStatus === 2) {
        return "#E56353";
      } else {
        return "#8B8B8B";
      }
    }
  };
  const handletestButtonClick = async (id: number, status: any) => {
    let dat: any = allStaffData.find((staff) => {
      return staff.id === id;
    });
    if (dat) {
      if (dat.register_status == status) {
        dat.register_status = 0;
      } else {
        dat.register_status = status;
      }
    }
    try {
      const response = await api.put(`bookings/${dat.id}`, dat);
    } catch (error) {
      console.log(error);
    }

    setAllStaffData([...allStaffData]);
  };

  interface DataType {
    id: number;
    key: string;
    no: number;
    meeting_room: {
      name: string;
    };
    booking_name: string;
    date: string;
    from_time: string;
    to_time: string;
    topic: string;
    objective: string;
    register_status: number;
    meeting_note: boolean;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "No",
      dataIndex: "id",
      key: "id",
      render: (number) => <a>{number}</a>,
      sorter: (a, b) => a.no - b.no,
      width: 73,
      fixed: "left",
    },
    {
      title: "Room Name",
      dataIndex: ["meeting_room", "name"],
      key: "meeting_room[name]",
      fixed: "left",
      width: 146,
    },
    {
      title: "Booked by",
      dataIndex: "booking_name",
      key: "booking_name",
      width: 149,
    },
    {
      title: "Date",
      dataIndex: "from_time",
      key: "from_time",
      render: (from_time) => moment(from_time).format("ddd,DD MMM YYYY"),
      width: 159,
    },
    {
      title: "From",
      dataIndex: "from_time",
      key: "from_time",
      render: (from_time) =>
        moment(from_time, "YYYY-MM-DD HH:mm:ss").format("HH:mm A"),
      width: 128,
    },
    {
      title: "To",
      dataIndex: "to_time",
      key: "to_time",
      render: (to_time) =>
        moment(to_time, "YYYY-MM-DD HH:mm:ss").format("HH:mm A"),
      width: 143,
    },
    {
      title: "Meeting Topic",
      dataIndex: "topic",
      key: "topic",
      width: 162,
    },
    {
      title: "Status",
      dataIndex: "register_status",
      key: "status",
      width: 145,
      render: (status) => {
        switch (status) {
          case 0:
            return "Pending";
          case 1:
            return "Upcoming";
          case 2:
            return "Finished";
          default:
            return "";
        }
      },
    },
    {
      title: "Add meeting notes",
      key: "meeting_note",
      width: 145,
      render: (_, record, meeting_note) => {
        return (
          <Space size="middle">
            <button className={styles.custombutton}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="18"
                viewBox="0 0 19 18"
                fill="none"
              >
                <path
                  d="M16.5 0H2.5C1.397 0 0.5 0.897 0.5 2V16C0.5 17.103 1.397 18 2.5 18H10.5C10.6313 18.0002 10.7614 17.9744 10.8828 17.9241C11.0041 17.8738 11.1143 17.8 11.207 17.707L18.207 10.707C18.2892 10.6217 18.3556 10.5225 18.403 10.414C18.417 10.384 18.425 10.353 18.436 10.321C18.4645 10.2373 18.4816 10.1502 18.487 10.062C18.489 10.041 18.5 10.021 18.5 10V2C18.5 0.897 17.603 0 16.5 0ZM2.5 2H16.5V9H10.5C10.2348 9 9.98043 9.10536 9.79289 9.29289C9.60536 9.48043 9.5 9.73478 9.5 10V16H2.5V2ZM11.5 14.586V11H15.086L11.5 14.586Z"
                  fill="white"
                />
              </svg>
            </button>
          </Space>
        );
      },
    },
    {
      title: "Confirmation",
      dataIndex: "confirmation",
      key: "confirmation",
      width: 162,
      render: (_, record) => {
        return (
          <Space size="middle">
            <button
              className={styles.confirmAgreeButton}
              style={{
                backgroundColor: getBtnColor(record.register_status, "confirm"),
              }}
              onClick={() => handletestButtonClick(record.id, 1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="14"
                viewBox="0 0 18 14"
                fill="none"
              >
                <path
                  d="M1.125 7.375L6.375 12.625L16.875 1.375"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <button
              className={styles.confirmDisagreeButton}
              style={{
                backgroundColor: getBtnColor(record.register_status, "decline"),
              }}
              onClick={() => handletestButtonClick(record.id, 2)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M15.5459 13.954C15.7573 14.1653 15.876 14.452 15.876 14.7509C15.876 15.0497 15.7573 15.3364 15.5459 15.5477C15.3346 15.7591 15.048 15.8778 14.7491 15.8778C14.4502 15.8778 14.1635 15.7591 13.9522 15.5477L8 9.59367L2.04594 15.5459C1.8346 15.7572 1.54795 15.8759 1.24907 15.8759C0.950182 15.8759 0.663537 15.7572 0.452193 15.5459C0.240848 15.3345 0.122116 15.0479 0.122116 14.749C0.122116 14.4501 0.240848 14.1635 0.452193 13.9521L6.40625 7.99992L0.454067 2.04586C0.242723 1.83451 0.123991 1.54787 0.123991 1.24898C0.123991 0.950097 0.242723 0.663452 0.454067 0.452108C0.665412 0.240763 0.952056 0.122031 1.25094 0.122031C1.54983 0.122031 1.83647 0.240763 2.04782 0.452108L8 6.40617L13.9541 0.45117C14.1654 0.239826 14.4521 0.121094 14.7509 0.121094C15.0498 0.121094 15.3365 0.239826 15.5478 0.45117C15.7592 0.662514 15.8779 0.949159 15.8779 1.24804C15.8779 1.54693 15.7592 1.83358 15.5478 2.04492L9.59375 7.99992L15.5459 13.954Z"
                  fill="white"
                />
              </svg>
            </button>
          </Space>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <BookingDetail rec={record}></BookingDetail>
          <BookingEditDetail
            rec={record}
            onEditSuccess={handleEditSuccess}
            fetchBooking={() => fetchData}
          ></BookingEditDetail>
          <button
            key="delete"
            className={styles.custombutton}
            style={{ backgroundColor: "#E56353" }}
          >
            <Image src="/delete.svg" alt="" preview={false} />
          </button>
        </Space>
      ),
      fixed: "right",
      width: 191,
    },
  ];
  return (
    <div>
      {isLoading ? (
        <Spin fullscreen size="large"/>
      ) : (
        <div className={styles.container}>
          <div className={styles.labelsection}>
            <div className={styles.square}></div>
            <h1 className={styles.label}>Booking List</h1>
          </div>
          <div className={styles.filter}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <span className={styles.textLabel}>FILTER BY STATUS</span>
                <select
                  defaultValue="all"
                  onChange={(e) => handleStatusChange(e)}
                  className={styles.textLabel}
                >
                  <option value="all" className={styles.textLabel}>
                    All Status
                  </option>
                  <option value="0" className={styles.textLabel}>
                    Pending
                  </option>
                  <option value="1" className={styles.textLabel}>
                    Upcoming
                  </option>
                  <option value="2" className={styles.textLabel}>
                    Finished
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div className={styles.companytable}>
            {loadingSkeleton ? (
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
                  dataSource={filteredBooking}
                  bordered
                  scroll={{ x: 1000 }}
                  //   className={customstyle.customtable}
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
                        console.log(isEvenRow);

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
          <div className={styles.addco}>
            <BookRoom onAddSuccess={handleAddSuccess}></BookRoom>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManagerBookingList;
