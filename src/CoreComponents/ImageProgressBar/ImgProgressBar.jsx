import React, { useState } from "react";
import "./ImgProgressBar.css"

function LoadingBar({ imageUrl, percentage = 0 }) {
  const [width, setWidth] = useState(0);

  if (percentage < 1 && percentage !== 0) percentage = percentage * 100;

  let A = -0.00617143
  let B = 1.51314
  let C = 9.08571

  
  React.useEffect(() => {
    let finalWidth= (A*(percentage*percentage))+(B*percentage)+C
    let fw=percentage

    setWidth(finalWidth);
  }, [percentage]);

  return (
    <div className="progress-bar-container" style={{ width: `${width}%` }}>
      <img
        className="progress-bar-image progress-bar-image-low-opacity"
        src={imageUrl}
        alt="Progress"
      />
      <div
        className="progress-bar"
        style={{ width: `${width}%`, height: "100%" }}
      >
        <img
          className="progress-bar-image progress-bar-image-full-opacity"
          src={imageUrl}
          alt="Progress"
        />
      </div>
    </div>
  );
}

export default LoadingBar;
