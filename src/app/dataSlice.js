import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-hot-toast'
import { retailMargin } from '../helpers/retailPrice'
import ky from 'ky'

export const fetchData = createAsyncThunk('data/fetchData', async (code, thunkApi) => {
  try {
    const {
      codeStore: { margin },
    } = thunkApi.getState()
    const result = await ky.get(`/sendCode?code=${code}`).json()
    const sources = Object.keys(result)
    const data = {}
    for (const source of sources) {
      if (source === 'mikado') {
        const addField = result[source].map((item) => ({
          ...item,
          selectDelivery: item.availability[0],
          retailPrice: retailMargin(item.price, margin),
        }))
        data[source] = addField
      }
      console.log(data)
      return data
    }
  } catch (error) {
    return thunkApi.rejectWithValue({ error: error.message })
  }
})

function clearState(state, action) {
  state.preOffer.splice(0, state.preOffer.length)
}

function addData(state, action) {
  clearState(state, action)
  state.data = action.payload
  state.status = 'fulfilled'
  toast.dismiss()
  toast.success('Данные загружены')
}

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    data: {
      mikado: [
        {
          id: '1mikado',
          code: 'ap175',
          brand: 'FILTRON',
          description: 'Фильтр возд..',
          price: 571,
          provider: 'Микадо',
          providerEng: 'mikado',
          availability: [
            {
              location: 'Симферополь',
              quantity: 1,
              deliveryDelay: 0,
            },
            {
              location: 'Севастополь',
              quantity: 1,
              deliveryDelay: 0,
            },
            {
              location: 'Евпатория',
              quantity: 1,
              deliveryDelay: 0,
            },
            {
              location: 'Краснодар',
              quantity: 1,
              deliveryDelay: 2,
            },
            {
              location: 'Пятигорск',
              quantity: 1,
              deliveryDelay: 2,
            },
            {
              location: 'Анапа',
              quantity: 1,
              deliveryDelay: 2,
            },
            {
              location: 'Ростов',
              quantity: 1,
              deliveryDelay: 2,
            },
            {
              location: 'Волгоград',
              quantity: 1,
              deliveryDelay: 2,
            },
            {
              location: 'Ставрополь',
              quantity: 1,
              deliveryDelay: 2,
            },
            {
              location: 'Астрахань',
              quantity: 1,
              deliveryDelay: 3,
            },
            {
              location: 'Самара',
              quantity: 1,
              deliveryDelay: 3,
            },
            {
              location: 'СПб',
              quantity: 5,
              deliveryDelay: 7,
            },
          ],
          selectDelivery: {
            location: 'Симферополь',
            quantity: 1,
            deliveryDelay: 0,
          },
          retailPrice: 750,
        },
      ],
    },
    status: 'idle',
    error: null,
    margin: {
      oneLevel: {
        title: '0 - 1000',
        margin: 30,
        type: 'number',
      },
      twoLevel: {
        title: '1001 - 4000',
        margin: 25,
        type: 'number',
      },
      treeLevel: {
        title: '4001 - 10000',
        margin: 20,
        type: 'number',
      },
      fourLevel: {
        title: '10000 и более',
        margin: 18,
        type: 'number',
      },
      priceSettings: {
        show: true,
        title: 'Показывать оптовые цены?',
        type: 'checkbox',
      },
    },
    offers: [],
    preOffer: [],
  },
  reducers: {
    changeMargin(state, action) {
      state.margin = { ...action.payload }
      const sources = Object.keys(state.data)
      const data = {}
      for (const source of sources) {
        const addField = state.data[source].map((item) => ({
          ...item,
          retailPrice: retailMargin(item.price, state.margin),
        }))
        data[source] = addField
        state.data = { ...data }
      }
      toast.success('Сохранения вступили в силу')
    },
    addPreOrderItem(state, action) {
      const comparison = state.preOffer.find((item) => item.id === action.payload.id)
      if (state.preOffer.length === 0 || typeof comparison === 'undefined') {
        state.preOffer.push(action.payload)
      }
    },
    changeDelivery(state, action) {
      const keys = Object.keys(state.data)
      for (const key of keys) {
        if (key === action.payload.provider) {
          const result = state.data[key].map((item) => {
            if (item.id === action.payload.id) {
              return {
                ...item,
                selectDelivery: action.payload.original,
              }
            } else {
              return item
            }
          })
          state.data[key] = result
        }
      }
    },
    deletePreOfferItem(state, action) {
      const result = state.preOffer.filter((item) => item.id !== action.payload)
      state.preOffer = result
    },
    addCategoryInOffers(state, action) {
      state.offers.push(action.payload)
    },
    clearPreOffer: clearState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = 'pending'
        state.error = null
        toast.loading('Загрузка')
      })
      .addCase(fetchData.fulfilled, addData)
      .addCase(fetchData.rejected, (state, action) => {
        state.status = 'rejected'
        state.error = action.payload.error
        toast.dismiss()
        toast.error(`Произошла ошибка: ${state.error}}`)
      })
  },
})

export const {
  changeMargin,
  addPreOrderItem,
  changeDelivery,
  deletePreOfferItem,
  addCategoryInOffers,
  clearPreOffer,
} = dataSlice.actions
export default dataSlice.reducer
