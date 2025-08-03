import { users, tasks, userProgress, xpEntries, type User, type InsertUser, type Task, type InsertTask, type UpdateTask, type UserProgress, type InsertUserProgress, type XpEntry, type InsertXpEntry } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  
  // Tasks
  getTasks(userId: number): Promise<Task[]>;
  getTaskById(id: string, userId: number): Promise<Task | undefined>;
  getTasksByRealm(realm: string, userId: number): Promise<Task[]>;
  getCautionTasks(userId: number, notifyDays?: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, userId: number, task: UpdateTask): Promise<Task | undefined>;
  deleteTask(id: string, userId: number): Promise<boolean>;
  
  // User Progress
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getUserProgressByType(type: string, userId: number): Promise<UserProgress | undefined>;
  updateUserProgress(type: string, userId: number, progress: Partial<UserProgress>): Promise<UserProgress>;
  
  // XP Entries
  getXpEntries(userId: number): Promise<XpEntry[]>;
  createXpEntry(entry: InsertXpEntry): Promise<XpEntry>;

  sessionStore: session.SessionStore;
}

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    
    // Initialize user progress for the three main types
    const types = ['abilities', 'skills', 'physical'];
    for (const type of types) {
      await db.insert(userProgress).values({
        userId: user.id,
        type,
        level: 1,
        currentXp: 0,
        totalXp: 0,
      });
    }
    
    return user;
  }

  async getTasks(userId: number): Promise<Task[]> {
    return await db.select().from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(tasks.createdAt);
  }

  async getTaskById(id: string, userId: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    return task || undefined;
  }

  async getTasksByRealm(realm: string, userId: number): Promise<Task[]> {
    return await db.select().from(tasks)
      .where(and(eq(tasks.realm, realm), eq(tasks.userId, userId)))
      .orderBy(tasks.createdAt);
  }

  async getCautionTasks(userId: number, notifyDays = 7): Promise<Task[]> {
    const now = new Date();
    const allTasks = await db.select().from(tasks)
      .where(eq(tasks.userId, userId));
    
    return allTasks.filter(task => {
      if (!task.deadline || task.status === 'completed') return false;
      const deadlineDate = new Date(task.deadline);
      const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilDeadline <= (task.notifyDays || notifyDays) && daysUntilDeadline >= 0;
    }).sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values(insertTask)
      .returning();
    return task;
  }

  async updateTask(id: string, userId: number, updateTask: UpdateTask): Promise<Task | undefined> {
    const [task] = await db
      .update(tasks)
      .set({
        ...updateTask,
        completedAt: updateTask.status === 'completed' ? new Date() : undefined,
      })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    return task || undefined;
  }

  async deleteTask(id: string, userId: number): Promise<boolean> {
    const result = await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    return result.rowCount > 0;
  }

  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return await db.select().from(userProgress)
      .where(eq(userProgress.userId, userId));
  }

  async getUserProgressByType(type: string, userId: number): Promise<UserProgress | undefined> {
    const [progress] = await db.select().from(userProgress)
      .where(and(eq(userProgress.type, type), eq(userProgress.userId, userId)));
    return progress || undefined;
  }

  async updateUserProgress(type: string, userId: number, progressUpdate: Partial<UserProgress>): Promise<UserProgress> {
    const existing = await this.getUserProgressByType(type, userId);
    
    if (!existing) {
      const [newProgress] = await db
        .insert(userProgress)
        .values({
          userId,
          type,
          level: 1,
          currentXp: 0,
          totalXp: 0,
          ...progressUpdate,
        })
        .returning();
      return newProgress;
    }

    const [updated] = await db
      .update(userProgress)
      .set(progressUpdate)
      .where(and(eq(userProgress.type, type), eq(userProgress.userId, userId)))
      .returning();
    return updated;
  }

  async getXpEntries(userId: number): Promise<XpEntry[]> {
    return await db.select().from(xpEntries)
      .where(eq(xpEntries.userId, userId))
      .orderBy(xpEntries.createdAt);
  }

  async createXpEntry(insertEntry: InsertXpEntry): Promise<XpEntry> {
    const [entry] = await db
      .insert(xpEntries)
      .values(insertEntry)
      .returning();
    return entry;
  }
}

export const storage = new DatabaseStorage();
