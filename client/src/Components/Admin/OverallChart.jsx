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

const OverallChart = () => {
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

    return (
        <div>
            <Spin spinning={loading} size="large" tip="Loading...">
                <Row>
                    {Object.keys(dataOverall)?.map((item, index) => (
                        <Col span={5} offset={1} key={index}>
                            <div
                                style={{
                                    border: '1px solid',
                                    backgroundColor: '#FFE5B4',
                                    textAlign: 'center',
                                    width: '75%',
                                    boxShadow: '5px 7.5px #888888',
                                    marginTop: '5%',
                                    borderRadius: '30px',
                                }}
                            >
                                <h1 style={{ left: 0 }}>{item}</h1>
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
            </Spin>
        </div>
    )
}

export default OverallChart
