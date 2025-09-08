import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import FilterButton from "@/components/molecules/FilterButton";
import AudienceBuilder from "@/components/organisms/AudienceBuilder";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";
import AudiencesService from "@/services/api/AudiencesService";

const Audiences = () => {
  const [audiences, setAudiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);

  const [newAudience, setNewAudience] = useState({
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
    estimatedReach: 0
  });

  useEffect(() => {
    loadAudiences();
  }, []);

  const loadAudiences = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await AudiencesService.getAll();
      setAudiences(data);
    } catch (err) {
      setError("Failed to load audiences");
      console.error("Audiences load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAudience = async () => {
    if (!newAudience.name.trim()) {
      toast.error("Please enter an audience name");
      return;
    }

    try {
      const createdAudience = await AudiencesService.create(newAudience);
      setAudiences(prev => [createdAudience, ...prev]);
      setShowCreateModal(false);
      resetForm();
      toast.success("Audience created successfully!");
    } catch (err) {
      toast.error("Failed to create audience");
      console.error("Create audience error:", err);
    }
  };

  const handleDeleteAudience = async (audienceId) => {
    if (!confirm("Are you sure you want to delete this audience?")) return;

    try {
      await AudiencesService.delete(audienceId);
      setAudiences(prev => prev.filter(a => a.Id !== audienceId));
      toast.success("Audience deleted successfully");
    } catch (err) {
      toast.error("Failed to delete audience");
      console.error("Delete audience error:", err);
    }
  };

  const handleDuplicateAudience = async (audienceId) => {
    try {
      const originalAudience = await AudiencesService.getById(audienceId);
      const duplicatedAudience = {
        ...originalAudience,
        name: `${originalAudience.name} (Copy)`
      };
      delete duplicatedAudience.Id;

      const createdAudience = await AudiencesService.create(duplicatedAudience);
      setAudiences(prev => [createdAudience, ...prev]);
      toast.success("Audience duplicated successfully!");
    } catch (err) {
      toast.error("Failed to duplicate audience");
      console.error("Duplicate audience error:", err);
    }
  };

  const resetForm = () => {
    setNewAudience({
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
      estimatedReach: 0
    });
  };

  const filterOptions = [
    { id: "high-reach", label: "High Reach (>100k)" },
    { id: "specific", label: "Highly Specific (<50k)" },
    { id: "recent", label: "Created This Week" },
    { id: "has-location", label: "Location Targeted" },
    { id: "has-interests", label: "Interest-Based" }
  ];

  // Filter audiences
  const filteredAudiences = audiences.filter(audience => {
    if (searchQuery && !audience.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (activeFilters.includes("high-reach") && audience.estimatedReach <= 100000) {
      return false;
    }
    
    if (activeFilters.includes("specific") && audience.estimatedReach >= 50000) {
      return false;
    }

    if (activeFilters.includes("has-location") && !audience.demographics?.location) {
      return false;
    }

    if (activeFilters.includes("has-interests") && (!audience.interests || audience.interests.length === 0)) {
      return false;
    }

    return true;
  });

  const getReachColor = (reach) => {
    if (reach >= 100000) return "success";
    if (reach >= 50000) return "warning";
    return "accent";
  };

  const formatReach = (reach) => {
    if (reach >= 1000000) {
      return `${(reach / 1000000).toFixed(1)}M`;
    }
    if (reach >= 1000) {
      return `${(reach / 1000).toFixed(0)}K`;
    }
    return reach.toString();
  };

  if (loading) return <Loading type="audiences" />;
  if (error) return <Error message={error} onRetry={loadAudiences} />;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Target Audiences</h2>
          <p className="text-slate-600">Define and manage your audience segments</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          icon="Plus"
          size="lg"
        >
          Create Audience
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-slate-700">
                {filteredAudiences.length} audience{filteredAudiences.length !== 1 ? 's' : ''}
              </span>
            </div>
            <FilterButton
              filters={filterOptions}
              activeFilters={activeFilters}
              onFilterChange={setActiveFilters}
            />
          </div>
        </CardContent>
      </Card>

      {/* Audiences Grid */}
      {filteredAudiences.length === 0 ? (
        <Empty
          type="audiences"
          onAction={() => setShowCreateModal(true)}
          actionLabel="Create First Audience"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAudiences.map((audience) => (
            <Card key={audience.Id} hover>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {audience.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge variant={getReachColor(audience.estimatedReach)}>
                        {formatReach(audience.estimatedReach)} users
                      </Badge>
                      {audience.demographics?.location && (
                        <Badge variant="outline" size="sm">
                          {audience.demographics.location}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleDuplicateAudience(audience.Id)}
                      className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                    >
                      <ApperIcon name="Copy" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAudience(audience.Id)}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Demographics */}
                <div className="space-y-3 mb-4">
                  {audience.demographics?.ageRange && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Age Range</span>
                      <span className="font-medium text-slate-900">
                        {audience.demographics.ageRange}
                      </span>
                    </div>
                  )}
                  {audience.demographics?.gender && audience.demographics.gender !== "all" && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Gender</span>
                      <span className="font-medium text-slate-900 capitalize">
                        {audience.demographics.gender}
                      </span>
                    </div>
                  )}
                  {audience.demographics?.income && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Income</span>
                      <span className="font-medium text-slate-900">
                        {audience.demographics.income === "low" && "Under $50K"}
                        {audience.demographics.income === "middle" && "$50K - $100K"}
                        {audience.demographics.income === "high" && "$100K - $200K"}
                        {audience.demographics.income === "premium" && "$200K+"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Interests */}
                {audience.interests && audience.interests.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-slate-700 mb-2">Interests</p>
                    <div className="flex flex-wrap gap-1">
                      {audience.interests.slice(0, 3).map((interest, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-primary-100 text-primary-800 text-xs rounded-md"
                        >
                          {interest}
                        </span>
                      ))}
                      {audience.interests.length > 3 && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md">
                          +{audience.interests.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Behaviors */}
                {audience.behaviors && audience.behaviors.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-slate-700 mb-2">Behaviors</p>
                    <div className="flex flex-wrap gap-1">
                      {audience.behaviors.slice(0, 2).map((behavior, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-accent-100 text-accent-800 text-xs rounded-md"
                        >
                          {behavior}
                        </span>
                      ))}
                      {audience.behaviors.length > 2 && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md">
                          +{audience.behaviors.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setSelectedAudience(audience)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Audience Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">Create New Audience</h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <AudienceBuilder
                audience={newAudience}
                onChange={setNewAudience}
              />
            </div>

            <div className="p-6 border-t border-slate-200">
              <div className="flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateAudience}>
                  Create Audience
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audience Detail Modal */}
      {selectedAudience && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">
                  {selectedAudience.name}
                </h3>
                <button
                  onClick={() => setSelectedAudience(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 mb-2">
                    <Badge variant={getReachColor(selectedAudience.estimatedReach)} size="lg">
                      {formatReach(selectedAudience.estimatedReach)} users
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">Estimated reach</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Demographics</h4>
                    <div className="space-y-2">
                      {selectedAudience.demographics?.ageRange && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Age:</span>
                          <span className="font-medium">{selectedAudience.demographics.ageRange}</span>
                        </div>
                      )}
                      {selectedAudience.demographics?.gender && selectedAudience.demographics.gender !== "all" && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Gender:</span>
                          <span className="font-medium capitalize">{selectedAudience.demographics.gender}</span>
                        </div>
                      )}
                      {selectedAudience.demographics?.location && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Location:</span>
                          <span className="font-medium">{selectedAudience.demographics.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Targeting</h4>
                    <div className="space-y-3">
                      {selectedAudience.interests && selectedAudience.interests.length > 0 && (
                        <div>
                          <span className="text-sm text-slate-600">Interests:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedAudience.interests.map((interest, index) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 bg-primary-100 text-primary-800 text-xs rounded"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedAudience.behaviors && selectedAudience.behaviors.length > 0 && (
                        <div>
                          <span className="text-sm text-slate-600">Behaviors:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedAudience.behaviors.map((behavior, index) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 bg-accent-100 text-accent-800 text-xs rounded"
                              >
                                {behavior}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200">
              <div className="flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => setSelectedAudience(null)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => handleDuplicateAudience(selectedAudience.Id)}
                  icon="Copy"
                >
                  Duplicate
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Audiences;