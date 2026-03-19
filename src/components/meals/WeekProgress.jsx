import React from "react";
import ProgressBar from "@ramonak/react-progress-bar";

function WeekProgress({ completedDay }) {
  const progress = Math.round((completedDay / 7) * 100);

  return (
    <section className="progressBarSection">
      <ProgressBar
        bgColor="#678B7A"
        height="40px"
        completed={progress}
        labelAlignment="center"
        customLabel={`${completedDay}/7 completed`}
        maxCompleted={100}
      />
    </section>
  );
}

export default WeekProgress;