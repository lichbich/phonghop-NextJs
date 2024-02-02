import React from 'react';

const TextArea = ({ onChange, value }:any) => {
  return (
    <textarea onChange={onChange} value={value} />
  );
};

export default TextArea;