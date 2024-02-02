"use client";
import React, {useRef, useState, useEffect, useCallback} from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import {Layout, Modal, Form} from 'antd';
import './calender.css';
import {get} from 'lodash';
import moment from 'moment';
import api from '@/axiosService';
import styles from 'src/css/Calender.module.css';
import type {DatePickerProps} from 'antd';
import {DatePicker, Space} from "antd";
import {useSelector} from 'react-redux'
import toast from "react-hot-toast";
import DeleteUser from "@/components/User/deleteUser/deleteUser";
import ModalBookingDetail from "@/components/Booking/ModalBookingDetail"
interface BookingDetails {
    type_of_booking: any;
    topic: string;
    type: string;
    room: string;
    date: string;
    time: string;
    guest: string;
    agenda: string;
    objective: string;
    materials: string;
    meeting_room: string;
}
const RoomDetailWeekly = ({calendarRef, events, renderEventContent, fetchAllBookingHistory, booking_id}: any) => {
    const [visible, setVisible] = useState(false);
    const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
        topic: '',
        type: '',
        room: '',
        date: '',
        time: '',
        guest: '',
        agenda: '',
        objective: '',
        materials: '',
        meeting_room: '',
        type_of_booking: ''
    });
    const [formBookingDetail] = Form.useForm();

    const showPopup = () => {
        setVisible(true);
        formBookingDetail.resetFields();
    };

    const handleCancel = () => {
        formBookingDetail.resetFields();
        setVisible(false);
        formBookingDetail.resetFields();
    };

    const bookingDetail = async (eventInfo: any) => {
        const booking_id = eventInfo.event.extendedProps.booking_id;
        try {
            const response = await api.get(`/bookings/${booking_id}`);
            const res = get(response, 'data.data');
            await setBookingDetails({...res});
            setVisible(true);
        } catch (error) {
            console.error('Error fetching booking details:', error);
        }
    };
    useEffect(() => {
        formBookingDetail.setFieldsValue({
            topic: bookingDetails.topic,
            type: bookingDetails.type_of_booking,
            room: bookingDetails.room,
            date: bookingDetails.date,
            time: bookingDetails.time,
            guest: bookingDetails.guest,
            agenda: bookingDetails.agenda,
            objective: bookingDetails.objective,
            materials: bookingDetails.materials,
            meeting_room: bookingDetails.meeting_room,
        });
    }, [bookingDetails, formBookingDetail]);

    return (
        <>
            <ModalBookingDetail rec={bookingDetails} formBookingDetail={formBookingDetail} visible={visible} handleCancel={handleCancel}></ModalBookingDetail>
            <div className={styles.calender}>
                <FullCalendar
                    ref={calendarRef}
                    plugins={[timeGridPlugin, interactionPlugin]}
                    headerToolbar={false}
                    allDaySlot={false}
                    editable
                    selectable={true}
                    selectOverlap={true}
                    eventDurationEditable={false}
                    eventStartEditable={false}
                    eventOverlap={false}
                    events={events}
                    eventMinHeight={66}
                    eventMinWidth={1000}
                    eventClick={bookingDetail}
                    expandRows={true}
                    slotMinTime={"08:00:00"}
                    slotMaxTime={"19:00:00"}
                    slotDuration={"00:30:00"}
                    slotLabelInterval={{hours: 1}}
                    slotLabelFormat={{
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                    }}
                    dayHeaderContent={
                        (args: any) => (
                            <div>
                                <div>{moment(args.date).format('dddd')}</div>
                                <div>{moment(args.date).format('DD/MM/YYYY')}</div>
                            </div>
                        )
                    }
                    contentHeight={786}
                    eventContent={renderEventContent}
                />
            </div>
        </>
    );
};

export default RoomDetailWeekly;
