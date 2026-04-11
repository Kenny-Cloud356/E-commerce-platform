import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({ onSearch, placeholder = "Search...", initialValue = "" }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => { onSearch(value); }, 400);
    return () => clearTimeout(timer);
  }, [value, onSearch]);

  return (
    <div className="relative">
      <FiSearch className="absolute left-3 top-3 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
    </div>
  );
};

export default SearchBar;
