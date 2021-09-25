import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
   
    return (
        <button className={`square ${props.winnerSquare ? 'winnerSquare' : ''}`} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        let winnerSquare = this.props.winner && this.props.winner.winnerLine.includes(i)? true:false;
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                winnerSquare={winnerSquare}
            />
        );
    }

    render() {
        let boardSquare = [];
        for (let row = 0; row < 3; row++) {
            let boardRow = [];
            for (let col = 0; col < 3; col++) {
                boardRow.push(<span key={(row * 3) + col}>{this.renderSquare((row * 3) + col)}</span>)
            }
            boardSquare.push(<div className="board-row" key={row}>{boardRow}</div>)
        }
        return (
            <div>
                {boardSquare}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,//buoc di
            xIsNext: true,//xac dinh nguoi choi
            click: null,//vi tri khi click chuot 
            sort: true,//sort tang dan
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares)) {
            return;
        }
        if (squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                click: i
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const active = {
            fontWeight: 'bold'
        };

        const inactive = {
            fontWeight: 'normal'
        };

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const sortState = this.state.sort;// trang thai sap xep 
        const drawState = calculateDraw(current.squares);// trang thai hoa 

        let sortStatus;
        if (this.state.sort) {
            sortStatus = 'In ascending order'
        } else {
            sortStatus = 'In descending order'
        }

        const moves = history.map((step, move) => {
            const vitri = calculateStep(step.click);
            const desc = move ?
                'Go to move #' + move + ' (' + vitri + ')' :
                'Go to game start';
            return (
                <li key={move}>
                    <button style={this.state.stepNumber === move ? active : inactive} onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner.winner;
        } else if (drawState) {
            status = 'Draw game'
        }else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winner={winner}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{sortState ? moves : moves.reverse()}</ol>
                    <button onClick={() => this.setState({ sort: !this.state.sort })}>
                        {sortStatus}
                    </button>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a], 
                winnerLine: [a, b, c]
            };
        }
    }
    return null;
}
function calculateDraw(squares) {
    for (let i = 0; i < 9; i++) {
        if (squares[i] === null) return false;
    }
    return true;
}
function calculateStep(vitri) {
    let day;
    switch (vitri) {
        case 0:
            day = "0,0";
            break;
        case 1:
            day = "0,1";
            break;
        case 2:
            day = "0,2";
            break;
        case 3:
            day = "1,0";
            break;
        case 4:
            day = "1,1";
            break;
        case 5:
            day = "1,2";
            break;
        case 6:
            day = "2,0";
        case 7:
            day = "2,1";
            break;
        case 8:
            day = "2,2";
            break;
    }
    return day;
}
