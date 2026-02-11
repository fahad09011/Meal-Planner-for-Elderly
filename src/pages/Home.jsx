import React from "react";
import Navbar from "../components/common/Navbar";
import homeImage from "../assets/images/homeScreenMainImage.png";
import "../assets/styles/home.css";
import HomeButton from "../components/common/HomeButton";
import mealButtonIcon from "../../src/assets/images/mealButtonIcon.png";
import careButtonIcon from "../../src/assets/images/careButtonIcon.png";
import profileButtonIcon from "../../src/assets/images/profileButtonIcon.png";
import shoppingButtonIcon from "../../src/assets/images/shoppingButtonIcon.png";

function Home() {
  return (
    <>
      <main className="homeMainContainer">
        <section className="navbarSection">
          <Navbar />
        </section>
        <section className="homeContentSection">
          <div className="homeImgContianer">
            <img src={homeImage} alt="" className="homeImage" />
          </div>
          <div className="homeButtonContainer">
            {/* <div className="parent"> */}
            <a className="div1">
    <HomeButton icon={mealButtonIcon} title={"Create Meal Plan"}/>
            </a>
            <a className="div2"><HomeButton icon={profileButtonIcon} title={"My Profile"}/></a>
            <a className="div3"><HomeButton icon={shoppingButtonIcon} title={"Shopping List"}/></a>
            <a className="div4"><HomeButton icon={careButtonIcon} title={"Care Giver"}/></a>
            {/* </div> */}
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;
