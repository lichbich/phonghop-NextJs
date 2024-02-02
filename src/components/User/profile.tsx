'use client'
import React, { useState, useEffect, useRef, use } from 'react';
import { useSelector, useDispatch } from "react-redux";
import Modal from "@/constants/Modal/ProfileModal";
import Button from "@/constants/Form/Button";
import styles from "@/constants/Sidebar/Sidebar.module.css";
import api from "@/axiosService";
import toast from "react-hot-toast";
import { initializeUser } from '@/lib/features/user/userSlice';
import { useAppDispatch } from '@/lib/hooks';
import ChangePasswordModal from '@/constants/Modal/ChangePasswordModal';

export default function Profile({ togglePopup }: { togglePopup: any }) {
  const dispatch = useAppDispatch()
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(false);


  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const handleClose = () => {
    togglePopup();
    setShow(false);
  };
  const handleShow = () => setShow(true);
  var apiSliceProfile = useSelector((state: any) => state.user.value);
  var usertype = apiSliceProfile.type;
  const [userData, setUserData] = useState({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
  })
  const handleEditClick = () => {

    setEditing(true);
  }
  const handleSaveClick = async () => {
    try {
      const res = await api.put(`update-user/${apiSliceProfile.id}`, userData)
      const user = res.data.data;
      dispatch(initializeUser(user));
    } catch (error) {
      console.error(error);
      toast.error('Error');
    }
    setEditing(false);
  };
  const handleToggleChangePasswordModal = () => {

    setIsChangePasswordModalOpen(true);
  }
  const handleChange = ({ field, value }: any) => {
    setUserData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  useEffect(() => {
    if (apiSliceProfile && usertype == 0) {
      const initialData:any = {
        name: apiSliceProfile.name,
        email: apiSliceProfile.email,
        phone: apiSliceProfile.phone,
      };
      setUserData(initialData);
    }
    if (apiSliceProfile && usertype == 1) {
      const initialData = {
        name: apiSliceProfile.name,
        title: apiSliceProfile.title,
        email: apiSliceProfile.email,
        phone: apiSliceProfile.phone,
        company: apiSliceProfile.company.company_name,
      };
      setUserData(initialData);
    }
    if (apiSliceProfile && usertype == 2) {
      const initialData = {
        name: apiSliceProfile.name,
        title: apiSliceProfile.title,
        email: apiSliceProfile.email,
        phone: apiSliceProfile.phone,
        company: apiSliceProfile.company.company_name,
      };
      setUserData(initialData);
    }
  }, [apiSliceProfile, usertype]);


  return (
    <>
      {usertype === 0 && (<>
        <Modal title="Personal Information" width={1000} height={1000} onClose={handleClose}>
          <div className={styles.inputform}>
            <label htmlFor="name">Name*</label>
            <input type="text" id="name" value={userData.name} disabled />
          </div>
          <div className={styles.inputform}>
            <label htmlFor="email">Email Address*</label>
            <input type="email" id="email" value={userData.email} disabled />
          </div>
          <div className={styles.inputform}>
            <label htmlFor="phone">Phone Number*</label>
            <input type="text" id="phone" value={userData.phone} readOnly={!editing} onChange={(e: any) => handleChange({ field: 'phone', value: e.target.value })} style={{ backgroundColor: editing ? '#FFF' : '#EAEEF6' }} />
          </div>
          <div className={styles.editsection}>
            <button className={styles.editbtn} onClick={handleEditClick}>EDIT INFORMATION</button>
          </div>
          <div className={styles.btngroup}>
          <Button className={styles.passbtn} onClick={editing ? handleSaveClick : handleToggleChangePasswordModal}>
                {editing ? 'SAVE' : 'CHANGE PASSWORD'}</Button>
            <Button color="#FFF" className={styles.closebtn} onClick={handleClose}>
              CLOSE
            </Button>
          </div>
        </Modal>
        {isChangePasswordModalOpen && <ChangePasswordModal title="Change Password" onClose={() => setIsChangePasswordModalOpen(false)} isOpen={isChangePasswordModalOpen}>
          </ChangePasswordModal>
          }
      </>)}
      {usertype === 1 && (
        <>
          {!isChangePasswordModalOpen && <Modal title="Personal Information" onClose={handleClose}><div className={styles.inputform}>
            <label htmlFor="name">Manager Name*</label>
            <input type="text" id="name" value={userData.name} />
          </div>
            <div className={styles.inputform}>
              <label htmlFor="title">Manager Title*</label>
              <input type="text" id="title" value={userData.title} readOnly={!editing} onChange={(e: any) => handleChange({ field: 'title', value: e.target.value })} style={{ backgroundColor: editing ? '#FFF' : '#EAEEF6' }} />
            </div>
            <div className={styles.inputform}>
              <label htmlFor="company">Company*</label>
              <input type="text" id="company" value={userData.company} />
            </div>
            <div className={styles.inputform}>
              <label htmlFor="email">Email Address*</label>
              <input type="email" id="email" value={userData.email} />
            </div>
            <div className={styles.inputform}>
              <label htmlFor="phone">Phone Number*</label>
              <input type="text" id="phone" value={userData.phone} readOnly={!editing} onChange={(e: any) => handleChange({ field: 'phone', value: e.target.value })} style={{ backgroundColor: editing ? '#FFF' : '#EAEEF6' }} />
            </div>
            <div className={styles.editsection}>
              <button className={styles.editbtn} onClick={handleEditClick}>EDIT INFORMATION</button>
            </div>
            <div className={styles.btngroup}>
            <Button className={styles.passbtn} onClick={editing ? handleSaveClick : handleToggleChangePasswordModal}>
                {editing ? 'SAVE' : 'CHANGE PASSWORD'}</Button>
              <Button color="#FFF" className={styles.closebtn} onClick={handleClose}>
                CLOSE
              </Button>
            </div>
          </Modal>}
          {isChangePasswordModalOpen && <ChangePasswordModal title="Change Password" onClose={() => setIsChangePasswordModalOpen(false)} isOpen={isChangePasswordModalOpen}>
          </ChangePasswordModal>
          }
        </>
      )}
      {usertype === 2 && (
        <> 

          {!isChangePasswordModalOpen && <Modal title="Personal Information" onClose={handleClose}><div className={styles.inputform}>
            <label htmlFor="name">Name*</label>
            <input type="text" id="name" value={userData.name} readOnly />
          </div>
            <div className={styles.inputform}>
              <label htmlFor="title">Title*</label>
              <input type="text" id="title" value={userData.title} readOnly={!editing} onChange={(e: any) => handleChange({ field: 'title', value: e.target.value })} style={{ backgroundColor: editing ? '#FFF' : '#EAEEF6' }} />
            </div>
            <div className={styles.inputform}>
              <label htmlFor="company">Company*</label>
              <input type="text" id="company" value={userData.company} readOnly />
            </div>
            <div className={styles.inputform}>
              <label htmlFor="email">Email Address*</label>
              <input type="email" id="email" value={userData.email} readOnly />
            </div>
            <div className={styles.inputform}>
              <label htmlFor="phone">Phone Number*</label>
              <input type="text" id="phone" value={userData.phone} readOnly={!editing} onChange={(e: any) => handleChange({ field: 'phone', value: e.target.value })} style={{ backgroundColor: editing ? '#FFF' : '#EAEEF6' }} />
            </div>
            <div className={styles.editsection}>
              <button className={styles.editbtn} onClick={handleEditClick}>EDIT INFORMATION</button>
            </div>
            <div className={styles.btngroup}>
              <Button className={styles.passbtn} onClick={editing ? handleSaveClick : handleToggleChangePasswordModal}>
                {editing ? 'SAVE' : 'CHANGE PASSWORD'}</Button>
              <Button color="#FFF" className={styles.closebtn} onClick={handleClose}>
                CLOSE
              </Button>
            </div>
          </Modal>}
          {isChangePasswordModalOpen && <ChangePasswordModal title="Change Password" onClose={() => setIsChangePasswordModalOpen(false)} isOpen={isChangePasswordModalOpen}>
          </ChangePasswordModal>
          }
        </>
      )}
    </>

  )
}




