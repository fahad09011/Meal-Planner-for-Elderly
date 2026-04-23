import React, { useRef, useState, useEffect, useCallback } from "react";
import MealCard from "./MealCard";
import "../../assets/styles/horizontalScroll.css";

const CARD_WIDTH = 188;
const CARD_GAP = 12;

function HorizontalScroll({ meals, selectMeal, weeklyPlan, selectedDay, daySelection }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const syncScrollControls = useCallback(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    setCanScrollLeft(scrollContainer.scrollLeft > 8);
    setCanScrollRight(
      scrollContainer.scrollLeft <
        scrollContainer.scrollWidth - scrollContainer.clientWidth - 8,
    );
    setActiveIndex(
      Math.min(
        Math.round(scrollContainer.scrollLeft / (CARD_WIDTH + CARD_GAP)),
        Math.max(0, meals.length - 1),
      ),
    );
  }, [meals.length]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    syncScrollControls();
    scrollContainer.addEventListener("scroll", syncScrollControls, {
      passive: true,
    });
    window.addEventListener("resize", syncScrollControls, { passive: true });
    return () => {
      scrollContainer.removeEventListener("scroll", syncScrollControls);
      window.removeEventListener("resize", syncScrollControls);
    };
  }, [meals, syncScrollControls]);

  function nudgeScroll(directionSign) {
    scrollRef.current?.scrollBy({
      left: directionSign * (CARD_WIDTH + CARD_GAP),
      behavior: "smooth"
    });
  }

  return (
    <div className="position-relative">

      {canScrollLeft &&
      <button
        className="scroll-arrow scroll-arrow--left"
        onClick={() => nudgeScroll(-1)}
        aria-label="Scroll left">
        
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <polyline points="10,3 5,8 10,13" />
          </svg>
        </button>
      }

      {canScrollRight &&
      <button
        className="scroll-arrow scroll-arrow--right"
        onClick={() => nudgeScroll(1)}
        aria-label="Scroll right">
        
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <polyline points="6,3 11,8 6,13" />
          </svg>
        </button>
      }

      <div ref={scrollRef} className="meal-hscroll">
        {meals.map((meal) =>
        <div
          className="meal-hscroll__card"
          key={meal.id ?? meal._id ?? meal.name}>
          
            <MealCard
            meals={meal}
            selectMeal={selectMeal}
            weeklyPlan={weeklyPlan}
            daySelection={daySelection}
            selectedDay={selectedDay} />
          
          </div>
        )}
        <div className="meal-hscroll__spacer" aria-hidden="true" />
      </div>

      {meals.length > 1 &&
      <div className="meal-hscroll__dots" aria-hidden="true">
          {Array.from(
          { length: Math.min(meals.length, 7) },
          (_ignored, dotIndex) =>
          <span
            key={dotIndex}
            className={`meal-hscroll__dot ${
            dotIndex === activeIndex ? "meal-hscroll__dot--active" : ""}`
            } />


        )}
        </div>
      }

    </div>);

}

export default HorizontalScroll;