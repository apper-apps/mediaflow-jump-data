import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import AudienceBuilder from "@/components/organisms/AudienceBuilder";
import BudgetAllocator from "@/components/organisms/BudgetAllocator";
import Audiences from "@/components/pages/Audiences";
import MediaPlansService from "@/services/api/MediaPlansService";

const MediaPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    objective: "",
    totalBudget: "",
    startDate: "",
    endDate: "",
    status: "draft",
    notes: ""
  });

  const [newAudience, setNewAudience] = useState({
    name: "",
    demographics: {},
    interests: [],
    behaviors: [],
    channelMapping: {},
    estimatedReach: 0
  });

  useEffect(() => {
    if (id) {
      loadPlan();
    }
  }, [id]);

  const loadPlan = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await MediaPlansService.getById(parseInt(id));
      setPlan(data);
setEditForm({
        name: data.name || "",
        objective: data.objective || "",
        totalBudget: data.totalBudget || "",
        startDate: data.startDate || "",
        endDate: data.endDate || "",
        status: data.status || "draft",
        notes: data.notes || ""
      });
    } catch (err) {
      setError("Failed to load media plan");
      console.error("Plan load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updatedPlan = {
        ...plan,
        ...editForm,
        totalBudget: parseFloat(editForm.totalBudget) || 0,
        updatedAt: new Date().toISOString()
      };
      
await MediaPlansService.update(plan.Id, updatedPlan);
      setPlan(updatedPlan);
      setIsEditing(false);
      toast.success("Media plan updated successfully!");
    } catch (err) {
      toast.error("Failed to update media plan");
      console.error("Update error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleChannelsChange = async (channels) => {
    try {
const updatedPlan = { ...plan, channels, updatedAt: new Date().toISOString() };
      await MediaPlansService.update(plan.Id, updatedPlan);
      setPlan(updatedPlan);
    } catch (err) {
      toast.error("Failed to update channels");
      console.error("Channels update error:", err);
    }
  };

  const handleAudienceChange = (audienceData) => {
    setNewAudience(audienceData);
  };

  const objectiveOptions = [
    { value: "brand-awareness", label: "Brand Awareness" },
    { value: "lead-generation", label: "Lead Generation" },
    { value: "conversions", label: "Conversions" },
    { value: "traffic", label: "Website Traffic" },
    { value: "engagement", label: "Engagement" },
    { value: "app-installs", label: "App Installs" }
  ];

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "completed", label: "Completed" }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "success";
      case "draft": return "warning";
      case "completed": return "default";
      case "paused": return "outline";
      default: return "default";
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "LayoutDashboard" },
    { id: "budget", label: "Budget Allocation", icon: "DollarSign" },
    { id: "audiences", label: "Target Audiences", icon: "Users" },
    { id: "timeline", label: "Timeline", icon: "Calendar" },
    { id: "collaboration", label: "Team", icon: "Users" }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPlan} />;
  if (!plan) return <Error message="Media plan not found" />;

const totalBudget = plan.channels?.reduce((sum, channel) => sum + (channel.budget || 0), 0) || 0;
  const remainingBudget = (plan.totalBudget || 0) - totalBudget;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/plans")}
            icon="ArrowLeft"
          >
            Back to Plans
          </Button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-slate-900">
                {isEditing ? (
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="text-2xl font-bold border-0 p-0 bg-transparent focus:ring-0"
/>
                ) : (
                  {plan.name}
                )}
              </h1>
