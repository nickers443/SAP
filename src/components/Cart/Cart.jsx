import React from 'react'
import Popup from 'reactjs-popup'
import Button from '../Button/Button'
import './Cart.style.scss'
import { useSelector } from 'react-redux'
import PreOfferItem from '../PreOffer/PreOfferItem/PreOfferItem'

export default function Cart() {
  const offers = useSelector((state) => state.codeStore.offers)
  return (
    <Popup
      trigger={<Button type="button" children="Корзина" className="cartWrapper" />}
      modal
      lockScroll
      nested>
      {(close) => (
        <div className="modal main">
          <Button type="button" className="close" onClick={close} icon="close" />
          <div className="header"> Список запчастей </div>
          <div className="content">
            {offers.length === 0 && <h3>Корзина пуста</h3>}
            {offers.map((offer, index) => {
              return (
                <div key={index}>
                  <h3>{offer.categoryName}</h3>
                  {offer.data.map((item, index) => {
                    return (
                      <PreOfferItem
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
