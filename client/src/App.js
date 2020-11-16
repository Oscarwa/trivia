import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import Game from './components/Game';

const API_URL = 'http://localhost:8080';

function App() {

  const [code, setCode] = useState(null);
  const [game, setGame] = useState(null);

  const createGame = async () => {
    const r = await fetch(`${API_URL}/api/game/create`, {
      method: 'POST',
      headers: {
          'content-type': 'application/json'
      },
      body: JSON.stringify({name: 'NazgulMX'}),
    });
    const res = await r.json();
    setGame(res);
    setCode(res.code);
  }
  const joinGame = async () => {
    const r = await fetch(`${API_URL}/api/game/join/${code}`, {
      method: 'POST',
      headers: {
          'content-type': 'application/json'
      },
      body: JSON.stringify({name: 'Bonga'}),
    });
    const res = await r.json();
    setCode(res.code);
  }

  useEffect(() => {
    if(code) {
      const socket = io(API_URL);
      console.log('listening for messages on channel', code);
      socket.on(`game/${code}`, data => {
        console.log(data);
      });

      return () => socket.disconnect();
    }
  }, [code]);

  return (
    <div className="App">
      <button onClick={createGame}>Create</button>
      <button onClick={joinGame}>Join</button>
      <Game />
    </div>
  );
}

export default App;
