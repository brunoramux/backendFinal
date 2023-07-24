const Container = require("./container");

describe("EventRepository", () => {

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

    test('Repositório deve criar um novo Cliente (C)', async () => {
        const result = await repository.create({
            name: 'Bruno Ramos Lemos',
            address: 'SGAN 94 Brasilia DF',
            fone: '16 994610753',
            email: 'bruno.lemos@live.com',
        });

        expect(result).toStrictEqual(expect.objectContaining({
            name: 'Bruno Ramos Lemos',
            address: 'SGAN 94 Brasilia DF',
            fone: '16 994610753',
            email: 'bruno.lemos@live.com',
        }));

        const clients = await repository.findAll();

        expect(clients.length).toBe(1);
    });
 
    test('Repositório deve listar todos os eventos (R)', async () => {

        await repository.create({
            name: 'Bruno Ramos Lemos',
            address: 'SGAN 94 Brasilia DF',
            fone: '16 994610753',
            email: 'bruno.lemos@live.com',
        });

        const result = await repository.findAll();

        expect(result.length).toBe(1);

        expect(result[0]).toStrictEqual(
            expect.objectContaining({
                name: 'Bruno Ramos Lemos',
                address: 'SGAN 94 Brasilia DF',
                fone: '16 994610753',
                email: 'bruno.lemos@live.com',
            })
        );
    });

    test('Repositório deve atualizar um evento (U)', async() => {

        const client = await repository.create({
            name: 'Bruno Ramos Lemos',
            address: 'SGAN 94 Brasilia DF',
            fone: '16 994610753',
            email: 'bruno.lemos@live.com',
        });

        client.fone = '16 999999999';
        await repository.update(client);
        
        // 4. certificar que o evento foi atualizado no banco de dados. - ok
        const result = await repository.findById(client._id);
        expect(result).toStrictEqual(expect.objectContaining({
            name: 'Bruno Ramos Lemos',
            address: 'SGAN 94 Brasilia DF',
            fone: '16 999999999',
            email: 'bruno.lemos@live.com',
        }));
    });

    test('Repositório deve remover um Cliente (D)', async() => {

        const client = await repository.create({
            name: 'Bruno Ramos Lemos',
            address: 'SGAN 94 Brasilia DF',
            fone: '16 994610753',
            email: 'bruno.lemos@live.com',
        });
        
        await repository.delete(client);

        const clients = await repository.findAll();
        expect(clients.length).toBe(0);
    });

    test('Repositorio não deve permitir remoção de Cliente sem id', async () => {

        const client = {
            name: 'Bruno Ramos Lemos',
            address: 'SGAN 94 Brasilia DF',
            fone: '16 994610753',
            email: 'bruno.lemos@live.com',
        };

        const expression = () => repository.delete(client);
        await expect(expression).rejects.toThrow('Cliente nao encontrado');
    });
});