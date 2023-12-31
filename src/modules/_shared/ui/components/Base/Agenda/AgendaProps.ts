export interface AgendaProps {
    events: AgendaEvent[];
    onAddEvent?: (event: NewEvent) => any;
    onEventPress?: (eventId: string) => any;
    showControls?: boolean;
    onMonthChange: any;
}

type NewEvent = {
    date: Date;
}

type AgendaEvent = {
    id: string;
    title: string;
    date: Date;
}