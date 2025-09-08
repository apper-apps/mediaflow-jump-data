import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const MediaPlanCard = ({ plan, onEdit, onDelete, onDuplicate }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "draft":
        return "warning";
      case "completed":
        return "default";
      case "paused":
        return "outline";
      default:
        return "default";
    }
  };

  const getChannelColor = (platform) => {
    const colors = {
      "Google Ads": "text-blue-600 bg-blue-100",
      "Meta": "text-blue-700 bg-blue-100",
      "TikTok": "text-slate-800 bg-slate-100",
      "LinkedIn": "text-blue-800 bg-blue-100",
      "Twitter": "text-blue-500 bg-blue-100",
      "YouTube": "text-red-600 bg-red-100",
      "Snapchat": "text-yellow-800 bg-yellow-100",
      "Pinterest": "text-red-700 bg-red-100"
    };
    return colors[platform] || "text-slate-600 bg-slate-100";
  };

  const totalBudget = plan.channels?.reduce((sum, channel) => sum + (channel.budget || 0), 0) || 0;
  const channelCount = plan.channels?.length || 0;
  const audienceCount = plan.audiences?.length || 0;

  return (
    <Card hover className="cursor-pointer" onClick={() => navigate(`/plans/${plan.Id}`)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
              <Badge variant={getStatusColor(plan.status)}>
                {plan.status}
              </Badge>
            </div>
            <p className="text-sm text-slate-600 mb-3">{plan.objective}</p>
            <div className="flex items-center space-x-4 text-sm text-slate-500">
              <span className="flex items-center space-x-1">
                <ApperIcon name="Calendar" className="w-4 h-4" />
                <span>{format(new Date(plan.startDate), "MMM d")} - {format(new Date(plan.endDate), "MMM d")}</span>
              </span>
              <span className="flex items-center space-x-1">
                <ApperIcon name="DollarSign" className="w-4 h-4" />
                <span>${totalBudget.toLocaleString()}</span>
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(plan.Id);
              }}
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
            >
              <ApperIcon name="Edit" className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate?.(plan.Id);
              }}
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
            >
              <ApperIcon name="Copy" className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(plan.Id);
              }}
              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Channels */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Channels</span>
            <span className="text-sm text-slate-500">{channelCount} selected</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {plan.channels?.slice(0, 4).map((channel) => (
              <div
                key={channel.id}
                className={`px-2 py-1 rounded-md text-xs font-medium ${getChannelColor(channel.platform)}`}
              >
                {channel.platform}
              </div>
            ))}
            {channelCount > 4 && (
              <div className="px-2 py-1 rounded-md text-xs font-medium text-slate-600 bg-slate-100">
                +{channelCount - 4} more
              </div>
            )}
          </div>
        </div>

        {/* Audiences */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Audiences</span>
            <span className="text-sm text-slate-500">{audienceCount} defined</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {plan.audiences?.slice(0, 3).map((audienceId) => (
              <div
                key={audienceId}
                className="px-2 py-1 bg-primary-100 text-primary-800 rounded-md text-xs font-medium"
              >
                Audience #{audienceId}
              </div>
            ))}
            {audienceCount > 3 && (
              <div className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                +{audienceCount - 3} more
              </div>
            )}
          </div>
        </div>

        {/* Collaborators */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-slate-700">Team</span>
            <div className="flex -space-x-1">
              {plan.collaborators?.slice(0, 3).map((collaborator, index) => (
                <div
                  key={index}
                  className="w-6 h-6 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white"
                  title={collaborator}
                >
                  {collaborator.charAt(0).toUpperCase()}
                </div>
              ))}
              {plan.collaborators && plan.collaborators.length > 3 && (
                <div className="w-6 h-6 bg-slate-300 rounded-full flex items-center justify-center text-slate-600 text-xs font-semibold border-2 border-white">
                  +{plan.collaborators.length - 3}
                </div>
              )}
            </div>
          </div>
          
          <div className="text-xs text-slate-500">
            Updated {format(new Date(plan.updatedAt), "MMM d")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaPlanCard;