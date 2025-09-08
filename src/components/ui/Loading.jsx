import React from "react";

const Loading = ({ type = "default" }) => {
  if (type === "dashboard") {
    return (
      <div className="space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="animate-shimmer h-4 bg-slate-200 rounded mb-3"></div>
              <div className="animate-shimmer h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
              <div className="animate-shimmer h-3 bg-slate-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        
        {/* Chart Area */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="animate-shimmer h-6 bg-slate-200 rounded w-1/4 mb-6"></div>
          <div className="animate-shimmer h-64 bg-slate-200 rounded"></div>
        </div>
        
        {/* Recent Plans */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="animate-shimmer h-6 bg-slate-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="animate-shimmer h-12 w-12 bg-slate-200 rounded"></div>
                <div className="flex-1">
                  <div className="animate-shimmer h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                  <div className="animate-shimmer h-3 bg-slate-200 rounded w-3/4"></div>
                </div>
                <div className="animate-shimmer h-8 w-16 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "plans") {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="animate-shimmer h-5 bg-slate-200 rounded mb-4"></div>
              <div className="animate-shimmer h-3 bg-slate-200 rounded mb-4 w-3/4"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="animate-shimmer h-6 bg-slate-200 rounded w-1/3"></div>
                <div className="animate-shimmer h-6 bg-slate-200 rounded w-1/4"></div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="animate-shimmer h-6 w-16 bg-slate-200 rounded-full"></div>
                ))}
              </div>
              <div className="animate-shimmer h-8 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "audiences") {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="animate-shimmer h-5 bg-slate-200 rounded w-1/2"></div>
                <div className="animate-shimmer h-4 w-4 bg-slate-200 rounded"></div>
              </div>
              <div className="animate-shimmer h-3 bg-slate-200 rounded mb-4 w-3/4"></div>
              <div className="space-y-3 mb-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex items-center justify-between">
                    <div className="animate-shimmer h-3 bg-slate-200 rounded w-1/3"></div>
                    <div className="animate-shimmer h-3 bg-slate-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
              <div className="animate-shimmer h-8 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>
  );
};

export default Loading;