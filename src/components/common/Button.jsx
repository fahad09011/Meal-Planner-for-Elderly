import React from 'react';
import "../../assets/styles/button.css";
function Button({
  children,
  onClick,
  type,
  className,
  disabled
}) {
  const buttonBaseClass = "button";
  return (
    <>
 
    
<button type={type}
      onClick={onClick}
      className={` ${buttonBaseClass} ${className}`}

      disabled={disabled}>
        {children}</button>

    
    </>);

}

export default Button;