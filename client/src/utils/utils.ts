import { PlayerType, State } from '../context/types'


export function isRed(role: PlayerType): boolean {
  return [PlayerType.RED_SPYMASTER, PlayerType.RED_OPERATIVE].includes(role)
}

export function isBlue(role: PlayerType): boolean {
  return [PlayerType.BLUE_SPYMASTER, PlayerType.BLUE_OPERATIVE].includes(role)
}

export function isSameTeam(role1: PlayerType, role2: PlayerType): boolean {
  if ([role1, role2].includes(PlayerType.UNASSIGNED)) return false
  return (isBlue(role1) && isBlue(role2)) || (isRed(role1) && isRed(role2))
}

export function isSpymaster(role: PlayerType): boolean {
  return [PlayerType.RED_SPYMASTER, PlayerType.BLUE_SPYMASTER].includes(role)
}

export function isOperative(role: PlayerType): boolean {
  return [PlayerType.RED_OPERATIVE, PlayerType.BLUE_OPERATIVE].includes(role)
}

export function isMyTurn(state: State) {
  return state.game.playersTurn === state.player?.role
}

export function getTurnMsg(state: State) {
  if (state.winningColor) {
    return `The ${state.winningColor} team won!`
  }

  if (!state.player?.name) {
    return 'Please enter a username.'
  }
  
  const turnPlayerRole = state.game.playersTurn
  const playerRole = state.player?.role

  if (!playerRole) {
    return 'Please join a team.'
  }

  if (!turnPlayerRole) {
    return 'error: no game.playersTurn'
  }

  let text = ''

  if (isMyTurn(state)) {
    const myRoleSpymaster = isSpymaster(playerRole)
    text = myRoleSpymaster ? 'Give a clue.' : 'Make your guesses.'
    return "It's your turn! " + text
  }

  const turnPlayerIsSpymaster = isSpymaster(turnPlayerRole)

  if (isSameTeam(turnPlayerRole, playerRole)) {
    if (turnPlayerIsSpymaster) {
      text = 'Your spymaster is giving a clue'
    }
    else {
      text = 'Your operatives are guessing'
    }
  }
  else {
    if (turnPlayerIsSpymaster) {
      text = 'The opponent spymaster is giving a clue'
    }
    else {
      text = 'The opponent operatives are guessing'
    }
  }

  return text + `, wait for your turn...`
}