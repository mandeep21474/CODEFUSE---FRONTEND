import React, { useState, useEffect } from 'react'
import { RiGeminiFill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { MdKeyboardArrowLeft } from "react-icons/md";
import axios from 'axios';
import Actions  from "../Actions";
import './Chatbot.css'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { useRef } from 'react';
import { LuLoaderCircle } from "react-icons/lu";

const Chatbot = ({room_id,socketref}) => {
  const [chatbotopen, setchatbotopen] = useState(false)
  const [showGeminiLogo, setShowGeminiLogo] = useState(false)
  const [showChatInterface, setShowChatInterface] = useState(false)
  const [user_mssg, setuser_mssg] = useState("")
  const [showSendIcon, setShowSendIcon] = useState(false)
  const [mssg_send, setmssg_send] = useState(false)
  const [mssg_list, setmssg_list] = useState([])
  const message_ref = useRef(null);
  const [ai_loading, setai_loading] = useState(false)

  useEffect(() => {
    if (chatbotopen) {
      // Show Gemini logo first
      setShowGeminiLogo(true)
      setShowChatInterface(false)
      
      // Hide logo and show chat interface after 2 seconds
      const timer = setTimeout(() => {
        setShowGeminiLogo(false)
        setTimeout(() => {
          setShowChatInterface(true)
        }, 500) // Small delay for smooth transition
      }, 2000)

      return () => clearTimeout(timer)
    } else {
      // Reset states when chatbot closes
      setShowGeminiLogo(false)
      setShowChatInterface(false)
    }
  }, [chatbotopen])

  const handleClose = () => {
    setchatbotopen(false)
  }
  const handleSend = async () => {
    // console.log("sedning data");
    // setmssg_send(true)
    setai_loading(true)
    setuser_mssg("")
    setmssg_list((prev)=>[
      ...prev,
      user_mssg
    ])
    socketref.current.emit(Actions.GET_AI_RESPONSE,{
      message: user_mssg,
      room_id
    })
    // console.log("data sent");



    
  }
  useEffect(()=>{

    if(socketref.current){
    socketref.current.on(Actions.GET_AI_RESPONSE,(data)=>{
      // console.log("data got:- ",data.response);  
      // setmssg_send(false)
      setmssg_list((prev)=>[
        ...prev,
        data.response
      ])
      setai_loading(false)
    })
    return ()=>{
      socketref.current.off(Actions.GET_AI_RESPONSE)
    }
    }
  },[socketref.current])

  useEffect(()=>{
    
    if(message_ref.current){
    message_ref.current.onkeydown=(e)=>{
      if(e.key==="Enter" && user_mssg){
        handleSend();
      }
    }
    }
    
  },[user_mssg])
const mssg_ref = useRef(null);
  useEffect(() => {
    if(mssg_ref.current){
    mssg_ref.current.scrollIntoView({ behavior: "smooth" ,block: "end",inline: "nearest",alignToTop: false});
    }

  }, [mssg_list])
  
  return (
    <div className={chatbotopen ? "chatbot-open" : "chatbot"}>
      <div className='icons'>
        {!chatbotopen && (
          <MdKeyboardArrowLeft 
            className='arrow-icon' 
            onClick={() => setchatbotopen(true)}
          />
        )}


      </div>

      {chatbotopen && (
        <div className='chatbot-content'>
          {/* Animated Gemini Logo */}
          {showGeminiLogo && (
            <div className='gemini-logo-container'>
              <RiGeminiFill className='gemini-logo-animated'/>
              <p className='welcome-text'>Welcome to Gemini Assistant</p>
            </div>
          )}

          {/* Chat Interface */}
          {showChatInterface && (
            <div className='chat-interface'>
              <div className='chat-header'>
                <RiGeminiFill className='gemini-icon-small'/>
                <span>Gemini Assistant</span>
                <IoMdClose className='close-icon' onClick={handleClose}/>
              </div>
              
              <div className='messages-area'>
                {/* Messages */}
                <div className='welcome-message'>
                  <p>Hello! I'm your coding assistant. Ask me anything about your code!</p>
                </div>
                {
                  mssg_list.map((mssg,index)=>(
                    <div ref={mssg_ref} className={index%2===0?'user-message message-content':'welcome-message message-content'}key={index}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                      >
                       {mssg}
                      </ReactMarkdown>
                      
                    </div>
                    
                  ))
                }
              </div>

              {
                ai_loading&&(
                  <div className='loading'>
                    <LuLoaderCircle className='loading-icon'/>
                  </div>
                )
              }

              <div className='input-area'>
                <input 
                ref={message_ref}
                  type="text" 
                  value={user_mssg}
                  placeholder='Ask me anything about your code...'
                  className='chat-input'
                  onChange={(e)=>setuser_mssg(e.target.value)}
                 
                />
                {user_mssg && (
                  <IoSend className='send-icon' onClick={handleSend}/>
                )}
          
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Chatbot
