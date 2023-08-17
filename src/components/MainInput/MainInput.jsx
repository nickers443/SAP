import React, { useEffect, useState } from 'react'
import './MainInput.style.scss'

export default function MainInput({
  value,
  onChange,
  status,
  title,
  error = null,
  style,
  id,
  defaultValue,
}) {
  if (typeof error === 'undefined') return
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  useEffect(() => {
    if (Boolean(error)) setIsPopupOpen(true)
    else setIsPopupOpen(false)
  }, [error])

  return (
    <label className="mainInput">
      <input
        className="mainInput__field"
        type="text"
        placeholder=" "
        value={value}
        style={style}
        id={id}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={status === 'pending' ? true : false}
      />
      <span className="mainInput__label">{title}</span>
      {isPopupOpen && (
        <span
          style={{
            position: 'absolute',
            top: -87,
            left: 0,
            backgroundColor: 'red',
            borderRadius: '8px',
            border: '2px solid black',
            padding: '8px',
          }}>
          {error}
        </span>
      )}
    </label>
  )
}
