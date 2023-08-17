import React from 'react'
import { useSelector } from 'react-redux'
import Skeleton from '../Skeleton/Skeleton'
import MarginSection from '../MarginMenu/MarginMenu'
import './SecondSection.style.scss'

export default function SecondSection({ style }) {
  const { balance, status } = useSelector((state) => state.smsStore)

  return (
    <div className="main secondSection" style={style}>
      <div className="smsBalance">
        {status === 'pending' && (
          <p>
            Баланс СМС:
            <Skeleton width={75} height={20} />
          </p>
        )}
        {status === 'fulfilled' && <p>Баланс СМС: {balance}р</p>}
        {status === 'rejected' && <p>Error occurred while fetching balance</p>}
      </div>
      <MarginSection />
    </div>
  )
}
