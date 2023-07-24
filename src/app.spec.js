const app = require('./app');
const Container = require('./container');
const request = require('supertest')(app);

describe('Event Management API', () => {

    let repository;
    let client;

    beforeAll(async() => {
        const container = new Container();
        client = container.getClient();
        repository = await container.getRepository();
    });

    afterAll(async() => {
        await client.close();
    });

    beforeEach(async() => {
        await repository.deleteAll();
    });

    describe('Endpoints de coleção', () => {
        test('GET /clients', async () => {
            await repository.create({
                name: 'Bruno Ramos Lemos',
                address: 'SGAN 94 Brasilia DF',
                fone: '16 994610753',
                email: 'bruno.lemos@live.com',
            });

            const response = await request
                .get('/clients')
                .expect('Content-type', /application\/json/);

            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toStrictEqual(expect.objectContaining({
                name: 'Bruno Ramos Lemos',
                address: 'SGAN 94 Brasilia DF',
                fone: '16 994610753',
                email: 'bruno.lemos@live.com',
            }));
        });

        test('POST /clients', async () => {
            const client = {
                name: 'Bruno Ramos Lemos',
                address: 'SGAN 94 Brasilia DF',
                fone: '16 994610753',
                email: 'bruno.lemos@live.com',
            };

            const response = await request.post('/clients')
                .send(client);

            expect(response.statusCode).toBe(201);
            expect(response.body).toStrictEqual(expect.objectContaining(client));
        });
    });
    
    describe('Endpoints de item', () => {

        describe('GET /clients/:id', () => {
            test('Deve retornar 200 para um cliente existente', async() => {
                const client = await repository.create({
                    name: 'Bruno Ramos Lemos',
                    address: 'SGAN 94 Brasilia DF',
                    fone: '16 994610753',
                    email: 'bruno.lemos@live.com',
                });
                
                const response = await request.get(`/clients/${client._id}`)
                    .expect('Content-type', /application\/json/);

                expect(response.statusCode).toBe(200);
                
                expect(response.body).toStrictEqual(expect.objectContaining({
                    name: 'Bruno Ramos Lemos',
                    address: 'SGAN 94 Brasilia DF',
                    fone: '16 994610753',
                    email: 'bruno.lemos@live.com',
                }));
            });
            
            test('Deve retornar 404 para um evento inexistente', async() => {
                const response = await request.get('/clients/649b7a272150835d525b7335')
                    .expect('Content-type', /application\/json/);

                expect(response.statusCode).toBe(404);
                
                expect(response.body).toStrictEqual({
                    status: 404,
                    error: 'Cliente não encontrado'
                });
            });
        });

        describe('PUT /clients/:id', () => {
            test('Deve retornar 200 para um evento existente', async() => {
                const client = await repository.create({
                    name: 'Bruno Ramos Lemos',
                    address: 'SGAN 94 Brasilia DF',
                    fone: '16 994610753',
                    email: 'bruno.lemos@live.com',
                });

                const response = await request.put(`/clients/${client._id}`)
                    .send({
                        name: 'Bruno Ramos Lemos',
                        address: 'SGAN 94 Brasilia DF',
                        fone: '16 994610753',
                        email: 'bruno.lemos@live.com',
                    })
                    .expect('Content-type', /application\/json/);
                
                expect(response.statusCode).toBe(200);

                expect(response.body).toStrictEqual(expect.objectContaining({
                    name: 'Bruno Ramos Lemos',
                    address: 'SGAN 94 Brasilia DF',
                    fone: '16 994610753',
                    email: 'bruno.lemos@live.com',
                }));

                const newClient = await repository.findById(client._id);
                expect(newClient).toStrictEqual(expect.objectContaining({
                    name: 'Bruno Ramos Lemos',
                    address: 'SGAN 94 Brasilia DF',
                    fone: '16 994610753',
                    email: 'bruno.lemos@live.com',
                }));
            });

            test('Deve retornar 404 para um evento inexistente', async() => {
                const response = await request.put('/clients/649b7a272150835d525b7335')
                    .send({
                        name: 'Bruno Ramos Lemos',
                        address: 'SGAN 94 Brasilia DF',
                        fone: '16 994610753',
                        email: 'bruno.lemos@live.com',
                    })
                    .expect('Content-type', /application\/json/);

                expect(response.statusCode).toBe(404);
                
                expect(response.body).toStrictEqual({
                    status: 404,
                    error: 'Cliente não encontrado'
                });
            });
        });

        describe('DELETE /clients/:id', () => {
            test('Deve retornar 204 para um cliente existente', async() => {

                const client = await repository.create({
                    name: 'Bruno Ramos Lemos',
                    address: 'SGAN 94 Brasilia DF',
                    fone: '16 994610753',
                    email: 'bruno.lemos@live.com',
                });

                const response = await request.delete(`/clients/${client._id}`);

                expect(response.statusCode).toBe(204);

                expect(response.body).toStrictEqual({});

                const newClient = await repository.findById(client._id);
                expect(newClient).toBe(null);

            });

            test('Deve retornar 404 para um evento inexistente', async() => {
                const response = await request.delete('/clients/649b7a272150835d525b7335')
                    .expect('Content-type', /application\/json/);

                expect(response.statusCode).toBe(404);
                
                expect(response.body).toStrictEqual({
                    status: 404,
                    error: 'Cliente não encontrado'
                });
            });
        });
    });
});