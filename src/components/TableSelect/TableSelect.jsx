import React, { useState } from 'react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { useDispatch } from 'react-redux'
import { changeDelivery } from '../../app/dataSlice'
import './TableSelect.style.scss'

const animatedComponents = makeAnimated()

export default function TableSelect({ options, id, provider }) {
  const selectOptions = options.map((option) => ({
    value: option.location,
    label: `${option.location}  Кол-во: ${option.quantity}. Срок доставки ${option.deliveryDelay} `,
    original: option,
    provider: provider,
    id,
  }))

  const dispatch = useDispatch()
  const [selected, setSelected] = useState(selectOptions[0])

  const handleChange = (selectedOption) => {
    setSelected(selectedOption)
    dispatch(changeDelivery(selectedOption))
  }

  return (
    <Select
      closeMenuOnSelect={true}
      components={animatedComponents}
      value={selected}
      onChange={handleChange}
      theme={(theme) => ({
        ...theme,
        borderRadius: 0,
        colors: {
          ...theme.colors,
          primary25: 'gray',
          primary: 'black',
        },
      })}
      options={selectOptions}
    />
  )
}
