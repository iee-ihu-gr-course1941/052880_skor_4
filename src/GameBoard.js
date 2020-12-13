import React, { Component } from "react";
import Cell from "./Cell";
import language from "./helper/language";
import EnglishFlag from "./img/English.svg";
import GreekFlag from "./img/Greek.svg";
import "./GameBoard.css";

export default class GameBoard extends Component {
  //We set default props for table rows / columns in case we want to make array size customizable!
  static defaultProps = { nRows: 6, nCols: 7 };
  constructor(props) {
    super(props);
    this.state = {
      gameBoard: new Array(this.props.nRows)
        .fill(0)
        .map(() => new Array(this.props.nCols).fill(0)),
      activePlayer: Math.ceil(Math.random() * 2),
      orangeWins: 0,
      blueWins: 0,
      winner: false,
      victoriousPlayer: null,
      disabled: false,
      winSet: [],
      language: "English",
    };
    this.resetBoard = this.resetBoard.bind(this);
    this.resetScore = this.resetScore.bind(this);
    this.toggleLanguage = this.toggleLanguage.bind(this);
  }

  tableBoard() {
    let row = [];
    let boardContainer = [];
    let board = this.state.gameBoard;
    for (let i = 0; i < this.props.nRows; i++) {
      if (!row[i]) row[i] = [];
      if (!boardContainer[i]) boardContainer[i] = [];
      for (var j = 0; j < this.props.nCols; j++) {
        let cellNum = `${i}-${j}`;
        row[i].push(
          <Cell
            key={cellNum}
            cellNum={cellNum}
            player={board[i][j]}
            dropPiece={() => this.dropPiece(cellNum)}
            disabled={board[i][j] === -1 ? true : false}
            isWinner={
              this.state.winSet.indexOf(`${i},${j}`) !== -1 ? true : false
            }
          />
        );
      }
      boardContainer[i].push(<tr key={i}>{row[i]}</tr>);
    }

    return boardContainer;
  }

  dropPiece(cellNum) {
    let active = this.state.activePlayer;
    let { nRows } = this.props;
    let board = this.state.gameBoard;
    let [x, y] = cellNum.split("-").map(Number);

    for (let i = nRows - 1; i > -1; i--) {
      if (board[i][y] === 0) {
        board[i][y] = active;
        x = i;
        break;
      }
    }
    // enimerwnoume to state kai allazoume ton energo paikti
    this.setState({ gameBoard: board }, () => this.checkWinner(x, y, active));
  }

  changeTurn() {
    return null;
  }

  checkWinner(x, y) {
    this.checkRow(x, y);
    this.checkCol(x, y);
    this.checkDiag(x, y);
    if (!this.state.winner)
      this.setState((st) => ({ activePlayer: st.activePlayer === 2 ? 1 : 2 }));
  }

  checkRow(x, y) {
    let { nCols } = this.props;
    let board = this.state.gameBoard;
    let active = this.state.activePlayer;
    let count = 0;
    let winS = [];

    for (let i = nCols - 1; i > -1; i--) {
      if (board[x][i] === active) {
        count++;
        winS.push(`${x},${i}`);
        console.log(winS);
      } else {
        count = 0;
        winS.splice(0, winS.length);
      }
      if (count === 4) {
        this.setState({ winSet: winS });
        this.setWinner();
        break;
      }
    }
  }

  checkCol(x, y) {
    let winS = [];
    let { nRows } = this.props;
    let board = this.state.gameBoard;
    let active = this.state.activePlayer;
    let count = 0;
    for (let i = nRows - 1; i > -1; i--) {
      if (board[i][y] === active) {
        count++;
        winS.push(`${i},${y}`);
      } else {
        count = 0;
        winS.splice(0, winS.length);
      }
      if (count === 4) {
        this.setState({ winSet: winS });
        return this.setWinner();
      }
    }
  }

  checkDiag(x, y) {
    let board = this.state.gameBoard;
    let active = this.state.activePlayer;
    let { nRows, nCols } = this.props;
    let tempX = x;
    let tempY = y;
    let count = 0;
    let winS = [];
    while (tempX >= 0 && tempY >= 0 && tempX < nRows && tempY < nCols) {
      if (board[tempX][tempY] === active) {
        count++;
        winS.push(`${tempX},${tempY}`);
      } else {
        count = 0;
        winS.splice(0, winS.length);
      }
      if (count === 4) {
        this.setState({ winSet: winS });
        return this.setWinner();
      }

      tempX -= 1;
      tempY += 1;
    }
    winS.splice(0, winS.length);
    // Ksanakanoume ton metriti miden kai thetoume tis suntetagmenes sto keli pou itan prin vgoun ektos oriwn pinaka
    count = 0;
    tempX += 1;
    tempY -= 1;
    while (tempX >= 0 && tempY >= 0 && tempX < nRows && tempY < nCols) {
      if (board[tempX][tempY] === active) {
        count++;
        winS.push(`${tempX},${tempY}`);
      } else {
        winS.splice(0, winS.length);
        count = 0;
      }
      if (count === 4) {
        this.setState({ winSet: winS });
        return this.setWinner();
      }

      tempX += 1;
      tempY -= 1;
    }
    winS.splice(0, winS.length);
    //Ksanakanoume ton metriti miden kai thetoume tis suntetagmenes stis arxikes gia na elegksoume tin alli diagwnio
    count = 0;
    tempX = x;
    tempY = y;
    while (tempX >= 0 && tempY >= 0 && tempX < nRows && tempY < nCols) {
      if (board[tempX][tempY] === active) {
        count++;
        winS.push(`${tempX},${tempY}`);
      } else {
        winS.splice(0, winS.length);
        count = 0;
      }
      if (count === 4) {
        this.setState({ winSet: winS });
        return this.setWinner();
      }

      tempX -= 1;
      tempY -= 1;
    }
    winS.splice(0, winS.length);
    count = 0;
    tempX += 1;
    tempY += 1;
    while (tempX >= 0 && tempY >= 0 && tempX < nRows && tempY < nCols) {
      if (board[tempX][tempY] === active) {
        count++;
        winS.push(`${tempX},${tempY}`);
        console.log(winS);
        console.log("in diag");
      } else {
        winS.splice(0, winS.length);
        count = 0;
      }
      if (count === 4) {
        this.setState({ winSet: winS });
        return this.setWinner();
      }
      tempX += 1;
      tempY += 1;
    }
    winS.splice(0, winS.length);
  }

