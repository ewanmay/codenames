import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/context';
import { Color, Player, PlayerType, Team } from '../../context/types';

interface TeamPanelProps {
  team: Team
}

export default function TeamPanel({ team }: TeamPanelProps) {
  const [state, dispatch] = useContext(AppContext);

  const [operatives, setOperatives] = useState([] as Player[]);
  const [spymasters, setSpymasters] = useState([] as Player[]);

  function isSpymaster(role: PlayerType): boolean {
    return [PlayerType.RED_SPYMASTER, PlayerType.BLUE_SPYMASTER].includes(role)
  }

  function isOperative(role: PlayerType): boolean {
    return [PlayerType.RED_OPERATIVE, PlayerType.BLUE_OPERATIVE].includes(role)
  }

  function joinTeam(playerType: PlayerType) {
    if (state.player) {
      const player: Player = { name: state.player.name, role: playerType }
      dispatch({ type: 'JOIN', payload: player })
      state.socket.emit('join', player)
    }
  }

  function showSpymasterButtons(color: Color) {
    const spymasterRole = color === Color.RED ? PlayerType.RED_SPYMASTER : PlayerType.BLUE_SPYMASTER;
    const spymasterAlreadyExists = state.game.players.some(player => player.role === spymasterRole);
    return state.player && state.player.role === PlayerType.UNASSIGNED && !spymasterAlreadyExists;
  }

  useEffect(() => {
    const operatives = team.players.filter(player => isOperative(player.role));
    const spymaster = team.players.filter(player => isSpymaster(player.role))
    setOperatives(operatives);
    setSpymasters(spymaster);
  }, [team])

  return (<div className={`col-12 p-0 ${team.color}-background left`}>
    <div className="col-12 p-1 flex center">
      <div className={`card ${team.color} cover`}>
        <div className={`card-background ${team.color}`}></div>
        <div className={`card-character ${team.color}`}></div>
      </div>
      <div className="col-4 cards-left">{team.cardsLeft}</div>
    </div>
    <div className="col-12 py-2 px-0 flex left">
      <h6 className="col-12 m-0">Operatives</h6>
      <div className="col-12">{operatives.map(player => player.name)}</div>
      {state.player && state.player.role === PlayerType.UNASSIGNED && (
        <div className='join-container flex center'>
          <button className="btn btn-primary fit"
            onClick={() => joinTeam(team.color === Color.BLUE ? PlayerType.BLUE_OPERATIVE : PlayerType.RED_OPERATIVE)}>
            {`Join As ${team.color} Operative`}
          </button>
        </div>
      )}
    </div>
    <div className="col-12 py-2 px-0 flex left">
      <h6 className="col-12 m-0">Spymaster</h6>
      <div className="col-12">{spymasters.map(player => player.name)}</div>
      {showSpymasterButtons(team.color) && (
        <div className='join-container flex center'>
          <button className="btn btn-primary fit"
            onClick={() => joinTeam(team.color === Color.BLUE ? PlayerType.BLUE_SPYMASTER : PlayerType.RED_SPYMASTER)}>
            Join As {team.color} Spymaster
          </button>
        </div>
      )}
    </div>
  </div>)
}