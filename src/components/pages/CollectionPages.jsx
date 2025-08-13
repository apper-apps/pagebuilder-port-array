import { motion } from "framer-motion";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const CollectionPages = () => {
  const handleCreateCollection = () => {
    // Future implementation for collection creation
    console.log("Create collection functionality would be implemented here");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Collection Pages
          </h1>
          <p className="text-gray-600">
            Create beautiful collection pages to showcase multiple products
          </p>
        </div>
      </div>

      <Empty
        title="Collection Pages Coming Soon"
        description="We're working on an amazing collection page builder that will let you create stunning product galleries, category pages, and curated collections."
        actionLabel="Get Notified"
        onAction={handleCreateCollection}
        icon="Grid3X3"
      />

      <div className="bg-gradient-to-br from-secondary/5 to-primary/5 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="bg-white p-3 rounded-xl">
            <ApperIcon name="Sparkles" size={24} className="text-secondary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              What's Coming in Collection Pages
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center gap-2">
                <ApperIcon name="Check" size={14} className="text-emerald-500" />
                <span>Drag & drop collection builder</span>
              </li>
              <li className="flex items-center gap-2">
                <ApperIcon name="Check" size={14} className="text-emerald-500" />
                <span>Multiple layout templates</span>
              </li>
              <li className="flex items-center gap-2">
                <ApperIcon name="Check" size={14} className="text-emerald-500" />
                <span>Smart product filtering</span>
              </li>
              <li className="flex items-center gap-2">
                <ApperIcon name="Check" size={14} className="text-emerald-500" />
                <span>Automated product recommendations</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {[
          {
            title: "Category Collections",
            description: "Group products by category with smart filtering",
            icon: "Grid3X3",
            color: "primary"
          },
          {
            title: "Featured Collections",
            description: "Showcase your best products in curated lists",
            icon: "Star",
            color: "secondary"
          },
          {
            title: "Seasonal Collections",
            description: "Create time-sensitive product groupings",
            icon: "Calendar",
            color: "accent"
          }
        ].map((item, index) => (
          <div key={index} className="card p-6 opacity-60">
            <div className={`bg-${item.color}/10 p-3 rounded-xl w-fit mb-4`}>
              <ApperIcon 
                name={item.icon} 
                size={24} 
                className={`text-${item.color}`}
              />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600">
              {item.description}
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500 font-medium">
                COMING SOON
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default CollectionPages;