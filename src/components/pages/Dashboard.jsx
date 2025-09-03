import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import TaskForm from "@/components/organisms/TaskForm";
import TaskList from "@/components/organisms/TaskList";
import CategoryManager from "@/components/organisms/CategoryManager";
import SearchBar from "@/components/molecules/SearchBar";
import FilterBar from "@/components/molecules/FilterBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { categoryService } from "@/services/api/categoryService";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    priority: "all"
  });

  React.useEffect(() => {
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

  const handleTaskAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleTasksChange = (updatedTasks) => {
    setTasks(updatedTasks);
  };

  const handleCategoriesUpdated = () => {
    loadCategories();
    setRefreshTrigger(prev => prev + 1);
  };

  const handleClearFilters = () => {
    setFilters({
      status: "all",
      category: "all",
      priority: "all"
    });
    setSearchQuery("");
  };

  const completedTasks = tasks.filter(task => task.completed && !task.archived).length;
  const totalTasks = tasks.filter(task => !task.archived).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Header
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          className="mb-8"
        />

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-100 p-6 mb-8 shadow-sm"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery("")}
                placeholder="Search your tasks..."
              />
            </div>
            <div className="flex items-center gap-4">
              <FilterBar
                filters={filters}
                onFiltersChange={setFilters}
                categories={categories}
                onClearFilters={handleClearFilters}
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowCategoryManager(true)}
                className="flex items-center gap-2 flex-shrink-0"
              >
                <ApperIcon name="Tag" className="h-4 w-4" />
                Categories
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Task Form */}
          <TaskForm
            onTaskAdded={handleTaskAdded}
            className="lg:sticky lg:top-8 lg:self-start"
          />

          {/* Task List */}
          <TaskList
            searchQuery={searchQuery}
            filters={filters}
            refreshTrigger={refreshTrigger}
            onTasksChange={handleTasksChange}
            className="space-y-4"
          />
        </div>

        {/* Category Manager Modal */}
        <CategoryManager
          isOpen={showCategoryManager}
          onClose={() => setShowCategoryManager(false)}
          onCategoriesUpdated={handleCategoriesUpdated}
        />
      </div>
    </div>
  );
};

export default Dashboard;