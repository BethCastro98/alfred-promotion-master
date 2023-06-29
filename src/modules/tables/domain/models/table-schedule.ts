export interface TableScheduleProps {
    id: string;
    name: string
    restaurantId: string,
    schedule: { [day: string]: { start: string, end: string } };
}

export interface TableSchedulePrimitiveProps extends TableScheduleProps {
}

export default class TableSchedule {

    constructor(private props: TableScheduleProps) {

    }

    get id() {
        return this.props.id;
    }

    get name() {
        return this.props.name;
    }

    get schedule() {
        return this.props.schedule;
    }

    get restaurantId() {
        return this.props.restaurantId;
    }

    static fromPrimitives(props: TableSchedulePrimitiveProps) {
        return new TableSchedule({
            ...props
        });
    }

    updateDetails(details: {
        name: string,
        schedule: { [day: string]: { start: string, end: string } };
    }) {
        this.props.schedule = details.schedule;
    }

    toPrimitives(): TableSchedulePrimitiveProps {
        return {
            ...this.props
        };
    }
}
