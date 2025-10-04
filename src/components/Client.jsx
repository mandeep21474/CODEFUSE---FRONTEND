import React, { useEffect, useState } from 'react'
import './client.css'


const Client = ({ username, socketid, isCurrentUser, avatar }) => {
    // console.log(socketid);
    
    return (
        <div 
            className="client"
            data-tooltip={username}
            role="button"

        >
            <div className="avatar-container">
                    <img src={avatar?avatar:null} alt={username} className='avatar' style={{width: '50px', height: '50px',borderRadius: '50%'}}/>
               
            </div>
            <p>{username}</p>
        </div>
    )
}

export default Client