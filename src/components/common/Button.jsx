import React from 'react'
import "../../assets/styles/button.css";
function Button({
    children,
    onClick,
    type,
    className,
    disabled = false,
}) {
    const buttonBaseClass = "button";
  return (
    <>
    <div>
    
<button type={type}
        onClick={onClick}
        className={` ${buttonBaseClass} ${className}`}
        
        
        >{children}</button>

    </div>
    </>
  )
}

export default Button
