import { Select } from 'antd'
import { useEffect, useState } from 'react'

const SelectDistrict = (props) => {

    const[districtData, setDistrictData] = useState([])

    const fetchDistrict = async () =>{
        try {
            const resp = await fetch(
                `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=202`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        token: 'eab201ba-816f-11ed-a2ce-1e68bf6263c5',
                    },
                }
            )

            const resjson = await resp.json()
            const data = resjson.data
            data.splice(0, 3)
            data[3].NameExtension = ['Quận Thủ Đức']
            setDistrictData(data)
            return data
        } catch (error) {
            console.log(error)
        }
    }

    const handleDistrictChange = (e) => {
        console.log(e)
        const currentDistrict = districtData.find(district => district.DistrictID.toString() === e.toString())
        props.onChange(e,currentDistrict)
    }

    useEffect(()=>{

        fetchDistrict()

        return()=> setDistrictData([])

    },[])

    return (
        <div>
            <Select
                onChange={handleDistrictChange}
                // style={{ width: '200%' }}
                // options={ghnDistrict?.map((district) => ({
                //     value: district.DistrictID,
                //     label: district.NameExtension[0],
                // }))}
                defaultValue={props.defaultValue}
            >
                {districtData?.map((district) => (
                    <Select.Option key={district.DistrictID}>
                        {district.NameExtension[0]}
                    </Select.Option>
                ))}
            </Select>
        </div>
    )
}

export default SelectDistrict
