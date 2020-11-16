import React, { useState, useContext, useEffect } from 'react';
import { QContext } from '../../utils/context';
import './style.css';

export default function QuestionForm() {
    const { refreshQuestions, editQuestion, setEditQuestion } = useContext(QContext);
    const initialStateQuestion = {
        question: '',
        answers: [
            {text: '', correct: true},
            {text: '', correct: false},
            {text: '', correct: false},
            {text: '', correct: false}
        ], 
        level: 'normal', 
        category: 'general',
        type: 'text'
    };
    const [question, setQuestion] = useState(initialStateQuestion);
    const categories = [
        'general',
        'tv series',
        'movies',
        'science',
        'music',
        'sports',
        'videogames',
        'history',
        'geography',
        'art',
        'food',
        'technology',
        'literature',
        'nature',
        'sci-fi',
        'animation',
        'friends',
        'the simpsons',
        'star wars',
    ];
    const { REACT_APP_API_URL } = process.env;

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
    const updateLevel = (v) => {
        const model = {...question};
        model.level = v.target.value;
        setQuestion(model);
    }
    const updateCategory = (v) => {
        const model = {...question};
        model.category = v;
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
            res = await fetch(`${REACT_APP_API_URL}/api/questions/${editQuestion._id}`, {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(question),
            });
        } else {
            res = await fetch(`${REACT_APP_API_URL}/api/questions`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(question),
            });
        }
        if(res.ok) {
            cancel();
            refreshQuestions();
        }
    }

    return (
        <div className='form'>
            <div className='section'>
                <div>Question</div>
                <input placeholder="Question..." value={question.question} onChange={updateName} />
            </div>
            <div>
                <div>Answers</div>
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
            <div>
                <div>Difficulty </div>
                <select value={question.level} onChange={ updateLevel }>
                    <option value="easy">Easy</option>
                    <option value="normal">Normal</option>
                    <option value="hard">Hard</option>
                    <option value="expert">Expert</option>
                </select>
            </div>
            <div className="categories">
                <div><span>Category</span></div>
                { categories.map(c => <button key={c} className={ c === question.category ? 'primary' : null} onClick={() => updateCategory(c)}>{c}</button>)}
            </div>
            <div className="actions">
                <button onClick={cancel}>Cancel</button>
                <button className='primary' onClick={save}>{ editQuestion ? 'Update' : 'Save' }</button>
            </div>
        </div>
    )
}
