import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import PropTypes from 'prop-types';

const API_URL = process.env.REACT_APP_API_URL;

function Game(props) {
    const { code } = props;
    const [game, setGame] = useState(null);

    useEffect(() => {
        if(code) {
          const socket = io(API_URL);
          console.log('listening for messages on channel', code);
          socket.on(`game/${code}`, data => {
              console.log(data.data);
            setGame(data.data);
          });
    
          return () => socket.disconnect();
        }
      }, [code]);

    return (
        <div>
            Game: <strong>{code}</strong>
            <ul>
                { game && game.players.map(p => {
                    return <li key={ p._id }>{ p.displayName }</li>
                })}
            </ul>
        </div>
    )
}

Game.propTypes = {
    code: PropTypes.string
}

export default Game;

