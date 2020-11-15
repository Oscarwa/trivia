import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { QContext } from '../../utils/context';

import './style.css';

function Question(props) {
    const { refreshQuestions, setEditQuestion } = useContext(QContext);
    const {
        _id,
        question,
        // answers,
        // level,
        category
    } = props;

    const remove = async () => {
        const { REACT_APP_API_URL } = process.env;
        const res = await fetch(`${REACT_APP_API_URL}/api/questions/${_id}`, {
            method: 'DELETE',
        });
        if(res.ok) {
            refreshQuestions();
        }
    }

    const edit = () => {
        setEditQuestion(props);
    }

    return (
        <div className={`question ${category}`}>
            <div>
                <span>
                    {question}
                </span>
            </div>
            <div className='actions'>
                <i onClick={ edit }>edit</i>
                <i onClick={ remove }>delete</i>
            </div>
        </div>
    )
}

Question.propTypes = {
    _id: PropTypes.string,
    question: PropTypes.string.isRequired,
    answers: PropTypes.array.isRequired,
    level: PropTypes.number,
    category: PropTypes.string
}

export default Question;

