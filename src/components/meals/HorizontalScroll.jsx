import React, { useRef, useState, useEffect } from "react";
import MealCard from "./MealCard";
import "../../assets/styles/horizontalScroll.css";

const CARD_WIDTH = 188;
const CARD_GAP   = 12;

function HorizontalScroll({ meals, selectMeal, weeklyPlan, selectedDay, daySelection }) {
  const scrollRef = useRef(null);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeIndex,    setActiveIndex]    = useState(0);

  function updateState() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    setActiveIndex(
      Math.min(
        Math.round(el.scrollLeft / (CARD_WIDTH + CARD_GAP)),
        meals.length - 1
      )
    );
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateState();
    el.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState, { passive: true });
    return () => {
      el.removeEventListener("scroll", updateState);
      window.removeEventListener("resize", updateState);
    };
  }, [meals]);

  function scrollBy(direction) {
    scrollRef.current?.scrollBy({
      left: direction * (CARD_WIDTH + CARD_GAP),
      behavior: "smooth",
    });
  }

  return (
    <div className="position-relative">

      {canScrollLeft && (
        <button
          className="scroll-arrow scroll-arrow--left"
          onClick={() => scrollBy(-1)}
          aria-label="Scroll left"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <polyline points="10,3 5,8 10,13" />
          </svg>
        </button>
      )}

      {canScrollRight && (
        <button
          className="scroll-arrow scroll-arrow--right"
          onClick={() => scrollBy(1)}
          aria-label="Scroll right"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <polyline points="6,3 11,8 6,13" />
          </svg>
        </button>
      )}

      {/* Scroll row */}
      <div ref={scrollRef} className="meal-hscroll">
        {meals.map((meal) => (
          <div
            className="meal-hscroll__card"
            key={meal.id ?? meal._id ?? meal.name}
          >
            <MealCard
              meals={meal}
              selectMeal={selectMeal}
              weeklyPlan={weeklyPlan}
              daySelection={daySelection}
              selectedDay={selectedDay}
            />
          </div>
        ))}
        <div className="meal-hscroll__spacer" aria-hidden="true" />
      </div>

      {/* Dot indicators */}
      {meals.length > 1 && (
        <div className="meal-hscroll__dots" aria-hidden="true">
          {Array.from({ length: Math.min(meals.length, 7) }).map((_, i) => (
            <span
              key={i}
              className={`meal-hscroll__dot ${
                i === activeIndex ? "meal-hscroll__dot--active" : ""
              }`}
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default HorizontalScroll;