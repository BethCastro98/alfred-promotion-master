import React from 'react';
import { BaseTimeInputProps } from './BaseTimeInputProps';
import DateTimeUtils from '@utils/misc/datetime-utils';
import BaseSelectPickerInput from '@main-components/Form/inputs/SelectInput/components/BaseSelectPickerInput';

const initialDate = new Date();

export default function BaseTimeInput(props: BaseTimeInputProps) {
    const date = props.value;


    return (
            /*    <DatePicker
                        {...props}
                        show={true}
                        onChange={(date) => {
                            props.onChangeText && props.onChangeText(date);
                        }}
                        value={date}
                        mode='time'
                        is24Hour={props.is24Hour ?? true}
                />*/
            /*<TimePicker
                    {...props}
                    value={date ? moment(date) : undefined}
                    onChange={(date) => {
                        props.onChangeText && props.onChangeText(date ? date?.toDate() : null);
                    }}
            />*/

            <TimeSelect
                    {...props}
                    value={date ? DateTimeUtils.fromTime(date) : undefined}
                    onChange={(date) => {
                        props.onChangeText && props.onChangeText(date);
                    }}
            />
    );
}

function TimeSelect(props) {

    const times = (() => {
        const times = [];
        let startTime = DateTimeUtils.fromTime('00:00');
        const endTime = DateTimeUtils.fromTime('23:59');


        while (startTime <= endTime) {
            times.push(DateTimeUtils.format(startTime, 'hh:mm A'));
            startTime = DateTimeUtils.addMinutes(startTime, 30);
        }

        return times;
    })();

    return (
            <BaseSelectPickerInput
                    {...props}
                    value={props.value ? DateTimeUtils.format(props.value, 'HH:mm') : undefined}
                    choices={times.map((e) => {
                        return { id: DateTimeUtils.format(DateTimeUtils.fromTime(e, 'hh:mm A'), 'HH:mm'), name: e };
                    })}
            />
    );
}