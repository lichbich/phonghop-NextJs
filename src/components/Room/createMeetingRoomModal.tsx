import React, { useEffect, useState, useCallback } from "react";
import { Modal, message, Input, Image } from "antd";
import Button from "@/constants/Form/Button";
import styles from "@/css/AddNewRoom.module.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import api from "@/axiosService";
import customstyle from "@/css/CompanyList.module.css";
import { Form as Form2 } from "antd";
import { Select, Space } from "antd";
import { useSelector } from "react-redux";

const AddNewRoom = ({ onAddSuccess }: any) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form2.useForm();
  const [formCompleted, setFormCompleted] = useState(true);
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showDragDrop, setShowDragDrop] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);

  const user = useSelector((state: any) => state.user.value);

  const handleInputChange = () => {
    const inputs =
      document.querySelectorAll<HTMLInputElement>('input[type="text"]');
    let isAllFieldsFilled = true;

    inputs.forEach((input) => {
      if (input.value.trim() === "") {
        isAllFieldsFilled = false;
      }
    });

    setIsFormValid(isAllFieldsFilled);
  };

  const handleDrag = function (e: React.DragEvent<HTMLDivElement>) {
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
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target) {
          setImagePreview(event.target.result as string);
        }
        setShowDragDrop(false);
      };

      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    const preventDefault = (e: Event) => {
      e.preventDefault();
    };

    window.addEventListener("dragenter", preventDefault);
    window.addEventListener("dragover", preventDefault);

    return () => {
      window.removeEventListener("dragenter", preventDefault);
      window.removeEventListener("dragover", preventDefault);
    };
  }, []);

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
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  function handleSubmit() {
    form
      .validateFields()
      .then(async (values) => {
        try {
          const inputImage = form.getFieldValue("image");
          const imageFile = new File([inputImage], "meeting-room-image.png", {
            type: "image/png/jpeg/jpg",
          });

          const formData = new FormData();
          formData.append("name", values.name);
          formData.append("location", values.location);
          formData.append("floor", values.floor);
          formData.append("capacity", values.capacity);
          formData.append("equipment", values.equipment);
          formData.append("availability", values.availability);
          formData.append("company_id", user.company_id);
          formData.append("image", imageFile);

          const data = await api.post("store-meeting-room", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (data.status === 200) {
            message.success("Room created successfully");
            form.resetFields();
            setVisible(false);
            if (onAddSuccess) {
              onAddSuccess();
            }
          } else {
            message.error("Failed to create Room");
            form.resetFields();
            setVisible(false);
            if (onAddSuccess) {
              onAddSuccess();
            }
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
      <button key="add" className={customstyle.addbtn} onClick={showPopup}>
        ADD NEW ROOM
      </button>
      <Modal
        title={<div className={styles.formTitle}>Add New Room</div>}
        open={visible}
        onCancel={handleCancel}
        footer={null}
        closable={false}
        width={973}
      >
        <Form2
          form={form}
          name="Add new room"
          requiredMark={false}
          onValuesChange={(changedValues, allValues) => {
            const isFormCompleted = Object.values(allValues).every(
              (value) => value !== undefined && value !== ""
            );
            setFormCompleted(isFormCompleted);
          }}
        >
          <div className={styles.formControl}>
            <Form2.Item
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
              <Input
                type="text"
                className={styles.Input}
                onChange={handleInputChange}
              />
            </Form2.Item>
          </div>
          <div className={styles.formControl}>
            <Form2.Item
              label={<span className={styles.label}>Location*</span>}
              name="location"
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
              <Input
                type="text"
                className={styles.Input}
                onChange={handleInputChange}
              />
            </Form2.Item>
          </div>
          <div className={styles.formControl}>
            <Form2.Item
              label={<span className={styles.label}>Floor</span>}
              name="floor"
              style={{ width: "100%" }}
            >
              <Input
                type="text"
                className={styles.Input}
                onChange={handleInputChange}
              />
            </Form2.Item>
          </div>
          <div className={styles.formControl}>
            <Form2.Item
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
              <Input
                type="text"
                className={styles.Input}
                onChange={handleInputChange}
              />
            </Form2.Item>
          </div>
          <div className={styles.formControl}>
            <Form2.Item
              label={<span className={styles.label}>Equipment</span>}
              name="equipment"
              style={{ width: "100%" }}
            >
              <Input
                type="text"
                className={styles.Input}
                onChange={handleInputChange}
              />
            </Form2.Item>
          </div>
          <div className={styles.formControl}>
            <Form2.Item
              label={<span className={styles.label}>Availability</span>}
              name="availability"
              style={{ width: "100%" }}
            >
              <Select
                // className={styles.Input}
                placeholder="Choose"
                style={{
                  width: 329,
                  height: 44,
                  left: "42%",
                  borderRadius: "8px",
                  border: "2px solid #225560",
                  fontFamily: "Be Vietnam Pro",
                  fontSize: "14px",
                  //   paddingLeft: "16px",
                }}
                onChange={handleChange}
                options={[
                  { value: "Open", label: "Open" },
                  { value: "Close", label: "Close" },
                ]}
              />
            </Form2.Item>
          </div>
          <Form2.Item
            label={
              <span className={styles.label}>Upload Meeting Room Image</span>
            }
            name="upload"
            style={{ width: "100%" }}
          ></Form2.Item>
          <div className={styles.formControl}>
            <div
              id="form-file-upload"
              className={styles.formupload}
              onDragOver={handleDrag}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
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
              {imagePreview && (
                <div>
                  <Image
                    src={imagePreview}
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
            </div>
          </div>
          <Form2.Item>
            <div className={styles.buttonContainer}>
              <div>
                <Button
                  className={`${styles.buttonAdd} ${
                    isFormValid ? styles.valid : ""
                  }`}
                  htmlType="submit"
                  onClick={handleSubmit}
                  label="ADD NEW ROOM"
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
          </Form2.Item>
        </Form2>
      </Modal>
    </>
  );
};

export default AddNewRoom;
