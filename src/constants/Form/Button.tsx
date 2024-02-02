import React from 'react';

const Button = ({ onClick, label,style,className,children }:any) => {
  return (
    <button onClick={onClick} style={style} className={className}>
      {label}
      {children}
    </button>
  );
};

export default Button;