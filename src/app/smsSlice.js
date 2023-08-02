import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import ky from 'ky'

export const fetchSmsBalance = createAsyncThunk('sms/fetchSmsBalance', async (_, thunkApi) => {
  try {
    const result = await ky.get('/getSmsBalance').json()
    return result.balance
  } catch (error) {
    return thunkApi.rejectWithValue({ error: error.message })
  }
})

const smsSlice = createSlice({
  name: 'sms',
  initialState: {
    balance: '',
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSmsBalance.pending, (state) => {
        state.status = 'pending'
        state.error = null
      })
      .addCase(fetchSmsBalance.fulfilled, (state, action) => {
        state.status = 'fulfilled'
        state.error = null
        state.balance = action.payload
      })
      .addCase(fetchSmsBalance, (state) => {
        state.status = 'rejected'
        state.error = action.payload.error
      })
  },
})

// export const {} = smsSlice.actions
export default smsSlice.reducer
