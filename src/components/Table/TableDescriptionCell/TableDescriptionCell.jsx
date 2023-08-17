import React, { useState } from 'react'
import TruncateText from '../../TruncateText/TruncateText'
import './TableDescriptionCell.style.scss'

export default function TableDescriptionCell({ cell }) {
  const [show, setShow] = useState(false)

  const Tooltip = ({ style }) => {
    return (
      <div className="tooltip" style={style}>
        <span>{cell.getValue()}</span>
        <div className="tooltip-arrow"></div>
      </div>
    )
  }
  return (
    <div
      className="tableDescriptionCell"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}>
      {show && <Tooltip />}
      <TruncateText text={cell.getValue()} maxWords={2} />
    </div>
  )
}
