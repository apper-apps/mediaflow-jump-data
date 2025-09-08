import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import StatCard from "@/components/molecules/StatCard";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Chart from "react-apexcharts";
import { useNavigate } from "react-router-dom";
import MediaPlansService from "@/services/api/MediaPlansService";
import AudiencesService from "@/services/api/AudiencesService";

const Reports = () => {
  const navigate = useNavigate();
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState("30");
  const [reportType, setReportType] = useState("overview");

  useEffect(() => {
    loadReportsData();
  }, [dateRange]);

  const loadReportsData = async () => {
    try {
      setLoading(true);
      setError("");

      const [plans, audiences] = await Promise.all([
        MediaPlansService.getAll(),
        AudiencesService.getAll()
      ]);

      // Calculate metrics
      const totalPlans = plans.length;
const activePlans = plans.filter(p => p.status === "active").length;
      const completedPlans = plans.filter(p => p.status === "completed").length;
      
      const totalBudget = plans.reduce((sum, plan) => 
        sum + (plan.channels?.reduce((channelSum, channel) => channelSum + (channel.budget || 0), 0) || 0), 0
      );

      // Channel distribution
      const channelBudgets = {};
plans.forEach(plan => {
        plan.channels?.forEach(channel => {
          if (channelBudgets[channel.platform]) {
            channelBudgets[channel.platform] += channel.budget || 0;
          } else {
            channelBudgets[channel.platform] = channel.budget || 0;
          }
        });
      });

      const channelData = Object.entries(channelBudgets).map(([platform, budget]) => ({
        platform,
        budget,
        percentage: totalBudget > 0 ? (budget / totalBudget) * 100 : 0
      }));

      // Budget trends over time (mock data for demo)
      const budgetTrends = [
        { month: "Jan", budget: totalBudget * 0.6, plans: Math.floor(totalPlans * 0.4) },
        { month: "Feb", budget: totalBudget * 0.7, plans: Math.floor(totalPlans * 0.5) },
        { month: "Mar", budget: totalBudget * 0.8, plans: Math.floor(totalPlans * 0.7) },
        { month: "Apr", budget: totalBudget * 0.9, plans: Math.floor(totalPlans * 0.8) },
        { month: "May", budget: totalBudget * 1.0, plans: Math.floor(totalPlans * 0.9) },
        { month: "Jun", budget: totalBudget * 1.1, plans: totalPlans }
      ];

      // Performance by objective (mock data)
      const objectivePerformance = [
{ objective: "Brand Awareness", plans: plans.filter(p => p.objective === "brand-awareness").length, budget: totalBudget * 0.3 },
        { objective: "Lead Generation", plans: plans.filter(p => p.objective === "lead-generation").length, budget: totalBudget * 0.25 },
        { objective: "Conversions", plans: plans.filter(p => p.objective === "conversions").length, budget: totalBudget * 0.2 },
        { objective: "Traffic", plans: plans.filter(p => p.objective === "traffic").length, budget: totalBudget * 0.15 },
        { objective: "Engagement", plans: plans.filter(p => p.objective === "engagement").length, budget: totalBudget * 0.1 }
      ].filter(item => item.plans > 0);

      setReportsData({
        overview: {
          totalPlans,
          activePlans,
          completedPlans,
          totalBudget,
          totalAudiences: audiences.length
        },
        channelData,
        budgetTrends,
        objectivePerformance,
        topPerformers: plans.slice(0, 5)
      });
    } catch (err) {
      setError("Failed to load reports data");
      console.error("Reports load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const dateRangeOptions = [
    { value: "7", label: "Last 7 days" },
    { value: "30", label: "Last 30 days" },
    { value: "90", label: "Last 3 months" },
    { value: "365", label: "Last 12 months" }
  ];

  const reportTypeOptions = [
    { value: "overview", label: "Overview" },
    { value: "budget", label: "Budget Analysis" },
    { value: "channels", label: "Channel Performance" },
    { value: "audiences", label: "Audience Insights" }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadReportsData} />;
  if (!reportsData) return <Empty type="reports" onAction={() => navigate("/plans")} />;

  // Chart configurations
  const budgetTrendOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
      fontFamily: "Inter, system-ui, sans-serif"
    },
    colors: ["#5B47E0", "#F97316"],
    stroke: {
      curve: "smooth",
      width: [3, 3]
    },
    xaxis: {
      categories: reportsData.budgetTrends.map(item => item.month),
      labels: { style: { colors: "#64748b" } }
    },
    yaxis: [
      {
        title: { text: "Budget ($)", style: { color: "#64748b" } },
        labels: {
          formatter: (value) => `$${(value / 1000).toFixed(0)}K`,
          style: { colors: "#64748b" }
        }
      },
      {
        opposite: true,
        title: { text: "Plans", style: { color: "#64748b" } },
        labels: { style: { colors: "#64748b" } }
      }
    ],
    legend: { position: "top" },
    grid: { borderColor: "#e2e8f0" }
  };

  const budgetTrendSeries = [
    {
      name: "Budget",
      type: "line",
      data: reportsData.budgetTrends.map(item => item.budget)
    },
    {
      name: "Plans",
      type: "line",
      yAxisIndex: 1,
      data: reportsData.budgetTrends.map(item => item.plans)
    }
  ];

  const channelChartOptions = {
    chart: {
      type: "donut",
      height: 350,
      fontFamily: "Inter, system-ui, sans-serif"
    },
    colors: ["#5B47E0", "#F97316", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"],
    dataLabels: { enabled: false },
    legend: { position: "bottom" },
    plotOptions: {
      pie: {
        donut: { size: "65%" }
      }
    },
    labels: reportsData.channelData.map(item => item.platform)
  };

  const channelChartSeries = reportsData.channelData.map(item => item.budget);

  const objectiveChartOptions = {
    chart: {
      type: "bar",
      height: 300,
      toolbar: { show: false },
      fontFamily: "Inter, system-ui, sans-serif"
    },
    colors: ["#5B47E0"],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: reportsData.objectivePerformance.map(item => item.objective),
      labels: {
        formatter: (value) => `$${(value / 1000).toFixed(0)}K`
      }
    },
    grid: { borderColor: "#e2e8f0" }
  };

  const objectiveChartSeries = [{
    name: "Budget Allocated",
    data: reportsData.objectivePerformance.map(item => item.budget)
  }];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Performance Reports</h2>
          <p className="text-slate-600">Analyze your media planning performance and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={dateRangeOptions}
            className="w-40"
          />
          <Select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            options={reportTypeOptions}
            className="w-48"
          />
          <Button icon="Download" variant="secondary">
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Plans"
          value={reportsData.overview.totalPlans}
          change="+12% vs last period"
          changeType="positive"
          icon="FileText"
        />
        <StatCard
          title="Active Campaigns"
          value={reportsData.overview.activePlans}
          change="+5 this month"
          changeType="positive"
          icon="Play"
        />
        <StatCard
          title="Total Budget"
          value={`$${reportsData.overview.totalBudget.toLocaleString()}`}
          change="+18% vs last period"
          changeType="positive"
          icon="DollarSign"
          gradient
        />
        <StatCard
          title="Completed"
          value={reportsData.overview.completedPlans}
          change="3 this month"
          changeType="neutral"
          icon="CheckCircle"
        />
        <StatCard
          title="Audiences"
          value={reportsData.overview.totalAudiences}
          change="+7 new"
          changeType="positive"
          icon="Users"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="TrendingUp" className="w-5 h-5 text-primary-600" />
              <span>Budget & Plan Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={budgetTrendOptions}
              series={budgetTrendSeries}
              type="line"
              height={350}
            />
          </CardContent>
        </Card>

        {/* Channel Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="PieChart" className="w-5 h-5 text-primary-600" />
              <span>Budget by Channel</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={channelChartOptions}
              series={channelChartSeries}
              type="donut"
              height={350}
            />
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Objective Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Target" className="w-5 h-5 text-primary-600" />
              <span>Budget by Campaign Objective</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={objectiveChartOptions}
              series={objectiveChartSeries}
              type="bar"
              height={300}
            />
          </CardContent>
        </Card>

        {/* Channel Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="BarChart3" className="w-5 h-5 text-primary-600" />
              <span>Channel Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportsData.channelData
                .sort((a, b) => b.budget - a.budget)
                .slice(0, 6)
                .map((channel, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full`} 
                         style={{ backgroundColor: channelChartOptions.colors[index] }}>
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {channel.platform}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      ${channel.budget.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">
                      {channel.percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Plans */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Trophy" className="w-5 h-5 text-primary-600" />
              <span>Recent Media Plans</span>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/plans")}
              icon="ArrowRight"
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {reportsData.topPerformers.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="FileText" className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">No media plans to display</p>
              <Button 
                className="mt-3" 
                onClick={() => navigate("/plans")}
                icon="Plus"
              >
                Create First Plan
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Plan Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Objective</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Budget</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Channels</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reportsData.topPerformers.map((plan) => {
const totalBudget = plan.channels?.reduce((sum, ch) => sum + (ch.budget || 0), 0) || 0;
                    return (
                      <tr key={plan.Id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-900">{plan.name}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-slate-600 capitalize">
                            {plan.objective?.replace("-", " ")}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">
                            ${totalBudget.toLocaleString()}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-slate-600">
                            {plan.channels?.length || 0} channels
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            plan.status === "active" ? "bg-green-100 text-green-800" :
                            plan.status === "draft" ? "bg-yellow-100 text-yellow-800" :
                            "bg-slate-100 text-slate-800"
                          }`}>
                            {plan.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;