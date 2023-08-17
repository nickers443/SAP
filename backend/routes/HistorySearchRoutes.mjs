import { Router } from 'express'
import {
  showAllQueryHistory,
  findQueryHistoryById,
  saveQueryHistory,
  updateQueryHistory,
  deleteOneQueryHistory,
} from '../controllers/HistorySearchController.mjs'

const router = Router()

router.get('/', showAllQueryHistory)
router.post('/find', findQueryHistoryById)
router.post('/save', saveQueryHistory)
router.post('/update', updateQueryHistory)
router.post('/delete', deleteOneQueryHistory)

export { router }
