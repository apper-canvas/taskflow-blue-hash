import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

export const taskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "archived_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "Tags"}}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}]
      };
      
      const response = await apperClient.fetchRecords('task_c', params);
      
      if (!response.success) {
        console.error("Failed to fetch tasks:", response.message);
        toast.error(response.message);
        return [];
      }
      
      // Map database fields to UI expected format
      return (response.data || []).map(task => ({
        Id: task.Id,
        title: task.title_c || "",
        description: task.description_c || "",
        dueDate: task.due_date_c || "",
        priority: task.priority_c || "medium",
        categoryId: task.category_id_c || null,
        completed: task.completed_c || false,
        archived: task.archived_c || false,
        createdAt: task.created_at_c || new Date().toISOString(),
        tags: task.Tags || ""
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "archived_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await apperClient.getRecordById('task_c', parseInt(id), params);
      
      if (!response?.data) {
        throw new Error("Task not found");
      }
      
      // Map database fields to UI expected format
      const task = response.data;
      return {
        Id: task.Id,
        title: task.title_c || "",
        description: task.description_c || "",
        dueDate: task.due_date_c || "",
        priority: task.priority_c || "medium",
        categoryId: task.category_id_c || null,
        completed: task.completed_c || false,
        archived: task.archived_c || false,
        createdAt: task.created_at_c || new Date().toISOString(),
        tags: task.Tags || ""
      };
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      throw new Error("Task not found");
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          // Only include Updateable fields
          title_c: taskData.title,
          description_c: taskData.description || "",
          due_date_c: taskData.dueDate || null,
          priority_c: taskData.priority || "medium",
          category_id_c: taskData.categoryId ? parseInt(taskData.categoryId) : null,
          completed_c: taskData.completed || false,
          archived_c: taskData.archived || false,
          created_at_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('task_c', params);
      
      if (!response.success) {
        console.error("Failed to create task:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create task:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create task");
        }
        
        if (successful.length > 0) {
          const newTask = successful[0].data;
          return {
            Id: newTask.Id,
            title: newTask.title_c || "",
            description: newTask.description_c || "",
            dueDate: newTask.due_date_c || "",
            priority: newTask.priority_c || "medium",
            categoryId: newTask.category_id_c || null,
            completed: newTask.completed_c || false,
            archived: newTask.archived_c || false,
            createdAt: newTask.created_at_c || new Date().toISOString(),
            tags: newTask.Tags || ""
          };
        }
      }
      
      throw new Error("No data returned from create operation");
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Id: parseInt(id),
          // Only include Updateable fields
          title_c: taskData.title,
          description_c: taskData.description || "",
          due_date_c: taskData.dueDate || null,
          priority_c: taskData.priority || "medium",
          category_id_c: taskData.categoryId ? parseInt(taskData.categoryId) : null,
          completed_c: taskData.completed || false,
          archived_c: taskData.archived || false
        }]
      };
      
      const response = await apperClient.updateRecord('task_c', params);
      
      if (!response.success) {
        console.error("Failed to update task:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update task:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update task");
        }
        
        if (successful.length > 0) {
          const updatedTask = successful[0].data;
          return {
            Id: updatedTask.Id,
            title: updatedTask.title_c || "",
            description: updatedTask.description_c || "",
            dueDate: updatedTask.due_date_c || "",
            priority: updatedTask.priority_c || "medium",
            categoryId: updatedTask.category_id_c || null,
            completed: updatedTask.completed_c || false,
            archived: updatedTask.archived_c || false,
            createdAt: updatedTask.created_at_c || taskData.createdAt,
            tags: updatedTask.Tags || ""
          };
        }
      }
      
      throw new Error("No data returned from update operation");
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('task_c', params);
      
      if (!response.success) {
        console.error("Failed to delete task:", response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete task:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByCategory(categoryId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "archived_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        where: [{"FieldName": "category_id_c", "Operator": "EqualTo", "Values": [parseInt(categoryId)]}]
      };
      
      const response = await apperClient.fetchRecords('task_c', params);
      
      if (!response.success) {
        console.error("Failed to fetch tasks by category:", response.message);
        return [];
      }
      
      return (response.data || []).map(task => ({
        Id: task.Id,
        title: task.title_c || "",
        description: task.description_c || "",
        dueDate: task.due_date_c || "",
        priority: task.priority_c || "medium",
        categoryId: task.category_id_c || null,
        completed: task.completed_c || false,
        archived: task.archived_c || false,
        createdAt: task.created_at_c || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching tasks by category:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getCompleted() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "archived_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        where: [{"FieldName": "completed_c", "Operator": "EqualTo", "Values": [true]}]
      };
      
      const response = await apperClient.fetchRecords('task_c', params);
      
      if (!response.success) {
        console.error("Failed to fetch completed tasks:", response.message);
        return [];
      }
      
      return (response.data || []).map(task => ({
        Id: task.Id,
        title: task.title_c || "",
        description: task.description_c || "",
        dueDate: task.due_date_c || "",
        priority: task.priority_c || "medium",
        categoryId: task.category_id_c || null,
        completed: task.completed_c || false,
        archived: task.archived_c || false,
        createdAt: task.created_at_c || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching completed tasks:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getActive() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "archived_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        whereGroups: [{
          "operator": "AND",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "completed_c", "operator": "EqualTo", "values": [false]}
              ],
              "operator": "AND"
            },
            {
              "conditions": [
                {"fieldName": "archived_c", "operator": "EqualTo", "values": [false]}
              ],
              "operator": "AND"  
            }
          ]
        }]
      };
      
      const response = await apperClient.fetchRecords('task_c', params);
      
      if (!response.success) {
        console.error("Failed to fetch active tasks:", response.message);
        return [];
      }
      
      return (response.data || []).map(task => ({
        Id: task.Id,
        title: task.title_c || "",
        description: task.description_c || "",
        dueDate: task.due_date_c || "",
        priority: task.priority_c || "medium",
        categoryId: task.category_id_c || null,
        completed: task.completed_c || false,
        archived: task.archived_c || false,
        createdAt: task.created_at_c || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching active tasks:", error?.response?.data?.message || error);
      return [];
    }
}
};