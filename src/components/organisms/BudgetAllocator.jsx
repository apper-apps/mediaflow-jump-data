import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import BudgetSlider from "@/components/molecules/BudgetSlider";
import ChannelSelector from "@/components/molecules/ChannelSelector";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const BudgetAllocator = ({ 
  totalBudget = 0, 
  channels = [], 
onChannelsChange,
  className = ""
}) => {
  const [localChannels, setLocalChannels] = useState(channels);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
setLocalChannels(channels);
  }, [channels]);

  const handleChannelAdd = (newChannel) => {
    const updatedChannels = [...localChannels, newChannel];
    setLocalChannels(updatedChannels);
    onChannelsChange(updatedChannels);
    toast.success(`${newChannel.platform} added to budget allocation`);
  };

  const handleChannelRemove = (channelId) => {
    const updatedChannels = localChannels.filter(c => c.id !== channelId);
    // Redistribute budget proportionally
    const remainingChannels = updatedChannels.length;
    if (remainingChannels > 0 && totalBudget > 0) {
      const budgetPerChannel = totalBudget / remainingChannels;
      updatedChannels.forEach(channel => {
        channel.budget = budgetPerChannel;
        channel.percentage = (budgetPerChannel / totalBudget) * 100;
      });
    }
    setLocalChannels(updatedChannels);
    onChannelsChange(updatedChannels);
    toast.info("Channel removed and budget redistributed");
  };

  const handleBudgetChange = (channelId, newBudget, newPercentage) => {
    const updatedChannels = localChannels.map(channel => 
      channel.id === channelId 
        ? { ...channel, budget: newBudget, percentage: newPercentage }
        : channel
    );
    setLocalChannels(updatedChannels);
    onChannelsChange(updatedChannels);
  };

  const totalAllocated = localChannels.reduce((sum, channel) => sum + channel.budget, 0);
  const remainingBudget = totalBudget - totalAllocated;
  const allocationPercentage = totalBudget > 0 ? (totalAllocated / totalBudget) * 100 : 0;

  const distributeEvenly = () => {
    if (localChannels.length === 0 || totalBudget === 0) return;
    
    const budgetPerChannel = totalBudget / localChannels.length;
    const updatedChannels = localChannels.map(channel => ({
      ...channel,
      budget: budgetPerChannel,
      percentage: (budgetPerChannel / totalBudget) * 100
    }));
    setLocalChannels(updatedChannels);
    onChannelsChange(updatedChannels);
    toast.success("Budget distributed evenly across all channels");
  };

  const resetBudget = () => {
    const updatedChannels = localChannels.map(channel => ({
      ...channel,
      budget: 0,
      percentage: 0
    }));
    setLocalChannels(updatedChannels);
    onChannelsChange(updatedChannels);
    toast.info("Budget allocation reset");
  };

  const getChartData = () => {
    return localChannels.map(channel => ({
      name: channel.platform,
      value: channel.budget,
      percentage: channel.percentage
    }));
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="DollarSign" className="w-5 h-5 text-primary-600" />
            <span>Budget Allocation</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChart(!showChart)}
              icon={showChart ? "List" : "PieChart"}
            />
            <ChannelSelector 
              onChannelSelect={handleChannelAdd}
              selectedChannels={localChannels}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Budget Summary */}
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-slate-600">Total Budget</p>
              <p className="text-lg font-bold text-slate-900">
                ${totalBudget.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Allocated</p>
              <p className="text-lg font-bold text-primary-600">
                ${totalAllocated.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Remaining</p>
              <p className={`text-lg font-bold ${remainingBudget < 0 ? 'text-red-600' : 'text-green-600'}`}>
                ${remainingBudget.toLocaleString()}
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-slate-600 mb-1">
              <span>Allocation Progress</span>
              <span>{allocationPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  allocationPercentage <= 100 
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500' 
                    : 'bg-gradient-to-r from-red-500 to-red-600'
                }`}
                style={{ width: `${Math.min(allocationPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Channel Controls */}
        {localChannels.length > 0 && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-600">
              {localChannels.length} channel{localChannels.length !== 1 ? 's' : ''} selected
            </p>
            <div className="space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={distributeEvenly}
                icon="Shuffle"
              >
                Distribute Evenly
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetBudget}
                icon="RotateCcw"
              >
                Reset
              </Button>
            </div>
          </div>
        )}

        {/* Channel List */}
        {localChannels.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Plus" className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600">Add channels to start allocating your budget</p>
          </div>
        ) : (
          <div className="space-y-4">
            {localChannels.map((channel) => (
              <BudgetSlider
                key={channel.id}
                channel={channel}
                budget={channel.budget}
                percentage={channel.percentage}
                totalBudget={totalBudget}
                onChange={handleBudgetChange}
                onRemove={handleChannelRemove}
              />
            ))}
          </div>
        )}

        {/* Warnings */}
        {remainingBudget < 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <ApperIcon name="AlertTriangle" className="w-5 h-5 text-red-500" />
              <p className="text-sm text-red-800">
                Budget exceeded by ${Math.abs(remainingBudget).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetAllocator;