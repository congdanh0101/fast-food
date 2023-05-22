const express = require('express')
const router = express.Router()
const DataChartVisualizeController = require('../controller/DataChartVisualizeController')

router.get('/overall',DataChartVisualizeController.getDataOverall)

module.exports = router