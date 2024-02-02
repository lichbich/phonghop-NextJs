'use client'
import React, { useState } from "react";
import Image from "next/image";
import Button from "../Form/Button";
import Modal from "../Modal/LogoutModal";
import styles from "./Header.module.css";
import Cookies from 'js-cookie';
import { useLocale, useTranslations  } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setLoading } from '@/lib/features/loadingSlice';
import api from '@/axiosService';
import {useSelector} from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown} from 'react-bootstrap';
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { get } from "lodash";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleEnglish = () => {
    const hostname = document.location.href;
    window.location.href = hostname.replace('/vn/', '/en/');
  }
  const handleVietNam = () => {
    const hostnamev = document.location.href;
    window.location.href = hostnamev.replace('/en/', '/vn/');
  }
  const locale = useLocale();
  const loading = useAppSelector((state) => state.loading)
  const user = useSelector((state:any) => state.user.value);
  const router = useRouter()

  var username = get(user,'name',null);
  const pathname = usePathname()
  const handleSignin = () => {
    router.push(`/${locale}/login`)
  }
  if (pathname === `/${locale}/guest`) {
    username = 'Guest';
  }
  const dispatch = useAppDispatch()
  const handleLogout = async () => {
    try {
      dispatch(setLoading(true));
      const response = await api.post('auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`, 
        },
        credentials: 'include',
      });

      if (response.status === 200) {
        Cookies.remove('token');
        window.location.href = `/${locale}/login`;
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      dispatch(setLoading(false));
      closeModal();
    }
  };
  return (
    <>
      <div className={styles.header}>
        
        <div className={styles.logo}>
          <Image src="/logo.svg" alt="Logo" width={79} height={72} />
          <h2 className={styles.text}>Hello, {username}!</h2>
        </div>
        <div className={styles.btn}>
          <Button className={`${styles.lang} ${styles.customlang}`} label="English">
            <Image src="/england.svg" alt="England" width={24} height={24} />
          </Button>
          {pathname === `/${locale}/guest` ? (
            <Button className={`${styles.lang} ${styles.customlogout}`} onClick={handleSignin} label="Sign in" />
          ) : (
            <Button className={`${styles.lang} ${styles.customlogout}`} onClick={openModal} label="Logout" />
          )}
        </div>

        
        {isModalOpen && (
          <Modal title="Are you sure to log out of the system?" onClose={closeModal}>
            <div className={styles.btngroup}>
              <Button className={styles.passbtn} onClick={handleLogout}>LOG OUT</Button>
              <Button color="#FFF" className={styles.closebtn} onClick={closeModal}>
                CANCEL
              </Button>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default Header;
