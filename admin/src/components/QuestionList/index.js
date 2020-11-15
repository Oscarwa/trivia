import React, { useContext, useEffect, useState } from 'react'
import { QContext } from '../../utils/context';
import Question from '../Question';

import './style.css';

export default function QuestionList() {
    const {questions, refreshQuestions } = useContext(QContext);

    useEffect(() => {
        if(!questions.length) {
            refreshQuestions();
        }
    });
    
    return (
        <div>
            <ul>
                { questions.map(q => <li key={q._id} ><Question {...q}/></li>)}
            </ul>
        </div>
    )
}
