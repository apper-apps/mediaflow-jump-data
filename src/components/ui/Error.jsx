import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry, type = "default" }) => {
  const getErrorContent = () => {
    switch (type) {
      case "network":
        return {
          icon: "WifiOff",
          title: "Connection Error",
          description: "Unable to connect to the server. Please check your internet connection."
        };
      case "notfound":
        return {
          icon: "Search",
          title: "Not Found",
          description: "The resource you're looking for could not be found."
        };
      case "permission":
        return {
          icon: "Lock",
          title: "Access Denied",
          description: "You don't have permission to access this resource."
        };
      default:
        return {
          icon: "AlertTriangle",
          title: "Error",
          description: message
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={errorContent.icon} className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        {errorContent.title}
      </h3>
      <p className="text-slate-600 mb-6 max-w-md">
        {errorContent.description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;