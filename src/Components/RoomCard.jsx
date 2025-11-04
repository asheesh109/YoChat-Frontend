// src/Components/RoomCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoomCard = ({ room, showJoinButton = false, onJoin }) => {
  const navigate = useNavigate();
 
  const handleClick = () => {
    if (!showJoinButton) {
      navigate(`/room/${room._id}`);
    }
  };
 
  const handleJoin = (e) => {
    e.stopPropagation();
    if (onJoin) {
      onJoin(room._id);
    }
  };
 
  return (
    <div
      className="room-card"
      onClick={handleClick}
      style={{ cursor: showJoinButton ? 'default' : 'pointer' }}
    >
      <div className="room-content">
        <h3 className="room-name">{room.name}</h3>
        <div className="room-meta">
          <span className="member-count">
            <span className="member-icon">👥</span>
            {room.members?.length || 0} members
          </span>
        </div>
      </div>
      {showJoinButton && (
        <button
          className="join-button"
          onClick={handleJoin}
        >
          Join <span className="arrow-icon">→</span>
        </button>
      )}
    </div>
  );
};

export default RoomCard;