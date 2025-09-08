import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import MediaPlansService from "@/services/api/MediaPlansService";
import AudiencesService from "@/services/api/AudiencesService";
import CompetitorAdsService from "@/services/api/CompetitorAdsService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    recentPlans: [],
    budgetTrends: [],
    channelDistribution: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [plans, audiences, competitors] = await Promise.all([
        MediaPlansService.getAll(),
        AudiencesService.getAll(),
        CompetitorAdsService.getAll()
      ]);

      // Calculate stats
      const totalPlans = plans.length;
      const activePlans = plans.filter(p => p.status === "active").length;
      const totalBudget = plans.reduce((sum, plan) => 
        sum + (plan.channels?.reduce((channelSum, channel) => channelSum + (channel.budget || 0), 0) || 0), 0
      );
      const totalAudiences = audiences.length;

      // Calculate channel distribution
      const channelMap = {};
      plans.forEach(plan => {
        plan.channels?.forEach(channel => {
          if (channelMap[channel.platform]) {
            channelMap[channel.platform] += channel.budget || 0;
          } else {
            channelMap[channel.platform] = channel.budget || 0;
          }
        });
      });

      const channelDistribution = Object.entries(channelMap).map(([platform, budget]) => ({
        platform,
        budget,
        percentage: totalBudget > 0 ? (budget / totalBudget) * 100 : 0
      }));

      // Generate budget trends (mock data for visualization)
      const budgetTrends = [
        { month: "Jan", budget: totalBudget * 0.7 },
        { month: "Feb", budget: totalBudget * 0.8 },
        { month: "Mar", budget: totalBudget * 0.9 },
        { month: "Apr", budget: totalBudget },
        { month: "May", budget: totalBudget * 1.1 },
        { month: "Jun", budget: totalBudget * 1.2 }
      ];

      setDashboardData({
        stats: {
          totalPlans,
          activePlans,
          totalBudget,
          totalAudiences,
          competitorAds: competitors.length
        },
        recentPlans: plans.slice(0, 5),
        budgetTrends,
        channelDistribution
      });
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const { stats, recentPlans, budgetTrends, channelDistribution } = dashboardData;

  const budgetChartOptions = {
    chart: {
      type: "area",
      height: 300,
      toolbar: { show: false },
      fontFamily: "Inter, system-ui, sans-serif"
    },
    colors: ["#5B47E0"],
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 3
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    xaxis: {
      categories: budgetTrends.map(item => item.month),
      labels: {
        style: { colors: "#64748b" }
      }
    },
    yaxis: {
      labels: {
        formatter: (value) => `$${(value / 1000).toFixed(0)}K`,
        style: { colors: "#64748b" }
      }
    },
    grid: {
      borderColor: "#e2e8f0",
      strokeDashArray: 5
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value.toLocaleString()}`
      }
    }
  };

  const budgetChartSeries = [{
    name: "Budget",
    data: budgetTrends.map(item => item.budget)
  }];

  const channelChartOptions = {
    chart: {
      type: "donut",
      height: 300,
      fontFamily: "Inter, system-ui, sans-serif"
    },
    colors: ["#5B47E0", "#F97316", "#3B82F6", "#10B981", "#F59E0B", "#EF4444"],
    dataLabels: { enabled: false },
    legend: {
      position: "bottom",
      labels: { colors: "#64748b" }
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%"
        }
      }
    },
    labels: channelDistribution.map(item => item.platform),
    tooltip: {
      y: {
        formatter: (value) => `$${value.toLocaleString()}`
      }
    }
  };

  const channelChartSeries = channelDistribution.map(item => item.budget);

  return (
    <div className="space-y-6 p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Media Plans"
          value={stats?.totalPlans || 0}
          change="+12% from last month"
          changeType="positive"
          icon="FileText"
          gradient
        />
        <StatCard
          title="Active Campaigns"
          value={stats?.activePlans || 0}
          change="+5 this week"
          changeType="positive"
          icon="Play"
        />
        <StatCard
          title="Total Budget"
          value={`$${(stats?.totalBudget || 0).toLocaleString()}`}
          change="+23% from last month"
          changeType="positive"
          icon="DollarSign"
          gradient
        />
        <StatCard
          title="Audiences"
          value={stats?.totalAudiences || 0}
          change="3 new this week"
          changeType="positive"
          icon="Users"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="TrendingUp" className="w-5 h-5 text-primary-600" />
              <span>Budget Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={budgetChartOptions}
              series={budgetChartSeries}
              type="area"
              height={300}
            />
          </CardContent>
        </Card>

        {/* Channel Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="PieChart" className="w-5 h-5 text-primary-600" />
              <span>Channel Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {channelDistribution.length > 0 ? (
              <Chart
                options={channelChartOptions}
                series={channelChartSeries}
                type="donut"
                height={300}
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <ApperIcon name="PieChart" className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>No budget allocation data</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Plans and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Plans */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Clock" className="w-5 h-5 text-primary-600" />
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
            {recentPlans.length === 0 ? (
              <Empty 
                type="plans"
                onAction={() => navigate("/plans")}
                actionLabel="Create First Plan"
              />
            ) : (
              <div className="space-y-4">
                {recentPlans.map((plan) => (
                  <div
                    key={plan.Id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/plans/${plan.Id}`)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center">
                        <ApperIcon name="FileText" className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{plan.name}</h4>
                        <p className="text-sm text-slate-600">{plan.objective}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        ${(plan.channels?.reduce((sum, ch) => sum + (ch.budget || 0), 0) || 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-600">{plan.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Zap" className="w-5 h-5 text-primary-600" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="primary"
              className="w-full justify-start"
              icon="Plus"
              onClick={() => navigate("/plans")}
            >
              Create Media Plan
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start"
              icon="Users"
              onClick={() => navigate("/audiences")}
            >
              Define Audience
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start"
              icon="Upload"
              onClick={() => navigate("/competitors")}
            >
              Upload Competitor Ad
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              icon="BarChart3"
              onClick={() => navigate("/reports")}
            >
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Team Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Activity" className="w-5 h-5 text-primary-600" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">JS</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-900">
                  <span className="font-medium">John Smith</span> created a new media plan "Q2 Brand Campaign"
                </p>
                <p className="text-xs text-slate-500">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">MJ</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-900">
                  <span className="font-medium">Maria Johnson</span> updated budget allocation for "Lead Gen Campaign"
                </p>
                <p className="text-xs text-slate-500">4 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">AD</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-900">
                  <span className="font-medium">Alex Davis</span> uploaded 3 new competitor ads to the library
                </p>
                <p className="text-xs text-slate-500">Yesterday</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;