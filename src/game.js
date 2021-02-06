import React, { useEffect, useState } from 'react';
import king from './king.png';
var total_move=0
var i,j,win_count,res;
const rowStyle = {
  display: 'flex'
}

const squareStyle = {
  'width':'60px',
  'height':'60px',
  'backgroundColor': '#ddd',
  'margin': '4px',
  'display': 'flex',
  'justifyContent': 'center',
  'alignItems': 'center',
  'fontSize': '20px',
  'color': 'white'
}

const boardStyle = {
  'backgroundColor': '#eee',
  'width': '208px',
  'alignItems': 'center',
  'justifyContent': 'center',
  'display': 'flex',
  'flexDirection': 'column',
  'border': '3px #eee solid'
}

const containerStyle = {
  'display': 'flex',
  'alignItems': 'center',
  'flexDirection': 'column'
}

const instructionsStyle = {
  'marginTop': '5px',
  'marginBottom': '5px',
  'fontWeight': 'bold',
  'fontSize': '16px',
}

const buttonStyle = {
  'marginTop': '15px',
  'marginBottom': '16px',
  'width': '80px',
  'height': '40px',
  'backgroundColor': '#8acaca',
  'color': 'white',
  'fontSize': '16px',
  "display":'inlinelock'
}

function Square({state,indexX,indexY,callback}){
    return (
      <div
        className="square"
        style={squareStyle}
        onClick={()=>{callback(indexX,indexY)}}
        ><span style={{color:state=='O'?'red':'green'}}>
        {state}
        </span>
      </div>
    );
}

function isWin(matrix,player,indexX,indexY){
  win_count=0
  // horizantal check
  for(i=0;i<3;i++){
    if(matrix[indexX][i]==player){
      win_count+=1
      if(win_count==3){
        return true
      }
    }
    else{
      win_count=0
      break
    }
    
  }
  // vertical check
  for(i=0;i<3;i++){
    if(matrix[i][indexY]==player){
      win_count+=1
      if(win_count==3){
        return true
      }
    }
    else{
      win_count=0
      break
    }
    
  }
  //diagonal check
    if ((matrix[0][0]==player && matrix[2][2]==player && matrix[1][1]==player) || (matrix[2][0]==player && matrix[0][2]==player && matrix[1][1]==player)){
      return true
    }
  return false
}

function checkWin(matrix,player,indexX,indexY){

  if(matrix[indexX][indexY]==player){
    if(isWin(matrix,player,indexX,indexY)){
      return 'win'
    }

  }
  if (total_move==8)
    return 'draw'
      
}
function bot(matrix,player,isbot=true){
    let flag=0
    let option=[]
    let noOption=false
    let i,j
    for(i=0;i<3;i++){
      for(j=0;j<3;j++){
        if(matrix[i][j]!='')
          continue
          noOption=[i,j]
        matrix[i][j]=player
        if(isbot==true){
          if(checkWin(matrix,player,i,j)=='win'){
            return [i,j]
          }else{
            if(bot([[...matrix[0]],[...matrix[1]],[...matrix[2]]],player=='O'?'X':'O',false)){
              //never like this option i want to win
            }else{
              option.push([i,j])
            }
          }
        }
        // harana padega
        else if(checkWin(matrix,player,i,j)=='win'){
          return true
        }
        matrix[i][j]=''
      }
    }

    if(isbot==false){
      return false
    }else{
      return option.length ?option[Math.floor((Math.random() * option.length) + 1)-1]:noOption
    }
} 
function Board(props){
    const [autoplay, setAutoplay] = useState([0,0])
    const [first, setFirst] = useState('')
    const [second, setSecond] = useState('')
    const [winner,setWinner]=useState('')
    const [player,setPlayer]=useState('X')
    const [bstate,setBstate]=useState([['','',''],['','',''],['','','']])
    
    useEffect(() => {
      setFirst(prompt('First Player Name : ') || 'First')
      setSecond(prompt('Second Player Name : ') || 'Second')
    }, [])

    function callback(indexX,indexY){
      if(bstate[indexX][indexY]!='' || winner!='')
        return
      bstate[indexX][indexY]=player
      res=checkWin(bstate,player,indexX,indexY)
      switch(res){
        case 'win':
          setWinner(player)
          break
        case 'draw':
          setWinner('match is draw')
          break
        default:
          
      }
    res=setBstate([[...bstate[0]],[...bstate[1]],[...bstate[2]]])
    total_move+=1
    setPlayer(player=='X'?'O':'X')
    let autoplay
    console.log(autoplay=bot([[...bstate[0]],[...bstate[1]],[...bstate[2]]],player))
    setAutoplay(autoplay)
    }
    function reset(){
      setBstate([['','',''],['','',''],['','','']])
      setPlayer('X')
      setWinner('')
      total_move=0
      setAutoplay([Math.floor((Math.random() * 3) + 1)-1,Math.floor((Math.random() * 3) + 1)-1])
    }
    function switchuser(){
      const temp=first
      setFirst(second)
      setSecond(temp)
    }
    return (
      <div style={containerStyle} className="gameBoard">
        {
          winner=='' &&
          <div className="status" style={instructionsStyle}>Next player: {player=='X'?first:second}</div>
        }
        {
          winner!='' &&
        <div className="winner" style={instructionsStyle}>{winner=='O' || winner=='X'?<><img src={king} style={{height:"1em",verticalAlign:'center'}} /> {winner=='X'?first:winner=='O'?second:winner} is winner</>:winner}</div>
        }
        <div>
        <button style={buttonStyle} onClick={()=>{reset()}}>Reset</button>
        {
        total_move==0 &&
        <button style={buttonStyle} onClick={()=>{switchuser()}}>Switch</button>
        }
        {
        winner=='' &&
        <button style={buttonStyle} onClick={()=>{callback(autoplay[0],autoplay[1])}}>Auto</button>
        }
        </div>
        <div style={boardStyle}>
          <div className="board-row" style={rowStyle}>
            <Square state={bstate[0][0]} indexX={0} indexY={0} callback={callback}  />
            <Square state={bstate[0][1]} indexX={0} indexY={1} callback={callback} />
            <Square state={bstate[0][2]} indexX={0} indexY={2} callback={callback} />
          </div>
          <div className="board-row" style={rowStyle}>
            <Square state={bstate[1][0]} indexX={1} indexY={0} callback={callback} />
            <Square state={bstate[1][1]} indexX={1} indexY={1} callback={callback} />
            <Square state={bstate[1][2]} indexX={1} indexY={2} callback={callback} />
          </div>
          <div className="board-row" style={rowStyle}>
            <Square state={bstate[2][0]} indexX={2} indexY={0} callback={callback} />
            <Square state={bstate[2][1]} indexX={2} indexY={1} callback={callback} />
            <Square state={bstate[2][2]} indexX={2} indexY={2} callback={callback} />
          </div>
        </div>
      </div>
    );  
}

export class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
      </div>
    );
  }
}
