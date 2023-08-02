import React from 'react'
import { useSelector } from 'react-redux'
import Skeleton from '../Skeleton/Skeleton'
import './SmsBalance.style.scss'

export default function SmsBalance({ style }) {
  const { balance, status } = useSelector((state) => state.smsStore)

  return (
    <div className="main smsBalance" style={style}>
      {status === 'pending' && (
        <p>
          Баланс СМС:
          <Skeleton width={75} height={20} />
        </p>
      )}
      {status === 'fulfilled' && <p>Баланс СМС: {balance}р</p>}
      {status === 'rejected' && <p>Error occurred while fetching balance</p>}
    </div>
  )
}
