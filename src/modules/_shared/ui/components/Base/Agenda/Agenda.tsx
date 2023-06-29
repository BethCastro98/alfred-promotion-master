import React from 'react';
import { AgendaProps } from './AgendaProps';
import FullCalendar, { DateSelectArg, EventClickArg, EventContentArg } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useUtils } from '@modules/_shared/domain/hooks/use-utils';
import Text from '@main-components/Typography/Text';
import { useResetOnFocused } from '@modules/_shared/domain/hooks/useResetOnFocused';
import { Box } from '@main-components/Base/Box';
import DateTimeUtils from '@utils/misc/datetime-utils';

export function Agenda({ showControls = true, onMonthChange, calendarRef, ...props }: AgendaProps) {

    // const [currentEvents, setCurrentEvents] = useState(props.events);
    const { date: dateUtils } = useUtils();

    function handleDateSelect(selectInfo: DateSelectArg) {
        let calendarApi = selectInfo.view.calendar;
        calendarApi.unselect();

        props.onAddEvent?.({
            date: selectInfo.start
        });
    }

    function handleEventClick(clickInfo: EventClickArg) {
        props.onEventPress?.(clickInfo.event.id);
    }

    /*   function handleEvents(events: EventApi[]) {
           setCurrentEvents(events);
       }*/

    function handleMonthChange(payload) {

        const start = new Date(payload.startStr);
        const end = new Date(payload.endStr);

        onMonthChange({
            start: DateTimeUtils.startOfDay(start),
            end: DateTimeUtils.endOfDay(end)
        });
    }

    const { ready } = useResetOnFocused();

    function renderEventContent(eventContent: EventContentArg) {
        return (
                <>
                    <Box
                            width={'100%'}
                            flexDirection={'row'}
                    >
                        <Box flexShrink={0}>
                            <Text
                                    bold
                                    numberOfLines={1}
                            >{dateUtils.format(eventContent.event.start, 'HH:mm a')}</Text>
                        </Box>
                        <Box
                                flex={1}
                                ml={'s'}
                        >
                            <Text
                                    variant={'small'}
                                    numberOfLines={1}
                            >{eventContent.event.title}</Text>
                        </Box>
                    </Box>

                </>
        );
    }

    const hasEvents = !!props.onAddEvent;

    if (!ready) return <Box />;

    return (
            <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, interactionPlugin]}
                    headerToolbar={showControls ? {
                        left: 'prev,next today',
                        center: 'title',
                        right: ''
                    } : {
                        left: '',
                        center: 'title',
                        right: ''
                    }}
                    buttonText={{
                        today: 'Hoy'
                    }}
                    locale={'es'}
                    events={props.events}
                    initialView='dayGridMonth'
                    editable={false}
                    selectable={hasEvents}
                    selectMirror={hasEvents}
                    dayMaxEvents={true}
                    weekends={true}
                    select={handleDateSelect}
                    datesSet={handleMonthChange}
                    eventContent={renderEventContent}
                    eventClick={handleEventClick}
                    /*  eventsSet={handleEvents}*/
            />
    );

}

