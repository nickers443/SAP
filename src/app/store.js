import { configureStore } from '@reduxjs/toolkit'
import dataSlice from './dataSlice'
import smsSlice from './smsSlice'

export const store = configureStore({
  reducer: {
    codeStore: dataSlice,
    smsStore: smsSlice,
  },
})
