"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import styles from '@/css/Login.module.css';
import Button from '@/constants/Form/Button';
import customstyle from '@/css/ResetPassword.module.css';
import api from '@/axiosService';
import { useRouter } from 'next/navigation';
import { Image } from 'antd';

const ResetPasswordPage: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
    const [isRePasswordVisible, setRePasswordVisibility] = useState(false);
    const locale = useLocale();
    const [errorMessage, setErrorMessage] = useState('');
    const [isOk, setIsOk] = useState(false);
    const router = useRouter();

    const [isPasswordVisible, setPasswordVisibility] = useState(false);

    const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(event.target.value);
        setIsOk(event.target.value !== '' && newPasswordConfirmation !== '');
    };
    
    const handleNewPasswordConfirmationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewPasswordConfirmation(event.target.value);
        setIsOk(newPassword !== '' && event.target.value !== '');
    };

    const togglePasswordVisibility = () => {
        setPasswordVisibility(!isPasswordVisible);
    };
    const toggleRePasswordVisibility = () => {
        setRePasswordVisibility(!isRePasswordVisible);
    };
    const handleSubmit = async () => {
        if (newPassword !== newPasswordConfirmation) {
            setIsOk(false)
            setErrorMessage('Password is not the same');
            return;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
        if (!passwordRegex.test(newPassword)) {
            setIsOk(false);
            setErrorMessage('Password must include at least: 1 lowercase letter, 1 uppercase letter, 1 special character and 1 number');
            return;
        }
        const minLength = 8;
        const maxLength = 20;
        if (newPassword.length < minLength || newPassword.length > maxLength) {
            setIsOk(false);
            setErrorMessage(`Password length must be between ${minLength} and ${maxLength} characters`);
            return;
        }
        const postData = {
            token: sessionStorage.getItem('token'),
            email: sessionStorage.getItem('email'),
            password: newPassword,
            password_confirmation: newPasswordConfirmation,
        }
        try {
            const res = await api.post('auth/reset-password',postData)
            router.push(`/${locale}/login`);
        }
        catch (error) {
            console.log(error);
            setIsOk(false);
        } 
    };
    return (
        <>
            <div className={styles.inputform}>
                <h4 className={customstyle.title}>Change password</h4>
                    <div className={styles.input}>
                        <Image src="/pass.svg" alt="" className={styles.icon} />
                        <input style={{opacity: newPassword? 1 : 0.6}} type={isPasswordVisible ? 'text' : 'password'} placeholder="Password*" className={styles.inputsection} onChange={handleNewPasswordChange}/>
                        <div className={styles.showhide} onClick={togglePasswordVisibility}>
                            {isPasswordVisible ? <Image src="/eyeshow.svg" alt="" className={styles.showhide} /> : <Image src="/eyeshide.svg" alt="" className={styles.showhide} />}
                        </div>
                    </div>
                    <div className={styles.input}>
                        <Image src="/pass.svg" alt="" className={styles.icon} />
                        <input style={{opacity: newPasswordConfirmation? 1 : 0.6}} type={isRePasswordVisible ? 'text' : 'password'} placeholder="Confirm Password*" className={styles.inputsection} onChange={handleNewPasswordConfirmationChange}/>
                        <div className={styles.showhide} onClick={toggleRePasswordVisibility}>
                            {isRePasswordVisible ? <Image src="/eyeshow.svg" alt="" className={styles.showhide} /> : <Image src="/eyeshide.svg" alt="" className={styles.showhide} />}
                        </div>
                        {!isOk && <p className={customstyle.error}>{errorMessage}</p>}
                    </div>
                    <button type="button" className={styles.loginbtn} style={{marginTop:'52px',marginBottom:'24px',backgroundColor: isOk ? '#225560' : '#8B8B8B'}} onClick={handleSubmit}   disabled={!isOk}>CHANGE PASSWORD</button>
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

export default ResetPasswordPage;
