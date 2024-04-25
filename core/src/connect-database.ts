import { Database } from "./database";

export async function connectDatabase () {
    Database.getInstance()
}