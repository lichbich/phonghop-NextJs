"use client";
import React, { useCallback } from "react";
import styles from "@/css/CompanyList.module.css";
import customstyle from "@/css/MeetingRoomList.module.css";
import AddNewCompany from "@/components/Admin/AddNewCompany";
import { Image, Table, Tooltip } from "antd";
import { Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import DeleteCompany from "@/components/DeleteCompany/DeleteCompany";
import api from "@/axiosService";
import { get } from "lodash";
import toast from "react-hot-toast";
import EditNewCompany from "@/components/Admin/EditNewCompany";
import InformationCompany from "@/components/Admin/InfomationCompany";
import "@/css/Table.module.css";

const CompanyPage = () => {
  const [allStaffData, setAllStaffData] = useState<DataType[]>([]);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);

  const fetchData = useCallback(async () => {
    try {
      const data = await api.get("index-companies");
      const res = get(data, "data.data");
      const sortedData = res.sort((a: DataType, b: DataType) => b.id - a.id);
      setAllStaffData(sortedData);
    } catch (error) {
      console.error(error);
      toast.error("Error");
    }
  }, []);
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
  interface DataType {
    id: number;
    key: string;
    no: number;
    name: string;
    domain: string;
    address: string;
    manager: {
      manager_title: string;
      manager_email: string;
      manager_name: string;
      manager_phone: number;
    };
    created_at: string;
  }
  const columns: ColumnsType<DataType> = [
    {
      title: "No",
      dataIndex: "id",
      key: "id",
      render: (number) => <a>{number}</a>,
      sorter: (a, b) => a.no - b.no,
      width: 60,
      fixed: "left",
    },
    {
      title: "Company Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      fixed: "left",
    },
    {
      title: "Company Domain",
      dataIndex: "domain",
      key: "domain",
      sorter: (a, b) => a.domain.localeCompare(b.domain),
      width: 149,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 159,
    },
    {
      title: "Manager Name",
      dataIndex: ["manager", "manager_name"],
      key: "manager[manager_name]",
      width: 128,
    },
    {
      title: "Manager Title",
      dataIndex: ["manager", "manager_title"],
      key: "manager[manager_title]",
      width: 143,
    },
    {
      title: "Email",
      dataIndex: ["manager", "manager_email"],
      key: "manager[manager_email]",
    },
    {
      title: "Manager Phone Number",
      dataIndex: ["manager", "manager_phone"],
      key: "manager[manager_phone]",
      width: 145,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <InformationCompany rec={record}></InformationCompany>
          <Tooltip title="Quick Access">
            <button key="skipdownline" className={styles.custombutton}>
              <Image src="/skipdownline.svg" alt="" preview={false} />
            </button>
          </Tooltip>

          <EditNewCompany
            rec={record}
            onEditSuccess={handleEditSuccess}
          ></EditNewCompany>
          <DeleteCompany
            company_id={record.id}
            onDeleteSuccess={handleDeleteSuccess}
          ></DeleteCompany>
        </Space>
      ),
      fixed: "right",
      width: 191,
    },
  ];
  return (
    <div className={styles.container}>
      <div className={styles.labelsection}>
        <div className={styles.square}></div>
        <h1 className={styles.label}>Company List</h1>
      </div>
      <div className={styles.companytable}>
        <Table
          columns={columns}
          bordered
          dataSource={allStaffData}
          scroll={{ x: 1300 }}
          pagination={false}
          rowKey={(record) => record.id}
          // className={customstyle.customtable}
          components={{
            header: {
              cell: (props: any) => (
                <th
                  style={{
                    background: "#255D6A",
                    color: "#fff",
                    borderRight: "1px solid #ffffff",
                  }}
                >
                  {props.children}
                </th>
              ),
            },
            body: {
              cell: (props: any) => {
                const isEvenRow = props.index % 2 === 0;
                // console.log(isEvenRow);

                return <td className={styles.customTable}>{props.children}</td>;
              },
            },
          }}
        />
      </div>
      <div className={styles.addco}>
        {/* <Button className={styles.addbtn}>ADD NEW COMPANY</Button> */}
        <AddNewCompany onAddSuccess={handleAddSuccess}></AddNewCompany>
      </div>
    </div>
  );
};
export default CompanyPage;
