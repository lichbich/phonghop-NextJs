"use client"
import styles from '@/css/Login.module.css';
import customstyle from '@/css/ForgotPassword.module.css';
import Input from '@/constants/Form/Input';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import React, { useState } from 'react';
import validator from 'validator';
import api from '@/axiosService';
import { useRouter } from 'next/navigation';
import { Image } from 'antd';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const locale = useLocale();
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async () => {
        
        if (!validator.isEmail(email)) {
            setIsEmailValid(false);
            setErrorMessage('Kindly input a valid email address');
            return;
        }
        const postData = {
            email: email,
        }
        try {
            const res = await api.post('auth/forget-password',postData)
            sessionStorage.setItem('token', res.data.messsages.token);
            sessionStorage.setItem('email', email);
            router.push(`/${locale}/resetpassword`);
            console.log(res.data.messsages.token)
        }
        catch (error) {
            console.log(error);
            setIsEmailValid(false);
            setErrorMessage('This email does not exist in our system, kindly register first!');
        } 
    };
    
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setIsEmailValid(e.target.value !== '');
    };
    const handleCancelButton = () => {
       
        router.push(`/${locale}/login`);
    };

    return (
        <>
            <div className={styles.inputform}>
                <h5 className={customstyle.forgot}>Forgot password?</h5>
                <p className={customstyle.label}>Kindly input your registered email here, we will send you a new password to your mailbox.</p>
                <div className={styles.input}>
                    <Image src="/mail.svg" alt="" className={styles.icon} />
                    <Input
                        type="text"
                        name="username"
                        placeholder="Email"
                        className={styles.inputsection}
                        style={{ marginBottom: '24px' }}
                        onChange={handleEmailChange}
                        value={email}
                    />
                    {!isEmailValid && <p className={customstyle.error}>{errorMessage}</p>}
                </div>
                
                <div className={customstyle.buttonsection}>
                    <button className={isEmailValid ? customstyle.sendbtnActive : customstyle.sendbtn} disabled={!isEmailValid} onClick={handleSubmit}>
                        SEND
                    </button>
                    <button className={customstyle.cancelbtn} onClick={handleCancelButton}>CANCEL</button>
                </div>
                <div className={styles.account}>
                    <p>Don't have an account?</p>
                    <Link href={`/${locale}/manager`} className={styles.customlink} passHref>
                        Register
                    </Link>
                </div>
            </div>
        </>
    );
};

export default ForgotPasswordPage;
