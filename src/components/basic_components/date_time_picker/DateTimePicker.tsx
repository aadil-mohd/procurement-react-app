import { DatePicker } from 'antd';
import dayjs from 'dayjs';

interface IDateTimePicker {
    label: string;
    value: string;
    setValue: (val: string) => void;
    required?:boolean;
}

export default function DateTimePicker({ label, value, setValue ,required = false}: IDateTimePicker) {
    return (
        <div className="w-full">
            <label className="block text-sm font-medium mb-2">{label}</label>
            <DatePicker
                required={required}
                showTime={{ use12Hours: true }}
                value={value ? dayjs(value) : null}
                onChange={(val) => {
                    if (val) setValue(val.toISOString());
                    else setValue('');
                }}
                format="YYYY-MM-DD hh:mm A" // Note lowercase `hh` and uppercase `A`
                className="w-full p-2"
                placeholder="yyyy-mm-dd hh:mm a"
            />
        </div>
    );
}
