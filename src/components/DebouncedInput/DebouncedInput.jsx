import React from 'react'
import './DebouncedInput.style.scss'

function DebouncedInput({ value: initialValue, onChange, debounce = 500, ...props }) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input
      {...props}
      className="debouncedInput"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

export default DebouncedInput
