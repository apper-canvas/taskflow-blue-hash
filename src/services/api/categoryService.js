import categoriesData from "@/services/mockData/categories.json";
import { taskService } from "./taskService";

let categories = [...categoriesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const updateTaskCounts = async () => {
  try {
    const tasks = await taskService.getAll();
    categories = categories.map(category => ({
      ...category,
      taskCount: tasks.filter(task => 
        task.categoryId === category.Id && !task.archived
      ).length
    }));
  } catch (error) {
    console.error("Error updating task counts:", error);
  }
};

export const categoryService = {
  async getAll() {
    await delay(200);
    await updateTaskCounts();
    return [...categories];
  },

  async getById(id) {
    await delay(150);
    const category = categories.find(c => c.Id === parseInt(id));
    if (!category) {
      throw new Error("Category not found");
    }
    return { ...category };
  },

  async create(categoryData) {
    await delay(300);
    const maxId = categories.length > 0 ? Math.max(...categories.map(c => c.Id)) : 0;
    const newCategory = {
      ...categoryData,
      Id: maxId + 1,
      taskCount: 0
    };
    categories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, categoryData) {
    await delay(250);
    const index = categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Category not found");
    }
    categories[index] = { ...categoryData, Id: parseInt(id) };
    return { ...categories[index] };
  },

  async delete(id) {
    await delay(200);
    const index = categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Category not found");
    }
    
    // Update tasks to remove this category
    try {
      const tasks = await taskService.getAll();
      const tasksToUpdate = tasks.filter(task => task.categoryId === parseInt(id));
      
      for (const task of tasksToUpdate) {
        await taskService.update(task.Id, { ...task, categoryId: "" });
      }
    } catch (error) {
      console.error("Error updating tasks after category deletion:", error);
    }
    
    categories.splice(index, 1);
    return true;
  }
};