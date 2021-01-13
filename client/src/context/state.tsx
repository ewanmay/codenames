import { Player, Color, PlayerType, State } from "./types";
import { socket } from './socket';

const red_players: Player[] = [{
  name: "Dylan",
  role: PlayerType.RED_OPERATIVE
}, {
  name: "Antoie",
  role: PlayerType.RED_SPYMASTER
}]

const blue_players: Player[] = [{
  name: "Ejuan",
  role: PlayerType.BLUE_OPERATIVE
}, {
  name: "Ross",
  role: PlayerType.BLUE_SPYMASTER
}]

const mockCards = [{
  showColor: true,
  color: Color.RED,
  name: "HELP",
  flipped: true
},
{
  showColor: true,
  color: Color.WHITE,
  name: "HELP",
  flipped: true
},
{
  showColor: true,
  color: Color.BLUE,
  name: "HELP",
  flipped: true
}

]

export const initialState: State = {
  socket: socket,
  player: null,
  winningColor: null,
  teams: [{
    cardsLeft: 8,
    color: Color.RED,
    players: red_players
  }, {
    cardsLeft: 7,
    color: Color.BLUE,
    players: blue_players
  }],
  game: {
    players: blue_players.concat(red_players),
    cards: mockCards,
    playersTurn: PlayerType.BLUE_SPYMASTER,
    actionLog: [],
  },
  clue: null,
}