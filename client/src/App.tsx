import React, { useContext, useEffect } from 'react';
import { AppContext } from './context/context';
import './App.css';

function App() {
  const [state, dispatch] = useContext(AppContext)
  
  useEffect(() => {
    setInterval(() => state.socket.emit("hello"), 2000);    
    state.socket.on('hello-response', () => console.log("server said hello"));
  }, [])


  return (
    <div className="App">
      Hello there
    </div>
  );
}

export default App;
