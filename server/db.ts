
import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGO_URI) {
  throw new Error(
    "MONGO_URI must be set. Did you forget to set the MongoDB connection string?",
  );
}

let client: MongoClient;
let db: Db;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URI!);
    await client.connect();
    db = client.db('blogDB');
  }
  return db;
}

export { connectToDatabase };
export const getDb = () => db;
