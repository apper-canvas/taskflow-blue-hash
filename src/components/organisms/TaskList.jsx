import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { format, isToday, isPast, parseISO } from "date-fns";
import Card from "@/components/atoms/Card";
import Checkbox from "@/components/atoms/Checkbox";
import Button from "@/components/atoms/Button";
import PriorityIndicator from "@/components/molecules/PriorityIndicator";
import CategoryBadge from "@/components/molecules/CategoryBadge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";

const TaskList = ({ 
  searchQuery, 
  filters, 
  refreshTrigger, 
  onTasksChange,
  className 
}) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      
      setTasks(tasksData);
      setCategories(categoriesData);
      onTasksChange?.(tasksData);
    } catch (err) {
      setError("Failed to load tasks");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      await taskService.update(task.Id, updatedTask);
      
      setTasks(prev => 
        prev.map(t => t.Id === task.Id ? updatedTask : t)
      );
      
      toast.success(
        updatedTask.completed ? "Task completed!" : "Task marked as active"
      );
      
      // Update parent component
      onTasksChange?.(tasks.map(t => t.Id === task.Id ? updatedTask : t));
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await taskService.delete(taskId);
      const updatedTasks = tasks.filter(t => t.Id !== taskId);
      setTasks(updatedTasks);
      onTasksChange?.(updatedTasks);
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.Id === parseInt(categoryId));
  };

  const getFilteredTasks = () => {
    let filtered = tasks.filter(task => !task.archived);

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter(task =>
        filters.status === "completed" ? task.completed : !task.completed
      );
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(task => 
        task.categoryId === filters.category
      );
    }

    // Priority filter
    if (filters.priority !== "all") {
      filtered = filtered.filter(task =>
        task.priority === filters.priority
      );
    }

    // Sort by completion status, then by priority, then by due date
    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority] || 0;
      const bPriority = priorityOrder[b.priority] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    
    try {
      const date = parseISO(dateString);
      
      if (isToday(date)) {
        return { text: "Today", isOverdue: false, isToday: true };
      }
      
      if (isPast(date)) {
        return { 
          text: format(date, "MMM d"), 
          isOverdue: true, 
          isToday: false 
        };
      }
      
      return { 
        text: format(date, "MMM d"), 
        isOverdue: false, 
        isToday: false 
      };
    } catch (error) {
      return null;
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const filteredTasks = getFilteredTasks();

  if (filteredTasks.length === 0) {
    if (searchQuery || filters.status !== "all" || filters.category !== "all" || filters.priority !== "all") {
      return (
        <Empty
          icon="Search"
          title="No matching tasks"
          description="Try adjusting your filters or search terms"
          action={{
            label: "Clear Filters",
            onClick: () => window.location.reload()
          }}
        />
      );
    }
    
    return (
      <Empty
        icon="CheckSquare"
        title="No tasks yet"
        description="Create your first task to get started with TaskFlow"
        action={{
          label: "Add Your First Task",
          onClick: () => document.querySelector('input[name="title"]')?.focus()
        }}
      />
    );
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        <AnimatePresence>
          {filteredTasks.map((task) => {
            const category = getCategoryById(task.categoryId);
            const dueDate = formatDueDate(task.dueDate);
            
            return (
              <motion.div
                key={task.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.2 }}
                className={task.completed ? "animate-fade-out" : ""}
              >
                <Card 
                  hover={!task.completed}
                  className={`p-5 ${task.completed ? "opacity-60" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <Checkbox
                        checked={task.completed}
                        onChange={() => handleToggleComplete(task)}
                        animated={true}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className={`font-bold font-display text-lg ${
                          task.completed 
                            ? "line-through text-gray-500" 
                            : "text-gray-900"
                        }`}>
                          {task.title}
                        </h3>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTask(task.Id)}
                          className="text-gray-400 hover:text-red-500 flex-shrink-0"
                        >
                          <ApperIcon name="Trash2" className="h-4 w-4" />
                        </Button>
                      </div>

                      {task.description && (
                        <p className={`text-gray-600 mb-3 leading-relaxed ${
                          task.completed ? "line-through" : ""
                        }`}>
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-4">
                          <PriorityIndicator 
                            priority={task.priority} 
                            animated={!task.completed}
                          />
                          
                          {category && (
                            <CategoryBadge category={category} />
                          )}
                        </div>

                        {dueDate && (
                          <div className={`flex items-center gap-2 text-sm font-medium ${
                            dueDate.isOverdue 
                              ? "text-red-600" 
                              : dueDate.isToday 
                                ? "text-amber-600" 
                                : "text-gray-500"
                          }`}>
                            <ApperIcon 
                              name={dueDate.isOverdue ? "AlertTriangle" : "Calendar"} 
                              className="h-4 w-4" 
                            />
                            {dueDate.text}
                            {dueDate.isOverdue && !task.completed && " (Overdue)"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskList;