import React from 'react'
import { useDispatch } from 'react-redux'
import { deletePreOfferItem } from '../../../app/dataSlice'
import Button from '../../Button/Button'
import './PreOfferItem.style.scss'

export default function PreOfferItem({
  code,
  brand,
  retailPrice,
  selectDelivery,
  id,
  deleteButton = true,
}) {
  const dispatch = useDispatch()

  const handleClick = (id) => {
    dispatch(deletePreOfferItem(id))
  }

  return (
    <div className="preOfferItem">
      <span>Артикул: {code}</span>
      <span>Производитель: {brand}</span>
      <span>Стоимость: {retailPrice}</span>
      <span>Склад: {selectDelivery.location}</span>
      <span>Доставка через: {selectDelivery.deliveryDelay} дней</span>
      {deleteButton && (
        <Button
          type="button"
          onClick={() => handleClick(id)}
          icon="close"
          className="preOfferItem__button"
        />
      )}
    </div>
  )
}
