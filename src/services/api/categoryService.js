import { toast } from "react-toastify";

export const categoryService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "task_count_c"}},
          {"field": {"Name": "Tags"}}
        ],
        orderBy: [{"fieldName": "Name", "sorttype": "ASC"}]
      };
      
      const response = await apperClient.fetchRecords('category_c', params);
      
      if (!response.success) {
        console.error("Failed to fetch categories:", response.message);
        toast.error(response.message);
        return [];
      }
      
      // Map database fields to UI expected format
      return (response.data || []).map(category => ({
        Id: category.Id,
        name: category.Name,
        color: category.color_c || "#5B21B6",
        taskCount: category.task_count_c || 0,
        tags: category.Tags || ""
      }));
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error);
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
          {"field": {"Name": "Name"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "task_count_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await apperClient.getRecordById('category_c', parseInt(id), params);
      
      if (!response?.data) {
        throw new Error("Category not found");
      }
      
      // Map database fields to UI expected format
      const category = response.data;
      return {
        Id: category.Id,
        name: category.Name,
        color: category.color_c || "#5B21B6",
        taskCount: category.task_count_c || 0,
        tags: category.Tags || ""
      };
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error?.response?.data?.message || error);
      throw new Error("Category not found");
    }
  },

  async create(categoryData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          // Only include Updateable fields
          Name: categoryData.name,
          color_c: categoryData.color || "#5B21B6",
          task_count_c: 0
        }]
      };
      
      const response = await apperClient.createRecord('category_c', params);
      
      if (!response.success) {
        console.error("Failed to create category:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create category:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create category");
        }
        
        if (successful.length > 0) {
          const newCategory = successful[0].data;
          return {
            Id: newCategory.Id,
            name: newCategory.Name,
            color: newCategory.color_c || "#5B21B6",
            taskCount: newCategory.task_count_c || 0,
            tags: newCategory.Tags || ""
          };
        }
      }
      
      throw new Error("No data returned from create operation");
    } catch (error) {
      console.error("Error creating category:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, categoryData) {
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
          Name: categoryData.name,
          color_c: categoryData.color || "#5B21B6",
          task_count_c: categoryData.taskCount || 0
        }]
      };
      
      const response = await apperClient.updateRecord('category_c', params);
      
      if (!response.success) {
        console.error("Failed to update category:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update category:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update category");
        }
        
        if (successful.length > 0) {
          const updatedCategory = successful[0].data;
          return {
            Id: updatedCategory.Id,
            name: updatedCategory.Name,
            color: updatedCategory.color_c || "#5B21B6",
            taskCount: updatedCategory.task_count_c || 0,
            tags: updatedCategory.Tags || ""
          };
        }
      }
      
      throw new Error("No data returned from update operation");
    } catch (error) {
      console.error("Error updating category:", error?.response?.data?.message || error);
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
      
      // First update tasks to remove this category
      try {
        const tasksParams = {
          fields: [{"field": {"Name": "category_id_c"}}],
          where: [{"FieldName": "category_id_c", "Operator": "EqualTo", "Values": [parseInt(id)]}]
        };
        
        const tasksResponse = await apperClient.fetchRecords('task_c', tasksParams);
        
        if (tasksResponse.success && tasksResponse.data && tasksResponse.data.length > 0) {
          const taskUpdateParams = {
            records: tasksResponse.data.map(task => ({
              Id: task.Id,
              category_id_c: null // Clear the category reference
            }))
          };
          
          await apperClient.updateRecord('task_c', taskUpdateParams);
        }
      } catch (error) {
        console.error("Error updating tasks after category deletion:", error);
      }
      
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('category_c', params);
      
      if (!response.success) {
        console.error("Failed to delete category:", response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete category:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting category:", error?.response?.data?.message || error);
      throw error;
    }
  }
};