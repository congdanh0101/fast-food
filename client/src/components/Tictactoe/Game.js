import { useState } from 'react'
import Board from './Board'
import './GameStyle.css'
import { calculateWinner } from '../../utils/helpers'
const Game = () => {
    const [board, setBoard] = useState(Array(9).fill(null))
    const [xIsNext, setXIsNext] = useState(true)
    const winner = calculateWinner(board)
    const [category, setCategory] = useState([])
    const handleClick = (index) => {
        const boardCopy = [...board]
        if (winner || boardCopy[index]) return
        boardCopy[index] = xIsNext ? 'X' : 'O'
        setBoard(boardCopy)
        setXIsNext(!xIsNext)
    }

    const handleResetGame = () => {
        setBoard(Array(9).fill(null))
        setXIsNext(true)
    }

    // if (category.length === 0) {
    // Promise.resolve(getData()).then((data) => setCategory(data))
    // }

    Promise.resolve(login())
        .then((data) => {
            if (data.accessToken)
                localStorage.setItem('token', data.accessToken)
        })
        .catch((err) => console.log(err))

    return (
        <div>
            <Board cells={board} onClick={handleClick}></Board>
            <button onClick={handleResetGame}>Reset game</button>
            <div>{winner ? `Winner is ${!xIsNext ? 'X' : 'O'}` : ''}</div>

            <div>
                {category.map((cate, index) => (
                    <ul key={index}>
                        <li>
                            {cate.fullName} | {cate.dob}
                        </li>
                    </ul>
                ))}
            </div>
            <div style={{fontSize:14}}>{localStorage.getItem('token')}</div>
        </div>
    )
}

async function getData() {
    const respone = await fetch('http://localhost:2001/api/user', {
        headers: new Headers({
            Authorization:
                'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2M2VmZDBhYTg4MmMyMWJkNTAxMWRjZTEiLCJpYXQiOjE2NzcyNzM2NzksImV4cCI6MTY3NzI3MzczOX0.ZumyuJkpUPZ2cI6JRC1xcR_McLDFekLrUISjj6ictZGDn8qQq58RjjMnJEtIrmP9JEtnFDVVuhnduUwNkIOijA',
            'Content-Type': 'application/json',
        }),
    })
    const data = await respone.json()
    return data
}

async function login() {
    const respone = await fetch('http://localhost:2001/api/auth/login', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: 'congdanh.01.0.222001@gmail.com',
            password: '123456',
        }),
    })
    const data = await respone.json()
    return data
}

export default Game
