import React, { useState, useEffect } from "react";

const PriceRangeSlider = ({
  defaultValues = [20, 500],
  onChange,
  min = 0,
  max = 1000,
}) => {
  const [values, setValues] = useState(defaultValues);

  // Initialize slider on mount with default values
  useEffect(() => {
    setValues(defaultValues);
  }, [defaultValues]);

  const handleChange = (e, index) => {
    const newValue = parseInt(e.target.value);
    const newValues = [...values];

    // Prevent min from exceeding max
    if (index === 0 && newValue > values[1]) {
      return;
    }

    // Prevent max from being less than min
    if (index === 1 && newValue < values[0]) {
      return;
    }

    newValues[index] = newValue;
    setValues(newValues);

    // Call the onChange prop with updated values
    if (onChange) {
      onChange(newValues);
    }
  };

  const calculateLeft = (value) => {
    return ((value - min) / (max - min)) * 100;
  };

  return (
    <div className="relative mt-5 mb-8">
      <div className="h-2 bg-gray-200 rounded-full">
        <div
          className="absolute h-2 bg-primary rounded-full"
          style={{
            left: `${calculateLeft(values[0])}%`,
            width: `${calculateLeft(values[1]) - calculateLeft(values[0])}%`,
          }}
        ></div>
      </div>

      {/* Min thumb */}
      <input
        type="range"
        min={min}
        max={max}
        value={values[0]}
        onChange={(e) => handleChange(e, 0)}
        className="absolute w-full h-2 opacity-0 cursor-pointer"
      />

      {/* Max thumb */}
      <input
        type="range"
        min={min}
        max={max}
        value={values[1]}
        onChange={(e) => handleChange(e, 1)}
        className="absolute w-full h-2 opacity-0 cursor-pointer"
      />

      {/* Thumb indicators */}
      <div
        className="absolute w-4 h-4 bg-primary rounded-full border-2 border-white -mt-1 transform -translate-x-1/2"
        style={{ left: `${calculateLeft(values[0])}%` }}
      ></div>
      <div
        className="absolute w-4 h-4 bg-primary rounded-full border-2 border-white -mt-1 transform -translate-x-1/2"
        style={{ left: `${calculateLeft(values[1])}%` }}
      ></div>
    </div>
  );
};

export default PriceRangeSlider;
