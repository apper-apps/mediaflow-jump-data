import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const AudienceBuilder = ({ audience, onChange, className = "" }) => {
  const [localAudience, setLocalAudience] = useState({
    name: "",
    demographics: {
      ageRange: "",
      gender: "",
      location: "",
      income: "",
      education: ""
    },
    interests: [],
    behaviors: [],
    channelMapping: {},
    estimatedReach: 0,
    ...audience
  });

  const [newInterest, setNewInterest] = useState("");
  const [newBehavior, setNewBehavior] = useState("");

  useEffect(() => {
    onChange(localAudience);
  }, [localAudience, onChange]);

  const handleDemographicChange = (field, value) => {
    setLocalAudience(prev => ({
      ...prev,
      demographics: {
        ...prev.demographics,
        [field]: value
      }
    }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !localAudience.interests.includes(newInterest.trim())) {
      setLocalAudience(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest("");
    }
  };

  const removeInterest = (interest) => {
    setLocalAudience(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const addBehavior = () => {
    if (newBehavior.trim() && !localAudience.behaviors.includes(newBehavior.trim())) {
      setLocalAudience(prev => ({
        ...prev,
        behaviors: [...prev.behaviors, newBehavior.trim()]
      }));
      setNewBehavior("");
    }
  };

  const removeBehavior = (behavior) => {
    setLocalAudience(prev => ({
      ...prev,
      behaviors: prev.behaviors.filter(b => b !== behavior)
    }));
  };

  const ageRangeOptions = [
    { value: "18-24", label: "18-24" },
    { value: "25-34", label: "25-34" },
    { value: "35-44", label: "35-44" },
    { value: "45-54", label: "45-54" },
    { value: "55-64", label: "55-64" },
    { value: "65+", label: "65+" }
  ];

  const genderOptions = [
    { value: "all", label: "All Genders" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" }
  ];

  const incomeOptions = [
    { value: "low", label: "Under $50K" },
    { value: "middle", label: "$50K - $100K" },
    { value: "high", label: "$100K - $200K" },
    { value: "premium", label: "$200K+" }
  ];

  const educationOptions = [
    { value: "highschool", label: "High School" },
    { value: "college", label: "College" },
    { value: "graduate", label: "Graduate Degree" },
    { value: "postgrad", label: "Post-Graduate" }
  ];

  const estimateReach = () => {
    // Simple reach estimation based on criteria
    let baseReach = 1000000;
    if (localAudience.demographics.ageRange) baseReach *= 0.7;
    if (localAudience.demographics.gender !== "all") baseReach *= 0.5;
    if (localAudience.demographics.location) baseReach *= 0.3;
    if (localAudience.interests.length > 0) baseReach *= Math.max(0.1, 1 - (localAudience.interests.length * 0.1));
    if (localAudience.behaviors.length > 0) baseReach *= Math.max(0.1, 1 - (localAudience.behaviors.length * 0.1));
    
    const estimatedReach = Math.max(10000, Math.floor(baseReach));
    setLocalAudience(prev => ({
      ...prev,
      estimatedReach
    }));
  };

  useEffect(() => {
    estimateReach();
  }, [localAudience.demographics, localAudience.interests, localAudience.behaviors]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ApperIcon name="Users" className="w-5 h-5 text-primary-600" />
          <span>Audience Builder</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div>
          <Input
            label="Audience Name"
            value={localAudience.name}
            onChange={(e) => setLocalAudience(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Tech-Savvy Millennials"
            required
          />
        </div>

        {/* Demographics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Demographics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Age Range"
              value={localAudience.demographics.ageRange}
              onChange={(e) => handleDemographicChange("ageRange", e.target.value)}
              options={ageRangeOptions}
              placeholder="Select age range"
            />
            
            <Select
              label="Gender"
              value={localAudience.demographics.gender}
              onChange={(e) => handleDemographicChange("gender", e.target.value)}
              options={genderOptions}
              placeholder="Select gender"
            />
            
            <Input
              label="Location"
              value={localAudience.demographics.location}
              onChange={(e) => handleDemographicChange("location", e.target.value)}
              placeholder="e.g., United States, California"
            />
            
            <Select
              label="Household Income"
              value={localAudience.demographics.income}
              onChange={(e) => handleDemographicChange("income", e.target.value)}
              options={incomeOptions}
              placeholder="Select income range"
            />
            
            <div className="md:col-span-2">
              <Select
                label="Education Level"
                value={localAudience.demographics.education}
                onChange={(e) => handleDemographicChange("education", e.target.value)}
                options={educationOptions}
                placeholder="Select education level"
              />
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Interests</h3>
          
          <div className="flex space-x-2">
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add interest (e.g., Technology, Fitness)"
              onKeyPress={(e) => e.key === "Enter" && addInterest()}
              className="flex-1"
            />
            <Button onClick={addInterest} icon="Plus" disabled={!newInterest.trim()}>
              Add
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {localAudience.interests.map((interest) => (
              <Badge
                key={interest}
                variant="primary"
                className="cursor-pointer hover:bg-primary-200"
                onClick={() => removeInterest(interest)}
              >
                {interest}
                <ApperIcon name="X" className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
        </div>

        {/* Behaviors */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Behaviors</h3>
          
          <div className="flex space-x-2">
            <Input
              value={newBehavior}
              onChange={(e) => setNewBehavior(e.target.value)}
              placeholder="Add behavior (e.g., Online Shoppers, App Users)"
              onKeyPress={(e) => e.key === "Enter" && addBehavior()}
              className="flex-1"
            />
            <Button onClick={addBehavior} icon="Plus" disabled={!newBehavior.trim()}>
              Add
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {localAudience.behaviors.map((behavior) => (
              <Badge
                key={behavior}
                variant="accent"
                className="cursor-pointer hover:bg-accent-200"
                onClick={() => removeBehavior(behavior)}
              >
                {behavior}
                <ApperIcon name="X" className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
        </div>

        {/* Estimated Reach */}
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-slate-900">Estimated Reach</h4>
              <p className="text-sm text-slate-600">Approximate audience size</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary-600">
                {localAudience.estimatedReach.toLocaleString()}
              </p>
              <p className="text-sm text-slate-600">users</p>
            </div>
          </div>
          
          <div className="mt-3">
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((localAudience.estimatedReach / 1000000) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Very Specific</span>
              <span>Broad Reach</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudienceBuilder;