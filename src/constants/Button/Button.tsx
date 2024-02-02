import React from 'react';

const Button = ({ onClick, label }:any) => {
  return (
    <button onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;