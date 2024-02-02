'use client'
import React from "react";
import styles from "./Sidebar.module.css";
import Link from "next/link";
import Image from "next/image";
import Button from "@/constants/Form/Button";
import { useState, useEffect } from "react";
import Modal from "@/constants/Modal/ViewModal";
import Profile from "@/components/User/profile";
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/lib/hooks';
import { setLoading } from '@/lib/features/loadingSlice';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation'
import { get } from "lodash";
import { useRouter } from "next/navigation";


const Sidebar = () => {
  const user = useSelector((state: any) => state.user.value);
  var usertype = get(user, 'type', null);
  const pathname = usePathname();
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(pathname);
    console.log("pathname", pathname);
    
  }, [pathname]);
console.log("currentPath", currentPath);

  if (pathname === '/vn/guest') {
    usertype = 3;
  }

  const locale = useLocale();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const openModal = (type: string) => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const togglePopup = () => {
    setIsProfileOpen(!isProfileOpen);
  };
  return (
    <aside className={styles.sidebar}>
      <ul className={styles.listsidebar}>
        {usertype === 0 && (
          <>
            <Link
              href={`/${locale}/company`}
              className={
                currentPath === `/${locale}/company`
                  ? styles.sidebarChoose
                  : styles.customlink
              }
            >
              <li className={styles.sidebarItem}>
                <Image
                  src="/company.svg"
                  alt="Company logo"
                  width={"32"}
                  height={"32"}
                />
                <span className={styles.sidebarText}>Company</span>
              </li>
            </Link>
          </>
        )}
        {usertype === 1 && (
          <>
            <Link
              href={`/${locale}/room`}
              className={
                currentPath === `/${locale}/room`
                  ? styles.sidebarChoose
                  : styles.customlink
              }
            >
              <li className={styles.sidebarItem}>
                <Image
                  src="/room.svg"
                  alt="Room logo"
                  width={"32"}
                  height={"32"}
                />
                <span className={styles.sidebarText}>Room</span>
              </li>
            </Link>
            <Link
              href={`/${locale}/booking`}
              className={
                currentPath === `/${locale}/booking`
                  ? styles.sidebarChoose
                  : styles.customlink
              }
            >
              <li className={styles.sidebarItem}>
                <Image
                  src="/booking.svg"
                  alt="Booking logo"
                  width={"32"}
                  height={"32"}
                />
                <span className={styles.sidebarText}>Booking</span>
              </li>
            </Link>
            <Link
              href={`/${locale}/users`}
              className={
                currentPath === `/${locale}/users`
                  ? styles.sidebarChoose
                  : styles.customlink
              }
            >
              <li className={styles.sidebarItem}>
                <Image
                  src="/user.svg"
                  alt="User logo"
                  width={"32"}
                  height={"32"}
                />
                <span className={styles.sidebarText}>Users</span>
              </li>
            </Link>
          </>
        )}
        {usertype === 2 && (
          <>
            <Link
              href={`/${locale}/room`}
              className={
                currentPath === `/${locale}/room`
                  ? styles.sidebarChoose
                  : styles.customlink
              }
            >
              <li className={styles.sidebarItem}>
                <Image
                  src="/room.svg"
                  alt="Room logo"
                  width={"32"}
                  height={"32"}
                />
                <span className={styles.sidebarText}>Room</span>
              </li>
            </Link>
            <Link
              href={`/${locale}/booking`}
              className={
                currentPath === `/${locale}/booking`
                  ? styles.sidebarChoose
                  : styles.customlink
              }
            >
              <li className={styles.sidebarItem}>
                <Image
                  src="/booking.svg"
                  alt="Booking logo"
                  width={"32"}
                  height={"32"}
                />
                <span className={styles.sidebarText}>Booking</span>
              </li>
            </Link>
          </>
        )}
        {usertype === 3 && (
          <>
            <Link
              href={`/${locale}/guest`}
              className={
                currentPath === `/${locale}/guest`
                  ? styles.sidebarChoose
                  : styles.customlink
              }
            >
              <li className={styles.sidebarItem}>
                <Image
                  src="/room.svg"
                  alt="Room logo"
                  width={"32"}
                  height={"32"}
                />
                <span className={styles.sidebarText}>Room</span>
              </li>
            </Link>
          </>
        )}
      </ul>
      <div>
        <div className={styles.sidebarItem2}>
          <Image src="/book.png" alt="Book logo" width={"32"} height={"32"} />
          {usertype === 3 ? (
            <a className={styles.sidebarText}>Guest</a>
          ) : (
            <a className={styles.sidebarText} onClick={() => togglePopup()}>
              {user.name}
            </a>
          )}
        </div>
        {isProfileOpen && <Profile togglePopup={() => togglePopup()} />}
      </div>
    </aside>
  );
};

export default Sidebar;