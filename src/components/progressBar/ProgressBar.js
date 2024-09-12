import './progressBar.css';
import React, { useRef, useEffect, useState } from 'react';

const ProgressBar = () => {
  const svgCircleRef = useRef(null);
  const [circumference, setCircumference] = useState(0);
  const [strokeDashoffset, setStrokeDashoffset] = useState(0);
  const [randomValue, setRandomValue] = useState(65); // Initialize with a default value within the range
  const [displayValue, setDisplayValue] = useState(0); // To display the percentage inside the circle
  const animationDuration = 1000; // Duration of the animation in milliseconds
  const animationRef = useRef(null); // Ref to store the animation function
  const progressBarRef = useRef(null); // New ref for visibility tracking

  useEffect(() => {
    if (svgCircleRef.current) {
      const radius = svgCircleRef.current.r.baseVal.value;
      const circleCircumference = 2 * Math.PI * radius;
      setCircumference(circleCircumference);
      setStrokeDashoffset(circleCircumference); // Start from 0

      // Generate a random number between 65 and 95
      const newRandomValue = Math.floor(Math.random() * (95 - 65 + 1)) + 65;
      setRandomValue(newRandomValue);
    }
  }, []);

  useEffect(() => {
    if (svgCircleRef.current) {
      const observer = new IntersectionObserver((entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          // Element is visible, trigger animation
          animationRef.current();
        }
      });
      observer.observe(progressBarRef.current);

      // Create the animation function
      animationRef.current = () => {
        if (circumference > 0 && randomValue >= 65 && randomValue <= 95) {
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
      };

      return () => observer.disconnect(); // Cleanup on unmount
    }
  }, [circumference, randomValue]);

  return (
    <div className="wrapperPB" ref={progressBarRef}>
      <div className="containerPB">
        <div className="foreground-circle">
          <svg width="100" height="100">
            <defs>
              <radialGradient id="myGradient">
                <stop offset="85%" stopColor="cyan" />
                <stop offset="100%" stopColor="#114444" />
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
              strokeLinecap="round"
              style={{
                transition: `stroke-dashoffset ${animationDuration}ms ease`,
                transform: 'rotate(0deg)',
                transformOrigin: '50% 50%',
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







  // const svgCircleRef = useRef(null);
  // const [circumference, setCircumference] = useState(0);
  // const [strokeDashoffset, setStrokeDashoffset] = useState(0);
  // const [randomValue, setRandomValue] = useState(65); // Initialize with a default value within the range
  // const [displayValue, setDisplayValue] = useState(0); // To display the percentage inside the circle
  // const animationDuration = 1000; // Duration of the animation in milliseconds
  // const animationRef = useRef(null); // Ref to store the animation function


  // const progressBarRef = useRef(null); // New ref for visibility tracking

  // useEffect(() => {
  //   if (svgCircleRef.current) {
  //     const radius = svgCircleRef.current.r.baseVal.value;
  //     const circleCircumference = 2 * Math.PI * radius;
  //     setCircumference(circleCircumference);

  //     // Generate a random number between 65 and 95
  //     const newRandomValue = Math.floor(Math.random() * (95 - 65 + 1)) + 65;
  //     setRandomValue(newRandomValue);
  //   }
  // }, []);


  // useEffect(() => {
  //   if (svgCircleRef.current && progressBarRef.current?.offsetWidth > 0) {
  //   if (circumference > 0 && randomValue >= 65 && randomValue <= 95) {
  //     // Calculate strokeDashoffset for the randomValue
  //     const offsetValue = circumference - (randomValue / 100) * circumference;

  //     // Animate the circle's stroke
  //     svgCircleRef.current.animate(
  //       [
  //         // initial value
  //         { strokeDashoffset: circumference },
  //         // final value
  //         { strokeDashoffset: offsetValue }
  //       ],
  //       {
  //         duration: animationDuration,
  //         fill: 'forwards' // Retain final state after animation
  //       }
  //     );

  //     // Update strokeDashoffset for immediate visual change
  //     setStrokeDashoffset(offsetValue);

  //     // Animate the number inside the circle
  //     let counter = 0;
  //     const speed = animationDuration / randomValue;
  //     const intervalId = setInterval(() => {
  //       if (counter >= randomValue) {
  //         clearInterval(intervalId);
  //         setDisplayValue(randomValue);
  //       } else {
  //         counter += 1;
  //         setDisplayValue(counter);
  //       }
  //     }, speed);
  //   }}
  // }, [randomValue, circumference]);