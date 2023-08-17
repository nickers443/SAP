import React, { forwardRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark,
  faPercent,
  faFloppyDisk,
  faCirclePlus,
  faCircleInfo,
  faCopy,
  faArrowDown,
} from '@fortawesome/free-solid-svg-icons'
import './Button.style.scss'

const Button = forwardRef(
  (
    {
      style,
      disabled,
      children,
      onClick,
      type,
      className = '',
      icon,
      iconSize,
      iconStyle,
      form,
      animation = 'press',
    },
    ref,
  ) => {
    let symbol
    switch (icon) {
      case 'close':
        symbol = faXmark
        break

      case 'persent':
        symbol = faPercent
        break

      case 'save':
        symbol = faFloppyDisk
        break

      case 'circlePlus':
        symbol = faCirclePlus
        break

      case 'faCircleInfo':
        symbol = faCircleInfo
        break

      case 'faCopy':
        symbol = faCopy
        break

      case 'faArrowDown':
        symbol = faArrowDown
        break

      default:
        ''
        break
    }

    return (
      <button
        ref={ref}
        style={style}
        type={type}
        form={form}
        className={`button ${className} ${animation}`}
        disabled={disabled}
        onClick={onClick}>
        {children}
        {icon && <FontAwesomeIcon size={iconSize} icon={symbol} style={iconStyle} />}
      </button>
    )
  },
)

export default Button
