import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ChannelSelector = ({ onChannelSelect, selectedChannels = [], className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const availableChannels = [
    { id: "google-ads", platform: "Google Ads", icon: "Search" },
    { id: "meta", platform: "Meta", icon: "Facebook" },
    { id: "tiktok", platform: "TikTok", icon: "Music" },
    { id: "linkedin", platform: "LinkedIn", icon: "Linkedin" },
    { id: "twitter", platform: "Twitter", icon: "Twitter" },
    { id: "youtube", platform: "YouTube", icon: "Youtube" },
    { id: "snapchat", platform: "Snapchat", icon: "Camera" },
    { id: "pinterest", platform: "Pinterest", icon: "Heart" }
  ];

  const unselectedChannels = availableChannels.filter(
    channel => !selectedChannels.some(selected => selected.id === channel.id)
  );

  const handleChannelClick = (channel) => {
    onChannelSelect({
      ...channel,
      budget: 0,
      percentage: 0,
      targeting: {},
      notes: ""
    });
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        icon="Plus"
        disabled={unselectedChannels.length === 0}
      >
        Add Channel
      </Button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-white rounded-lg shadow-lg border z-10">
          <div className="p-4">
            <h3 className="text-sm font-medium text-slate-900 mb-3">Select Channel</h3>
            <div className="space-y-2">
              {unselectedChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => handleChannelClick(channel)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left"
                >
                  <ApperIcon name={channel.icon} className="w-5 h-5 text-slate-600" />
                  <span className="text-sm font-medium text-slate-900">
                    {channel.platform}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-4 pt-3 border-t">
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelSelector;