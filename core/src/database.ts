import mongoose from "mongoose";

export class Database {
  private static instance: Database;

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(uri: string): Promise<void> {
    try {
      await mongoose.connect(uri);
      console.log('Successfully connected to the database');
    } catch (error) {
      console.error('Database connection error', error);
      throw error;
    }
  }
}
