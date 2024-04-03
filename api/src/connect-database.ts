import { Database } from "@authorization-provider/core";

export async function connectDatabase () {
    const db = Database.getInstance();
    await db.connect('mongodb://root:example@localhost:27017/oauth?authSource=admin');
}