import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const FilterButton = ({ filters, activeFilters = [], onFilterChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterClick = (filterId) => {
    const newActiveFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(id => id !== filterId)
      : [...activeFilters, filterId];
    
    onFilterChange(newActiveFilters);
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        icon="Filter"
        className="relative"
      >
        Filters
        {activeFilters.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {activeFilters.length}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-white rounded-lg shadow-lg border z-10">
          <div className="p-4">
            <h3 className="text-sm font-medium text-slate-900 mb-3">Filter Options</h3>
            <div className="space-y-3">
              {filters.map((filter) => (
                <div key={filter.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={filter.id}
                    checked={activeFilters.includes(filter.id)}
                    onChange={() => handleFilterClick(filter.id)}
                    className="h-4 w-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor={filter.id} className="ml-3 text-sm text-slate-700">
                    {filter.label}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 pt-3 border-t">
              <button
                onClick={() => onFilterChange([])}
                className="text-sm text-slate-600 hover:text-slate-800"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-primary-600 hover:text-primary-800 font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterButton;