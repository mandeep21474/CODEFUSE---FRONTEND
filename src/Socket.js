import {io} from 'socket.io-client'
import {v4 as uuid} from 'uuid';

export const initSocket = async ()=> {

    

    const options = {
        forceNew: true,
        reconnectionAttempts: Infinity,
        timeout: 10000,
        transports: ['websocket'],
 
    }
    
    return io(import.meta.env.VITE_BACKEND_URL, options);

}