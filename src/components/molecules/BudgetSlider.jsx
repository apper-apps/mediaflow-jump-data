import React from "react";
import ApperIcon from "@/components/ApperIcon";

const BudgetSlider = ({ 
  channel, 
  budget, 
  percentage, 
  totalBudget,
  onChange, 
  onRemove,
  className = "" 
}) => {
  const handleBudgetChange = (e) => {
    const newBudget = parseFloat(e.target.value) || 0;
    const newPercentage = totalBudget > 0 ? (newBudget / totalBudget) * 100 : 0;
    onChange(channel.id, newBudget, newPercentage);
  };

  const handlePercentageChange = (e) => {
    const newPercentage = parseFloat(e.target.value) || 0;
    const newBudget = (newPercentage / 100) * totalBudget;
    onChange(channel.id, newBudget, newPercentage);
  };

  const getChannelColor = (platform) => {
    const colors = {
      "Google Ads": "bg-blue-500",
      "Meta": "bg-blue-600", 
      "TikTok": "bg-black",
      "LinkedIn": "bg-blue-700",
      "Twitter": "bg-blue-400",
      "YouTube": "bg-red-600",
      "Snapchat": "bg-yellow-400",
      "Pinterest": "bg-red-500"
    };
    return colors[platform] || "bg-slate-500";
  };

  return (
    <div className={`bg-white rounded-lg border p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${getChannelColor(channel.platform)}`}></div>
          <span className="font-medium text-slate-900">{channel.platform}</span>
        </div>
        <button
          onClick={() => onRemove(channel.id)}
          className="text-slate-400 hover:text-red-500 transition-colors"
        >
          <ApperIcon name="X" className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Budget ($)
          </label>
          <input
            type="number"
            value={budget}
            onChange={handleBudgetChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-sm"
            min="0"
            step="100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Percentage (%)
          </label>
          <input
            type="number"
            value={percentage.toFixed(1)}
            onChange={handlePercentageChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-sm"
            min="0"
            max="100"
            step="0.1"
          />
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-sm text-slate-600 mb-1">
          <span>0%</span>
          <span>100%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={percentage}
          onChange={handlePercentageChange}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #5B47E0 0%, #5B47E0 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`
          }}
        />
      </div>
      
      {channel.notes && (
        <div className="mt-3 p-3 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600">{channel.notes}</p>
        </div>
      )}
    </div>
  );
};

export default BudgetSlider;