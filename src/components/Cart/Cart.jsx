import React, { useState } from 'react'
import Popup from 'reactjs-popup'
import Button from '../Button/Button'
import PreOfferItem from '../PreOffer/PreOfferItem/PreOfferItem'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import MainInput from '../MainInput/MainInput'
import { saveData, setMoreInfo, setTextForClient } from '../../app/dataSlice'
import './Cart.style.scss'

export default function Cart() {
  const { offers, moreInfo } = useSelector((state) => state.codeStore)
  const [show, setShow] = useState(false)
  const dispatch = useDispatch()

  const [fields, setFields] = useState(moreInfo)

  const convertJsonToUserMessage = () => {
    let message = ''

    offers.forEach((category) => {
      const categoryName = category.categoryName
      message += categoryName + '\n'

      category.data.forEach((cross, index) => {
        let string =
          ` ${cross.brand} ${cross.retailPrice} ${cross.selectDelivery.deliveryDelay} день` + '\n'
        message += string
        if (index === category.data.length - 1) message += '\n'
      })
    })
    return message
  }

  const handleCopyToClipboard = () => {
    const message = convertJsonToUserMessage()
    navigator.clipboard.writeText(message)
    toast('Скопированно', {
      icon: '📑',
    })
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    setFields((prevFields) =>
      prevFields.map((field) => (field.id === id ? { ...field, value } : field)),
    )
  }

  const handleSave = () => {
    const message = convertJsonToUserMessage()
    dispatch(setTextForClient(message))
    dispatch(setMoreInfo(fields))
    dispatch(saveData())
  }

  return (
    <Popup
      trigger={
        <Button
          type="button"
          disabled={offers.length === 0}
          children="Корзина"
          className="cartWrapper"
        />
      }
      modal
      lockScroll
      nested>
      {(close) => (
        <div className="modal main">
          <Button type="button" className="close" onClick={close} icon="close" />
          <div className="modal__header">
            <Button
              type="button"
              onClick={handleCopyToClipboard}
              icon="faCopy"
              children="Скопировать"
              iconStyle={{ marginLeft: '8px' }}
            />
            <Button
              type="button"
              onClick={() => setShow(!show)}
              icon="faArrowDown"
              animation="rotate"
              children="Доп. поля"
              iconStyle={{ marginLeft: '8px' }}
            />
            <Button
              type="button"
              className="preOffer__button"
              children="Сохранить"
              onClick={handleSave}
              icon="save"
              iconStyle={{ marginLeft: '8px' }}
            />
            {show && (
              <form onChange={handleChange}>
                {fields.map((field) => (
                  <MainInput
                    title={field.title}
                    key={field.id}
                    id={field.id}
                    defaultValue={field.value}
                    style={{ border: '2px solid black', marginBottom: '8px' }}
                  />
                ))}
              </form>
            )}
          </div>
          <div className="modal__content">
            <h2>Список запчастей</h2>
            {offers.map((offer, index) => {
              return (
                <div key={index}>
                  <h3>{offer.categoryName}</h3>
                  {offer.data.map((item, index) => {
                    return (
                      <PreOfferItem
                        mode="cart"
                        key={index}
                        code={item.code}
                        brand={item.brand}
                        retailPrice={item.retailPrice}
                        selectDelivery={item.selectDelivery}
                        id={item.id}
                        deleteButton={false}
                      />
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </Popup>
  )
}
