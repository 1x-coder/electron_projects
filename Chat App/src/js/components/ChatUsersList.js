import React from 'react'


const ChatUsersList = ({ users = [] }) => {
    
    return (
        <div className="list-container">
            <div className="chat-search-box">
              <div className="input-group">
                <input className="form-control" placeholder="Search" />
              </div>
            </div>
            <ul className="items">
              { users.map(user => (
                  <li
                    key={user.uid}
                    className="item">
                    <div className="item-status">
                      <img
                        src={user.avatar}
                        alt={user.username} />
                      <span className={`status ${user.state}`}></span>
                    </div>
                    <p className="name-time">
                    <span className="name mr-2">{user.username}</span>
                    </p>
                  </li>
                ))
              }
            </ul>
          </div>
    )
}

export default ChatUsersList