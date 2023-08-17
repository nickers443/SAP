import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-hot-toast'
import { addRetailPrice, retailMargin } from '../helpers/retailPrice'
import ky from 'ky'

export const fetchData = createAsyncThunk('data/fetchData', async (code, thunkApi) => {
  try {
    const {
      codeStore: { margin },
    } = thunkApi.getState()

    const result = await ky.get(`/sendCode?code=${code}`).json()

    return result.map((el) => {
      if (el === 'Ничего не найдено') return el

      if (el.provider !== 'mikado') {
        return {
          provider: el.provider,
          result: el.result.map((brandItem) => {
            return {
              ...brandItem,
              math: brandItem.math.length !== 0 ? addRetailPrice(brandItem.math, margin) : [],
              crosses: brandItem.crosses.map((cross) => addRetailPrice(cross, margin)),
            }
          }),
        }
      } else {
        return {
          provider: el.provider,
          result: el.result.map((item) => {
            return addRetailPrice(item, margin)
          }),
        }
      }
    })
  } catch (error) {
    console.log(error)
    return thunkApi.rejectWithValue({ error: error.message })
  }
})

export const saveData = createAsyncThunk('data/saveData', async (_, thunkApi) => {
  try {
    const {
      codeStore: { searchCode, textForClient, moreInfo, offers },
    } = thunkApi.getState()
    const saveData = {
      searchCode,
      textForClient,
      moreInfo,
      offers,
    }
    console.log(saveData)
    return saveData
  } catch (error) {
    console.log(error)
    return thunkApi.rejectWithValue({ error: error.message })
  }
})

function clearPreOfferState(state) {
  state.preOffer.splice(0, state.preOffer.length)
}

function getBrands(action) {
  const result = []
  action.payload.forEach((provider) => {
    if (provider.provider !== 'mikado') {
      provider.result.forEach((brand) => {
        result.push(brand.brand)
      })
    }
  })
  return result
}

function addData(state, action) {
  clearState(state, action)
  const brands = getBrands(action)

  state.data = action.payload
  state.brands = brands
  state.status = 'fulfilled'
  toast.dismiss()
  toast.success('Данные загружены')
}

const initialStateMoreInfo = [
  {
    title: 'Клиент',
    id: 'client',
    value: '',
  },
  {
    title: 'Контакты',
    id: 'contacts',
    value: '',
  },
  {
    title: 'Vin',
    id: 'vin',
    value: '',
  },
  {
    title: 'Авто',
    id: 'car',
    value: '',
  },
]

function clearState(state) {
  state.status = 'idle'
  state.error = null
  state.data = []
  state.brands = []
  state.offers = []
  state.preOffer = []
  state.selectedBrand = ''
  state.selectedData = []
  state.moreInfo = initialStateMoreInfo
  state.textForClient = ''
}

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    data: [],
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
    searchCode: '',
    offers: [],
    preOffer: [],
    brands: [],
    selectedBrand: '',
    selectedData: [],
    moreInfo: initialStateMoreInfo,
    textForClient: '',
  },
  reducers: {
    selectData(state, action) {
      state.selectedData = action.payload
    },
    selectBrand(state, action) {
      state.selectedBrand = ''
      state.selectedBrand = action.payload
    },
    changeMargin(state, action) {
      state.margin = { ...action.payload }
      const addField = state.selectedData.map((item) => ({
        ...item,
        retailPrice: retailMargin(item.price, state.margin),
      }))

      state.selectedData = addField
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
    setMoreInfo(state, action) {
      state.moreInfo = action.payload
    },
    setTextForClient(state, action) {
      state.textForClient = action.payload
    },
    clearPreOffer: clearPreOfferState,
  },
  extraReducers: (bulder) => {
    bulder
      .addCase(fetchData.pending, (state, action) => {
        state.searchCode = ''
        state.status = 'pending'
        state.error = null
        state.data = []
        state.brands = []
        state.preOffer = []
        state.selectedData = []
        state.searchCode = action.meta.arg
        toast.loading('Загрузка')
      })
      .addCase(fetchData.fulfilled, addData)
      .addCase(fetchData.rejected, (state, action) => {
        state.status = 'rejected'
        state.error = action.payload.error
        state.data = []
        state.brands = []
        state.preOffer = []
        state.selectedData = []
        state.searchCode = ''
        toast.dismiss()
        toast.error(`Произошла ошибка: ${state.error}}`)
      })
      .addCase(saveData.pending, (state, action) => {
        toast.loading('Загрузка')
      })
      .addCase(saveData.fulfilled, (state, action) => {
        state.searchCode = ''
        clearState(state)
        toast.dismiss()
        toast.success('Данные сохранены')
      })
      .addCase(saveData.rejected, (state, action) => {
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
  selectBrand,
  selectData,
  setMoreInfo,
  setTextForClient,
} = dataSlice.actions
export default dataSlice.reducer
