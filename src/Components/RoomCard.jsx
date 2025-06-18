import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserFriends, FaArrowRight } from 'react-icons/fa';

const RoomCard = ({ room, showJoinButton = false, onJoin }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="room-card"
      onClick={!showJoinButton ? () => navigate(`/room/${room._id}`) : null}
    >
      <div className="room-content">
        <h3 className="room-name">{room.name}</h3>
        <div className="room-meta">
          <span className="member-count">
            <FaUserFriends className="member-icon" />
            {room.members?.length || 0} members
          </span>
        </div>
      </div>

      {showJoinButton && (
        <button 
          className="join-button"
          onClick={(e) => {
            e.stopPropagation();
            onJoin && onJoin(room._id);
          }}
        >
          Join <FaArrowRight className="arrow-icon" />
        </button>
      )}
    </div>
  );
};

export default RoomCard;