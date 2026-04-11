import React from "react";
import { FiStar } from "react-icons/fi";

const Rating = ({ value, count, size = 16 }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          size={size}
          className={star <= Math.round(value) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
        />
      ))}
      {count !== undefined && <span className="text-sm text-gray-500 ml-1">({count})</span>}
    </div>
  );
};

export default Rating;
