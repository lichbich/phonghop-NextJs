'use client'
import React, { useCallback } from "react";
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@/lib/hooks';
import ManagerBookingList from "@/components/Manager/ManagerBookingList";
import MyBookingHistory from "@/components/Staff/MyBookingHistory";

const BookingPage = () => {
  const user = useSelector((state:any) => state.user.value);
  const dispatch = useAppDispatch()
  const usertype = user.type;
  return (
  <>
    {user.type === 1 && (
      <ManagerBookingList></ManagerBookingList>
    )}
    {user.type === 2 && (
      <MyBookingHistory></MyBookingHistory>
    )}
  </>
  )
}
export default BookingPage



