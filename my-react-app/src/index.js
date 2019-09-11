import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  render() {
    return (
      <button
        className={"square " + (this.props.isCurrentMove ? "bold " : "") + (this.props.isWinningSequence ? "bold " : "")}
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        key={i}
        isCurrentMove={i === this.props.history.slice(-1)[0].ind}
        isWinningSequence={this.props.matchResult && this.props.matchResult.winningSequence.indexOf(i) >= 0}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
      {
        Array(3).fill().map((_, i) => {
          return <div className="board-row" key={i}>
            {
              Array(3).fill().map((_, j) => this.renderSquare(3 * i + j))
            }
          </div>
        })
      }
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
        row: -1, col: -1, ind: -1
      }],
      historyOrder: 'ascending',
      stepNumber: 0,
      xIsNext: true,
      matchResult: null
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (this.state.matchResult || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{ squares, row: Math.floor(i / 3), col: i % 3, ind: i }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });

    this.setState({
      matchResult: calculateResult(squares)
    });


  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  toggleMoves() {
    this.setState({
      historyOrder: this.state.historyOrder === 'ascending' ? 'descending' : 'ascending'
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <div>
            {move === 0 ? '' : <span>row: {step.row}, col: {step.col}</span>}
          </div>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    if (this.state.historyOrder === 'descending') {
      moves.reverse();
    }

    let status;
    if (this.state.matchResult) {
      if (this.state.matchResult.winner !== 'Draw') {
        status = 'Winner: ' + this.state.matchResult.winner;
      } else {
        status = 'Drraaaw';
      }
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            history={this.state.history}
            matchResult={this.state.matchResult}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <div><button onClick={() => this.toggleMoves()}>Toggle moves</button></div>
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

function calculateResult(squares) {
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
        winningSequence: [a, b, c]
      }
    }
  }
  if (squares.every(x => x !== null)) {
    return {
      winner: 'Draw',
      winningSequence: []
    }
  }
  return null;
}
