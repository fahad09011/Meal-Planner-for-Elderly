import React from 'react'

function HomeButton(props) {
  return (
    <>
      <div className='HomeButton'>
    <div className="buttonIconContainer">
        <img src={props.icon} alt="" className="buttonIcon" />
    </div>
    <div className="buttonTextContainer">
        <h4>{props.title}</h4>
        {/* <p>just create now!</p> */}
    </div>
      </div>
    </>
  )
}

export default HomeButton
