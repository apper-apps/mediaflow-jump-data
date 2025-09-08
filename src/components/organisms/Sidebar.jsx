import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: "LayoutDashboard",
      badge: null
    },
    {
name: "Media Plans",
      href: "/media-plans",
      icon: "FileText",
      badge: "12"
    },
    {
      name: "Audiences",
      href: "/audiences",
      icon: "Users",
      badge: null
    },
    {
      name: "Competitor Library",
href: "/competitors",
      icon: "Eye",
      badge: "89"
    },
    {
      name: "Reports",
      href: "/reports",
      icon: "BarChart3",
      badge: null
    },
    {
      name: "Settings",
      href: "/settings",
      icon: "Settings",
      badge: null
    }
  ];

  const NavItem = ({ item }) => {
const isActive = location.pathname === item.href || 
      (item.href === "/" ? location.pathname === "/" : location.pathname.startsWith(item.href));

    return (
      <NavLink
        to={item.href}
        onClick={onClose}
        className={cn(
          "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
        )}
      >
        <div className="flex items-center space-x-3">
          <ApperIcon 
            name={item.icon} 
            className={cn(
              "w-5 h-5",
              isActive ? "text-white" : "text-slate-500"
            )} 
          />
          <span>{item.name}</span>
        </div>
        {item.badge && (
          <span className={cn(
            "px-2 py-0.5 text-xs rounded-full font-semibold",
            isActive 
              ? "bg-white/20 text-white" 
              : "bg-slate-200 text-slate-700"
          )}>
            {item.badge}
          </span>
        )}
      </NavLink>
    );
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow bg-white border-r border-slate-200">
        <div className="flex items-center flex-shrink-0 px-6 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">MediaFlow Pro</h1>
              <p className="text-xs text-slate-600">Media Planning Hub</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 pb-4 space-y-1">
          {navigationItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        <div className="flex-shrink-0 p-4">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                <ApperIcon name="Sparkles" className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">Pro Plan</p>
                <p className="text-xs text-slate-600 truncate">Unlimited plans & audiences</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-600 bg-opacity-75 z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between flex-shrink-0 px-6 py-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">MediaFlow Pro</h1>
                <p className="text-xs text-slate-600">Media Planning Hub</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex-1 px-4 pb-4 space-y-1">
            {navigationItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>

          <div className="flex-shrink-0 p-4">
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                  <ApperIcon name="Sparkles" className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">Pro Plan</p>
                  <p className="text-xs text-slate-600 truncate">Unlimited plans & audiences</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;