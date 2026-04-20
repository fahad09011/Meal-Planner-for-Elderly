import React from "react";

function HomeButton({ icon, title }) {
  return (
    <div className="HomeButton">
      <img src={icon} alt={title} className="buttonIcon" />
      <span className="homeButtonTitle">{title}</span>
    </div>);

}

export default HomeButton;