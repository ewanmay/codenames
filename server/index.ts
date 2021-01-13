interface Team {
  players: Player[],
  color: Color,
  cardsLeft: number  
}

interface Card {
  showColor: boolean,
  color: Color | null,
  name: string,
  flipped: boolean
}

enum Color {
  WHITE = "white",
  RED = "red",
  BLUE = "blue",
  BLACK = "black",
};

enum PlayerType {
  RED_SPYMASTER = 1,
  RED_OPERATIVE = 2,
  BLUE_SPYMASTER = 3,
  BLUE_OPERATIVE = 4, 
  UNASSIGNED = 5
};

interface Player {
    name: String, 
    role: PlayerType
};

interface Game {
    players: Player[],
    cards: Card[],
    playersTurn: PlayerType,
    actionLog: LoggedAction[]
};

// Player needs to be a copy of the object, not a reference in case the player switches sides later
interface LoggedAction {
  player: Player,
  action: string,
  selectedTile: string | null,
  clueGiven: string | null
};

interface Clue {
  clue: string,
  clueAmount: number
}

const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
})
const fs = require("fs");
const WORDS = fs.readFileSync("./wordlist-eng.txt", "utf-8").split("\n");
const PORT = process.env.PORT || 5000; 


const game: Game = {
  players: Array(0),
  cards: Array(0),
  playersTurn: 1,
  actionLog: Array(0)
}; 
for(let i = 0; i < 25; i++)
{
  game.cards.push({name: "", flipped: false, color: Color.WHITE, showColor: false});
}
const shuffledWords = shuffle(WORDS);
const indexList = Array(25).fill(0).map((v, i) => i);
const randomIndexList = shuffle(indexList);
for(let i = 0; i < 25; i++)
{
  game.cards[i].name = shuffledWords[i];
}
let counter = 0;
randomIndexList.forEach((value) => {
  if(counter < 9){
    game.cards[value].color = Color.RED;
  }
  else if(counter < 17){
    game.cards[value].color = Color.BLUE;
  }
  else if(counter == 17){
    game.cards[value].color = Color.BLACK;
  }
  counter++;
});
  
io.on('connection', (socket: any) => {
  console.log('User Connected');
  const player: Player = {name: socket.id, role: PlayerType.UNASSIGNED};
  io.emit('game-update', game);
  game.players.push(player);

  socket.on('join', (newPlayer: Player) => {
    console.log("player joined game:", newPlayer);
    player.name = newPlayer.name;
    player.role = newPlayer.role;
    io.emit('game-update', game);
  });

  socket.on('reset-game', () => {
    game.cards = Array(0);
    game.playersTurn = 1;
    game.actionLog = Array(0);
    for(let i = 0; i < 25; i++)
    {
      game.cards.push({name: "", flipped: false, color: Color.WHITE, showColor: false});
    }
    const shuffledWords = shuffle(WORDS);
    const indexList = Array(25).fill(0).map((v, i) => i);
    const randomIndexList = shuffle(indexList);
    for(let i = 0; i < 25; i++)
    {
      game.cards[i].name = shuffledWords[i];
    }
    let counter = 0;
    randomIndexList.forEach((value) => {
      if(counter < 9){
        game.cards[value].color = Color.RED;
      }
      else if(counter < 17){
        game.cards[value].color = Color.BLUE;
      }
      else if(counter == 17){
        game.cards[value].color = Color.BLACK;
      }
      counter++;
    });
    io.emit('game-update', game);
  })

  socket.on('game-start', () => {
    console.log('game-start')
    
    io.emit('game-update', game);
  });
  
  let numberOfGuesses = 0;
  socket.on('give-clue', (msg: Clue) => {
    console.log('give-clue', msg);
    if(game.playersTurn != player.role){
      return;
    }
    game.actionLog.push({player, action: "gave a clue", selectedTile: null, clueGiven: msg.clue});
    numberOfGuesses = msg.clueAmount;

    endTurn();
    io.emit('clue-given', msg);
    io.emit('game-update', game);
  }); // clue, clueAmount
  
  socket.on('make-guess', (cardIndex: number) => {
    console.log('make-guess', cardIndex);
    if(game.playersTurn != player.role){
      return;
    }
    game.actionLog.push({player, action: "made a guess", selectedTile: "" + cardIndex, clueGiven: null});
    game.cards[cardIndex].flipped = true;
    numberOfGuesses--;
    if(game.cards[cardIndex].color == Color.BLACK){
      endGame(player.role == PlayerType.RED_OPERATIVE ? Color.BLUE : Color.RED);
    }
    else if(game.cards[cardIndex].color == Color.WHITE) {
      endTurn();
    }
    else if(player.role == PlayerType.RED_OPERATIVE && game.cards[cardIndex].color == Color.BLUE){
      endTurn();
    }
    else if(player.role == PlayerType.BLUE_OPERATIVE && game.cards[cardIndex].color == Color.RED){
      endTurn();
    }
    else if(numberOfGuesses === 0){
      endTurn();
    }

    // check for win
    if(game.cards.filter(card => card.color == Color.RED && card.flipped).length == 9){
      endGame(Color.RED);
    }
    else if(game.cards.filter(card => card.color == Color.BLUE && card.flipped).length == 8){
      endGame(Color.BLUE);
    }

    io.emit('game-update', game);
  }); // cardIndex

  socket.on('end-turn', () => {
    console.log('end-turn');
    if(game.playersTurn != player.role){
      return;
    }
    endTurn();
    io.emit('game-update', game);
  });

  socket.on('disconnect', () => {
    game.players = game.players.filter(value => value.name != player.name);
    io.emit('game-update', game);
  });
})

function endGame(color: Color){
  io.emit("end-game", color);
}

function endTurn(){

  switch(game.playersTurn)
  {
    case (PlayerType.RED_SPYMASTER):
      game.playersTurn = PlayerType.RED_OPERATIVE;
      break;
    
    case (PlayerType.RED_OPERATIVE):
      game.playersTurn = PlayerType.BLUE_SPYMASTER;
      break;
  
    case (PlayerType.BLUE_SPYMASTER):
      game.playersTurn = PlayerType.BLUE_OPERATIVE;
      break;

    case (PlayerType.BLUE_OPERATIVE):
      game.playersTurn = PlayerType.RED_SPYMASTER;
      break;
                    
  } 

  console.log("turn", game.playersTurn);
}

function shuffle(array: Array<any>) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
 
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
// const randomIndexList = shuffle(new Array(25).map((v, i) => i));
// console.log("List: ", randomIndexList)

http.listen(PORT, () => console.log(`Listening on port ${PORT}`))
