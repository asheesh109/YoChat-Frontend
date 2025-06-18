import React, { useEffect, useState } from 'react';
import axiosInstance from '../Utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import RoomCard from '../Components/RoomCard';
import './Home.css';

const Home = () => {
  const [allRooms, setAllRooms] = useState([]);
  const [myRooms, setMyRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUserInfo();
    fetchRooms();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await axiosInstance.get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsername(res.data.username);
    } catch (err) {
      console.error('Failed to fetch user info:', err);
      setError('Failed to fetch user information. Please try logging in again.');
    }
  };

  const fetchRooms = async () => {
    try {
      const [allRes, myRes] = await Promise.all([
        axiosInstance.get('/rooms'),
        axiosInstance.get('/rooms/my', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      console.log('All Rooms:', allRes.data);
      console.log('My Rooms:', myRes.data);

      const myRoomIds = new Set(myRes.data.map(room => room._id));
      const filteredAllRooms = allRes.data.filter(room => !myRoomIds.has(room._id));

      setMyRooms(myRes.data);
      setAllRooms(filteredAllRooms);
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
      setError('Failed to load rooms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async () => {
    if (!roomName.trim()) {
      alert("Room name cannot be empty");
      return;
    }
    if (!token) {
      alert("You must be logged in to create a room");
      return;
    }

    setCreating(true);
    try {
      const res = await axiosInstance.post(
        '/rooms',
        { name: roomName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate(`/room/${res.data._id}`);
    } catch (err) {
      console.error('Failed to create room:', err);
      alert('Room creation failed');
    } finally {
      setCreating(false);
    }
  };

  const joinRoom = async (roomId) => {
    try {
      await axiosInstance.post(`/rooms/join/${roomId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const joinedRoom = allRooms.find(room => room._id === roomId);
      if (joinedRoom) {
        setMyRooms(prev => [...prev, joinedRoom]);
        setAllRooms(prev => prev.filter(room => room._id !== roomId));
      }

      alert("Joined room successfully!");
    } catch (err) {
      console.error("Failed to join room:", err);
      alert("Failed to join room. Please try again.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      createRoom();
    }
  };

  if (loading) {
    return (
      <main className="home-container" data-testid="home-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading rooms...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="home-container" data-testid="home-container">
        <div className="loading-container">
          <p>{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchUserInfo();
              fetchRooms();
            }}
            className="create-room-button"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="home-container" data-testid="home-container">
      <div className="home-header" style={{ position: 'relative', top: 0, zIndex: 1 }}>
        {username && (
          <h2 className="welcome-message">Welcome back, {username}!</h2>
        )}
        <h1 className="home-title">YOchat Rooms</h1>
        <p className="home-subtitle">Connect with others in real-time</p>
      </div>

      <div className="create-room-section">
        <div className="create-room-card">
          <h2 className="section-title">Create New Room</h2>
          <div className="create-room-form">
            <input
              className="room-name-input"
              placeholder="Enter room name..."
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              onClick={createRoom} 
              disabled={creating || !roomName.trim()}
              className={`create-room-button ${creating ? 'loading' : ''}`}
            >
              {creating ? (
                <>
                  <div className="button-spinner"></div>
                  Creating...
                </>
              ) : (
                <>
                  <span className="plus-icon">+</span>
                  Create Room
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="rooms-section">
        <div className="my-rooms">
          <h2 className="section-title">
            <span className="room-icon">🏠</span>
            My Rooms
            <span className="room-count">{myRooms.length}</span>
          </h2>
          {myRooms.length > 0 ? (
            <div className="rooms-grid">
              {myRooms.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <p>No rooms joined yet</p>
              <small>Create a room or join one from the available rooms below</small>
            </div>
          )}
        </div>

        <div className="all-rooms">
          <h2 className="section-title">
            <span className="room-icon">🌐</span>
            Available Rooms
            <span className="room-count">{allRooms.length}</span>
          </h2>
          {allRooms.length > 0 ? (
            <div className="rooms-grid">
              {allRooms.map((room) => (
                <div key={room._id} className="room-card-wrapper">
                  <RoomCard room={room} />
                  <button 
                    onClick={() => joinRoom(room._id)}
                    className="join-room-button"
                  >
                    <span className="join-icon">→</span>
                    Join Room
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <p>No available rooms</p>
              <small>Be the first to create a room!</small>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;