<Badge variant={getStatusColor(plan.status)}>
                {plan.status}
              </Badge>
            </div>
            <p className="text-slate-600 mt-1">
              {isEditing ? (
                <Select
                  value={editForm.objective}
                  onChange={(e) => setEditForm(prev => ({ ...prev, objective: e.target.value }))}
                  options={objectiveOptions}
                  className="border-0 p-0 bg-transparent"
                />
              ) : (
{plan.objective}
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsEditing(false);
                  setEditForm({
name: plan.name || "",
                    objective: plan.objective || "",
                    totalBudget: plan.totalBudget || "",
                    startDate: plan.startDate || "",
                    endDate: plan.endDate || "",
                    status: plan.status || "draft",
                    notes: plan.notes || ""
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                loading={saving}
                icon="Save"
              >
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={() => setIsEditing(true)}
                icon="Edit"
              >
                Edit Plan
              </Button>
              <Button
                variant="accent"
                icon="Share"
              >
                Share
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Plan Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Plan Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Start Date
                    </label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editForm.startDate}
                        onChange={(e) => setEditForm(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    ) : (
                      <p className="text-slate-900">
{plan.startDate ? format(new Date(plan.startDate), "PPP") : "Not set"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      End Date
                    </label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editForm.endDate}
                        onChange={(e) => setEditForm(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    ) : (
                      <p className="text-slate-900">
{plan.endDate ? format(new Date(plan.endDate), "PPP") : "Not set"}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Total Budget
                  </label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editForm.totalBudget}
                      onChange={(e) => setEditForm(prev => ({ ...prev, totalBudget: e.target.value }))}
                    />
                  ) : (
                    <p className="text-2xl font-bold text-primary-600">
${(plan.totalBudget || 0).toLocaleString()}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status
                  </label>
                  {isEditing ? (
                    <Select
                      value={editForm.status}
                      onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                      options={statusOptions}
                    />
                  ) : (
<Badge variant={getStatusColor(plan.status)}>
                      {plan.status}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Budget Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-slate-600">Total Budget</p>
                    <p className="text-xl font-bold text-slate-900">
${(plan.totalBudget || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-600">Allocated</p>
                    <p className="text-xl font-bold text-primary-600">
                      ${totalBudget.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-600">Remaining</p>
                    <p className={`text-xl font-bold ${remainingBudget < 0 ? "text-red-600" : "text-green-600"}`}>
                      ${remainingBudget.toLocaleString()}
                    </p>
                  </div>
                </div>
                
{plan.channels && plan.channels.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-900">Channel Breakdown</h4>
                    {plan.channels.map((channel) => (
<div key={channel.id} className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">{channel.platform}</span>
                        <span className="font-medium text-slate-900">
                          ${(channel.budget || 0).toLocaleString()} 
                          <span className="text-sm text-slate-500 ml-1">
                            ({((channel.budget || 0) / (plan.totalBudget || 1) * 100).toFixed(1)}%)
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team Collaboration */}
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
{plan.collaborators?.map((collaborator, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {collaborator.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-slate-700">{collaborator}</span>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full mt-3" icon="Plus">
                    Add Team Member
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Channels</span>
<span className="font-medium">{plan.channels?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Audiences</span>
<span className="font-medium">{plan.audiences?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Last Updated</span>
<span className="text-sm text-slate-700">
                    {format(new Date(plan.updatedAt), "MMM d, yyyy")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "budget" && (
        <BudgetAllocator
totalBudget={plan.totalBudget || 0}
          channels={plan.channels || []}
          onChannelsChange={handleChannelsChange}
        />
      )}

      {activeTab === "audiences" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AudienceBuilder
            audience={newAudience}
            onChange={handleAudienceChange}
          />
          <Card>
            <CardHeader>
              <CardTitle>Saved Audiences</CardTitle>
            </CardHeader>
            <CardContent>
{plan.audiences && plan.audiences.length > 0 ? (
                <div className="space-y-3">
                  {plan.audiences.map((audienceId, index) => (
                    <div key={index} className="p-3 bg-slate-50 rounded-lg">
                      <p className="font-medium text-slate-900">Audience #{audienceId}</p>
                      <p className="text-sm text-slate-600">Custom audience definition</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="Users" className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600">No audiences defined yet</p>
                  <Button className="mt-3" icon="Plus" size="sm">
                    Create First Audience
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "timeline" && (
        <Card>
          <CardHeader>
            <CardTitle>Campaign Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <ApperIcon name="Calendar" className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Timeline View</h3>
              <p className="text-slate-600 mb-6">
                Visualize your campaign schedule and milestones
              </p>
              <Button icon="Calendar">
                Set Up Timeline
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "collaboration" && (
        <Card>
          <CardHeader>
            <CardTitle>Team Collaboration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <ApperIcon name="Users" className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Team Workspace</h3>
              <p className="text-slate-600 mb-6">
                Invite team members and manage permissions
              </p>
              <Button icon="UserPlus">
                Invite Team Members
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MediaPlanDetail;