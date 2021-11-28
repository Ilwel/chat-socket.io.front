import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Chat.css'
import { v4 as uuidv4 } from 'uuid';

// const myId = uuidv4();
const socket = io(process.env.REACT_APP_SERVER);
socket.on('connect', () => {
  console.log('[IO] new connection');
});

const Chat = () => {
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [id, setId] = useState(uuidv4());

  useEffect(() => {
    const handleNewMessage = newMessage => setMessages([...messages, newMessage]);
    socket.on('chat.message', handleNewMessage);
    return () => socket.off('chat.message', handleNewMessage);
  }, [messages])

  const handleInputChange = e => setMessage(e.target.value);
  const handleAuthorChange = e => setAuthor(e.target.value);
  const handleFormSubimit = e => {
    e.preventDefault();
    if (message.trim()) {
      setId(uuidv4());
      socket.emit('chat.message', {
        id,
        author,
        message
      })
      setMessage('');
    }
  }

  return (
    <div className="c-chat">
      <form className="form" action="" onSubmit={handleFormSubimit}>
        <input className="input" type="text" placeholder="username" onChange={handleAuthorChange} />
        <input className="input input--message" type="text" placeholder="message" value={message} onChange={handleInputChange} />
        <button type="submit" className="button">Submit</button>
      </form>
      <ul className="messages">
        {/* <li className="message">Hello There</li> */}
        {messages.map(m =>
          <li id={m.id} className="message" key={m.id}>
            <strong>{m.author}:</strong>
            <p>{m.message}</p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Chat;