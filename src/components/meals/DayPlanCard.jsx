import React from "react";
import arrow from "../../assets/icons/arrow.png";
import mealImg from "../../assets/images/cereal.jpg";
function DayPlanCard({ weeklyPlan }) {
  function test() {
    console.log(weeklyPlan.Monday);
  }

  return (
    <div>
      {Object.entries(weeklyPlan).map(([day, value]) => (
        <div key={day} className="mainDiv">
          <main className="card mainCard">
            <h2 className="day">{day}</h2>

            <div className="card secondaryCard" style={{ width: "18rem" }}>
              <img
                className="card-img-top"
                src={mealImg}
                alt="Card image cap"
                style={{ height: "10rem" }}
              />
              <div className="card-body">
                <h5 className="card-title">
                  Breakfast: {value.breakfast?.name}
                </h5>
              </div>

              <button className="bt" onClick={test}>
                <img src={arrow} alt="icon" />
              </button>
            </div>

            {/* linch */}
            <div className="card" style={{ width: "18rem" }}>
              {/* <p>Lunch</p> */}
              <img
                className="card-img-top"
                src={mealImg}
                alt="Card image cap"
                style={{ height: "10rem" }}
              />
              <div className="card-body">
                <h5 className="card-title">Lunch: {value.lunch?.name}</h5>
                {/* <p className="card-text">meal description</p> */}
              </div>

              <button className="bt" onClick={test}>
                <img src={arrow} alt="icon" />
              </button>
            </div>
            {/* dinner */}
            <div className="card" style={{ width: "18rem" }}>
              {/* <p>Dinner</p> */}
              <img
                className="card-img-top"
                src={mealImg}
                alt="Card image cap"
                style={{ height: "10rem" }}
              />
              <div className="card-body">
                <h5 className="card-title">Dinner: {value.dinner?.name}</h5>
                {/* <p className="card-text">meal description</p> */}
              </div>

              <button className="bt" onClick={test}>
                <img src={arrow} alt="icon" />
              </button>
            </div>

          </main>
        </div>
      ))}
    </div>
  );
}

export default DayPlanCard;
