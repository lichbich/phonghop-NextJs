
import React, {useState} from 'react';
import {Modal} from 'antd';
import Button from "@/constants/Form/Button";
import styles from '@/css/DeleteMeeting.module.css';
import axios from "axios";
import customstyle from '@/css/CompanyList.module.css'
import api from '@/axiosService';

const BookingDelete = ({ booking_id,onDeleteSuccess,open,cancel }:any) => {
    const [visible, setVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    const showPopup = () => {
        setVisible(true);
    };
    const handleDelete = async () => {
        try {
          const response = await api.delete(`bookings/${booking_id}`);
          if (response.status === 200) {
              onDeleteSuccess(false);
          } else {
              console.error('Error deleting bookings:');
          }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            cancel(false);
        }
      }

    const handleCancel = () => {
        setErrorMessage('');
        cancel(false)
    };
    return (
        <>
                <Modal
                    title={
                        <div className={styles.warningTitle}>
                            Are you sure to delete this booking?
                        </div>
                    }
                    open={open}
                    footer={null}
                    closable={false}
                    width={626}
                    centered
                >
                    
                    {errorMessage && (
                        <div className={styles.errorMessage}>
                            {errorMessage}
                        </div>
                    )}
                    <div className={styles.buttonContainer}>
                        <div>
                            <Button className={styles.buttonDelete} onClick={handleDelete} label='DELETE'/>
                        </div>
                        <div>
                            <Button className={styles.buttonCancel} onClick={handleCancel} label='CANCEL'/>
                        </div>
                    </div>
                </Modal>
        </>
    );
};
export default BookingDelete;
