import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import {
    GridComponent,
    TooltipComponent,
    TitleComponent,
    DatasetComponent,
    LegendComponent,
} from 'echarts/components'
import {
    CanvasRenderer,
    // SVGRenderer,
} from 'echarts/renderers'
import { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import request from '../../utils/axiosConfig'
import { Col, Row, Spin } from 'antd'
import OverallChart from './OverallChart'
import RevenueChart from './RevenueChart'

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    BarChart,
    LineChart,
    CanvasRenderer,
    DatasetComponent,
    LegendComponent,
])

const AdminDashboard = () => {
    const [loading, setLoading] = useState(false)
    const [dataOverall, setDataOverall] = useState({})

    const [optionsChart, setOptionChart] = useState({})

    const fetchDataOverall = async () => {
        try {
            setLoading(true)
            const response = await request.get('/data/chart/visualize/overall')
            setLoading(false)
            setDataOverall(response.data)
            const opts = {
                legend: {
                    orient: 'horizontal',
                    right: 100,
                    top: 'center',
                },
                tooltip: { position: 'top' },

                xAxis: { type: 'category', data: Object.keys(response.data) },
                yAxis: {},
                series: [
                    {
                        type: 'bar',
                        data: Object.values(response.data),
                        color: ['#dd6b66', '#759aa0'],
                    },
                ],
            }
            console.log(opts)
            setOptionChart(opts)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchDataOverall()

        return () => {
            setDataOverall({})
        }
    }, [])

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
            {/* <Spin spinning={loading}>
                <Row>
                    {Object.keys(dataOverall)?.map((item, index) => (
                        <Col span={5} offset={1} key={index}>
                            <div
                                style={{
                                    border: '1px solid',
                                    backgroundColor:'#FFE5B4',
                                    textAlign: 'center',
                                    width: '75%',
                                    boxShadow: '5px 7.5px #888888',
                                    marginTop: '5%',
                                    borderRadius: '30px',
                                }}
                            >
                                <h1 style={{left:0}}>{item}</h1>
                                <h1>{dataOverall[item]}</h1>
                            </div>
                        </Col>
                    ))}
                </Row>
                <ReactEChartsCore
                    echarts={echarts}
                    notMerge={true}
                    lazyUpdate={true}
                    option={optionsChart}
                />
            </Spin> */}
            <OverallChart />
            <RevenueChart />
        </div>
    )
}

export default AdminDashboard
