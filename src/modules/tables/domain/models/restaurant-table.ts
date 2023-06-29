export interface RestaurantTableProps {
    id: string;
    areaId: string;
    capacity: number;
    number: number;
    reservationDuration: {
        minutes: number,
        hours: number
    };
    schedule: { [day: string]: { start: string, end: string } };
}

export interface RestaurantTablePrimitiveProps extends RestaurantTableProps {
}

export default class RestaurantTable {

    constructor(private props: RestaurantTableProps) {

    }

    get id() {
        return this.props.id;
    }

    get number() {
        return this.props.number;
    }

    get capacity() {
        return this.props.capacity;
    }

    get reservationDuration() {
        return this.props.reservationDuration;
    }

    get schedule() {
        return this.props.schedule;
    }


    updateDetails(details: {
        areaId: string;
        capacity: number;
        number: number;
        reservationDuration: {
            minutes: number,
            hours: number
        };
        schedule: { [day: string]: { start: string, end: string } };
    }) {
        this.props.number = details.number;
        this.props.areaId = details.areaId;
        this.props.capacity = details.capacity;
        this.props.schedule = details.schedule;
        this.props.reservationDuration = details.reservationDuration;
    }

    static fromPrimitives(props: RestaurantTablePrimitiveProps) {
        return new RestaurantTable({
            ...props
        });
    }

    toPrimitives(): RestaurantTablePrimitiveProps {
        return {
            ...this.props
        };
    }
}
