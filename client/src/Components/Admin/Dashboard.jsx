import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import {
    GridComponent,
    TooltipComponent,
    TitleComponent,
    DatasetComponent,
} from 'echarts/components'
import {
    CanvasRenderer,
    // SVGRenderer,
} from 'echarts/renderers'
import { useState } from 'react'

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    BarChart,
    LineChart,
    CanvasRenderer,
    DatasetComponent,
])

const AdminDashboard = () => {
    const [loading, setLoading] = useState(false)
    const option = {
        title: { text: 'haha' },
        legend: {},
        tooltip: { position: 'top' },
        dataset: {
            // Provide a set of data.
            source: [
                ['Matcha Latte', 43.3, 85.8, 93.7],
                ['Milk Tea', 83.1, 73.4, 55.1],
                ['Cheese Cocoa', 86.4, 65.2, 82.5],
                ['Walnut Brownie', 72.4, 53.9, 39.1],
            ],
            dimensions: ['product', '2015', '2016', '2017'],
        },
        // Declare an x-axis (category axis).
        // The category map the first column in the dataset by default.
        xAxis: { type: 'category' },
        // Declare a y-axis (value axis).
        yAxis: {},
        // Declare several 'bar' series,
        // every series will auto-map to each column by default.
        series: [{ type: 'line' }, { type: 'bar' }, { type: 'bar' }],
    }
    return (
        <div>
            <ReactEChartsCore
                echarts={echarts}
                notMerge={true}
                lazyUpdate={true}
                option={option}
            />
        </div>
    )
}

export default AdminDashboard
