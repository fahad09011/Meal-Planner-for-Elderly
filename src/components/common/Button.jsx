import React from 'react'
import "../../assets/styles/button.css";
function Button({
    children,
    onClick,
    type,
    className,
    disabled ,
}) {
    const buttonBaseClass = "button";
  return (
    <>
    <div>
    
<button type={type}
        onClick={onClick}
        className={` ${buttonBaseClass} ${className}`}
        
        disabled={disabled}
        >{children}</button>

    </div>
    </>
  )
}

export default Button
