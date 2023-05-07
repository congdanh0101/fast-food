import { useState } from "react";
import { createContext } from "react";


const BadgeContext = createContext()

function BadgeProvider (){

    const [count, setCount] = useState(0)

    return (
        <BadgeContext.Provider value={count}>
            
        </BadgeContext.Provider>
    )
}

export default BadgeProvider
