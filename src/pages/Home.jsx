import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './Home.css'
import { PiSignOutBold } from "react-icons/pi";
import { FiCode, FiUsers, FiZap } from "react-icons/fi";
import {v4 as uuid} from 'uuid';
import { useUser, SignedIn, SignedOut } from '@clerk/clerk-react'
import { useClerk } from '@clerk/clerk-react'
import {useLocation} from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '@clerk/clerk-react'
import { Toaster } from 'react-hot-toast'
import axios from 'axios'


const Home = () => {
    const [room_id, setroom_id] = useState("");
    const location = useLocation();
    const [trial, settrial] = useState(false)
    const [username, setusername] = useState("");
   
    const navigate = useNavigate();
    const [room_created, setroom_created] = useState(false);
    const [typewriterText, setTypewriterText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [ispremiuim, setispremiuim] = useState(false);

    const { isSignedIn,user } = useUser()
    // console.log(user);
    const { signOut } = useClerk()

    const handle_signout = () => {
        signOut()
    }
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    // console.log(userEmail);
  const {has,isLoaded} = useAuth();
    useEffect(() => {
        if(isLoaded){
            const plan=has({plan:'premium'});
            // console.log(plan);
            setispremiuim(plan);
        }
    },[isLoaded])


    // check for trial and grants it

    useEffect(() => {
     

        const trial_check = async ()=>{
            try {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/start_trial`,
                    {
                          
                        // userdetails:user,
                        email:userEmail,
                        ispremiuim:has({plan:'premium'}),
                        room_entered:false,
                         


                        
                    },
                    {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                // console.log(response.data);
                if(response.data.message==="Trial started"){
                    // console.log("trial started");
                    settrial(true);

                }
                else if(response.data.message==="Trial is active"){
                    // console.log(response.data);
                    settrial(true);
                }

            } catch (error) {
                console.log(error);
            }
        }
        
        if(isLoaded){
            trial_check();
        }
    },[isLoaded])

    useEffect(() => {
        if(user){
            // console.log(location.state);
            if(location.state){
                if(location.state.ROOM_FULL){
                    toast.error("Room is full", {
                        duration: 3000,
                        position: 'top-right',
                        style: {
                            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(26, 26, 26, 0.95))',
                            backdropFilter: 'blur(20px)',
                            color: 'white',
                            fontWeight: '600',
                            borderRadius: '16px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                        }
                        
                    });
                    // navigate("/home");
                }
                
            }
            setusername(user.fullName);
        }
        
    },[user])
    useEffect(() => {
        const scroll_progress = document.querySelector('.scroll-progress');
        if(scroll_progress){
            scroll_progress.style.display = 'none';
        }
        
    })

    // Typewriter effect for room ID
    useEffect(() => {
        if (room_created && room_id) {
            setIsTyping(true);
            setTypewriterText("");
            let index = 0;
            const interval = setInterval(() => {
                if (index < room_id.length) {
                    setTypewriterText(prev => prev + room_id.charAt(index));
                    index++;
                } else {
                    setIsTyping(false);
                    clearInterval(interval);
                }
            }, 60);

            return () => clearInterval(interval);
        }
    }, [room_id, room_created]);

    useEffect(() => {
        const body = document.querySelector('body');
        body.onkeydown = (e) => {
            if (e.key === "Enter") {
                handleJoinRoom();
            }
        }
        return () => {
            body.onkeydown = null;
        }
    }, [room_id, username]);

    const handlechange = (details) => {
     
        setusername(details.target.value);
        
    }
    const handle_roomid = (details) => {
        setroom_id(details.target.value);
        // setroom_created(false);
    }

    const handle_createroom = () => {
          const id = uuid();
            setroom_id(id);
            setroom_created(true);
            // console.log(id)
    }


    const handleJoinRoom = () => {

        if (room_id === "" || username === "") {
            alert("Room ID and username are required");
            return;
        }
        // console.log("trial at join room :-",trial);
        navigate(`/editor/${room_id}`, {
            state: {
                username: username,
                email:userEmail,
                room_id: room_id,
                trial: trial
            }
        });
    }

    return (
        <div className='home-container'>
            {/* Header */}
            <Toaster />
            <header className='header'>
                <div className='logo'>
                    <FiCode className='logo-icon' />
                    <span>CODEFUSE</span>
                </div>
                <div className='user-info'>
                    <span className='username'>{user?.firstName || 'User'}</span>
                    <div className='signout' onClick={handle_signout} title="Sign Out">
                        <PiSignOutBold />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className='main-content'>
                <div className='hero-section'>
                    <h1 className='hero-title'>
                        Code Together,
                        <br />
                        <span className='highlight'>Create Forever</span>
                    </h1>
                    <p className='hero-subtitle'>
                        Real-time collaborative coding environment with AI assistance
                    </p>
                </div>

                <div className='form-card'>
                    <div className='card-header'>
                        <h2>Join or Create Room</h2>
                        <p>Enter room details to start collaborating</p>
                    </div>

                    <div className='input-section'>
                        <div className='input-group'>
                            <label>Room ID</label>
                            <div className='input-wrapper'>
                                <input 
                                    type="text" 
                                    placeholder='Enter room ID' 
                                    value={room_created ? typewriterText : room_id} 
                                    onChange={handle_roomid}
                                    className={`room-input ${room_created ? 'generated' : ''}`}
                                    disabled={room_created}
                                />
                                {/* {isTyping && <span className='cursor'>|</span>} */}
                            </div>
                        </div>

                        <div className='input-group'>
                            <label>Username</label>
                            <input 
                                type="text" 
                                placeholder='Enter your username' 
                                onChange={handlechange}
                                value={username}
                                className='username-input'
                            />
                        </div>

                        <div className='button-section'>
                            <button 
                                className='btn primary-btn' 
                                type="button" 
                                onClick={handleJoinRoom}
                                disabled={!room_id || !username}
                            >
                                <FiUsers className='btn-icon' />
                                Join Room
                            </button>

                            <div className='divider'>
                                <span>OR</span>
                            </div>

                            <button 
                                className='btn secondary-btn' 
                                type="button"
                                onClick={handle_createroom}
                            >
                                <FiZap className='btn-icon' />
                                Create New Room
                            </button>
                        </div>
                    </div>
                </div>
            </main>

 
        </div>
    )
}

export default Home
