import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './styles.css';

const DateSelector = ({
  selectedDate,
  handleDateChange,
  maxDate,
  placeholderText,
}) => {
  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const oneDayAhead = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);

    return time >= oneDayAhead.getTime();
  };

  return (
    <div className='datePickerContainer'>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
        maxDate={maxDate}
        dateFormat='MM/dd/yyyy h:mm aa'
        showTimeSelect
        timeFormat='HH:mm'
        timeIntervals={15}
        timeCaption='time'
        wrapperClassName='datePickerWrapper'
        placeholderText={placeholderText}
        showPopperArrow={false}
        filterTime={filterPassedTime}
      />
    </div>
  );
};
export default DateSelector;
