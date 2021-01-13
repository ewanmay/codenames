import React from 'react';
import { Card } from '../../context/types';
import CardDisplay from "./CardDisplay";
interface BoardProps {
  cards: Card[]
}

export default function Board({ cards }: BoardProps) {
  return (
    <div className="col-12 p-0 flex">
      {cards.map((card, index) => <CardDisplay data={card} key={Math.random()} index={index} />)}
    </div>
  )
}