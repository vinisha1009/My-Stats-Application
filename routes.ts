import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertTaskSchema, updateTaskSchema, insertXpEntrySchema } from "@shared/schema";
import { calculateXpForDifficulty, calculateLevelFromXp, calculateXpRequiredForLevel } from "../client/src/lib/xp-calculator";

// Authentication middleware
function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Tasks
  app.get("/api/tasks", requireAuth, async (req, res) => {
    try {
      const tasks = await storage.getTasks(req.user.id);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/realm/:realm", requireAuth, async (req, res) => {
    try {
      const { realm } = req.params;
      const tasks = await storage.getTasksByRealm(realm, req.user.id);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks for realm" });
    }
  });

  app.get("/api/tasks/caution", requireAuth, async (req, res) => {
    try {
      const tasks = await storage.getCautionTasks(req.user.id);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch caution tasks" });
    }
  });

  app.post("/api/tasks", requireAuth, async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse({ ...req.body, userId: req.user.id });
      const task = await storage.createTask(taskData);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  app.patch("/api/tasks/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = updateTaskSchema.parse(req.body);
      
      const existingTask = await storage.getTaskById(id, req.user.id);
      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Calculate XP gain if task completion changed
      if (updateData.completedLevels !== undefined && updateData.completedLevels > existingTask.completedLevels) {
        const levelsCompleted = updateData.completedLevels - existingTask.completedLevels;
        const xpPerLevel = calculateXpForDifficulty(existingTask.difficulty);
        const totalXpGain = levelsCompleted * xpPerLevel;

        // Add XP to user progress
        const userProgress = await storage.getUserProgressByType(existingTask.type, req.user.id);
        if (userProgress) {
          const newTotalXp = userProgress.totalXp + totalXpGain;
          const newLevel = calculateLevelFromXp(newTotalXp);
          const xpForCurrentLevel = calculateXpRequiredForLevel(newLevel);
          const currentXp = newTotalXp - xpForCurrentLevel;

          await storage.updateUserProgress(existingTask.type, req.user.id, {
            level: newLevel,
            currentXp,
            totalXp: newTotalXp,
          });
        }

        // Update task status if completed
        if (updateData.completedLevels >= existingTask.totalLevels) {
          updateData.status = 'completed';
          
          // Bonus XP for completion
          const bonusXp = Math.floor(xpPerLevel * 0.5);
          const userProgress = await storage.getUserProgressByType(existingTask.type, req.user.id);
          if (userProgress) {
            const newTotalXp = userProgress.totalXp + bonusXp;
            const newLevel = calculateLevelFromXp(newTotalXp);
            const xpForCurrentLevel = calculateXpRequiredForLevel(newLevel);
            const currentXp = newTotalXp - xpForCurrentLevel;

            await storage.updateUserProgress(existingTask.type, req.user.id, {
              level: newLevel,
              currentXp,
              totalXp: newTotalXp,
            });
          }
        } else if (updateData.completedLevels > 0 && existingTask.status === 'not_started') {
          updateData.status = 'in_progress';
        }
      }

      const updatedTask = await storage.updateTask(id, req.user.id, updateData);
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.json(updatedTask);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  app.delete("/api/tasks/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTask(id, req.user.id);
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // User Progress
  app.get("/api/progress", requireAuth, async (req, res) => {
    try {
      const progress = await storage.getUserProgress(req.user.id);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // XP Entries
  app.get("/api/xp-entries", requireAuth, async (req, res) => {
    try {
      const entries = await storage.getXpEntries(req.user.id);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch XP entries" });
    }
  });

  app.post("/api/xp-entries", requireAuth, async (req, res) => {
    try {
      const entryData = insertXpEntrySchema.parse({ ...req.body, userId: req.user.id });
      const xpAmount = calculateXpForDifficulty(entryData.difficulty);
      
      const entry = await storage.createXpEntry({
        ...entryData,
        xpAmount,
      });

      // Add XP to user progress
      const userProgress = await storage.getUserProgressByType(entryData.type, req.user.id);
      if (userProgress) {
        const newTotalXp = userProgress.totalXp + xpAmount;
        const newLevel = calculateLevelFromXp(newTotalXp);
        const xpForCurrentLevel = calculateXpRequiredForLevel(newLevel);
        const currentXp = newTotalXp - xpForCurrentLevel;

        await storage.updateUserProgress(entryData.type, req.user.id, {
          level: newLevel,
          currentXp,
          totalXp: newTotalXp,
        });
      }

      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid XP entry data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
