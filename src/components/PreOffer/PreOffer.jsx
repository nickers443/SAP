import React, { useState } from 'react'
import MainInput from '../MainInput/MainInput'
import Cart from '../Cart/Cart'
import { useDispatch, useSelector } from 'react-redux'
import PreOfferItem from './PreOfferItem/PreOfferItem'
import Button from '../Button/Button'
import { addCategoryInOffers, clearPreOffer } from '../../app/dataSlice'
import './PreOffer.style.scss'

export default function PreOffer() {
  const dispatch = useDispatch()
  const preOffers = useSelector((state) => state.codeStore.preOffer)
  const [categoryName, setCategoryName] = useState('')
  const getCategoryName = preOffers[0]?.description.split(' ').slice(0, 2).join(' ')
  const handleChange = (e) => setCategoryName(e.target.value)
  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(
      addCategoryInOffers({
        categoryName: categoryName ? categoryName : getCategoryName,
        data: [...preOffers],
      }),
    )
    dispatch(clearPreOffer())
    setCategoryName('')
  }

  const preOfferData = useSelector((state) => state.codeStore.preOffer)

  return (
    <form className="preOffer main" onSubmit={handleSubmit}>
      <h3 className="preOffer__title">Предварительный список</h3>
      <MainInput
        value={getCategoryName ?? categoryName}
        onChange={handleChange}
        title={'Введите название категории'}
      />
      <Cart />
      {preOfferData.length >= 1 && (
        <section>
          {preOfferData.map((elem) => {
            return <PreOfferItem {...elem} key={elem.id} />
          })}
        </section>
      )}
      <Button
        type="submit"
        className="preOffer__button"
        children="Сохранить"
        icon="save"
        iconStyle={{ marginLeft: '8px' }}
      />
    </form>
  )
}
