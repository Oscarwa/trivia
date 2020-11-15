import React, { useState, useContext, useEffect } from 'react';
import { QContext } from '../../utils/context';
import './style.css';

export default function QuestionForm() {
    const { refreshQuestions, editQuestion, setEditQuestion } = useContext(QContext);
    const initialStateQuestion = {question: "", answers: []};
    const [question, setQuestion] = useState(initialStateQuestion);

    const updateName = (e) => {
        const name = e.target.value;
        const model = {...question};
        model.question = name;
        setQuestion(model);
    }
    const addEmptyAnswer = () => {
        const model = {...question};
        model.answers.push({text: '', correct: false});
        setQuestion(model);
    }
    const removeAnswer = (i) => {
        const model = {...question};
        model.answers.splice(i, 1);
        setQuestion(model);
    }

    const updateAnswer = (value, i) => {
        const model = {...question};
        model.answers[i].text = value;
        setQuestion(model);
    }
    const updateCorrectAnswer = (i) => {
        const model = {...question, answers: question.answers.map(a => ({...a, correct: false}))};
        
        model.answers[i].correct = true;
        setQuestion(model);
    }

    
    const cancel = () => {
        if(editQuestion) {
            setEditQuestion(null);
        }
        setQuestion(initialStateQuestion);
    }
    
    useEffect(() => {
        if(editQuestion) {
            setQuestion(editQuestion);
        }
    }, [editQuestion]);

    const save = async () => {
        let res = null;
        if(editQuestion) {
            res = await fetch(`http://localhost:8080/api/questions/${editQuestion._id}`, {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(question),
            });
        } else {
            res = await fetch('http://localhost:8080/api/questions', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(question),
            });
        }
        console.log(res);
        if(res.ok) {
            cancel();
            refreshQuestions();
        }
    }

    return (
        <div className='form'>
            <input placeholder="Question..." value={question.question} onChange={updateName} />
            <div>
                <button onClick={addEmptyAnswer}>Add answer</button>
                { question.answers
                    .map((a, i) => (
                        <div className='a' key={i}>
                            <input type='radio' checked={a.correct} name='answer' onChange={ () => updateCorrectAnswer(i) }></input>
                            <input value={a.text} placeholder={ `Answer # ${i + 1}` } onChange={(e) => updateAnswer(e.target.value, i) } />
                            <i onClick={() => removeAnswer(i) }>x</i>
                        </div>
                        )
                    )
                }
            </div>
            <div className="actions">
                <button onClick={cancel}>Cancel</button>
                <button className='primary' onClick={save}>{ editQuestion ? 'Update' : 'Save' }</button>
            </div>
        </div>
    )
}
