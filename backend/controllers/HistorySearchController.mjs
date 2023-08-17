import HistirySearch from '../models/HistorySearch.mjs'

function showAllQueryHistory(req, res, next) {
  HistirySearch.find()
    .then((response) => res.json({ response }))
    .catch((error) => res.json({ message: 'Не удалось загрузить список' }))
}

function findQueryHistoryById(req, res, next) {
  HistirySearch.findById()
    .then((response) => res.json({ response }))
    .catch((error) => res.json({ message: 'Не удалось найти' }))
}

function saveQueryHistory(req, res, next) {
  const histirySearch = new HistirySearch({
    moreInfo: req.body.moreInfo,
    offers: req.body.offers,
    searchCode: req.body.searchCode,
    textForClient: req.body.textForClient,
  })

  histirySearch
    .save()
    .then((response) =>
      res.json({
        message: 'История поиска сохранена',
      }),
    )
    .catch((error) => res.json({ message: 'Не удалось сохранить историю поиска' }))
}

function updateQueryHistory(req, res, next) {
  const queryHistoryId = req.body.findById

  const updatedQueryHistory = {
    moreInfo: req.body.moreInfo,
    offers: req.body.offers,
    searchCode: req.body.searchCode,
    textForClient: req.body.textForClient,
  }

  HistirySearch.findByIdAndUpdate(queryHistoryId, { $set: updatedQueryHistory }, { new: true })
    .then(() => {
      res.json({
        message: 'Объект был успешно изменен',
      })
    })
    .catch((error) => {
      message: 'Не удалось обновить объект'
    })
}

function deleteOneQueryHistory(req, res, next) {
  const idQueryHistory = req.body.id

  HistirySearch.findByIdAndRemove(idQueryHistory)
    .then((response) => res.json({ message: 'Объект удален' }))
    .catch((error) => res.json({ message: 'Не удалось удалить объект' }))
}

export {
  showAllQueryHistory,
  findQueryHistoryById,
  saveQueryHistory,
  updateQueryHistory,
  deleteOneQueryHistory,
}
