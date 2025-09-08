import React, { useState, useEffect } from "react";
import CompetitorAdCard from "@/components/organisms/CompetitorAdCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import FilterButton from "@/components/molecules/FilterButton";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";
import { format } from "date-fns";
import CompetitorAdsService from "@/services/api/CompetitorAdsService";

const CompetitorLibrary = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");
  const [activeFilters, setActiveFilters] = useState([]);

  const [uploadForm, setUploadForm] = useState({
    brand: "",
    channel: "",
    format: "",
    mediaUrl: "",
    tags: [],
    insights: ""
  });

  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await CompetitorAdsService.getAll();
      setAds(data);
    } catch (err) {
      setError("Failed to load competitor ads");
      console.error("Ads load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAd = async (e) => {
    e.preventDefault();
    
    if (!uploadForm.brand || !uploadForm.channel || !uploadForm.format) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const adData = {
        ...uploadForm,
        uploadedBy: "Current User",
        uploadedAt: new Date().toISOString()
      };

      const createdAd = await CompetitorAdsService.create(adData);
      setAds(prev => [createdAd, ...prev]);
      setShowUploadModal(false);
      resetUploadForm();
      toast.success("Competitor ad uploaded successfully!");
    } catch (err) {
      toast.error("Failed to upload competitor ad");
      console.error("Upload error:", err);
    }
  };

  const handleDeleteAd = async (adId) => {
    if (!confirm("Are you sure you want to delete this competitor ad?")) return;

    try {
      await CompetitorAdsService.delete(adId);
      setAds(prev => prev.filter(a => a.Id !== adId));
      toast.success("Competitor ad deleted successfully");
    } catch (err) {
      toast.error("Failed to delete competitor ad");
      console.error("Delete error:", err);
    }
  };

  const handleViewAd = async (adId) => {
    try {
      const ad = await CompetitorAdsService.getById(adId);
      setSelectedAd(ad);
      setShowDetailModal(true);
    } catch (err) {
      toast.error("Failed to load ad details");
      console.error("View ad error:", err);
    }
  };

  const resetUploadForm = () => {
    setUploadForm({
      brand: "",
      channel: "",
      format: "",
      mediaUrl: "",
      tags: [],
      insights: ""
    });
    setNewTag("");
  };

  const addTag = () => {
if (newTag.trim() && !uploadForm.tags.includes(newTag.trim())) {
      setUploadForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setUploadForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const channelOptions = [
    { value: "Google Ads", label: "Google Ads" },
    { value: "Meta", label: "Meta" },
    { value: "TikTok", label: "TikTok" },
    { value: "LinkedIn", label: "LinkedIn" },
    { value: "Twitter", label: "Twitter" },
    { value: "YouTube", label: "YouTube" },
    { value: "Snapchat", label: "Snapchat" },
    { value: "Pinterest", label: "Pinterest" }
  ];

  const formatOptions = [
    { value: "image", label: "Image" },
    { value: "video", label: "Video" },
    { value: "carousel", label: "Carousel" },
    { value: "text", label: "Text Only" }
  ];

  const filterOptions = [
    { id: "recent", label: "Uploaded This Week" },
    { id: "has-insights", label: "Has Insights" },
    { id: "video-ads", label: "Video Format" },
    { id: "high-engagement", label: "High Engagement" }
  ];

  // Filter ads
  const filteredAds = ads.filter(ad => {
    if (searchQuery && !ad.brand.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !ad.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    
    if (channelFilter !== "all" && ad.channel !== channelFilter) {
      return false;
    }
    
    if (formatFilter !== "all" && ad.format !== formatFilter) {
      return false;
    }

    if (activeFilters.includes("recent")) {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      if (new Date(ad.uploadedAt) < weekAgo) return false;
    }

    if (activeFilters.includes("has-insights") && !ad.insights) {
      return false;
    }

    if (activeFilters.includes("video-ads") && ad.format !== "video") {
      return false;
    }

    return true;
  });

  const getUniqueValues = (field) => {
    const values = ads.map(ad => ad[field]).filter(Boolean);
    return [...new Set(values)];
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAds} />;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Competitor Library</h2>
          <p className="text-slate-600">Research and analyze competitor advertising strategies</p>
        </div>
        <Button
          onClick={() => setShowUploadModal(true)}
          icon="Upload"
          size="lg"
        >
          Upload Ad
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Eye" className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Total Ads</p>
                <p className="text-xl font-bold text-slate-900">{ads.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Building" className="w-5 h-5 text-accent-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Brands</p>
                <p className="text-xl font-bold text-slate-900">{getUniqueValues('brand').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Layers" className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Channels</p>
                <p className="text-xl font-bold text-slate-900">{getUniqueValues('channel').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Calendar" className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">This Week</p>
                <p className="text-xl font-bold text-slate-900">
                  {ads.filter(ad => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(ad.uploadedAt) >= weekAgo;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Channels" },
                  ...channelOptions
                ]}
                className="w-40"
              />
              
              <Select
                value={formatFilter}
                onChange={(e) => setFormatFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Formats" },
                  ...formatOptions
                ]}
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

      {/* Ads Grid */}
      {filteredAds.length === 0 ? (
        <Empty
          type="competitors"
          onAction={() => setShowUploadModal(true)}
          actionLabel="Upload First Ad"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAds.map((ad) => (
            <CompetitorAdCard
              key={ad.Id}
              ad={ad}
              onView={handleViewAd}
              onEdit={(id) => console.log("Edit ad:", id)}
              onDelete={handleDeleteAd}
            />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900">Upload Competitor Ad</h3>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    resetUploadForm();
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUploadAd} className="space-y-4">
                <Input
                  label="Brand Name"
                  value={uploadForm.brand}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, brand: e.target.value }))}
                  placeholder="e.g., Nike, Apple, Amazon"
                  required
                />

                <Select
                  label="Channel"
                  value={uploadForm.channel}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, channel: e.target.value }))}
                  options={channelOptions}
                  placeholder="Select advertising channel"
                  required
                />

                <Select
                  label="Ad Format"
                  value={uploadForm.format}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, format: e.target.value }))}
                  options={formatOptions}
                  placeholder="Select ad format"
                  required
                />

                <Input
                  label="Media URL"
                  value={uploadForm.mediaUrl}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, mediaUrl: e.target.value }))}
                  placeholder="https://example.com/ad-image.jpg"
                />

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tags
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      icon="Plus"
                      disabled={!newTag.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {uploadForm.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="primary"
                        className="cursor-pointer hover:bg-primary-200"
                        onClick={() => removeTag(tag)}
                      >
                        {tag}
                        <ApperIcon name="X" className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Insights & Notes
                  </label>
                  <textarea
                    value={uploadForm.insights}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, insights: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-sm"
                    rows="3"
                    placeholder="What makes this ad effective? Key insights and observations..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowUploadModal(false);
                      resetUploadForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" icon="Upload">
                    Upload Ad
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedAd && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-semibold text-slate-900">
                    {selectedAd.brand}
                  </h3>
                  <Badge variant="primary">
                    {selectedAd.channel}
                  </Badge>
                  <Badge variant="outline">
                    {selectedAd.format}
                  </Badge>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                {/* Media Preview */}
                {selectedAd.mediaUrl ? (
                  <div className="bg-slate-50 rounded-lg p-4">
                    <img
                      src={selectedAd.mediaUrl}
                      alt={`${selectedAd.brand} ad`}
                      className="w-full max-w-md mx-auto rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="hidden text-center py-8">
                      <ApperIcon name="Image" className="w-16 h-16 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">Media preview not available</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-lg p-8 text-center">
                    <ApperIcon name="Image" className="w-16 h-16 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No media attached</p>
                  </div>
                )}

                {/* Tags */}
                {selectedAd.tags && selectedAd.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAd.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Insights */}
                {selectedAd.insights && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Insights & Analysis</h4>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-slate-700 whitespace-pre-wrap">
                        {selectedAd.insights}
                      </p>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Uploaded by:</span>
                      <span className="font-medium text-slate-900">{selectedAd.uploadedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Upload date:</span>
                      <span className="font-medium text-slate-900">
                        {format(new Date(selectedAd.uploadedAt), "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Channel:</span>
                      <span className="font-medium text-slate-900">{selectedAd.channel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Format:</span>
                      <span className="font-medium text-slate-900 capitalize">{selectedAd.format}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200">
              <div className="flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowDetailModal(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handleDeleteAd(selectedAd.Id);
                    setShowDetailModal(false);
                  }}
                  variant="danger"
                  icon="Trash2"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitorLibrary;