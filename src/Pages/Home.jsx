// src/Home.js - Fixed loader centering, mobile hamburger positioning, text visibility
import React, { useEffect, useState } from 'react';
import axiosInstance from '../Utils/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import ChatBox from '../Components/ChatBox';
import './Home.css'; // Use consolidated global CSS

const Home = () => {
  const [allRooms, setAllRooms] = useState([]);
  const [myRooms, setMyRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [username, setUsername] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar toggle
  const navigate = useNavigate();
  const { roomId } = useParams();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUserInfo();
    fetchRooms();
  }, []);

  useEffect(() => {
    if (roomId && myRooms.length > 0) {
      const room = myRooms.find(r => r._id === roomId);
      if (room) {
        setSelectedRoom(room);
      }
    }
  }, [roomId, myRooms]);

  const fetchUserInfo = async () => {
    try {
      const res = await axiosInstance.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` },
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
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowCreateModal(false);
      setRoomName('');
      await fetchRooms();
      selectRoom(res.data);
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
        headers: { Authorization: `Bearer ${token}` },
      });
      const joinedRoom = allRooms.find(room => room._id === roomId);
      if (joinedRoom) {
        setMyRooms(prev => [...prev, joinedRoom]);
        setAllRooms(prev => prev.filter(room => room._id !== roomId));
        selectRoom(joinedRoom);
        navigate(`/room/${roomId}`);
      }
    } catch (err) {
      console.error("Failed to join room:", err);
      alert("Failed to join room. Please try again.");
    }
  };

  const selectRoom = (room) => {
    setSelectedRoom(room);
    navigate(`/room/${room._id}`);
    if (window.innerWidth <= 768) setSidebarOpen(false); // Close on mobile
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      createRoom();
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/register');
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-container">
          <div className="loading-icon">💬</div>
          <p className="loading-text" style={{ color: 'white' }}>Loading your chats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p className="error-text">{error}</p>
          <button 
            onClick={() => { setError(null); fetchUserInfo(); fetchRooms(); setLoading(true); }} 
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="app-logo">
            <span className="logo-text">YOchat</span>
          </div>
          <div className="user-profile">
            <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <div className="user-name">{username}</div>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="sidebar-content">
          <div className="sidebar-section">
            <div className="section-header">
              <h3 className="section-title">
                <span className="section-icon">💬</span>
                Chats
              </h3>
              <button className="create-room-btn" onClick={() => setShowCreateModal(true)} title="New Chat" style={{ color: 'white' }}>
                +
              </button>
            </div>
            <div className="rooms-list">
              {myRooms.length > 0 ? (
                myRooms.map((room) => (
                  <div
                    key={room._id}
                    className={`room-item ${selectedRoom?._id === room._id ? 'active' : ''}`}
                    onClick={() => selectRoom(room)}
                  >
                    <div className="room-icon">#</div>
                    <div className="room-details">
                      <div className="room-name">{room.name}</div>
                      <div className="room-members">{room.members?.length || 0} members</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-rooms">
                  <p>No chats yet</p>
                  <small>Start a new one!</small>
                </div>
              )}
            </div>
          </div>
          <div className="sidebar-section">
            <div className="section-header">
              <h3 className="section-title">
                <span className="section-icon">🔍</span>
                Explore
              </h3>
            </div>
            <div className="rooms-list">
              {allRooms.length > 0 ? (
                allRooms.map((room) => (
                  <div key={room._id} className="room-item">
                    <div className="room-icon">#</div>
                    <div className="room-details">
                      <div className="room-name">{room.name}</div>
                      <div className="room-members">{room.members?.length || 0} members</div>
                    </div>
                    <button className="join-btn" onClick={() => joinRoom(room._id)}>
                      Join
                    </button>
                  </div>
                ))
              ) : (
                <div className="empty-rooms">
                  <p>No rooms to explore</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Mobile Hamburger - Fixed position, no overlap */}
        <button 
          className="hamburger" 
          onClick={toggleSidebar}
          style={{ 
            display: window.innerWidth <= 768 ? 'block' : 'none',
            position: 'fixed',
            top: '8px',
            right: '12px',
            left: 'auto',
            zIndex: 1000,
            background: 'rgba(17, 17, 17, 0.8)',
            border: 'none',
            borderRadius: '50%',
            padding: '12px',
            color: '#ffffff',
            fontSize: '20px',
            cursor: 'pointer'
          }}
        >
          ☰
        </button>

        {selectedRoom ? (
          <ChatBox roomId={selectedRoom._id} roomName={selectedRoom.name} />
        ) : (
          <div className="welcome-screen">
            <div className="welcome-content">
              <div className="welcome-icon">💬</div>
              <h1 className="welcome-title">Welcome to YOchat</h1>
              <p className="welcome-subtitle">Pick a chat from the left or start a new one</p>
              <button className="welcome-create-btn" onClick={() => setShowCreateModal(true)}>
                + New Chat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title" style={{ color: 'white' }}>New Chat</h2>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="input-group">
                <label className="input-label">Chat Name</label>
                <input
                  className="modal-input"
                  placeholder="Enter chat name..."
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  maxLength={30}
                  autoFocus
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
              <button
                className="modal-btn create"
                onClick={createRoom}
                disabled={creating || !roomName.trim()}
              >
                {creating ? (
                  <>
                    <div className="button-spinner"></div>
                    Creating...
                  </>
                ) : (
                  'Create'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Overlay for Sidebar */}
      {sidebarOpen && window.innerWidth <= 768 && (
        <div 
          className="modal-overlay" 
          onClick={toggleSidebar} 
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99 
          }}
        ></div>
      )}
    </div>
  );
};

export default Home;