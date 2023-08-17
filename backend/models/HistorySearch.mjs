import mongoose, { Schema } from 'mongoose'

const moreInfoSchema = new Schema({
  title: String,
  id: String,
  value: String,
})

const availabilitySchema = new Schema({
  location: String,
  quantity: Number,
  deliveryDelay: Number,
  multiplicity: Number,
})

const offerSchema = new Schema({
  id: String,
  code: String,
  brand: String,
  description: String,
  price: Number,
  provider: String,
  providerEng: String,
  availability: [availabilitySchema],
  selectDelivery: availabilitySchema,
  retailPrice: Number,
})

const offersSchema = new Schema({
  categoryName: String,
  data: [offerSchema],
})

const histirySearchShema = new Schema(
  {
    moreInfo: [moreInfoSchema],
    offers: [offersSchema],
    searchCode: String,
    textForClient: String,
  },
  { timestamps: true },
)

const HistirySearch = mongoose.model('HistirySearch', histirySearchShema)

export default HistirySearch
