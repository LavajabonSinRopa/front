import React from "react";
import PiecesView from "./PiecesView";
import './BoardView.css';

const BoardView = ({ board }) => {
    if (board.length !== 6 || board.some(row => row.length !== 6)) {
        return <h1>ERROR: FORMATO DE TABLERO INCORRECTO</h1>;
    }

    return (
        <div className="board">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    {row.map((char, colIndex) => (
                        <div key={colIndex} className="piece">
                            <PiecesView color={char} />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default BoardView;
