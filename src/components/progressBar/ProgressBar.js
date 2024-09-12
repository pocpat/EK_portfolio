import './progressBar.css';

import React, { useRef, useEffect, useState } from 'react';

const ProgressBar = () => {
  const svgCircleRef = useRef(null);
  const [circumference, setCircumference] = useState(0);
  const [strokeDashoffset, setStrokeDashoffset] = useState(0);
  const [randomValue, setRandomValue] = useState(84); // Initialize with a default value within the range
  const [displayValue, setDisplayValue] = useState(0); // To display the percentage inside the circle
  const animationDuration = 1000; // Duration of the animation in milliseconds

  useEffect(() => {
    if (svgCircleRef.current) {
      const radius = svgCircleRef.current.r.baseVal.value;
      const circleCircumference = 2 * Math.PI * radius;
      setCircumference(circleCircumference);

      // Generate a random number between 84 and 99
      const newRandomValue = Math.floor(Math.random() * (99 - 84 + 1)) + 84;
      setRandomValue(newRandomValue);
    }
  }, []);

  useEffect(() => {
    if (circumference > 0 && randomValue >= 84 && randomValue <= 99) {
      // Calculate strokeDashoffset for the randomValue
      const offsetValue = circumference - (randomValue / 100) * circumference;

      // Animate the circle's stroke
      svgCircleRef.current.animate(
        [
          // initial value
          { strokeDashoffset: circumference },
          // final value
          { strokeDashoffset: offsetValue }
        ],
        {
          duration: animationDuration,
          fill: 'forwards' // Retain final state after animation
        }
      );

      // Update strokeDashoffset for immediate visual change
      setStrokeDashoffset(offsetValue);

      // Animate the number inside the circle
      let counter = 0;
      const speed = animationDuration / randomValue;
      const intervalId = setInterval(() => {
        if (counter >= randomValue) {
          clearInterval(intervalId);
          setDisplayValue(randomValue);
        } else {
          counter += 1;
          setDisplayValue(counter);
        }
      }, speed);
    }
  }, [randomValue, circumference]);

  return (
    <div className="wrapperPB">
      <div className="containerPB">
        <div className="foreground-circle">
          <svg width="100" height="100">
          <defs>
          <radialGradient id="myGradient">
          <stop offset="85%" stop-color="cyan" />
          <stop offset="100%" stop-color="#114444" />
        </radialGradient>
        </defs>



            <circle
              ref={svgCircleRef}
              cx="50"
              cy="50"
              r="45"
              stroke="url(#myGradient)"
              strokeWidth="15"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              stroke-linecap="round"
              style={{
                transition: `stroke-dashoffset ${animationDuration}ms ease`,
              }}
            />
          </svg>
          {/* Display the percentage number inside the circle */}
          <div className="number-inside-circle">{displayValue}%</div>
        </div>
      </div>

    </div>
  );
};

export default ProgressBar;
