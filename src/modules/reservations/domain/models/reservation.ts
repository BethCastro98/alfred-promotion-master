import ObjectUtils from '@utils/misc/object-utils';

interface ReservationClient {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string,
    allergies: string
}

interface ReservationTable {
    id: string;
    name: string;
    areaId: string;
}

interface ReservationRestaurant {
    id: string;
    name: string;
}

interface ReservationMall {
    id: string;
    name: string;
}

export interface ReservationProps {
    id: string;
    code: string,
    restaurant: ReservationRestaurant
    client: ReservationClient
    date: string,
    hour: string,
    table: ReservationTable,
    mall: ReservationMall,
    status: string;
    numberOfPeople: number;
    checkedIn: boolean;
    checkedInAt?: Date
}

export interface ReservationPrimitiveProps extends ReservationProps {

}

export default class Reservation {

    constructor(private props: ReservationProps) {

    }

    get id() {
        return this.props.id;
    }

    get clientId() {
        return this.props.client.id;
    }

    get mallId() {
        return this.props.mall.id;
    }

    get areaId() {
        return this.props.table.areaId;
    }

    get tableId() {
        return this.props.table.id;
    }

    get date() {
        return this.props.date;
    }

    get clientAllergies() {
        return this.props.client.allergies;
    }

    get hour() {
        return this.props.hour;
    }

    get clientName() {
        return `${this.props.client.firstName} ${this.props.client.lastName}`;
    }

    get tableNumber() {
        return this.props.table.name;
    }

    get mallName() {
        return this.props.mall.name;
    }

    get numberOfPeople() {
        return this.props.numberOfPeople;
    }

    get isCheckedIn() {
        return this.props.checkedIn;
    }

    checkIn() {
        this.props.checkedIn = true;
        this.props.checkedInAt = new Date();
    }

    updateInfo(info: Omit<Partial<ReservationProps>, 'id' | 'code' | 'createdAt'>) {
        this.props = ObjectUtils.merge(this.props, info);
    }

    static fromPrimitives(props: ReservationPrimitiveProps) {
        return new Reservation({
            ...props
        });
    }

    toPrimitives(): ReservationPrimitiveProps {
        return {
            ...this.props
        };
    }
}
