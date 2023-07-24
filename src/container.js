const {MongoClient} = require('mongodb');
const ClientsRepository = require('./repository');

class Container {

    services = {};
    params = {};

    setParam(name, value) {
        this.params[name] = value;
    }

    getClient() { //criando cliente para conexao mongoDB

        if (this.services.client !== undefined) {
            return this.services.client;
        }

        const dsn = 'mongodb://root:root@localhost?retryWrites=true&writeConcern=majority'
        const client = new MongoClient(dsn);

        return this.services.client = client;
    }

    async getRepository() {

        if (this.services.repository !== undefined) {
            return this.services.repository;
        }

        const client = this.getClient();

        await client.connect();
        const collection = client.db('app_db').collection('clients');

        return this.services.repository = new ClientsRepository(collection);
    }
}

module.exports = Container;