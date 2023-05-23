const DataChartVisualizeService = require('../service/DataChartVisualizeService')

class DataChartVisualizeController {
    async getDataOverall(req, res, next) {
        try {
            const result = await DataChartVisualizeService.getDataOverall()
            return res.json(result)
        } catch (error) {
            return next(error)
        }
    }

    async getRevenueLastSevenDays(req, res, next) {
        const query = req.query.lastDays
        try {
            const result = await DataChartVisualizeService.getRevenueLastNDays(
                query
            )
            return res.json(result)
        } catch (error) {
            return next(error)
        }
    }

    async getDetailsRevenueLastNDays(req, res, next) {
        const query = req.query.lastDays
        try {
            const result =
                await DataChartVisualizeService.getDetailsRevenueLastNDays(
                    query
                )
            return res.json(result)
        } catch (error) {
            return next(error)
        }
    }
    
    async getOverallRevenue(req,res,next){
        const query = req.query
        try {
            
            const result = await DataChartVisualizeService.getOverallRevenue(query.fromDate,query.toDate)
            return res.json(result)

        } catch (error) {
            return next(error)
        }
    }
}

module.exports = new DataChartVisualizeController()
