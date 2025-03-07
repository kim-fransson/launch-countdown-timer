/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useEffect, memo } from "react";
import { formatDigit, getTimeDifference } from "../utils";

import "./FlipCountdown.css";
import { addDays } from "date-fns";
import { useLocalStorage } from "@uidotdev/usehooks";

const FlipCard = ({ animation, digit }) => {
  return (
    <div className={`flipCard ${animation}`}>
      <span>{digit}</span>
    </div>
  );
};

const StaticCard = ({ position, digit, animation, ref }) => {
  return (
    <div ref={ref} className={`${position} ${animation}`}>
      <span>{digit}</span>
    </div>
  );
};

const FlipCardContainer = ({ digit, max, shuffle, label }) => {
  let currentDigit = digit;
  let previousDigit = (currentDigit + 1) % max;

  // shuffle digits
  const digit1 = shuffle ? previousDigit : currentDigit;
  const digit2 = !shuffle ? previousDigit : currentDigit;

  // shuffle animations
  const animation1 = shuffle ? "fold" : "unfold";
  const animation2 = !shuffle ? "fold" : "unfold";

  const lowerCardRef = useRef(null);
  const flipCardRef = useRef(null);

  useEffect(() => {
    if (flipCardRef.current) {
      flipCardRef.current.classList.remove("delimiter");
      // Force reflow to restart animation, feels hacky/dirty
      void flipCardRef.current.offsetWidth;
      flipCardRef.current.classList.add("delimiter");
    }

    if (lowerCardRef.current) {
      lowerCardRef.current.classList.remove("shadow");
      // Force reflow to restart animation, feels hacky/dirty
      void lowerCardRef.current.offsetWidth;
      lowerCardRef.current.classList.add("shadow");
    }
  }, [shuffle]);

  return (
    <div>
      <div ref={flipCardRef} className="flipCardContainer">
        <StaticCard position="upperCard" digit={formatDigit(currentDigit)} />
        <StaticCard
          ref={lowerCardRef}
          position="lowerCard"
          digit={formatDigit(previousDigit)}
        />

        <FlipCard digit={formatDigit(digit1)} animation={animation1} />
        <FlipCard digit={formatDigit(digit2)} animation={animation2} />
      </div>
      <span className="flipCardContainer__label">{label}</span>
    </div>
  );
};

const FlipCountdown = memo(() => {
  const [targetDate, setTargetDate] = useLocalStorage(
    "targetDate",
    new Date("Mars 16, 2025 13:34:30")
  );

  const [time, setTime] = useState({
    ...getTimeDifference(targetDate),
    daysShuffle: true,
    hoursShuffle: true,
    minutesShuffle: true,
    secondsShuffle: true,
  });

  useEffect(() => {
    const timerID = setInterval(() => {
      setTime((prevTime) => {
        const newTime = getTimeDifference(targetDate);

        if (
          newTime.days <= 0 &&
          newTime.hours <= 0 &&
          newTime.minutes <= 0 &&
          newTime.seconds <= 0
        ) {
          setTargetDate(addDays(new Date(), 30));
        }

        return {
          ...newTime,
          daysShuffle:
            newTime.days >= 0 && newTime.days !== prevTime.days
              ? !prevTime.daysShuffle
              : prevTime.daysShuffle,

          // Toggle hoursShuffle if hours changed and (hours > 0 or days > 0)
          hoursShuffle:
            (newTime.hours >= 0 || newTime.days > 0) &&
            newTime.hours !== prevTime.hours
              ? !prevTime.hoursShuffle
              : prevTime.hoursShuffle,

          // Toggle minutesShuffle if minutes changed and (minutes > 0 or hours > 0 or days > 0)
          minutesShuffle:
            (newTime.minutes >= 0 || newTime.hours > 0 || newTime.days > 0) &&
            newTime.minutes !== prevTime.minutes
              ? !prevTime.minutesShuffle
              : prevTime.minutesShuffle,

          // Toggle secondsShuffle if seconds changed and (seconds > 0 or minutes > 0 or hours > 0 or days > 0)
          secondsShuffle:
            (newTime.seconds >= 0 ||
              newTime.minutes > 0 ||
              newTime.hours > 0 ||
              newTime.days > 0) &&
            newTime.seconds !== prevTime.seconds
              ? !prevTime.secondsShuffle
              : prevTime.secondsShuffle,
        };
      });
    }, 1000);

    return () => clearInterval(timerID);
  }, [targetDate]);

  return (
    <div className="flipCountdown">
      <span
        aria-label={`${time.days} days, ${time.hours} hours and ${
          time.minutes + 1
        } minutes left until launch`}
        aria-live="polite"
        className="sr-only"
      ></span>
      <FlipCardContainer
        max="99"
        digit={time.days}
        shuffle={time.daysShuffle}
        label="days"
      />
      <FlipCardContainer
        max={24}
        digit={time.hours}
        shuffle={time.hoursShuffle}
        label="hours"
      />
      <FlipCardContainer
        max={60}
        digit={time.minutes}
        shuffle={time.minutesShuffle}
        label="minutes"
      />
      <FlipCardContainer
        max={60}
        digit={time.seconds}
        shuffle={time.secondsShuffle}
        label="seconds"
      />
    </div>
  );
});

export default FlipCountdown;
