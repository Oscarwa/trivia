import React from 'react';
import PropTypes from 'prop-types';

function Game(props) {
    return (
        <div>
            Game {props.code}
        </div>
    )
}

Game.propTypes = {
    code: PropTypes.string
}

export default Game;

