import React from 'react'
import { Toaster } from 'react-hot-toast'
import SearchCode from './components/SearchCode/SearchCode'
import { useSelector } from 'react-redux'
import Table from './components/Table/Table'
import PreOffer from './components/PreOffer/PreOffer'
import './App.scss'

export default function App() {
  const { data } = useSelector((state) => state.codeStore)
  return (
    <div className="container">
      {
        <>
          <Toaster />
          <section
            style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'space-between' }}>
            <SearchCode />
          </section>
          <Table />
          <PreOffer />
        </>
      }
    </div>
  )
}
