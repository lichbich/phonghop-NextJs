import React from "react";
const Input = ({ value,onChange,type,placeholder,className,style,name,onClick }:any) => {
    return (
        <input type={type} name={name} value={value} onChange={onChange} onClick={onClick} placeholder={placeholder} className={className} style={style}></input>
    );
}
export default Input;