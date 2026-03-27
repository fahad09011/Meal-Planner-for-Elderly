import React from "react";
import "../assets/styles/home.css";
import HomeButton from "../components/common/HomeButton";
import mealButtonIcon     from "../assets/images/mealButtonIcon.png";
import careButtonIcon     from "../assets/images/careButtonIcon.png";
import profileButtonIcon  from "../assets/images/profileButtonIcon.png";
import shoppingButtonIcon from "../assets/images/shoppingButtonIcon.png";
import { NavLink } from "react-router-dom";

const NAV_BUTTONS = [
  { to: "/mealPlan", icon: mealButtonIcon, title: "Create meal plan", cls: "div1" },
  { to: "/profile", icon: profileButtonIcon, title: "My profile", cls: "div2" },
  { to: "/shopping", icon: shoppingButtonIcon, title: "Shopping list", cls: "div3" },
  { to: "/viewPlan", icon: careButtonIcon, title: "View weekly plan", cls: "div4" },
];

function Home() {
  return (
    <main
      className="homeMainContainer"
      aria-label="Home — choose where to go"
    >
      <div className="homeButtonContainer" role="navigation" aria-label="Main shortcuts">
        {NAV_BUTTONS.map(({ to, icon, title, cls }) => (
          <NavLink key={to} to={to} className={`homeNavLink ${cls}`} aria-label={title}>
            <HomeButton icon={icon} title={title} />
          </NavLink>
        ))}
      </div>
    </main>
  );
}

export default Home;