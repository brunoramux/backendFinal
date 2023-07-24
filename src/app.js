const EventRepository = require("./repository");
const express = require('express');
const Container = require("./container");

const app = express();
app.use(express.json());
app.set('container', new Container());

app.get('/clients', async (request, response) => {

    const repository = await app.get('container').getRepository();
    const clients = await repository.findAll();

    response.json(clients);
});

app.post('/clients', async (request, response) => {

    const repository = await app.get('container').getRepository();

    try {
        const client = await repository.create(request.body);
        response.status(201).json(client);
    } catch (e) {
        response.status(500).json({error: e.message});
    }

});

app.get('/clients/:id', async(request, response) => {
    
    const repository = await app.get('container').getRepository();

    try {
        const client = await repository.findById(request.params.id);

        if (client === null) {
            response.status(404).json({
                status: 404,
                error: 'Cliente não encontrado'
            });
        } else {
            response.json(client);
        }
        
    } catch (e) {
        console.log(e);
        response.status(500).json({error: e.message});
    }
});

app.put('/clients/:id', async(request, response) => {

    const repository = await app.get('container').getRepository();
    const client = await repository.findById(request.params.id);
    
    if (client === null) {
        response.status(404).json({
            status: 404,
            error: 'Cliente não encontrado'
        });
    } else {
        const newClient = {...client, ...request.body};
        await repository.update(newClient);
        response.json(newClient);
    }
});

app.delete('/clients/:id', async(request, response) => {
    const repository = await app.get('container').getRepository();
    const client = await repository.findById(request.params.id);

    if (null !== client) {
        await repository.delete(client);
        response.sendStatus(204);
    } else {
        response.status(404).json({
            status: 404,
            error: 'Cliente não encontrado'
        });
    }
});

module.exports = app;