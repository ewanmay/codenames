import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/context';
import { Card, Color, Player, PlayerType } from '../../context/types';
import { isOperative, isSpymaster } from '../../utils/utils';
import './Card.css';

interface CardProps {
  data: Card,
  index: number
}

export default function CardDisplay({ data, index }: CardProps) {
  const [state, dispatch] = useContext(AppContext)
  const [peek, setPeek] = useState(false)
  const [color, setColor ] = useState(Color.WHITE)

  useEffect(() => {    
    const colorToShow = ((state.player && isSpymaster(state.player?.role)) || data.flipped) ? data.color as Color: Color.WHITE;
    setColor(colorToShow)
  }, [data.color, data.flipped, state.player])


  function makeGuess(cardIdx: number) {
    state.socket.emit('make-guess', cardIdx)
  }


  return (
    <div className='codename-card m-2' onClick={() => makeGuess(index)}>
      <div className={`cardImage ${color}`}>
      </div>
      <section className={`center-text ${color}`}>
        <div className="transition-opacity inline-block">
          {data.name}
        </div>
      </section>
      {data.flipped && (
        <div className={`card ${color} cover flipped-card ${peek ? 'peek':''}`} onClick={() => setPeek(!peek)}>
          <div className={`card-background ${color}`}></div>
          <div className={`card-character ${color}`}></div>
        </div>
      )}
    </div>
  )
}