import React from 'react'
import Cell from './Cell'
import { calculateWinner } from '../../utils/helpers'

const Board = (props) => {
    const cells = [null, null, null, 'X', 'O', 'X', null, null, null]


    return (
        <div className="game-board">
            {props.cells.map((item, index) => (
                <Cell
                    key={index}
                    value={item}
                    onClick={() => props.onClick(index)}
                ></Cell>
            ))}
        </div>
    )
}

export default Board
