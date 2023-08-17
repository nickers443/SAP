import React from 'react'
import './TableHeader.style.scss'

export default function TableHeader({ header, title, value, onChange }) {
  const handleInputChange = (event) => {
    const newValue = event.target.value
    onChange(newValue)
  }
  return (
    <>
      <input type="text" value={value} onChange={handleInputChange} />
      <div className="tableHeader">{title}</div>
    </>
  )
}
