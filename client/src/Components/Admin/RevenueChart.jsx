import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import {
    GridComponent,
    TooltipComponent,
    TitleComponent,
    DatasetComponent,
    LegendComponent,
    ToolboxComponent,
    DataZoomComponent,
} from 'echarts/components'
import {
    CanvasRenderer,
    // SVGRenderer,
} from 'echarts/renderers'
import { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import request from '../../utils/axiosConfig'
import { Col, Radio, Row, Spin } from 'antd'

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    BarChart,
    LineChart,
    CanvasRenderer,
    DatasetComponent,
    LegendComponent,
    ToolboxComponent,
    DataZoomComponent,
])

const RevenueChart = () => {
    const [loading, setLoading] = useState(false)
    const [optionsChart, setOptionChart] = useState({})
    const [dataRevenue, setDataRevenue] = useState({})
    const [selectRadio, setSelectRadio] = useState(null)
    // const fetchDataRevenue = async () => {
    //     try {
    //         setLoading(true)
    //         var url = `/data/chart/visualize/revenue/last_n_days`
    //         if (selectRadio != null) url += `?lastDays=${selectRadio}`
    //         const response = await request.get(url)
    //         setDataRevenue(response.data)
    //         const opts = {
    //             legend: {},
    //             tooltip: { position: 'top' },

    //             xAxis: { type: 'category', data: Object.keys(response.data) },
    //             yAxis: { type: 'value' },
    //             series: [
    //                 {
    //                     type: 'bar',
    //                     data: Object.values(response.data),
    //                     color: ['#dd6b66'],
    //                     showBackground: true,
    //                     backgroundStyle: {
    //                         color: 'rgba(180, 180, 180, 0.2)',
    //                     },
    //                 },
    //             ],
    //             title: {
    //                 text: 'Biểu đồ doanh thu và chi phí',
    //                 top: 'bottom',
    //                 textVerticalAlign: 'middle',
    //                 left: 'center',
    //                 textStyle: {
    //                     fontFamily: 'Arial',
    //                     fontWeight: 'bold',
    //                 },
    //             },
    //         }
    //         setOptionChart(opts)
    //         setLoading(false)
    //     } catch (error) {}
    // }

    const fetchDataOverallRevenue = async () => {
        try {
            setLoading(true)
            var url = `/data/chart/visualize/details/revenue/last_n_days`
            if (selectRadio != null) url += `?lastDays=${selectRadio}`
            const response = await request.get(url)
            // setDataRevenue(response.data)
            const dates = Object.keys(response.data)
            const subtotalBar = Object.values(response.data).map((value) =>
                typeof value === 'object' ? value.subtotal : value
            )
            const totalPriceBar = Object.values(response.data).map((value) =>
                typeof value === 'object' ? value.totalPrice : value
            )
            const discountBar = Object.values(response.data).map((value) =>
                typeof value === 'object' ? value.discount : value
            )
            const vatBar = Object.values(response.data).map((value) =>
                typeof value === 'object' ? value.vat : value
            )
            const feeShipBar = Object.values(response.data).map((value) =>
                typeof value === 'object' ? value.feeShip : value
            )

            var subtotal = 0
            var discount = 0
            var feeShip = 0
            var vat = 0
            var totalPrice = 0
            dates.map((item, index) => {
                subtotal += subtotalBar[index]
                discount += discountBar[index]
                feeShip += feeShipBar[index]
                vat += vatBar[index]
                totalPrice += totalPriceBar[index]
            })
            const dataRev = {
                'Tổng giá trị đơn': totalPrice,
                'Tổng thu': subtotal,
                'Tổng chiết khấu': discount,
                'Tổng thuế VAT': vat,
                'Tổng phí giao hàng': feeShip,
            }
            setDataRevenue(dataRev)

            const opts = {
                legend: {},
                tooltip: {
                    position: 'top',
                    trigger: 'axis',
                    axisPointer: {
                        // Use axis to trigger tooltip
                        type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
                    },
                },
                dataset: {
                    source: [
                        [
                            'date',
                            'Tổng thu',
                            'Tổng giá trị đơn',
                            'Tổng thuế VAT',
                            'Tổng chiết khấu',
                            'Tổng phí giao hàng',
                        ],
                        ...dates.map((date, index) => [
                            date,
                            subtotalBar[index],
                            totalPriceBar[index],
                            vatBar[index],
                            discountBar[index],
                            feeShipBar[index],
                        ]),
                    ],
                },
                xAxis: { type: 'category' },
                yAxis: {},
                series: [
                    { type: 'bar' },
                    { type: 'bar' },
                    { type: 'bar' },
                    { type: 'bar' },
                    { type: 'bar' },
                ],

                dataZoom: { type: 'slider' },
                toolbox: {
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none',
                        },
                        restore: {},
                        saveAsImage: {},
                    },
                },
                title: {
                    text: 'Biểu đồ doanh thu và chi phí',
                    top: 'bottom',
                    textVerticalAlign: 'middle',
                    left: 'center',
                    textStyle: {
                        fontFamily: 'Arial',
                        fontWeight: 'bold',
                    },
                },
            }
            setOptionChart(opts)
            setLoading(false)
        } catch (error) {}
    }

    useEffect(() => {
        // fetchDataRevenue()
        fetchDataOverallRevenue()
        return () => {
            setDataRevenue({})
            setOptionChart({})
        }
    }, [selectRadio])
    return (
        <div>
            <Spin spinning={loading} size="large" tip="Loading...">
                <Radio.Group
                    defaultValue="7"
                    buttonStyle="solid"
                    onChange={(e) => {
                        setSelectRadio(e.target.value)
                    }}
                >
                    <Radio.Button value="3">3 ngày trước</Radio.Button>
                    <Radio.Button value="7">7 ngày trước</Radio.Button>
                    <Radio.Button value="30">1 tháng trước</Radio.Button>
                </Radio.Group>
                <Row>
                    {Object.keys(dataRevenue)?.map((item, index) => (
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
                                <h1>{currencyFormat(dataRevenue[item])}</h1>
                            </div>
                        </Col>
                    ))}
                </Row>
                <ReactEChartsCore
                    echarts={echarts}
                    notMerge={true}
                    lazyUpdate={true}
                    option={optionsChart}
                    style={{ height: '500%' }}
                />
            </Spin>
        </div>
    )
}

const currencyFormat = (price) => (
    <h4 style={{ color: 'red' }}>
        {price.toLocaleString('it-IT', {
            style: 'currency',
            currency: 'VND',
        })}
    </h4>
)

export default RevenueChart
