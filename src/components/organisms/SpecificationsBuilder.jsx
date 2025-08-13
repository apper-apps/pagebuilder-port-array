import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Modal from "@/components/atoms/Modal";
import { cn } from "@/utils/cn";

const SpecificationsBuilder = ({ specifications = [], onChange }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSpec, setEditingSpec] = useState(null);
  const [newSpec, setNewSpec] = useState({
    category: "",
    name: "",
    value: "",
    type: "general"
  });

  const specificationTypes = [
    { id: "general", label: "General Information", icon: "Info" },
    { id: "dimensions", label: "Dimensions", icon: "Ruler" },
    { id: "technical", label: "Technical Specs", icon: "Settings" },
    { id: "package", label: "Package Contents", icon: "Package" }
  ];

  const handleAddSpecification = () => {
    if (!newSpec.category.trim() || !newSpec.name.trim() || !newSpec.value.trim()) {
      return;
    }

    const specification = {
      id: Date.now(),
      category: newSpec.category.trim(),
      name: newSpec.name.trim(),
      value: newSpec.value.trim(),
      type: newSpec.type
    };

    if (editingSpec) {
      const updatedSpecs = specifications.map(spec =>
        spec.id === editingSpec.id ? { ...specification, id: editingSpec.id } : spec
      );
      onChange(updatedSpecs);
      setEditingSpec(null);
    } else {
      onChange([...specifications, specification]);
    }

    setNewSpec({ category: "", name: "", value: "", type: "general" });
    setShowAddModal(false);
  };

  const handleEditSpecification = (spec) => {
    setEditingSpec(spec);
    setNewSpec({
      category: spec.category,
      name: spec.name,
      value: spec.value,
      type: spec.type
    });
    setShowAddModal(true);
  };

  const handleRemoveSpecification = (id) => {
    onChange(specifications.filter(spec => spec.id !== id));
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingSpec(null);
    setNewSpec({ category: "", name: "", value: "", type: "general" });
  };

  const groupedSpecifications = specifications.reduce((groups, spec) => {
    const key = `${spec.type}-${spec.category}`;
    if (!groups[key]) {
      groups[key] = {
        type: spec.type,
        category: spec.category,
        specs: []
      };
    }
    groups[key].specs.push(spec);
    return groups;
  }, {});

  const getTypeIcon = (type) => {
    const typeInfo = specificationTypes.find(t => t.id === type);
    return typeInfo ? typeInfo.icon : "Info";
  };

  const getTypeLabel = (type) => {
    const typeInfo = specificationTypes.find(t => t.id === type);
    return typeInfo ? typeInfo.label : "General";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Product Specifications
        </label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddModal(true)}
          type="button"
        >
          <ApperIcon name="Plus" size={16} />
          Add Specification
        </Button>
      </div>

      {Object.keys(groupedSpecifications).length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <ApperIcon name="FileText" size={48} className="text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 text-sm mb-4">
            No specifications added yet. Add product specifications to help customers understand your product better.
          </p>
          <Button
            variant="outline"
            onClick={() => setShowAddModal(true)}
            type="button"
          >
            <ApperIcon name="Plus" size={16} />
            Add First Specification
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.values(groupedSpecifications).map((group, groupIndex) => (
            <motion.div
              key={`${group.type}-${group.category}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <ApperIcon 
                    name={getTypeIcon(group.type)} 
                    size={16} 
                    className="text-primary" 
                  />
                  <h4 className="font-medium text-gray-900">
                    {group.category}
                  </h4>
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                    {getTypeLabel(group.type)}
                  </span>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100">
                <AnimatePresence>
                  {group.specs.map((spec, specIndex) => (
                    <motion.div
                      key={spec.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50"
                    >
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {spec.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">
                            {spec.value}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSpecification(spec)}
                          type="button"
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <ApperIcon name="Edit2" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSpecification(spec.id)}
                          type="button"
                          className="text-red-400 hover:text-red-600"
                        >
                          <ApperIcon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showAddModal}
        onClose={handleModalClose}
        title={editingSpec ? "Edit Specification" : "Add Specification"}
        size="md"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specification Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {specificationTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setNewSpec(prev => ({ ...prev, type: type.id }))}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border transition-all",
                    newSpec.type === type.id
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  )}
                >
                  <ApperIcon name={type.icon} size={16} />
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Category"
            placeholder="e.g., Physical Properties, Performance, etc."
            value={newSpec.category}
            onChange={(e) => setNewSpec(prev => ({ ...prev, category: e.target.value }))}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Specification Name"
              placeholder="e.g., Weight, Material, etc."
              value={newSpec.name}
              onChange={(e) => setNewSpec(prev => ({ ...prev, name: e.target.value }))}
              required
            />

            <Input
              label="Value"
              placeholder="e.g., 2.5 lbs, Aluminum, etc."
              value={newSpec.value}
              onChange={(e) => setNewSpec(prev => ({ ...prev, value: e.target.value }))}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={handleModalClose}
              type="button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSpecification}
              type="button"
              disabled={!newSpec.category.trim() || !newSpec.name.trim() || !newSpec.value.trim()}
            >
              {editingSpec ? "Update" : "Add"} Specification
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SpecificationsBuilder;