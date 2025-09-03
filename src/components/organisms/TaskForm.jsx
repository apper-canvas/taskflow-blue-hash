import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";

const TaskForm = ({ onTaskAdded, className }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    categoryId: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = "Please select a category";
    }
    
    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const newTask = {
        ...formData,
        completed: false,
        archived: false,
        createdAt: new Date().toISOString()
      };
      
      await taskService.create(newTask);
      
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        categoryId: ""
      });
      
      toast.success("Task created successfully!");
      onTaskAdded?.();
    } catch (error) {
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl">
            <ApperIcon name="Plus" className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold font-display text-gray-900">
            Add New Task
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField
            label="Task Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter task title..."
            required
            error={errors.title}
          />

          <FormField
            label="Description"
            type="textarea"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Add task description (optional)..."
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Due Date"
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              min={getTodayDate()}
              error={errors.dueDate}
            />

            <FormField
              label="Priority"
              type="select"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </FormField>
          </div>

          <FormField
            label="Category"
            type="select"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            required
            error={errors.categoryId}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.Id} value={category.Id}>
                {category.name}
              </option>
            ))}
          </FormField>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating Task...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ApperIcon name="Plus" className="h-4 w-4" />
                  Add Task
                </div>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default TaskForm;