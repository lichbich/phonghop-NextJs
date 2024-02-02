import { Flex, Spin } from 'antd';
import React from 'react';
import style from './LoadingComponent.module.css';

const LoadingComponent: React.FC = () => {
    return (
        <Flex align="center" gap="middle" className={style.loaderWrapper}>
            <Spin size="large" className={style.loader} />
        </Flex>
    );
};

export default LoadingComponent;
