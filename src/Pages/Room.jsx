import React from 'react';
import { useParams } from 'react-router-dom';
import ChatBox from '../Components/ChatBox';

const Room = () => {
  const { roomId } = useParams();

  return (
    <div>
      <h2>Room Chat</h2>
      <ChatBox roomId={roomId} />
    </div>
  );
};

export default Room;
