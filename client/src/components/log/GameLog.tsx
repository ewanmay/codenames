import React from 'react';
import {LoggedAction} from '../../context/types'
// import { AppContext } from './context/context';

interface GameLogProps {
  logItems: LoggedAction[]
}

export default function GameLog({ logItems }: GameLogProps) {
  // const [state] = useContext(AppContext);

  // const getSelectedTileName: string = (selectedTile: string) => {
  //   return state.board.cards[parseInt(selectedTile)].name;
  // }

  return (
    <div id='gamelog' className="col-12 flex column">
      {logItems.map((item: LoggedAction) => (
        <div className="col-12 flex row">
          <div className="player">
            {item.player.name}
          </div>
          <div className="action">
            {item.action}
          </div>
          <div className="actionType">
            {item.selectedTile ? item.selectedTile : "" + item.clueGiven ? item.clueGiven : ""}
          </div>
        </div>
      ))}
    </div>
  )
}