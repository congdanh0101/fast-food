import { useState } from 'react'
import './register.css'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../../redux/apiRequest'

const Register = () => {
    const [email, setEmail] = useState('')
    const [fullName, setFullName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()
        const userRegister = {
            email: email,
            fullName: fullName,
            password: password,
            confirmPassword: confirmPassword,
        }
        console.log(userRegister)
        registerUser(userRegister, dispatch, navigate)
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
