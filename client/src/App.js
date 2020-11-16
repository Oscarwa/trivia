import './App.css';
import { useState } from 'react';
import Game from './components/Game';

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [isJoin, setIsJoin] = useState(true);
  const [nickname, updateNickname] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [gameType, setGameType] = useState('points');
  const [code, setCode] = useState(null);
  const [joinCode, setJoinCode] = useState('');

  const createGame = async () => {
    const r = await fetch(`${API_URL}/api/game/create`, {
      method: 'POST',
      headers: {
          'content-type': 'application/json'
      },
      body: JSON.stringify({name: nickname.trim(), maxPlayers, type: gameType}),
    });
    const res = await r.json();
    // setGame(res);
    setCode(res.code);
  }
  const joinGame = async () => {
    const r = await fetch(`${API_URL}/api/game/join/${joinCode}`, {
      method: 'POST',
      headers: {
          'content-type': 'application/json'
      },
      body: JSON.stringify({name: nickname.trim()}),
    });
    const res = await r.json();
    setCode(res.code);
  }

  const renderMaxPlayers = (max) => {
    const result = [];
    for(let p = 2; p <= max; p++) {
      result.push(<button className={maxPlayers === p ? 'selected' : null} key={p} onClick={() => setMaxPlayers(p)}>{p}</button>)
    }
    result.push(<button className={maxPlayers === 20 ? 'selected' : null} key={20} onClick={() => setMaxPlayers(20)}>{20}</button>)
    return result;
  }

  return (
    <div className="App">
      <h1 className='center'>{ `Bamboozled`.split('').join(' • ') }</h1>
     { !code && isJoin && 
      <section>
          <div className='form-field'>
            <label>Name </label>
            <input type="text" placeholder='Your name' value={nickname} onChange={ (e) => updateNickname(e.target.value) } /> <br />
          </div>
          <div className='form-field'>
            <label>Code </label>
            <input type='text' placeholder='Code' value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase().trim())} /> <br />
          </div>
          <div className='center'>
            <button className='big' onClick={joinGame}>Join!</button>
            <div>
              <span>Or <a href='#' onClick={() => setIsJoin(false)}>create</a> a new game</span>
            </div>
          </div>
      </section>
     }
      { !code && !isJoin &&
        <section>
          <div className='form-field'>
            <label>Name </label>
            <input type='text' placeholder='Your name' value={nickname} onChange={ (e) => updateNickname(e.target.value) } /> <br />
          </div>
          <section>
            <div>Max players</div>
            { 
              renderMaxPlayers(10)
            }
          </section>
          <section>
            <div>Game type</div>
            <button className={gameType === 'points' ? 'selected' : null} onClick={() => setGameType('points')}>Points</button>
            <button disabled className={gameType === 'time' ? 'selected' : null} onClick={() => setGameType('time')}>Time</button>
          </section>
          <div className='center'>
            <button onClick={createGame}>Create</button>
            <div>
              <span>Or <a href='#' onClick={() => setIsJoin(true)}>join</a> an existing game</span>
            </div>
          </div>
        </section>
      }
      {code && <Game code={code} />}
    </div>
  );
}

export default App;
