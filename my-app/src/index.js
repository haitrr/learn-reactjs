import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
  
  class Board extends React.Component {
    renderSquare(i) {
      return <Square value={this.props.squares[i]} 
      onClick={() => this.props.onClick(i)}
      />;
    }
  
    render() {
      var rows = [];
      for(var i =0 ; i<3;i++){
        var cells = [];
        for(var j =0;j<3;j++){
          cells.push(this.renderSquare(i*3+j));
        }
        rows.push(<div className="board-row">
        {cells}
        </div>
        )
      }
      return rows;
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          move: null
        }],
        stepNumber: 0,
        xIsNext: true,
        sortHistoryIncreasing : false
      };
    }

    handleClick(i) {
      const history = this.state.history;
      const current = history[history.length - 1];
      const step = this.state.stepNumber;
      if(step !== history.length-1){
        alert("Please return to the latest step");
        return;
      }
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
          move: i
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    jumpTo(step) {
      if(!this.state.sortHistoryIncreasing){
        step = this.state.history.length - step-1;
    }
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });

    }

  handleSortChange(){
    this.setState({sortHistoryIncreasing: !this.state.sortHistoryIncreasing})
  }

    render() {
      const history = this.state.history.slice();
      const stepnumber = this.state.sortHistoryIncreasing ? this.state.stepNumber  : this.state.history.length -1 - this.state.stepNumber 


      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      if(!this.state.sortHistoryIncreasing){
        history.reverse();
      }

      const moves = history.map((step, move) => {
        const desc = step.move ?
          'Go to move #' + move + " <"+ calculateRowCol(step.move) +">":
          ('Go to game ' + (calculateWinner(step.squares) ? "end" : "start"));
        return (
          <li key={step.move}>
            <button onClick={() => this.jumpTo(move)}>{(stepnumber === move)?(<strong> {desc} </strong>):desc}</button>
          </li>
        );
      });
      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <p>History</p>
            <p>Sort increasing</p>
            <label className="switch">
            <input type="checkbox" onChange = {() => this.handleSortChange()}/>
            <span className="slider round"></span>
          </label>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

  function calculateRowCol(step){
    return [Math.floor(step/3),step%3];
  }

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
      return squares[a];
    }
  }
  return null;
}


  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  