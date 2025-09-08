import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    general: {
      companyName: "MediaFlow Pro Agency",
      timezone: "America/New_York",
      dateFormat: "MM/DD/YYYY",
      currency: "USD"
    },
    notifications: {
      emailNotifications: true,
      browserNotifications: true,
      weeklyReports: true,
      budgetAlerts: true,
      collaborationUpdates: true
    },
    integrations: {
      googleAds: false,
      facebookAds: false,
      linkedinAds: false,
      tiktokAds: false
    },
    team: {
      defaultRole: "editor",
      autoInvite: true,
      teamSize: 5
    }
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async (section) => {
    setSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSaving(false);
    toast.success(`${section} settings saved successfully!`);
  };

  const tabs = [
    { id: "general", label: "General", icon: "Settings" },
    { id: "notifications", label: "Notifications", icon: "Bell" },
    { id: "integrations", label: "Integrations", icon: "Zap" },
    { id: "team", label: "Team", icon: "Users" },
    { id: "billing", label: "Billing", icon: "CreditCard" }
  ];

  const timezoneOptions = [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
    { value: "Europe/Paris", label: "Central European Time (CET)" }
  ];

  const currencyOptions = [
    { value: "USD", label: "US Dollar (USD)" },
    { value: "EUR", label: "Euro (EUR)" },
    { value: "GBP", label: "British Pound (GBP)" },
    { value: "CAD", label: "Canadian Dollar (CAD)" },
    { value: "AUD", label: "Australian Dollar (AUD)" }
  ];

  const dateFormatOptions = [
    { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
    { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
    { value: "YYYY-MM-DD", label: "YYYY-MM-DD" }
  ];

  const roleOptions = [
    { value: "viewer", label: "Viewer" },
    { value: "editor", label: "Editor" },
    { value: "admin", label: "Admin" }
  ];

  const integrationPlatforms = [
    { 
      key: "googleAds", 
      name: "Google Ads", 
      description: "Sync campaigns and budgets with Google Ads",
      icon: "Search",
      status: settings.integrations.googleAds
    },
    { 
      key: "facebookAds", 
      name: "Meta Business", 
      description: "Connect Facebook and Instagram advertising",
      icon: "Facebook",
      status: settings.integrations.facebookAds
    },
    { 
      key: "linkedinAds", 
      name: "LinkedIn Campaign Manager", 
      description: "Integrate LinkedIn advertising campaigns",
      icon: "Linkedin",
      status: settings.integrations.linkedinAds
    },
    { 
      key: "tiktokAds", 
      name: "TikTok Ads Manager", 
      description: "Sync TikTok advertising campaigns",
      icon: "Music",
      status: settings.integrations.tiktokAds
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-600">Manage your application preferences and integrations</p>
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
      {activeTab === "general" && (
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input
              label="Company Name"
              value={settings.general.companyName}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                general: { ...prev.general, companyName: e.target.value }
              }))}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Timezone"
                value={settings.general.timezone}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  general: { ...prev.general, timezone: e.target.value }
                }))}
                options={timezoneOptions}
              />

              <Select
                label="Currency"
                value={settings.general.currency}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  general: { ...prev.general, currency: e.target.value }
                }))}
                options={currencyOptions}
              />
            </div>

            <Select
              label="Date Format"
              value={settings.general.dateFormat}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                general: { ...prev.general, dateFormat: e.target.value }
              }))}
              options={dateFormatOptions}
            />

            <div className="flex justify-end">
              <Button 
                onClick={() => handleSave("General")}
                loading={saving}
                icon="Save"
              >
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "notifications" && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {Object.entries({
                emailNotifications: "Email Notifications",
                browserNotifications: "Browser Notifications", 
                weeklyReports: "Weekly Performance Reports",
                budgetAlerts: "Budget Threshold Alerts",
                collaborationUpdates: "Team Collaboration Updates"
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{label}</p>
                    <p className="text-sm text-slate-600">
                      {key === "emailNotifications" && "Receive notifications via email"}
                      {key === "browserNotifications" && "Show browser push notifications"}
                      {key === "weeklyReports" && "Weekly summary of your media plans"}
                      {key === "budgetAlerts" && "Alerts when budgets exceed thresholds"}
                      {key === "collaborationUpdates" && "Updates when team members make changes"}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications[key]}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, [key]: e.target.checked }
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={() => handleSave("Notification")}
                loading={saving}
                icon="Save"
              >
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "integrations" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {integrationPlatforms.map((platform) => (
                  <div key={platform.key} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        <ApperIcon name={platform.icon} className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{platform.name}</h4>
                        <p className="text-sm text-slate-600">{platform.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {platform.status && (
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                          <ApperIcon name="CheckCircle" className="w-3 h-3 mr-1" />
                          Connected
                        </span>
                      )}
                      <Button
                        variant={platform.status ? "outline" : "primary"}
                        size="sm"
                        onClick={() => setSettings(prev => ({
                          ...prev,
                          integrations: { ...prev.integrations, [platform.key]: !platform.status }
                        }))}
                      >
                        {platform.status ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-slate-900">API Key</h4>
                  <Button variant="outline" size="sm" icon="Copy">
                    Copy
                  </Button>
                </div>
                <code className="text-sm font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                  mfp_1a2b3c4d5e6f7g8h9i0j
                </code>
                <p className="text-sm text-slate-500 mt-2">
                  Use this API key to integrate with external systems
                </p>
              </div>
              
              <Button variant="secondary" icon="RefreshCw">
                Regenerate API Key
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "team" && (
        <Card>
          <CardHeader>
            <CardTitle>Team Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Default Role for New Members"
                value={settings.team.defaultRole}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  team: { ...prev.team, defaultRole: e.target.value }
                }))}
                options={roleOptions}
              />

              <Input
                label="Team Size Limit"
                type="number"
                value={settings.team.teamSize}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  team: { ...prev.team, teamSize: parseInt(e.target.value) || 0 }
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Auto-invite to Plans</p>
                <p className="text-sm text-slate-600">
                  Automatically invite new team members to existing plans
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.team.autoInvite}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    team: { ...prev.team, autoInvite: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={() => handleSave("Team")}
                loading={saving}
                icon="Save"
              >
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "billing" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">Pro Plan</h3>
                  <p className="text-slate-600">Unlimited plans, audiences, and team members</p>
                  <p className="text-2xl font-bold text-primary-600 mt-2">$99/month</p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full mb-3">
                    <ApperIcon name="CheckCircle" className="w-4 h-4 mr-1" />
                    Active
                  </div>
                  <p className="text-sm text-slate-600">Next billing: Jan 15, 2024</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">12</div>
                  <div className="text-sm text-slate-600">Media Plans</div>
                  <div className="text-xs text-green-600">Unlimited</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">8</div>
                  <div className="text-sm text-slate-600">Audiences</div>
                  <div className="text-xs text-green-600">Unlimited</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">5</div>
                  <div className="text-sm text-slate-600">Team Members</div>
                  <div className="text-xs text-green-600">Unlimited</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: "Dec 15, 2023", amount: "$99.00", status: "Paid" },
                  { date: "Nov 15, 2023", amount: "$99.00", status: "Paid" },
                  { date: "Oct 15, 2023", amount: "$99.00", status: "Paid" }
                ].map((invoice, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <p className="font-medium text-slate-900">{invoice.date}</p>
                      <p className="text-sm text-slate-600">Monthly subscription</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">{invoice.amount}</p>
                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mt-6">
                <Button variant="outline" icon="Download">
                  Download All Invoices
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Settings;