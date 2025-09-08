import React, { useState, useEffect } from "react";
import MediaPlanCard from "@/components/organisms/MediaPlanCard";
import Button from "@/components/atoms/Button";
import FilterButton from "@/components/molecules/FilterButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MediaPlansService from "@/services/api/MediaPlansService";

const MediaPlans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("updated");
  const [activeFilters, setActiveFilters] = useState([]);

  const [newPlan, setNewPlan] = useState({
    name: "",
    objective: "",
    totalBudget: "",
    startDate: "",
    endDate: ""
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await MediaPlansService.getAll();
      setPlans(data);
    } catch (err) {
      setError("Failed to load media plans");
      console.error("Plans load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    
    if (!newPlan.name || !newPlan.objective || !newPlan.totalBudget) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const planData = {
        ...newPlan,
        totalBudget: parseFloat(newPlan.totalBudget) || 0,
        channels: [],
        audiences: [],
        collaborators: ["John Doe"],
        status: "draft"
      };

      const createdPlan = await MediaPlansService.create(planData);
      setPlans(prev => [createdPlan, ...prev]);
      setShowCreateModal(false);
      setNewPlan({
        name: "",
        objective: "",
        totalBudget: "",
        startDate: "",
        endDate: ""
      });
      toast.success("Media plan created successfully!");
navigate(`/media-plans/${createdPlan.Id}`);
    } catch (err) {
      toast.error("Failed to create media plan");
      console.error("Create plan error:", err);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!confirm("Are you sure you want to delete this media plan?")) return;

    try {
      await MediaPlansService.delete(planId);
      setPlans(prev => prev.filter(p => p.Id !== planId));
      toast.success("Media plan deleted successfully");
    } catch (err) {
      toast.error("Failed to delete media plan");
      console.error("Delete plan error:", err);
    }
  };

  const handleDuplicatePlan = async (planId) => {
    try {
      const originalPlan = await MediaPlansService.getById(planId);
      const duplicatedPlan = {
        ...originalPlan,
        name: `${originalPlan.name} (Copy)`,
        status: "draft"
      };
      delete duplicatedPlan.Id;

      const createdPlan = await MediaPlansService.create(duplicatedPlan);
      setPlans(prev => [createdPlan, ...prev]);
      toast.success("Media plan duplicated successfully!");
    } catch (err) {
      toast.error("Failed to duplicate media plan");
      console.error("Duplicate plan error:", err);
    }
  };

  const filterOptions = [
    { id: "active", label: "Active Plans" },
    { id: "draft", label: "Draft Plans" },
    { id: "completed", label: "Completed Plans" },
    { id: "high-budget", label: "High Budget (>$10k)" },
    { id: "recent", label: "Created This Week" }
  ];

  const objectiveOptions = [
    { value: "brand-awareness", label: "Brand Awareness" },
    { value: "lead-generation", label: "Lead Generation" },
    { value: "conversions", label: "Conversions" },
    { value: "traffic", label: "Website Traffic" },
    { value: "engagement", label: "Engagement" },
    { value: "app-installs", label: "App Installs" }
  ];

  const sortOptions = [
    { value: "updated", label: "Last Updated" },
    { value: "created", label: "Date Created" },
    { value: "name", label: "Name" },
    { value: "budget", label: "Budget" }
  ];

  // Filter and sort plans
  const filteredPlans = plans.filter(plan => {
    if (searchQuery && !plan.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !plan.objective.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (statusFilter !== "all" && plan.status !== statusFilter) {
      return false;
    }

    // Apply active filters
    if (activeFilters.includes("high-budget")) {
      const totalBudget = plan.channels?.reduce((sum, ch) => sum + (ch.budget || 0), 0) || 0;
      if (totalBudget <= 10000) return false;
    }
    
    if (activeFilters.includes("recent")) {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      if (new Date(plan.createdAt) < weekAgo) return false;
    }

    return true;
  });

  // Sort plans
  const sortedPlans = [...filteredPlans].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "budget":
        const budgetA = a.channels?.reduce((sum, ch) => sum + (ch.budget || 0), 0) || 0;
        const budgetB = b.channels?.reduce((sum, ch) => sum + (ch.budget || 0), 0) || 0;
        return budgetB - budgetA;
      case "created":
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return new Date(b.updatedAt) - new Date(a.updatedAt);
    }
  });

  if (loading) return <Loading type="plans" />;
  if (error) return <Error message={error} onRetry={loadPlans} />;

  return (
    <div className="space-y-6 p-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Media Plans</h2>
          <p className="text-slate-600">Manage and organize your advertising campaigns</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          icon="Plus"
          size="lg"
        >
          Create Media Plan
        </Button>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "active", label: "Active" },
                  { value: "draft", label: "Draft" },
                  { value: "completed", label: "Completed" },
                  { value: "paused", label: "Paused" }
                ]}
                className="w-40"
              />
              
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={sortOptions}
                className="w-40"
              />
            </div>

            <div className="flex items-center space-x-3">
              <FilterButton
                filters={filterOptions}
                activeFilters={activeFilters}
                onFilterChange={setActiveFilters}
              />
              <Button variant="ghost" icon="Download" size="sm">
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans Grid */}
      {sortedPlans.length === 0 ? (
        <Empty
          type="plans"
          onAction={() => setShowCreateModal(true)}
          actionLabel="Create First Plan"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPlans.map((plan) => (
            <MediaPlanCard
key={plan.Id}
              plan={plan}
              onEdit={(id) => navigate(`/plans/${id}`)}
              onDelete={handleDeletePlan}
              onDuplicate={handleDuplicatePlan}
            />
          ))}
        </div>
      )}

      {/* Create Plan Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900">Create New Media Plan</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePlan} className="space-y-4">
                <Input
                  label="Campaign Name"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Q2 Brand Awareness Campaign"
                  required
                />

                <Select
                  label="Campaign Objective"
                  value={newPlan.objective}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, objective: e.target.value }))}
                  options={objectiveOptions}
                  placeholder="Select campaign objective"
                  required
                />

                <Input
                  label="Total Budget"
                  type="number"
                  value={newPlan.totalBudget}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, totalBudget: e.target.value }))}
                  placeholder="0"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                    value={newPlan.startDate}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />

                  <Input
                    label="End Date"
                    type="date"
                    value={newPlan.endDate}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, endDate: e.target.value }))}
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Plan
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPlans;