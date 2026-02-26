import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import "../../assets/styles/popup.css";
export default () => (
  <Popup trigger={<button> Trigger</button>} position="right center">
    <div>Weekly plan is Done!</div>
  </Popup>
);