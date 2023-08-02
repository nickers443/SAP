import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import SearchCode from './components/SearchCode/SearchCode'
import Table from './components/Table/Table'
import PreOffer from './components/PreOffer/PreOffer'
import SmsBalance from './components/SmsBalance/SmsBalance'
import { useDispatch } from 'react-redux'
import { fetchSmsBalance } from './app/smsSlice'
import './App.scss'

export default function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchSmsBalance())
  }, [])
  return (
    <div className="container">
      {
        <>
          <Toaster />
          <section
            style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'space-between' }}>
            <SearchCode />
            <SmsBalance style={{ flexBasis: '65%' }} />
          </section>
          <Table />
          <PreOffer />
        </>
      }
    </div>
  )
}
