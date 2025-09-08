import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ type = "default", onAction, actionLabel, title, description }) => {
  const getEmptyContent = () => {
    switch (type) {
      case "plans":
        return {
          icon: "FileText",
          title: title || "No Media Plans Yet",
          description: description || "Create your first media plan to start organizing your marketing campaigns.",
          actionLabel: actionLabel || "Create Media Plan",
          actionIcon: "Plus"
        };
      case "audiences":
        return {
          icon: "Users",
          title: title || "No Audiences Defined",
          description: description || "Build your first audience profile to start targeting your campaigns effectively.",
          actionLabel: actionLabel || "Create Audience",
          actionIcon: "Plus"
        };
      case "competitors":
        return {
          icon: "Eye",
          title: title || "No Competitor Ads Saved",
          description: description || "Upload competitor ads to build your research library and gain competitive insights.",
          actionLabel: actionLabel || "Upload Ad",
          actionIcon: "Upload"
        };
      case "search":
        return {
          icon: "Search",
          title: title || "No Results Found",
          description: description || "Try adjusting your search criteria or filters to find what you're looking for.",
          actionLabel: actionLabel || "Clear Filters",
          actionIcon: "X"
        };
      case "reports":
        return {
          icon: "BarChart",
          title: title || "No Reports Available",
          description: description || "Create media plans to generate performance reports and insights.",
          actionLabel: actionLabel || "View Plans",
          actionIcon: "ArrowRight"
        };
      default:
        return {
          icon: "Inbox",
          title: title || "Nothing Here Yet",
          description: description || "Get started by creating your first item.",
          actionLabel: actionLabel || "Get Started",
          actionIcon: "Plus"
        };
    }
  };

  const emptyContent = getEmptyContent();

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={emptyContent.icon} className="w-10 h-10 text-primary-500" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        {emptyContent.title}
      </h3>
      <p className="text-slate-600 mb-8 max-w-md">
        {emptyContent.description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name={emptyContent.actionIcon} className="w-5 h-5 mr-2" />
          {emptyContent.actionLabel}
        </button>
      )}
    </div>
  );
};

export default Empty;