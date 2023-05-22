const DataChartVisualizeService = require("../service/DataChartVisualizeService")

class DataChartVisualizeController{

    async getDataOverall(req,res,next){
     
        try {
            const result = await DataChartVisualizeService.getDataOverall()
            return res.json(result)
        } catch (error) {
            return next(error)
        }

    }

}

module.exports = new DataChartVisualizeController()