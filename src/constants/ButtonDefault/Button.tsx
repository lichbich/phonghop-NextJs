import React from 'react';
import styles from './Button.module.css';

const Button = ({ color, children, onClick,className }:any) => {

  const buttonStyle = {
    backgroundColor: color || '#225560', 
  };

  return (
    <button className={`${styles.customButton} ${className}`} style={buttonStyle} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;