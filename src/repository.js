const mongo = require('mongodb');

// repository pattern
class ClientsRepository {

    collection;

    constructor(collection) {
        this.collection = collection;
    }

    async deleteAll() {
        await this.collection.deleteMany({});
    }

    async create(client) {
        await this.collection.insertOne(client);
        return client;
    }

    async findAll() {
        return (await this.collection.find({})).toArray();
    }

    async update(client) {
        await this.collection.updateOne({_id: client._id}, {$set: client});
    }

    async findById(id) {
        return await this.collection.findOne({_id: new mongo.ObjectId(id)});
    }

    async delete(client) {

        if (client._id === undefined) {
            throw new Error('Cliente nao encontrado');
        }

        await this.collection.deleteOne({_id: client._id});
    }
}

module.exports = ClientsRepository;