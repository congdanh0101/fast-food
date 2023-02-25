import React from 'react'

const Cell = (props) => {
    // console.log(props)
    const { value, onClick } = props

    return (
        <div className="game-cell" onClick={props.onClick}>
            {props.value}
        </div>
    )
}

export default Cell
