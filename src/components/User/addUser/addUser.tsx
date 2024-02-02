import React, {useEffect, useState} from 'react';
import {Modal, Form as Form1, message} from 'antd';
import Input from "@/constants/Form/Input";
import Button from "@/constants/Form/Button";
import styles from '/src/css/AddUser.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '@/axiosService';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux'
import { useLocale, useTranslations } from 'next-intl';
import { get } from 'lodash';

const AddUser = ({onAddSuccess}: any) => {
    const [visible, setVisible] = useState(false);
    const [form] = Form1.useForm();
    const [users, setUsers] = useState([]);
    const [formCompleted, setFormCompleted] = useState(false)
    const t = useTranslations('Add');
    const locale = useLocale();
    const user = useSelector((state:any) => state.user.value);
    const showPopup = () => {
        form.resetFields();
        setVisible(true);
    };
    const handleCancel = () => {
        form.resetFields();
        setVisible(false);
    };

    async function handleSubmit() {
        try {
            await form.validateFields();
            const password = Math.random().toString(36);
            const values = {
                ...form.getFieldsValue(),
                password: password,
                password_confirmation: password,
                company_id: user.company_id,
                type: 2
            };
            const response = await api.post(`store-user`, values);
            if (response.status === 200) {
                onAddSuccess();
                toast.success(t('success'));
                form.resetFields();
            }
            setVisible(false);
        } catch (error) {
            console.log(error);
            toast.error(t('error'));
        }finally {
            setVisible(false);
        }
    };

    return (
        <>
            <button onClick={showPopup} className={styles.addbtn}>ADD NEW USER</button>
            <Modal
                title={
                    <div className={styles.formTitle}>Add New Staff</div>
                }
                open={visible}
                onCancel={handleCancel}
                footer={null}
                closable={false}
                width={973}
                centered
            >
                <Form1
                    form={form}
                    name="Add new staff"
                    requiredMark={false}
                    onValuesChange={(changedValues, allValues) => {
                        const isFormCompleted = Object.values(allValues).every(value => value !== undefined && value !== '');
                        setFormCompleted(isFormCompleted);
                    }}
                >
                    <div className={styles.formControl}>
                        <Form1.Item
                            label={<span className={styles.label}>Name*</span>}
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
                            style={{width: '100%'}}
                        >
                            <Input className={styles.Input}/>
                        </Form1.Item>

                    </div>
                    <div className={styles.formControl}>
                        <Form1.Item
                            label={<span className={styles.label}>Title</span>}
                            name="title"
                            style={{width: '100%'}}
                        >
                            <Input className={styles.Input}/>
                        </Form1.Item>

                    </div>
                    <div className={styles.formControl}>
                        <Form1.Item
                            label={<span className={styles.label}>Email*</span>}
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        <span className={styles.errorMessage}>
                                            This field is required!
                                        </span>
                                    ),
                                },
                                {
                                    type: 'email',
                                    message: (
                                        <span className={styles.phoneError}>
                        Please enter a valid email address
                    </span>
                                    ),
                                },
                            ]}
                            style={{width: '100%'}}
                        >
                            <Input className={styles.Input}/>
                        </Form1.Item>
                    </div>
                    <div className={styles.formControl}>
                        <Form1.Item
                            label={<span className={styles.label}>Phone Number</span>}
                            name="phone"
                            style={{width: '100%'}}
                            rules={[
                                {min: 6, message:<span className={styles.phoneError}>Please input a valid phone number</span>},
                                {max: 15, message:<span className={styles.phoneError}>Please input a valid phone number</span>}
                            ]}
                        >
                            <Input className={styles.Input}/>
                        </Form1.Item>

                    </div>
                    <Form1.Item>
                        <div className={styles.buttonContainer}>
                            <div>
                                <Button className={styles.buttonAdd} htmlType="submit" onClick={handleSubmit}
                                        label='ADD NEW USER' style={!formCompleted ? {backgroundColor:'#8B8B8B'}:{backgroundColor:'#225560'}} />
                            </div>
                            <div>
                                <Button className={styles.buttonCancel} onClick={handleCancel} label='CANCEL'/>
                            </div>
                        </div>
                    </Form1.Item>
                </Form1>
            </Modal>
        </>
    );
};

export default AddUser;