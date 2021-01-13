import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/context';


export default function SpymasterInput() {
  const [state] = useContext(AppContext)
  const [clue, setClue] = useState('')
  const [clueAmount, setClueAmount] = useState(0)
  const [openMenu, setOpenMenu] = useState(false)

  function giveClue() {
    state.socket.emit('give-clue', { clue, clueAmount })
  }

  function handleClueChange(e: React.ChangeEvent<HTMLInputElement>) {
    setClue(e.target.value)
  }

  function handleClueAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const num = parseInt(e.target.value)
    setClueAmount(num)
  }

  return (
    <div className="col-12 center flex">
      <div className="col-12 flex number-menu center">
        {openMenu && (
          [1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => (<div onClick={() => { setClueAmount(item); setOpenMenu(false) }} className="clue-input cursor">{item}</div>))
        )}
      </div>
      <div className="col-12 flex center">
        <input type="text" className="form-control col-2 p-0 fill clue-input" placeholder="Clue" aria-label="Clue" aria-describedby="basic-addon1" value={clue} onChange={handleClueChange} />
        <button value={clueAmount} onClick={() => setOpenMenu(true)}>{!clueAmount ? "-" : clueAmount}</button>
      </div>
      <button className="btn btn-secondary" onClick={() => giveClue()}>Submit</button>
    </div>
  )
}
