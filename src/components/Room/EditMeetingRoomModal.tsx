import React, {
  DragEvent,
  FormEvent,
  DragEventHandler,
  useEffect,
  useState,
} from "react";
import { Image, Modal, message } from "antd";
import Input from "@/constants/Form/Input";
import Button from "@/constants/Form/Button";
import styles from "@/css/AddNewRoom.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "@/axiosService";
import customstyle from "@/css/CompanyList.module.css";
import { Form as Form } from "antd";
import { Select, Space } from "antd";
import { floor } from "lodash";

const EditNewCompany = ({ rec, onEditSuccess }: any) => {
  const [visible, setVisible] = useState(false);
  const [form1] = Form.useForm();
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showDragDrop, setShowDragDrop] = useState(true);
  const [apiImagePreview, setApiImagePreview] = useState<string | null>(null);

  const handleDrag = (
    e: DragEvent<HTMLDivElement> | FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = function (e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    }
  };

  const handleSelect = function (e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setShowDragDrop(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setShowDragDrop(true);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const showPopup = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  useEffect(() => {
    form1.setFieldsValue({
      name: rec.name,
      location: rec.location,
      capacity: rec.capacity,
      equipment: rec.equipment,
      availabilitys: rec.availabilitys,
      floor: rec.floor,
    });
    if (rec.apiImageUrl) {
      setApiImagePreview(rec.apiImageUrl);
      setShowDragDrop(false);
    }
  }, [rec, form1]);

  function handleSubmit() {
    form1
      .validateFields()
      .then(async (values) => {
        try {
          console.log(values);
          const data = await api.patch(`update-meeting-room/${rec.id}`, values);
          if (data.status == 200) {
            message.success("Room update successfully");
            setVisible(false);
            if (onEditSuccess) {
              onEditSuccess();
            }
          } else {
            message.error("Failed to create Room");
          }
        } catch (e) {
          console.error("Error creating Room:", e);
          message.error("Failed to create Room");
          console.log(values);
        }
      })
      .catch((errorInfo) => {
        console.log(errorInfo);
      });
  }

  return (
    <>
      <button
        key="edit"
        className={customstyle.custombutton}
        onClick={showPopup}
      >
        <Image src="/edit.svg" alt="" preview={false} />
      </button>
      <Modal
        title={<div className={styles.formTitle}>Edit Meeting Room</div>}
        open={visible}
        onCancel={handleCancel}
        footer={null}
        closable={false}
        width={973}
      >
        <Form form={form1} name="Edit New Room" requiredMark={false}>
          <div className={styles.formControl}>
            <Form.Item
              label={<span className={styles.label}>Room Name*</span>}
              name="name"
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
              style={{ width: "100%" }}
            >
              <input className={styles.Input} />
            </Form.Item>
          </div>
          <div className={styles.formControl}>
            <Form.Item
              label={<span className={styles.label}>Location*</span>}
              name="location"
              style={{ width: "100%" }}
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
            >
              <input className={styles.Input} />
            </Form.Item>
          </div>
          <div className={styles.formControl}>
            <Form.Item
              label={<span className={styles.label}>Floor</span>}
              name="floor"
              style={{ width: "100%" }}
            >
              <input className={styles.Input} />
            </Form.Item>
          </div>
          <div className={styles.formControl}>
            <Form.Item
              label={<span className={styles.label}>Capacity*</span>}
              name="capacity"
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
              style={{ width: "100%" }}
            >
              <input className={styles.Input} />
            </Form.Item>
          </div>
          <div className={styles.formControl}>
            <Form.Item
              label={<span className={styles.label}>Equipment</span>}
              name="equipment"
              style={{ width: "100%" }}
            >
              <input className={styles.Input} />
            </Form.Item>
          </div>
          <div className={styles.formControl}>
            <Form.Item
              label={<span className={styles.label}>Availability</span>}
              name="availabilitys"
              style={{ width: "100%" }}
            >
              <Select
                defaultValue="Open"
                style={{ width: 329, height: 44, left: "42%" }}
                onChange={handleChange}
                options={[
                  { value: "Open", label: "Open" },
                  { value: "Close", label: "Close" },
                ]}
              />
            </Form.Item>
          </div>
          <Form.Item
            label={
              <span className={styles.label}>Upload Meeting Room Image</span>
            }
            name="upload"
            style={{ width: "100%" }}
          ></Form.Item>
          <div className={styles.formControl}>
            <form
              id="form-file-upload"
              className={styles.formupload}
              onDragEnter={handleDrag}
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                ref={inputRef}
                type="file"
                className={styles.inputfileupload}
                id="input-file-upload"
                multiple={true}
                onChange={handleSelect}
              />
              {showDragDrop && (
                <label
                  id="label-file-upload"
                  htmlFor="input-file-upload"
                  className={`${styles.fileupload} ${
                    dragActive ? "drag-active" : ""
                  }`}
                >
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="58"
                      height="50"
                      viewBox="0 0 58 50"
                      fill="none"
                      style={{ marginLeft: "38%", marginBottom: "10px" }}
                    >
                      <path
                        d="M28.9999 37.011H14.7519C7.89325 37.0003 2.33325 31.6483 2.33325 25.0457C2.33325 18.4457 7.89325 13.0937 14.7519 13.0937C15.7999 8.39501 19.5359 4.56034 24.5519 3.03234C29.5652 1.50701 35.1012 2.51768 39.0692 5.69901C43.0372 8.87234 44.8346 13.7177 43.7892 18.4163H46.4292C50.1092 18.4163 53.2826 20.579 54.7706 23.7123M47.6666 47.667V31.667M47.6666 31.667L55.6666 39.667M47.6666 31.667L39.6666 39.667"
                        stroke="#225560"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <p>Drag and drop files here</p>
                  </div>
                </label>
              )}
              {apiImagePreview && (
                <div>
                  <Image
                    src={apiImagePreview}
                    alt="Meeting Room Preview"
                    style={{
                      width: "500px",
                      height: "225px",
                      marginTop: "10px",
                      marginBottom: "10px",
                      marginLeft: "100px",
                    }}
                  />
                  <button
                    className={styles.deleteimg}
                    onClick={handleRemoveImage}
                  >
                    <Image src="/delete.svg" alt="" />
                  </button>
                </div>
              )}
              {dragActive && (
                <div
                  id="drag-file-element"
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                ></div>
              )}
            </form>
          </div>
          <Form.Item>
            <div className={styles.buttonContainer}>
              <div>
                <Button
                  className={`${styles.buttonAdd} ${styles.formCompleted}`}
                  htmlType="submit"
                  onClick={handleSubmit}
                  label="SAVE"
                />
              </div>
              <div>
                <Button
                  className={styles.buttonCancel}
                  onClick={handleCancel}
                  label="CANCEL"
                />
              </div>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditNewCompany;
