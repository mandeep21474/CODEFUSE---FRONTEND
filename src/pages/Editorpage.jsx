import React, { useEffect, useRef, useState } from 'react'
import Client from '../components/Client'
import './Editorpage.css'
import Editor from '../components/Editor'
import { initSocket } from '../Socket'
import Actions from '../Actions'
import {FiCode} from 'react-icons/fi'
import { useLocation } from 'react-router-dom'
import {useNavigate} from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import Chatbot from '../components/Chatbot'
import Freeusers from '../components/Freeusers'
import {useAuth, useUser} from '@clerk/clerk-react'
import Plans from '../components/Plans'
import axios from 'axios'
const Editorpage = () => {
  const [clients, setclients] = useState([]);
//   console.log(clients);
  const {user} = useUser();
  const socketref = useRef(null);
  const location = useLocation();
  const Navigate = useNavigate();
  const [userjoined, setuserjoined] = useState("");
  const [ispremiuim, setispremiuim] = useState(false)
  const [trial, settrial] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [showplans, setshowplans] = useState(false)
  const {has,isLoaded} = useAuth();



  // to check trial status

  

  const handleplan = () => {
   Navigate("/#plans")
    
  }
  useEffect(() => {
     

    const trial_check = async ()=>{
        try {
           
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/start_trial`,
                {
                      
                    // userdetails:user,
                    email:location.state.email,
                    ispremiuim:has({plan:'premium'}),
                    room_entered:true
                     


                    
                },
                {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            // console.log(response.data);
            if(response.data.message==="Trial ended"){
                settrial(false);
                toast.error("Trial ended", {
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
            }
            else if (response.data.message==="Trial is active"){
                toast.success(`Trial period is active for ${response.data.time_left} `, {
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
        if(isLoaded){
            const plan=has({plan:'premium'});
            // console.log(plan);
            
            setispremiuim(plan);
        }
    },[isLoaded])

  useEffect(() => {
    let avatar="";
    if(user){
        avatar=user.imageUrl;
    }
    if(location.state.trial){
        settrial(location.state.trial)
    }
      async function initialize() {
          setIsLoading(true);
          try {
              socketref.current = await initSocket();

              // error handlers for socket connection
              socketref.current.on("connect_error", () => {
                  console.log("Connection error");
                  Navigate("/home")
              })
              socketref.current.on("connect_failed", () => {
                  console.log("Connection failed");
                  Navigate("/home")
              })

              //connection event
              socketref.current.emit(Actions.JOIN, {
                  premium_user: has({plan:'premium'}),
                  username: location.state.username,
                  avatar:avatar,
                  room_id: location.state.room_id,
                  code: `function greetUser(name) {
  console.log(\`Hello, \${name}!\`);
  return \`Welcome to our application, \${name}.\`;
}

const user = "Developer";
const message = greetUser(user);
console.log(message);`,
                  language: "javascript"
              })

              // receiving calls from backend

              socketref.current.on(Actions.ROOM_FULL, () => {
                Navigate("/home",{
                    state:{
                        ROOM_FULL:true
                    }
                })
              })
              
              socketref.current.on(Actions.JOINED, ({ clients, username, socket_id }) => {
                  if (username !== location.state.username) {
                      setuserjoined(username);
                      // 
                      // toast notification
                      toast.success(`${username} joined the session`, {
                          duration: 4000,
                          position: 'top-right',
                          style: {
                              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(26, 26, 26, 0.95))',
                              backdropFilter: 'blur(20px)',
                              color: 'white',
                              fontWeight: '600',
                              borderRadius: '16px',
                              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                          },
                          iconTheme: {
                              primary: '#ffffff',
                              secondary: '#000000',
                          },
                      });
                  }
                  setclients(clients);
                //   console.log(clients);
              })

              //disconnecting
              socketref.current.on(Actions.DISCONNECTED, ({ socket_id, username }) => {
                  toast.success(`${username} left the session`, {
                      duration: 4000,
                      position: 'top-right',
                      style: {
                          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(26, 26, 26, 0.95))',
                          backdropFilter: 'blur(20px)',
                          color: 'white',
                          fontWeight: '600',
                          borderRadius: '16px',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                      },
                      iconTheme: {
                          primary: '#ffffff',
                          secondary: '#000000',
                      },
                  });

                  setclients((prev) => {
                      return prev.filter((val) => {
                          return val.socket_id !== socket_id;
                      })
                  });
              })
          } catch (error) {
              console.error("Connection failed:", error);
              Navigate("/home");
          } finally {
              setIsLoading(false);
          }
      }
      if(isLoaded){
      initialize();
      }

      return () => {
          if (socketref.current) {
              socketref.current.off("connect_error");
              socketref.current.off("connect_failed");
              socketref.current.off(Actions.JOINED);
              socketref.current.off(Actions.DISCONNECTED);
              socketref.current.disconnect();
          }
      }
  }, [Navigate, location.state,user,isLoaded]);

  const handlecopy = async () => {
      try {
          await navigator.clipboard.writeText(location.state.room_id);
          toast.success("Room ID copied to clipboard", {
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
              },
              iconTheme: {
                  primary: '#ffffff',
                  secondary: '#000000',
              },
          });
      } catch (err) {
          toast.error("Failed to copy Room ID", {
              duration: 3000,
              position: 'top-right',
          });
      }
  }

  const handleleave = () => {
      Navigate("/home");
      toast("Left the session", {
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
          },
          iconTheme: {
              primary: '#ffffff',
              secondary: '#000000',
          },
      });
  }

  return (
      <div className='editor-page'>
          <Toaster />

         
          <div className='editor-header'>
              <div className='room-info'>
         
                
                {(ispremiuim===true||trial===true)?       <div className='logo'>
                    <FiCode className='logo-icon' />
                    <span>CODEFUSE <span className='pro-tag'>Premium</span></span>
                </div>:       <div className='logo'>
                    <FiCode className='logo-icon' />
                    <span>CODEFUSE</span>
                </div>}
                
                  <div className='room-id-badge'>
                      <span>🔑</span>
                      <span>{location.state.room_id}</span>
                  </div>
                
              </div>
              <div className='plan-btn-container'>
                <button className='plan-btn' onClick={handleplan}>Plans</button>
                
              </div>
            
              <div className='connected-count'>
                  <div className='status-dot'></div>
                  <span>{clients.length} Connected</span>
              </div>
          </div>

          {/* Main Content */}
          <div className='editor-content'>
              {/* Users Sidebar */}
              <div className='users'>
                  <h3>Team Members</h3>

                  <div className='clientlist'>
                      {clients.map((val, ind) => {
                          return (
                              <Client 
                                  key={ind} 
                                  socketid={val.socket_id} 
                                  username={val.username}
                                  isCurrentUser={val.username === location.state.username}
                                  avatar={val.user_avatar}
                                
                              />
                          )
                      })}
                  </div>

                  <div className='Editor-buttons'>
                      <button className='Editor-btn primary' onClick={handlecopy}>
                          📋 Copy Room ID
                      </button>
                      <button className='Editor-btn' onClick={handleleave}>
                          🚪 Leave Room
                      </button>
                  </div>
              </div>

              {/* Editor Area */}
              <div className='editor_area'>
                  {isLoading && (
                      <div className='loading-overlay'>
                          <div className='loading-spinner'></div>
                      </div>
                  )}
                  <Editor socketref={socketref} room_id={location.state.room_id} ispremiuim={ispremiuim} trial={trial}/>
              </div>
          </div>

          {/* Chatbot Container */}
          <div className='chatbot-container'>
              {(ispremiuim || trial===true) && (
                  <Chatbot room_id={location.state.room_id} socketref={socketref} />
              )}
              {(!ispremiuim && trial===false)&& (
                  <Freeusers socketref={socketref} room_id={location.state.room_id} />
              )}
          </div>
      </div>
  )
}

export default Editorpage