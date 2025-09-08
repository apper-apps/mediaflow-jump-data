import React from "react";
import { useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuToggle, searchQuery, onSearchChange, onSearchClear }) => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
case "/media-plans":
        return "Media Plans";
      case "/audiences":
        return "Audiences";
      case "/competitors":
        return "Competitor Library";
      case "/reports":
        return "Reports";
      case "/settings":
        return "Settings";
      default:
if (location.pathname.startsWith("/media-plans/")) {
          return "Media Plan";
        }
        return "MediaFlow Pro";
    }
  };

  const showSearch = ["/plans", "/audiences", "/competitors"].includes(location.pathname);

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{getPageTitle()}</h1>
            <p className="text-sm text-slate-600 mt-1">
{location.pathname === "/" && "Overview of your media planning activities"}
              {location.pathname === "/media-plans" && "Manage your media plans and campaigns"}
              {location.pathname === "/audiences" && "Define and organize your target audiences"}
              {location.pathname === "/competitors" && "Research and analyze competitor advertising"}
              {location.pathname === "/reports" && "Performance insights and analytics"}
              {location.pathname === "/settings" && "Application preferences and configuration"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {showSearch && (
            <SearchBar
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onClear={onSearchClear}
              placeholder="Search..."
              className="w-80 hidden md:block"
            />
          )}
          
          <Button
            variant="ghost"
            icon="Bell"
            className="relative"
          >
            <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              2
            </span>
          </Button>
          
          <Button
            variant="ghost"
            icon="Settings"
          />
          
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">JD</span>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      {showSearch && (
        <div className="mt-4 md:hidden">
          <SearchBar
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={onSearchClear}
            placeholder="Search..."
          />
        </div>
      )}
    </header>
  );
};

export default Header;