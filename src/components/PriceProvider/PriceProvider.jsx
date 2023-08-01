import React from 'react'
import { useSelector } from 'react-redux'
import './PriceProvider.style.scss'

export default function PriceProvider(price, retailPrice) {
  const showProviderPrice = useSelector((state) => state.codeStore.margin.priceSettings.show)
  return (
    <div>
      {showProviderPrice && <p>Опт: {price}</p>}
      <span>Розница: {retailPrice}</span>
    </div>
  )
}
