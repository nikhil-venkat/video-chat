import React, { useState, useCallback } from 'react';
import Login from './Login';
import Room from './Room';

const VideoChat = () => {
  const [roomName, setRoomName] = useState('nikhils-private-chat');
  const [token, setToken] = useState(null);


  const handleLogin = useCallback(
    async email => {
      const data = await fetch('/video/token', {
        method: 'POST',
        body: JSON.stringify({
          identity: email,
          room: roomName
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json());
      setToken(data.token);
    },
    []
  );

  const handleLogout = useCallback(event => {
    setToken(null);
  }, []);


  let render;
  if (token) {
    render = (
      <div>
        <Login handleLogin={handleLogin} handleLogout={handleLogout}></Login>
        <Room roomName={roomName} token={token} ></Room>
      </div>
    );
  } else {
    render = (
      <Login handleLogin={handleLogin}></Login>
    );
  }
  return render;
};

export default VideoChat;
