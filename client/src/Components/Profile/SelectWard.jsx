import { Select } from 'antd'
import { useEffect, useState } from 'react'

const SelectWard = ({ district, defaultValue, load, change, onChange }) => {
    const [wardData, setWardData] = useState([])
    const [currentWard, setCurrentWard] = useState()
    const [idDistrict, setIdDistrict] = useState(district)
    const [idWard, setIdWard] = useState()
    const [wardChange, setWardChange] = useState(false)

    const fetchWard = async (id = null) => {
        try {
            const resp = await fetch(
                `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${idDistrict}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        token: 'eab201ba-816f-11ed-a2ce-1e68bf6263c5',
                    },
                }
            )
            const resjson = await resp.json()
            let data = resjson.data
            data = data.filter((ward) => ward.NameExtension)

            let current
            if (id == null) current = data[0]
            else
                current = data.find(
                    (w) => w.WardCode.toString() === id.toString()
                )
            if (!((load === true || change === false) && wardChange === false))
                onChange(current)
            setCurrentWard(current)
            setWardData(data)
            return current
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchWard()

        return () => setWardData([])
    }, [idDistrict])

    useEffect(() => {
        setIdDistrict(district)

        return () => setWardData([])
    }, [district])

    const handleWardChange = async (e) => {
        const current = await fetchWard(e)
        onChange(current)
        setWardChange(true)
    }

    const currentValue = () => {}

    return (
        <div>
            <Select
                onChange={handleWardChange}
                // style={{ width: '200%' }}
                // options={ghnDistrict?.map((ward) => ({
                //     value: district.DistrictID,
                //     label: district.NameExtension[0],
                // }))}
                // defaultValue={props.defaultValue}
                // defaultValue={wardData[0].NameExtension[0]}
                value={
                    (load === false && change === true) || wardChange === true
                        ? currentWard?.NameExtension[0]
                        : defaultValue
                }
                // defaultValue={defaultValue}
            >
                {wardData?.map((ward) => (
                    <Select.Option key={ward.WardCode}>
                        {ward.NameExtension[0]}
                    </Select.Option>
                ))}
            </Select>
        </div>
    )
}

export default SelectWard
