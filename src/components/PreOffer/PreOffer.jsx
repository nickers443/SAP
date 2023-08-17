import React, { useEffect, useState } from 'react'
import MainInput from '../MainInput/MainInput'
import Cart from '../Cart/Cart'
import { useDispatch, useSelector } from 'react-redux'
import PreOfferItem from './PreOfferItem/PreOfferItem'
import Button from '../Button/Button'
import { addCategoryInOffers, clearPreOffer } from '../../app/dataSlice'
import './PreOffer.style.scss'

export default function PreOffer() {
  const dispatch = useDispatch()
  const { preOffer, status } = useSelector((state) => state.codeStore)
  const categoryNameOfCross = preOffer[0]?.description.split(' ').slice(0, 2).join(' ')

  const [categoryName, setCategoryName] = useState('')
  const handleChange = (e) => setCategoryName(e.target.value)
  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(
      addCategoryInOffers({
        categoryName: categoryName,
        data: [...preOffer],
      }),
    )
    dispatch(clearPreOffer())
    setCategoryName('')
  }

  useEffect(() => {
    if (categoryNameOfCross) setCategoryName(categoryNameOfCross)
    if (status === 'pending' || status === 'rejected') setCategoryName('')
  }, [categoryNameOfCross, status])

  return (
    <form className="preOffer main" onSubmit={handleSubmit}>
      <h3 className="preOffer__title">Предварительный список</h3>
      <MainInput
        value={categoryName}
        onChange={handleChange}
        title={'Введите название категории'}
      />
      <Cart />
      {preOffer.length >= 1 && (
        <section>
          {preOffer.map((elem) => {
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
