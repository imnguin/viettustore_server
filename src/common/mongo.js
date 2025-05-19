import mongodb from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const connectString = process.env.MONGO_URI ?? "";
const dbName = process.env.DBNAME_MONGO ?? "";
const MongoClient = mongodb.MongoClient;
let client = null;
let db = null;

const connect = async () => {
    if (client && client.topology && client.topology.isConnected()) {
        return;
    }
    try {
        client = await MongoClient.connect(connectString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 100,
            minPoolSize: 10,
        });
        db = client.db(dbName);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

const disConnect = async () => {
    try {
        if (client) {
            await client.close();
            client = null;
            db = null;
        }
    } catch (error) {
        console.error('MongoDB disconnect error:', error);
        throw error;
    }
};

const createdWithCollection = (collectionName) => {
    if (!db) {
        throw new Error('Database not initialized. Call connect before createdWithCollection.');
    }
    return db.collection(collectionName);
};

const get = async (collection, query = {}) => {
    try {
        return await collection.find(query).toArray();
    } catch (error) {
        throw error;
    }
};

const findOne = async (collection, query = {}) => {
    try {
        return await collection.findOne(query);
    } catch (error) {
        throw error;
    }
};

const insert = async (collection, object) => {
    try {
        if (Array.isArray(object)) {
            await collection.insertMany(object);
        } else {
            await collection.insertOne(object);
        }
    } catch (error) {
        throw error;
    }
};

const update = async (collection, object, filter, upsert = true) => {
    try {
        const newvalues = { $set: object };
        await collection.updateOne(filter, newvalues, { upsert });
    } catch (error) {
        throw error;
    }
};

const deleted = async (collection, filter) => {
    try {
        await collection.deleteOne(filter);
    } catch (error) {
        throw error;
    }
};

const deleteMany = async (collection, filter) => {
    try {
        const result = await collection.deleteMany(filter);
        return result;
    } catch (error) {
        throw error;
    }
};

const withMongo = async (collectionName, callback, retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await connect();
            const collection = createdWithCollection(collectionName);
            const result = await callback(collection);
            return result;
        } catch (error) {
            console.error(`Attempt ${attempt}/${retries} failed for ${collectionName}:`, error);
            if (attempt === retries) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, 100 * attempt));
        }
    }
};

// Đóng connection khi ứng dụng tắt
process.on('SIGINT', async () => {
    await disConnect();
    process.exit(0);
});

export const MongoData = {
    connect,
    disConnect,
    createdWithCollection,
    get,
    findOne,
    insert,
    update,
    deleted,
    withMongo,
    deleteMany
};