import { State, Color, Player, Card } from "./types";
import { isRed, isBlue } from '../utils/utils'

export const reducer = (state: State, action: Record<string, any>): State => {
  switch (action.type) {
    case "JOIN": {
      const player = action.payload
      return {...state, player}
    };
    case "GAME_UPDATE": {
      const game = action.payload
      const players = game.players
      const teams = [
        {
          players: players.filter((p: Player) => isRed(p.role)),
          color: Color.RED,
          cardsLeft: 9 - game.cards.filter((card: Card) => card.color === Color.RED && card.flipped).length,
        },
        {
          players: players.filter((p: Player) => isBlue(p.role)),
          color: Color.BLUE,
          cardsLeft: 8 - game.cards.filter((card: Card) => card.color === Color.BLUE && card.flipped).length,
          }
      ]
      return {...state, game, teams }
    };
    case "SET_CLUE": {
      const clue = action.payload
      return {...state, clue}
    };
    case "SET_WINNER": {
      const winningColor = action.payload
      return {...state, winningColor}
    };
    default: {
      return state;
    }
  }
}