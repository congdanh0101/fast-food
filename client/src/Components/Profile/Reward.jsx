import { Col, Modal, Row, Table } from 'antd'
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

    // useEffect(() => {
    //     const targetDate = new Date(item.expiryDate).getTime() // Set the target date here
    //     const intervalId = setInterval(() => {
    //         const now = new Date().getTime()
    //         const distance = targetDate - now
    //         const days = Math.floor(distance / (1000 * 60 * 60 * 24))
    //         const hours = Math.floor(
    //             (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    //         )
    //         const minutes = Math.floor(
    //             (distance % (1000 * 60 * 60)) / (1000 * 60)
    //         )
    //         const seconds = Math.floor((distance % (1000 * 60)) / 1000)
    //         if (days === 0 && hours === 0 && minutes === 0 && seconds === 0)
    //             setCountdown(null)
    //         else if (minutes === 0 && hours === 0 && days === 0)
    //             setCountdown(`${seconds}s`)
    //         else if (hours === 0 && days === 0)
    //             setCountdown(`${minutes}m ${seconds}s`)
    //         else if (days === 0)
    //             setCountdown(`${hours}h ${minutes}m ${seconds}s`)
    //         else setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`)
    //     }, 1000)
    //     return () => clearInterval(intervalId)
    // }, [])

    return (
        <div>
            {/* {countdown != null ? (
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
                        <Card.Title onClick={() => configModal(item)}>
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
                                {countdown}
                            </h4>
                        </Card.Text>
                    </Card.Body>
                </Card>
            ) : (
                <></>
            )} */}

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

    const fetchUser = async () => {
        try {
            const response = await axiosInstance.get(`/user/${userID}`)
            setUser(response.data)
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

    return (
        <div>
            <div>
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
