import React, { useState } from "react";

const QContext = React.createContext();

const QContextProvider = (props) => {
    const [questions, setQuestions] = useState([]);
    const [editQuestion, setEditQuestion] = useState(null);
    const { REACT_APP_API_URL } = process.env;

    const refreshQuestions = async () => {
        const res = await fetch(`${REACT_APP_API_URL}/api/questions`);
        const data = await res.json();
        setQuestions(data);
    }

    const val = {
        questions,
        refreshQuestions,
        editQuestion,
        setEditQuestion
    }

    return (
        <QContext.Provider value={val}>
            {props.children}
        </QContext.Provider>
    )
}

export {QContext, QContextProvider};