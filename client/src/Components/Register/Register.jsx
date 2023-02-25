import { useState } from 'react'
import './register.css'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../../redux/apiRequest'
import axios from 'axios'

const Register = () => {
    const [email, setEmail] = useState('')
    const [fullName, setFullName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [dob, setDOB] = useState('')
    const [gender, setGender] = useState(true)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [address, setAddress] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()
        const userRegister = {
            email: email,
            fullName: fullName,
            phoneNumber: phoneNumber,
            dob: dob,
            gender: gender,
            password: password,
            confirmPassword: confirmPassword,
            address: address,
        }
        console.log(userRegister)
        registerUser(userRegister, dispatch, navigate)
        // const res = await axios.post(
        //     'http://localhost:2001/api/auth/register',
        //     userRegister
        // )
        // console.log(res.headers['set-cookie'])
    }

    return (
        <section className="register-container">
            <div className="register-title"> Sign up </div>
            <form onSubmit={handleRegister}>
                <label>Full name</label>
                <input
                    type="text"
                    placeholder="Enter your full name"
                    onChange={(e) => setFullName(e.target.value)}
                />

                <label>Phone number</label>
                <input
                    type="number"
                    placeholder="Enter your phone number"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />

                <label>Date of birth</label>
                <input type="date" onChange={(e) => setDOB(e.target.value)} />
                <label>Gender</label>
                <select
                    style={{ width: 100 }}
                    onChange={(e) => setGender(e.target.value)}
                >
                    <option value={true}>MALE</option>
                    <option value={false}>FEMALE</option>
                </select>
                <label>Address</label>
                <input
                    type="text"
                    placeholder="Enter your address"
                    onChange={(e) => setAddress(e.target.value)}
                />
                <label>Email</label>
                <input
                    type="text"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label>Password</label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label>Confirm password</label>
                <input
                    type="password"
                    placeholder="Enter your confirm password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit"> Create account </button>
            </form>
        </section>
    )
}

export default Register
