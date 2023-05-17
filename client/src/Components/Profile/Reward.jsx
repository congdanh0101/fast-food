import { Col, Modal, Row, Slider, Table } from 'antd'
import { createContext, useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import request from '../../utils/axiosConfig'
import moment from 'moment'
import axiosInstance from '../../utils/axiosInstance'

const current = moment()

const configModal = (item) => {
    Modal.info({
        title: 'Voucher information',
        content: (
            <>
                <h1>Description</h1>
                <ul>
                    {item.description?.map((descript) => (
                        <li>{descript}</li>
                    ))}
                </ul>
            </>
        ),
    })
}

const VoucherCard = ({ item, width }) => {
    const [countdown, setCountdown] = useState(null)
    return (
        <div>
            <Card border="dark" bg="light">
                <div
                    className=""
                    style={{ width: `${width}%` }}
                    onClick={() => configModal(item)}
                >
                    <img
                        src={
                            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS11onTcfNwCEY3_t152pKiWYJoTKKEaIVycw&usqp=CAU'
                        }
                    />
                </div>
                <Card.Body style={{ marginTop: 24 }}>
                    <Card.Title>
                        <h2>{item['code']}</h2>
                    </Card.Title>
                    <Card.Text>
                        <h3>
                            Expiry date:{' '}
                            {new Date(item.expiryDate).toLocaleDateString()}{' '}
                            {new Date(item.expiryDate).toLocaleTimeString()}
                        </h3>
                        <h4>
                            Remain:{' '}
                            {parseInt(
                                Math.min(
                                    Math.abs(
                                        new Date(item.expiryDate).getTime() -
                                            new Date().getTime()
                                    ) /
                                        (1000 * 60 * 60 * 24)
                                )
                            )}
                            days
                        </h4>
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}

const Reward = () => {
    // const user = JSON.parse(localStorage.getItem('user'))
    const userID = localStorage.getItem('userID')

    const [user, setUser] = useState({})
    const [rankingPoint, setRankingPoint] = useState(0)
    const fetchUser = async () => {
        try {
            const response = await axiosInstance.get(`/user/${userID}`)
            setUser(response.data)
            setRankingPoint(response.data.rankingPoint)
        } catch (error) {
            console.log(error)
        }
    }

    const [voucherList, setVoucherList] = useState([])

    const fetchVoucher = async () => {
        let listData = []
        for (var index = 0; index < user?.voucher?.length; index++) {
            try {
                const response = await request(
                    `/voucher/${user.voucher[index]}`
                )
                if (
                    response.data['isActive'] === false &&
                    response.data['isExpired'] === false &&
                    current.isSameOrBefore(response.data['expiryDate'])
                )
                    listData.push(response.data)
            } catch (error) {
                console.log(error)
            }
        }
        setVoucherList(listData)
    }
    useEffect(() => {
        fetchUser()

        return () => {
            setUser({})
        }
    }, [])

    useEffect(() => {
        fetchVoucher()

        return () => {
            setVoucherList([])
        }
    }, [user])

    const marks = {
        0: {
            label: <h3>ĐỒNG</h3>,
        },
        100: {
            label: <h3>BẠC (100)</h3>,
        },
        250: {
            label: <h3>VÀNG (250)</h3>,
        },
        500: {
            label: <h3>BẠCH KIM (500)</h3>,
        },
        1000: {
            label: <h3>KIM CƯƠNG (1000)</h3>,
        },
    }
    const markss = {
        0: '0°C',
        26: '26°C',
        37: '37°C',
        100: {
            style: {
                color: '#f50',
            },
            label: <strong>100°C</strong>,
        },
    }

    return (
        <div>
            <div>
                <Slider
                    marks={marks}
                    // defaultValue={parseInt(user.rankingPoint)}
                    style={{
                        marginLeft: '36px',
                        marginRight: '36px',
                        marginTop: '36px',
                    }}
                    max={1100}
                    // range={true}
                    value={[0, parseInt(user['rankingPoint'])]}
                    dis
                ></Slider>

                <ul
                    style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        fontSize: '2rem',
                    }}
                >
                    <li
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <p>Ranking points:</p>
                        <p style={{ color: 'red' }}>{user.rankingPoint}</p>
                    </li>
                    <li
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <p>Rank:</p>
                        <p style={{ color: 'red' }}>{user.rank}</p>
                    </li>
                    <li
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <p>Reward point:</p>
                        <p style={{ color: 'red' }}>{user.rewardPoint}</p>
                    </li>
                </ul>
            </div>

            <Row gutter={[40, 24]}>
                {voucherList?.map((item) => (
                    <Col span={6}>
                        <VoucherCard item={item} width={100} />
                    </Col>
                ))}
            </Row>
        </div>
    )
}

export default Reward
