import { Property } from '../../../domain/entities/property';
import { PropertyEntity } from '../entities/property_entity';
import { PropertyMapper } from './property_mapper';

describe('PropertyMapper', () => {

    it('deve converter PropertyEntity em Property corretamente', () => {
        const propertyEntity: PropertyEntity = {
            id: '1',
            name: 'Apartamento',
            description: 'Um apartamento confortável',
            maxGuests: 4,
            basePricePerNight: 100,
            bookings: [],
        }

        const property = PropertyMapper.toDomain(propertyEntity);

        expect(property.getId()).toBe(propertyEntity.id);
        expect(property.getName()).toBe(propertyEntity.name);
        expect(property.getDescription()).toBe(propertyEntity.description);
        expect(property.getMaxGuests()).toBe(propertyEntity.maxGuests);
        expect(property.getBasePricePerNight()).toBe(propertyEntity.basePricePerNight);
    });

    it('deve lançar erro de validação ao faltar campos obrigatórios no PropertyEntity', () => {
        const propertyEntity = {
            id: '1',
            name: 'Apartamento',
            description: 'Um apartamento confortável',
            maxGuests: 4,
            bookings: [],
        } as any; // Simulando falta de campo basePricePerNight

        expect(() => {
            PropertyMapper.toDomain(propertyEntity)
        }).toThrow('Preço base por noite é obrigatório');
    });

    it('deve converter Property para PropertyEntity corretamente', () => {
        const property: Property = new Property(
            '1',
            'Apartamento',
            'Um apartamento confortável',
            4,
            100,
        );

        const propertyEntity = PropertyMapper.toPersistence(property);
        
        expect(propertyEntity.id).toBe(property.getId());
        expect(propertyEntity.name).toBe(property.getName());
        expect(propertyEntity.description).toBe(property.getDescription());
        expect(propertyEntity.maxGuests).toBe(property.getMaxGuests());
        expect(propertyEntity.basePricePerNight).toBe(property.getBasePricePerNight());
    });
});