  setWinner() {
    // Efoson vrethike nikitis ston teleutaio guro pername times sto winner = true kai koitame pios itan o nikitis gia na auksisoume ton antistoixo metriti!
    this.setState({ victoriousPlayer: this.state.activePlayer });
    this.setState((st) =>
      this.state.activePlayer === 1
        ? { winner: true, orangeWins: st.orangeWins + 1 }
        : { winner: true, blueWins: st.blueWins + 1 }
    );
    this.freezeGame();
  }

  freezeGame() {
    let board = this.state.gameBoard;
    for (let i = 0; i < this.props.nRows; i++) {
      for (let j = 0; j < this.props.nCols; j++) {
        if (board[i][j] === 0) {
          board[i][j] = -1;
        }
      }
    }
    this.setState({ gameBoard: board });
  }

  resetBoard() {
    let board = this.state.gameBoard;
    let newPlayer = Math.ceil(Math.random() * 2);
    for (let i = 0; i < this.props.nRows; i++) {
      for (let j = 0; j < this.props.nCols; j++) {
        board[i][j] = 0;
      }
    }
    this.setState({
      gameBoard: board,
      activePlayer: newPlayer,
      winner: false,
      victoriousPlayer: 0,
      winSet: [],
    });
  }
  resetScore() {
    this.setState({ blueWins: 0, orangeWins: 0 });
    this.resetBoard();
  }

  toggleLanguage() {
    this.setState({
      language: this.state.language === "English" ? "Greek" : "English",
    });
  }

  render() {
    let {
      flagBtn,
      gameName,
      activePlayer,
      score,
      orange,
      blue,
      newGameBtn,
      resetScoreBtn,
      orangeWins,
      blueWins,
    } = language;
    let lang = this.state.language;
    let vic = this.state.victoriousPlayer;
    let gameOver = (
      <div
        className={`${
          vic === 1 ? "neon-orange Gameover" : "neon-blue Gameover"
        }`}
        style={
          this.state.winner
            ? { visibility: "visible" }
            : { visibility: "hidden" }
        }
      >
        {" "}
        {vic === 1 ? `${orangeWins[lang]} ` : `${blueWins[lang]} `}
      </div>
    );
    return (
      <div className="The-game">
        <div className="lang">
          <span className="flag">
            <img
              className="flagImg"
              src={lang === "English" ? EnglishFlag : GreekFlag}
              onClick={this.toggleLanguage}
            ></img>
          </span>
          <button onClick={this.toggleLanguage} className="btn language">
            {flagBtn[lang]}
          </button>
        </div>
        <div className="Info">
          <span className="acvite">{activePlayer[lang]}: </span>
          <span
            className={`${
              this.state.activePlayer === 1 ? "neon-orange " : "neon-blue "
            } Player`}
          >
            {" "}
            {this.state.activePlayer === 1
              ? `${orange[lang]} `
              : `${blue[lang]} `}{" "}
          </span>
          <div>
            <span className="Score">{score[lang]}</span>
            <div>
              <span className="Score numbers ">
                <span className="neon-orange-full Player">
                  {" "}
                  {orange[lang]} {this.state.orangeWins}
                </span>{" "}
                :
                <span className="neon-blue-full Player">
                  {" "}
                  {this.state.blueWins} {blue[lang]}{" "}
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="Reset">
          <button className="btn" onClick={this.resetBoard}>
            {newGameBtn[lang]}
          </button>
          <button className="btn Score" onClick={this.resetScore}>
            {resetScoreBtn[lang]}
          </button>
        </div>
        <div className="Board-title">
          <div className="neon-orange">{gameName[lang]}</div>
          <div className="neon-blue">-4</div>
        </div>

        <div>
          <table className="Board">
            <tbody>{this.tableBoard()}</tbody>
          </table>
        </div>
        {gameOver}
      </div>
    );
  }
}
