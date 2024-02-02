"use client";
import React, { useCallback } from "react";
import styles from "@/css/CompanyList.module.css";
import Button from "@/constants/Form/Button";
import { ConfigProvider, Skeleton, Spin, Table, Tag } from "antd";
import { DatePicker, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { get } from "lodash";
import api from "@/axiosService";
import ManagerEditInfor from "@/components/Manager/ManagerEditInfor";
import DeleteUser from "@/components/User/deleteUser/deleteUser";
import AddUser from "@/components/User/addUser/addUser";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/lib/hooks";
import { setLoading } from "@/lib/features/loadingSlice";
import toast from "react-hot-toast";
import StaffInfomation from "@/components/User/InforUser/UserInfor";
import UserEditInfor from "@/components/User/editInfor/UserEditInfor";

const UserPage = () => {
  const [allStaffData, setAllStaffData] = useState<DataType[]>([]);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [loading, setLoadingSkeleton] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state: any) => state.user.value);
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchData().then(() => {
      setLoadingSkeleton(false);
      setIsLoading(false);
    });
  }, []);

  const fetchData = useCallback(async () => {
    const company_id = user.company_id;
    if (company_id) {
      try {
        const response = await api.get(`users/company/${company_id}`);
        const res = get(response, "data.data.data", []);
        const sortedData = res.sort((a: DataType, b: DataType) => b.id - a.id);
        setAllStaffData(sortedData);
      } catch (error) {
        console.error(error);
        toast.error("Error");
      } finally {
        dispatch(setLoading(false));
      }
    }
  }, [dispatch, user.company_id]);
  useEffect(() => {
    fetchData();
  }, []);

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
  interface DataType {
    id: number;
    key: string;
    no: number;
    name: string;
    title: string;
    email: string;
    phonenumber: number;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: () => {
        return <div className={styles.headerTitle}>No</div>;
      },
      dataIndex: "id",
      key: "id",
      render: (number) => <a>{number}</a>,
      sorter: (a, b) => a.no - b.no,
      fixed: "left",
      width: 272,
    },
    {
      title: () => {
        return <div className={styles.headerTitle}>Name</div>;
      },
      dataIndex: ["name"],
      key: "attributes[name]",
      sorter: (a, b) => a.name.localeCompare(b.name),
      fixed: "left",
      width: 272,
    },
    {
      title: () => {
        return <div className={styles.headerTitle}>Role</div>;
      },
      dataIndex: ["title"],
      key: "attributes[type]",
      sorter: (a, b) => a.title.localeCompare(b.title),
      width: 273,
    },
    {
      title: () => {
        return <div className={styles.headerTitle}>Email</div>;
      },
      dataIndex: ["email"],
      key: "attributes[email]",
      width: 262,
    },
    {
      title: () => {
        return <div className={styles.headerTitle}>Phone Number</div>;
      },
      dataIndex: ["phone"],
      key: "attributes[phone]",
      width: 251,
    },
    {
      title: () => {
        return <div className={styles.headerTitle}>Action</div>;
      },
      key: "action",
      align: "center",
      render: (_, record: any) => (
        <Space size="middle" style={{ alignItems: "center" }}>
          <StaffInfomation rec={record}></StaffInfomation>
          {<ManagerEditInfor user={record} onEditSuccess={handleEditSuccess} />}
          <DeleteUser
            user_id={record.id}
            onDeleteSuccess={handleDeleteSuccess}
          />
        </Space>
      ),
      fixed: "right",
      width: 168,
    },
  ];
  return (
    <>
      {isLoading ? (
        <Spin fullscreen size="large"/>
      ) : (
        <div className={styles.container}>
          <div className={styles.labelsection}>
            <div className={styles.square}></div>
            <h1 className={styles.label}>Staff List</h1>
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
                  dataSource={allStaffData}
                  bordered
                  scroll={{ x: 1000 }}
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
            <AddUser onAddSuccess={handleAddSuccess} />
          </div>
        </div>
      )}
    </>
  );
};
export default UserPage;
