import React from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "../../assets/styles/popup.css";

function PopUp() {
  return (
    <Popup trigger={<button> Trigger</button>} position="right center">
      <div>Weekly plan is Done!</div>
    </Popup>
  );
}

export default PopUp;