export interface State {
  socket: SocketIOClient.Socket,
  teams: Team[],
  player: Player | null,
  game: Game,
  clue: Clue | null
  winningColor: Color | null
}

export interface Game {
  players: Player[],
  cards: Card[],
  playersTurn: PlayerType,
  actionLog: LoggedAction[]
};
export interface Team {
  players: Player[],
  color: Color,
  cardsLeft: number  
}

export interface Card {
  showColor: boolean,
  color: Color | null,
  name: string,
  flipped: boolean
}

export enum Color {
  WHITE = "white",
  RED = "red",
  BLUE = "blue",
  BLACK = "black",
};

export enum PlayerType {
  RED_SPYMASTER = 1,
  RED_OPERATIVE = 2,
  BLUE_SPYMASTER = 3,
  BLUE_OPERATIVE = 4, 
  UNASSIGNED = 5
};
export interface Player {
    name: String, 
    role: PlayerType
};

export interface Clue {
  clue: string,
  clueAmount: number
}


// Player needs to be a copy of the object, not a reference in case the player switches sides later
export interface LoggedAction {
  player: Player,
  action: string,
  selectedTile: string | null,
  clueGiven: string | null
};
