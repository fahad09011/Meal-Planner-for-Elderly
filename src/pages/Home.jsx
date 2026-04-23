import React from "react";
import "../assets/styles/home.css";
import HomeButton from "../components/common/HomeButton";
import mealButtonIcon from "../assets/images/mealButtonIcon.png";
import profileButtonIcon from "../assets/images/profileButtonIcon.png";
import shoppingButtonIcon from "../assets/images/shoppingButtonIcon.png";
import { NavLink } from "react-router-dom";
import { BiBookOpen, BiLinkExternal } from "react-icons/bi";
import {
  USER_RESOURCES_DOC_URL,
  USER_GUIDE_LINK_TEXT,
  USER_GUIDE_LINK_ARIA_LABEL
} from "../constants/externalLinks";

const NAV_BUTTONS = [
{ to: "/mealPlan", icon: mealButtonIcon, title: "Create meal plan", cls: "div1" },
{ to: "/profile", icon: profileButtonIcon, title: "My profile", cls: "div2" },
{ to: "/shopping", icon: shoppingButtonIcon, title: "Shopping list", cls: "div3" }];


function Home() {
  return (
    <main className="homeMainContainer" aria-label="Home — choose where to go">
      <header className="homeHero">
        <p className="homeHero__eyebrow">MealCare</p>
        <h1 className="homeHero__title">Eating well at home, one week at a time</h1>
        <p className="homeHero__lede">
          Plan balanced meals around your health needs, see your full week in one place, and turn it
          into a clear shopping list — for you or with someone who helps you care.
        </p>
      </header>

      <div className="homeButtonContainer" role="navigation" aria-label="Main shortcuts">
        {NAV_BUTTONS.map(({ to, icon, title, cls }) =>
        <NavLink key={to} to={to} className={`homeNavLink ${cls}`} aria-label={title}>
            <HomeButton icon={icon} title={title} />
          </NavLink>
        )}
        <a
          className="homeNavLink homeNavLink--external div4"
          href={USER_RESOURCES_DOC_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={USER_GUIDE_LINK_ARIA_LABEL}>
          <div className="HomeButton HomeButton--guide">
            <BiBookOpen className="homeGuideBookIcon" aria-hidden="true" focusable="false" />
            <span className="homeButtonTitle homeButtonTitle--wrap">{USER_GUIDE_LINK_TEXT}</span>
            <BiLinkExternal className="homeGuideExtIcon" aria-hidden="true" focusable="false" />
          </div>
        </a>
      </div>
    </main>);

}

export default Home;