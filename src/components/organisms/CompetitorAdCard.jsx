import React, { useState } from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const CompetitorAdCard = ({ ad, onEdit, onDelete, onView }) => {
  const [imageError, setImageError] = useState(false);

  const getChannelColor = (channel) => {
    const colors = {
      "Google Ads": "primary",
      "Meta": "primary",
      "TikTok": "default",
      "LinkedIn": "primary",
      "Twitter": "primary",
      "YouTube": "danger",
      "Snapchat": "warning",
      "Pinterest": "danger"
    };
    return colors[channel] || "default";
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case "video":
        return "Play";
      case "image":
        return "Image";
      case "carousel":
        return "MoreHorizontal";
      case "text":
        return "Type";
      default:
        return "File";
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const renderMediaPreview = () => {
    if (imageError || !ad.mediaUrl) {
      return (
        <div className="w-full h-48 bg-slate-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <ApperIcon name={getFormatIcon(ad.format)} className="w-12 h-12 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500">
              {ad.format === "video" ? "Video Content" : 
               ad.format === "carousel" ? "Carousel Ad" : 
               "Ad Preview"}
            </p>
          </div>
        </div>
      );
    }

    if (ad.format === "video") {
      return (
        <div className="relative w-full h-48 bg-slate-100 rounded-lg overflow-hidden group">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center group-hover:bg-black/80 transition-colors">
              <ApperIcon name="Play" className="w-8 h-8 text-white ml-1" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            Video
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-48 bg-slate-100 rounded-lg overflow-hidden">
        <img
          src={ad.mediaUrl}
          alt={`${ad.brand} ad`}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>
    );
  };

  return (
    <Card hover className="cursor-pointer" onClick={() => onView?.(ad.Id)}>
      <CardContent className="p-0">
        {/* Media Preview */}
        <div className="p-4 pb-0">
          {renderMediaPreview()}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-slate-900">{ad.brand}</h3>
                <Badge variant={getChannelColor(ad.channel)} size="xs">
                  {ad.channel}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" size="xs">
                  {ad.format}
                </Badge>
                <span className="text-xs text-slate-500">
                  {format(new Date(ad.uploadedAt), "MMM d, yyyy")}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(ad.Id);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
              >
                <ApperIcon name="Edit" className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(ad.Id);
                }}
                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tags */}
          {ad.tags && ad.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {ad.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
              {ad.tags.length > 3 && (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                  +{ad.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Insights Preview */}
          {ad.insights && (
            <div className="bg-slate-50 rounded-lg p-3 mb-3">
              <p className="text-sm text-slate-700 line-clamp-2">
                {ad.insights}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center space-x-1">
              <ApperIcon name="User" className="w-3 h-3" />
              <span>Uploaded by {ad.uploadedBy}</span>
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView?.(ad.Id);
              }}
              className="flex items-center space-x-1 hover:text-primary-600 transition-colors"
            >
              <ApperIcon name="Eye" className="w-3 h-3" />
              <span>View Details</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitorAdCard;