import { Booking } from '../../../domain/entities/booking';
import { Property } from '../../../domain/entities/property';
import { User } from '../../../domain/entities/user';
import { DateRange } from '../../../domain/value_objects/date_range';
import { BookingEntity } from '../entities/booking_entity';
import { PropertyEntity } from '../entities/property_entity';
import { UserEntity } from '../entities/user_entity';
import { BookingMapper } from './booking_mapper';

describe('BookingMapper', () => {

    it('deve converter BookingEntity em Booking corretamente', () => {

        const propertyEntity: PropertyEntity = {
            id: '1',
            name: 'Apartamento',
            description: 'Um apartamento confortável',
            maxGuests: 4,
            basePricePerNight: 100,
            bookings: [],
        };

        const guestEntity: UserEntity = {
            id: '1',
            name: 'João',
        };

        const bookingEntity: BookingEntity = {
            id: '1',
            property: propertyEntity,
            guest: guestEntity,
            startDate: new Date('2023-10-01'),
            endDate: new Date('2023-10-05'),
            guestCount: 2,
            totalPrice: 500,
            status: 'CONFIRMED',
        }

        const booking = BookingMapper.toDomain(bookingEntity);

        expect(booking.getId()).toBe(bookingEntity.id);
        expect(booking.getProperty().getId()).toBe(propertyEntity.id);
        expect(booking.getProperty().getName()).toBe(propertyEntity.name);
        expect(booking.getProperty().getDescription()).toBe(propertyEntity.description);
        expect(booking.getProperty().getMaxGuests()).toBe(propertyEntity.maxGuests);
        expect(booking.getGuest().getId()).toBe(guestEntity.id);
        expect(booking.getGuest().getName()).toBe(guestEntity.name);
        expect(booking.getDateRange().getStartDate()).toEqual(bookingEntity.startDate);
        expect(booking.getDateRange().getEndDate()).toEqual(bookingEntity.endDate);
        expect(booking.getGuestCount()).toBe(bookingEntity.guestCount);
        expect(booking.getTotalPrice()).toBe(bookingEntity.totalPrice);
        expect(booking.getStatus()).toBe(bookingEntity.status);
    });

    it('deve lançar erro de validação ao faltar campos obrigatórios no BookingEntity', () => {

        const propertyEntity: PropertyEntity = {
            id: '1',
            name: 'Apartamento',
            description: 'Um apartamento confortável',
            maxGuests: 4,
            basePricePerNight: 100,
            bookings: [],
        };

        const guestEntity: UserEntity = {
            id: '1',
            name: 'João',
        };

        const bookingEntity = {
            property: propertyEntity,
            guest: guestEntity,
            startDate: new Date('2023-10-01'),
            endDate: new Date('2023-10-05'),
            guestCount: 2,
            totalPrice: 500,
            status: 'CONFIRMED',
        } as any; // Simulando falta de campo id

        expect(() => {
            BookingMapper.toDomain(bookingEntity)
        }).toThrow('O ID da reserva é obrigatório.');
    });

    it('deve converter Booking para BookingEntity corretamente', () => {

        const property: Property = new Property(
            '1',
            'Apartamento',
            'Um apartamento confortável',
            4,
            100,
        );
        const user: User = new User('1', 'João');
        const dateRange: DateRange = new DateRange(new Date('2023-10-01'), new Date('2023-10-05'));
        const booking: Booking = new Booking(
            '1',
            property,
            user,
            dateRange,
            2
        );

        const bookingEntity = BookingMapper.toPersistence(booking);
        
        expect(bookingEntity.id).toBe(booking.getId());
        expect(bookingEntity.property.id).toBe(property.getId());
        expect(bookingEntity.property.name).toBe(property.getName());
        expect(bookingEntity.property.description).toBe(property.getDescription());
        expect(bookingEntity.property.maxGuests).toBe(property.getMaxGuests());
        expect(bookingEntity.guest.id).toBe(user.getId());
        expect(bookingEntity.guest.name).toBe(user.getName());
        expect(bookingEntity.startDate).toEqual(booking.getDateRange().getStartDate());
        expect(bookingEntity.endDate).toEqual(booking.getDateRange().getEndDate());
        expect(bookingEntity.guestCount).toBe(booking.getGuestCount());
        expect(bookingEntity.totalPrice).toBe(booking.getTotalPrice());
        expect(bookingEntity.status).toBe(booking.getStatus());
    });
});