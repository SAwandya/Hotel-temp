import React, { useState, useEffect } from "react";

const PriceRangeSlider = ({
  defaultValues = [20, 100],
  onChange,
  min = 20,
  max = 500,
}) => {
  const [values, setValues] = useState(defaultValues);
  const [dragging, setDragging] = useState(null); // 'min', 'max', or null

  // Calculate the percentage position for the thumbs
  const getThumbPosition = (value) => {
    return ((value - min) / (max - min)) * 100;
  };

  const handleMouseDown = (e, type) => {
    e.preventDefault();
    setDragging(type);
  };

  const handleTouchStart = (e, type) => {
    setDragging(type);
  };

  const handleChange = (e, type) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;

    // Calculate the new value based on the mouse/touch position
    let percentage = (clientX - rect.left) / rect.width;
    percentage = Math.max(0, Math.min(percentage, 1));

    const newValue = Math.round(min + percentage * (max - min));

    // Update the appropriate value (min or max)
    let newValues = [...values];

    if (type === "min") {
      newValues[0] = Math.min(newValue, values[1] - 10); // Ensure min doesn't exceed max - 10
    } else {
      newValues[1] = Math.max(newValue, values[0] + 10); // Ensure max doesn't go below min + 10
    }

    setValues(newValues);

    // Call the onChange callback
    if (onChange) {
      onChange(newValues);
    }
  };

  // Add event listeners for mouse/touch events
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return;
      handleChange(e, dragging);
    };

    const handleMouseUp = () => {
      setDragging(null);
    };

    const handleTouchMove = (e) => {
      if (!dragging) return;
      handleChange(e, dragging);
    };

    const handleTouchEnd = () => {
      setDragging(null);
    };

    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [dragging, values]);

  // Reset slider values if defaultValues changes
  useEffect(() => {
    setValues(defaultValues);
  }, [defaultValues]);

  return (
    <div className="relative h-9 w-full">
      {/* Track background */}
      <div className="absolute h-2 w-full top-3 bg-gray-200 rounded-full"></div>

      {/* Active track */}
      <div
        className="absolute h-2 top-3 bg-primary rounded-full"
        style={{
          left: `${getThumbPosition(values[0])}%`,
          width: `${
            getThumbPosition(values[1]) - getThumbPosition(values[0])
          }%`,
        }}
      ></div>

      {/* Min thumb */}
      <div
        className={`absolute h-6 w-6 top-1 -ml-3 bg-white rounded-full shadow cursor-pointer flex items-center justify-center ${
          dragging === "min" ? "ring-2 ring-primary" : ""
        }`}
        style={{ left: `${getThumbPosition(values[0])}%` }}
        onMouseDown={(e) => handleMouseDown(e, "min")}
        onTouchStart={(e) => handleTouchStart(e, "min")}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={values[1]}
        aria-valuenow={values[0]}
        tabIndex={0}
      >
        <div className="h-2 w-2 bg-primary rounded-full"></div>
      </div>

      {/* Max thumb */}
      <div
        className={`absolute h-6 w-6 top-1 -ml-3 bg-white rounded-full shadow cursor-pointer flex items-center justify-center ${
          dragging === "max" ? "ring-2 ring-primary" : ""
        }`}
        style={{ left: `${getThumbPosition(values[1])}%` }}
        onMouseDown={(e) => handleMouseDown(e, "max")}
        onTouchStart={(e) => handleTouchStart(e, "max")}
        role="slider"
        aria-valuemin={values[0]}
        aria-valuemax={max}
        aria-valuenow={values[1]}
        tabIndex={0}
      >
        <div className="h-2 w-2 bg-primary rounded-full"></div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
