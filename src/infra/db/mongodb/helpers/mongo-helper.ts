import { Collection, MongoClient, ObjectId } from "mongodb";

interface MongoHelper {
    client: MongoClient | null;

    connect(url: string): Promise<void>;

    disconnect(): Promise<void>;

    getCollection(name: string): Collection;

    findOne(collectionName: string, itemId: any): Promise<any>;
}

export const MongoHelper: MongoHelper = {
    client: null,

    async connect(url: string): Promise<void> {
        this.client = await MongoClient.connect(process.env.MONGO_URL)
    },

    async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.close();
        }
    },

    getCollection(name: string): Collection {
        if (!this.client) {
            throw new Error('MongoDB connection not established');
        }
        return this.client.db().collection(name);
    },

    async findOne(collectionName: string, itemId: any): Promise<any> {
        const collection = await this.getCollection(collectionName);
        const insertedDocument = await collection.findOne({ _id: new ObjectId(itemId) });
        return insertedDocument;
    }
};
