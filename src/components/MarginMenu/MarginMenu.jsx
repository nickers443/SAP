import React, { useCallback, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPercent, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'
import Popup from 'reactjs-popup'
import { useDispatch, useSelector } from 'react-redux'
import { changeMargin } from '../../app/dataSlice'
import './MarginMenu.style.scss'
import Button from '../Button/Button'

export default function MarginSection() {
  const { margin } = useSelector((state) => state.codeStore)

  const [formValue, setFormValue] = useState(margin)

  const dispatch = useDispatch()

  const [open, setOpen] = useState(false)
  const closeModal = useCallback(() => setOpen(false))

  function handleSubmit(e) {
    e.preventDefault()
    dispatch(changeMargin(formValue))
    closeModal()
  }

  const handleChange = (e) => {
    const { name, value, checked } = e.target
    setFormValue((prevFormData) => ({
      ...prevFormData,
      [name]: {
        ...formValue[name],
        margin: value > 100 ? 100 : value <= 0 ? 0 : value,
        show: checked,
      },
    }))
  }

  return (
    <div>
      <Button
        className="secretButton"
        type="button"
        onClick={() => setOpen((o) => !o)}
        icon="persent"
        iconSize="xs"
      />
      <Popup open={open} closeOnDocumentClick onClose={closeModal}>
        <div className="modal main">
          <Button className="close" onClick={closeModal} icon="close" iconSize="xs" />
          <div className="header"> Секретные настройки </div>
          <div className="content">
            Диапазон цен
            <form className="marginForm" onSubmit={(e) => handleSubmit(e)}>
              {Object.entries(formValue).map(([key, value]) => {
                return (
                  <label key={key} className="label">
                    {value.title}
                    <input
                      className="input"
                      name={key}
                      type={value.type}
                      value={value.margin}
                      onChange={(e) => handleChange(e)}
                      checked={value?.show}
                      pattern="^(100|[1-9]?\d)$"
                    />
                    {value.type !== 'checkbox' ? (
                      <FontAwesomeIcon className="inputIcon" icon={faPercent} size="xs" />
                    ) : (
                      <></>
                    )}
                  </label>
                )
              })}
              <Button
                icon="save"
                iconSize="1x"
                iconStyle={{ marginLeft: '8px' }}
                children="Сохранить"
              />
            </form>
          </div>
        </div>
      </Popup>
    </div>
  )
}
