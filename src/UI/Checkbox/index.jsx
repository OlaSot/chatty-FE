import React from 'react';

export default function Checkbox({
  onChange,
  isChecked,
  isTrue,
  setIsTrue,
  text,
  id,
}) {
  const changeOn = () => {
    setIsTrue(!isTrue);
  };
  const changeHandler = onChange ? onChange : changeOn;
  const checkHandler = isChecked ? isChecked : isTrue;

  return (
    <div className='post-header__checkbox'>
      <input
        type='checkbox'
        id={id}
        className='checkbox'
        data-test='checkbox'
        checked={checkHandler}
        onChange={changeHandler}
      />
      <label htmlFor={id}>{text}</label>
    </div>
  );
}
