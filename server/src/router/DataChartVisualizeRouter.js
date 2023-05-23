const express = require('express')
const router = express.Router()
const DataChartVisualizeController = require('../controller/DataChartVisualizeController')

router.get('/overall', DataChartVisualizeController.getDataOverall)
router.get(
    '/revenue/last_n_days',
    DataChartVisualizeController.getRevenueLastSevenDays
)
router.get(
    '/details/revenue/last_n_days',
    DataChartVisualizeController.getDetailsRevenueLastNDays
)
router.get(
    '/overall/revenue/',
    DataChartVisualizeController.getOverallRevenue
)

module.exports = router
