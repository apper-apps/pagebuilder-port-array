import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuToggle }) => {
  return (
    <header className="lg:pl-64 bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
            icon="Menu"
          />
          
          <div className="hidden sm:block">
            <h2 className="text-lg font-semibold text-gray-900">
              E-commerce Page Builder
            </h2>
            <p className="text-sm text-gray-500">
              Create high-converting product pages
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            icon="Bell"
            className="relative"
          >
            <span className="sr-only">Notifications</span>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"></div>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            icon="Settings"
          >
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;