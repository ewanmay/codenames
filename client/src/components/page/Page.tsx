import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/context';
import Board from '../board/Board';
import GameLog from '../log/GameLog';
import SpymasterInput from '../inputs/SpymasterInput';
import TeamPanel from '../teampanel/TeamPanel';
import { Player, PlayerType } from '../../context/types';
import { isMyTurn, isOperative, isSpymaster } from '../../utils/utils';

interface PageProps {
  actionMessage: string
}

export default function Page({ actionMessage }: PageProps) {
  const [state, dispatch] = useContext(AppContext)
  const [name, setName] = useState('')


  function stopGuessing() {
    state.socket.emit('end-turn')
  }

  function reset() {
    state.socket.emit('reset-game')
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value)
  }


  function initializePlayer() {
    if (!name) return
    const player: Player = { name, role: PlayerType.UNASSIGNED }
    dispatch({ type: 'JOIN', payload: player })
    state.socket.emit('join', player)
  }

  const isGivingClue = isMyTurn(state) && state.player?.role && isSpymaster(state.player?.role)
  const isGussing = isMyTurn(state) && state.player?.role && isOperative(state.player?.role)
  const clueIsReady = isOperative(state.game.playersTurn) && state.clue?.clue


  return (<div className="col-12 flex column">
    <div className="col-12">
      {!state.player && (
        <div className="col-12 m-2 flex">
          <input type="text" className="form-control col-2 p-0 fill" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" value={name} onChange={handleNameChange} />
          <button onClick={initializePlayer}>Submit</button>
        </div>
      )}
      {clueIsReady && (
        <div className='clue'>The clue is: {state.clue?.clue}, amount {state.clue?.clueAmount}</div>
      )}
      {isGussing && (
        <button className="btn btn-primary fit" onClick={stopGuessing}>Stop Guessing</button>
      )}
      <button className="btn btn-primary fit" onClick={reset}>Reset Game</button>

    </div>
    <div className="panel-container"> <TeamPanel team={state.teams[0]} /></div>
    <div className="board">
      <div className="col-12 actionMessage">{actionMessage}</div>
      <div className="col-12 flex"> <Board cards={state.game.cards} /></div>
      {isGivingClue && (
        <div className="col-12">
          <SpymasterInput />
        </div>
      )}
    </div>
    <div className="panel-container">
        <TeamPanel team={state.teams[1]}></TeamPanel>
      <div className="col-12"><GameLog logItems={state.game.actionLog} /></div>
    </div>

  </div>)
}