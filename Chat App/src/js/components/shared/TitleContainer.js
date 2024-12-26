import React from 'react'


const TitleContainer = ({ text, children }) => {

    return (
        <div className="chat-name-container align-items-center">
            <span className="name">{text}</span>
            <div>{ children }</div>
        </div>
    )
}

export default TitleContainer