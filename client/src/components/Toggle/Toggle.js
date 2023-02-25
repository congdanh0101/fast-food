import { useState } from 'react'
import './Toggle.css'
function Toggle() {
    const [on, setOn] = useState(false)
    const [count, setCount] = useState(1)
    console.log(count)
    const giaiThua = (n) => {
        if (n === 1) return 1
        return n * giaiThua(n - 1)
    }
    return (
        <div>
            <div
                className={`toggle ${on ? 'active' : ''}`}
                onClick={() => {
                    setOn((prev) => !prev)
                    setCount(count + 1)
                }}
            >
                <div className={`spinner ${on ? 'active' : ''}`}></div>
            </div>

            <div className="toggle-control">
                {/* <div className="toggle-on">
                    <button onClick={() => setOn(prev => !prev)}>
                        {!on ? 'ON' : 'OFF'}
                    </button>
                </div> */}
            </div>
            <div>{giaiThua(count)}</div>
        </div>
    )
}

export default Toggle
