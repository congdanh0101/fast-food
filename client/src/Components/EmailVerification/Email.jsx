import request from '../../utils/axiosConfig'
const { useState } = require('react')

const Email = () => {
    const [code, setCode] = useState('')
    console.log(code)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await request.post('/auth/verify/register', { code })

        console.log(res.data)
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>EMAIL VERIFICATION CODE</label>
                <input
                    type="text"
                    placeholder="your email verification code"
                    onChange={(e) => setCode(e.target.value)}
                />
                <button type="submit">submit</button>
            </form>
        </div>
    )
}

export default Email
