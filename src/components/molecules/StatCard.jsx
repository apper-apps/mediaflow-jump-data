import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = "neutral",
  icon,
  gradient = false,
  className = ""
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      default:
        return "text-slate-600";
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case "positive":
        return "TrendingUp";
      case "negative":
        return "TrendingDown";
      default:
        return "Minus";
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>
            <p className={`text-2xl font-bold ${gradient ? "gradient-text" : "text-slate-900"}`}>
              {value}
            </p>
            {change && (
              <div className={`flex items-center mt-2 text-sm ${getChangeColor()}`}>
                <ApperIcon name={getChangeIcon()} className="w-4 h-4 mr-1" />
                <span>{change}</span>
              </div>
            )}
          </div>
          {icon && (
            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center">
              <ApperIcon name={icon} className="w-6 h-6 text-primary-600" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;