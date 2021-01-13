import React, { useContext, useEffect } from 'react';
import './App.css';
import Page from './components/page/Page';
import { AppContext } from './context/context';
import { Clue, Game, Color } from './context/types';
import { getTurnMsg, isBlue } from './utils/utils';


function App() {
  const [state, dispatch] = useContext(AppContext)

  useEffect(() => {
    state.socket.on('game-update', (game: Game) => {
      dispatch({ type: 'GAME_UPDATE', payload: game })
    });
    state.socket.on('clue-given', (clue: Clue) => {
      dispatch({ type: 'SET_CLUE', payload: clue })
    });
    state.socket.on('end-game', (winningColor: Color) => {
      dispatch({ type: 'SET_WINNER', payload: winningColor })
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <div className={`App flex fill ${isBlue(state.game.playersTurn) ? "blue" : "red"}-app-background`}>
      <Page actionMessage={getTurnMsg(state)}></Page>
    </div>
  );
}

export default App;
