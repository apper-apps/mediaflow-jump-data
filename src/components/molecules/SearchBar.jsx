import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  className = "",
  onClear
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" className="h-5 w-5 text-slate-400" />
      </div>
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-10 pr-10"
      />
      {value && onClear && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-slate-600 transition-colors"
        >
          <ApperIcon name="X" className="h-5 w-5 text-slate-400" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;