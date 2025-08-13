import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const navigation = [
    {
      name: "Product Pages",
      href: "/",
      icon: "Package"
    },
    {
      name: "Collection Pages",
      href: "/collections",
      icon: "Grid3X3"
    }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <ApperIcon name="Zap" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-gray-900">
              PageBuilder Pro
            </h1>
            <p className="text-xs text-gray-500">E-commerce Builder</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-primary text-white shadow-lg"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`
                  }
                >
                  <ApperIcon 
                    name={item.icon} 
                    size={18} 
                    className={isActive ? "text-white" : "text-gray-500"}
                  />
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-100">
        <div className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <ApperIcon name="Sparkles" size={16} className="text-primary" />
            <span className="text-sm font-medium text-gray-900">Pro Tips</span>
          </div>
          <p className="text-xs text-gray-600">
            Use templates to create high-converting pages faster
          </p>
        </div>
      </div>
    </div>
  );

  // Desktop sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <SidebarContent />
    </div>
  );

  // Mobile sidebar
  const MobileSidebar = () => (
    <div className={`lg:hidden fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 left-0 w-64 z-50"
      >
        <SidebarContent />
      </motion.div>
    </div>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;