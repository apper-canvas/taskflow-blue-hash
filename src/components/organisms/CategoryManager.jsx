import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { categoryService } from "@/services/api/categoryService";

const CategoryManager = ({ 
  isOpen, 
  onClose, 
  onCategoriesUpdated 
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    color: "#5B21B6"
  });

  const colorOptions = [
    { value: "#5B21B6", name: "Purple" },
    { value: "#8B5CF6", name: "Violet" },
    { value: "#10B981", name: "Emerald" },
    { value: "#3B82F6", name: "Blue" },
    { value: "#EF4444", name: "Red" },
    { value: "#F59E0B", name: "Amber" },
    { value: "#EC4899", name: "Pink" },
    { value: "#6366F1", name: "Indigo" }
  ];

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      const newCategory = {
        ...formData,
        taskCount: 0
      };
      
      await categoryService.create(newCategory);
      setFormData({ name: "", color: "#5B21B6" });
      loadCategories();
      onCategoriesUpdated?.();
      toast.success("Category created successfully!");
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure? This will remove this category from all tasks.")) return;
    
    try {
      await categoryService.delete(categoryId);
      setCategories(prev => prev.filter(cat => cat.Id !== categoryId));
      onCategoriesUpdated?.();
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl max-h-[80vh] overflow-hidden"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl">
                <ApperIcon name="Tag" className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold font-display">
                Manage Categories
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <ApperIcon name="X" className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Add Category Form */}
            <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2">
                  <FormField
                    label="Category Name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter category name..."
                  />
                </div>
                <div>
                  <FormField
                    label="Color"
                    type="select"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  >
                    {colorOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.name}
                      </option>
                    ))}
                  </FormField>
                </div>
              </div>
              <div className="mt-4">
                <Button type="submit" variant="success" size="sm">
                  <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </form>

            {/* Categories List */}
            <div className="max-h-96 overflow-y-auto space-y-3">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading categories...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="Tag" className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No categories yet</p>
                  <p className="text-sm text-gray-400">Create your first category above</p>
                </div>
              ) : (
                <AnimatePresence>
                  {categories.map(category => (
                    <motion.div
                      key={category.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium font-display">
                          {category.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({category.taskCount} tasks)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.Id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default CategoryManager;