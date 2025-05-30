import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { TypeORMPropertyRepository } from "../repositories/typeorm_property_repository";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { PropertyService } from "../../application/services/property_service";
import { PropertyController } from "./property_controller";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { UserEntity } from "../persistence/entities/user_entity";

const app = express();
app.use(express.json());

let dataSource: DataSource;
let propertyRepository: TypeORMPropertyRepository;
let propertyService: PropertyService;
let propertyController: PropertyController;

beforeAll(async () => {
    dataSource = new DataSource({
        type: "sqlite",
        database: ":memory:",
        dropSchema: true,
        entities: [PropertyEntity, BookingEntity, UserEntity],
        synchronize: true,
        logging: false,
    });

    await dataSource.initialize();

    propertyRepository = new TypeORMPropertyRepository(
        dataSource.getRepository(PropertyEntity)
    );

    propertyService = new PropertyService(propertyRepository);
  
    propertyController = new PropertyController(propertyService);
    
    app.post("/properties", (req, res, next) => {
        propertyController.createProperty(req, res).catch((err) => next(err));
    });
});

afterAll(async () => {
    await dataSource.destroy();
});

describe("PropertyController", () => {
  
    it("deve criar uma propriedade com sucesso", async () => {
        const payload = {
            name: "Beautiful Property",
            description: "A beautiful property",
            maxGuests: 4,
            basePricePerNight: 100
        };
        const response = await request(app).post("/properties").send(payload);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Property created successfully");
        expect(response.body.property).toHaveProperty("id");
        expect(response.body.property).toHaveProperty("name");
        expect(response.body.property).toHaveProperty("description");
        expect(response.body.property).toHaveProperty("maxGuests");
        expect(response.body.property).toHaveProperty("basePricePerNight");
        expect(response.body.property.name).toBe(payload.name);
        expect(response.body.property.description).toBe(payload.description);
        expect(response.body.property.maxGuests).toBe(payload.maxGuests);
        expect(response.body.property.basePricePerNight).toBe(payload.basePricePerNight);
    });

    it("deve retornar erro com código 400 e mensagem 'O nome é obrigatório.' ao enviar um nome vazio", async () => {
        const payload = {
            description: "Test Description",
            maxGuests: 0,
            basePricePerNight: 100
        };
        const response = await request(app).post("/properties").send(payload);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("O nome é obrigatório");
    });

    it("deve retornar erro com código 400 e mensagem 'A capacidade máxima deve ser maior que zero.' ao enviar maxGuests igual a zero ou negativo", async () => {

        const payload = {
            name: "Test Property",
            description: "Test Description",
            maxGuests: 0,
            basePricePerNight: 100
        };
        const response = await request(app).post("/properties").send(payload);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("A capacidade máxima deve ser maior que zero");
    });

    it("deve retornar erro com código 400 e mensagem 'O preço base por noite é obrigatório.' ao enviar basePricePerNight ausente", async () => {
        const payload = {
            name: "Test Property",
            description: "Test Description",
            maxGuests: 2
        };

        const response = await request(app).post("/properties").send(payload);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("O preço base por noite é obrigatório");
    });
});

