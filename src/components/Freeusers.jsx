import React, { useEffect, useRef, useState } from 'react'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import './Freeusers.css'
import { IoMdClose } from "react-icons/io";
import Actions from '../Actions'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import toast, { Toaster } from 'react-hot-toast'
import { LuLoaderCircle } from "react-icons/lu";

const Freeusers = ({socketref,room_id}) => {
    const [side_baropen, setside_baropen] = useState(false);
    const [code_review, setcode_review] = useState("")
    const [document_code, setdocument_code] = useState("")
    const document_code_ref = useRef(null)
    const [loading, setloading] = useState(false)
    const [loading_document, setloading_document] = useState(false)
    const handleClose = () => {
        setside_baropen(false)
    }
    const handleAIcodeReview = () => {
        if(loading){
            return;
        }
 
        if(socketref.current){
            setloading(true)
            socketref.current.emit(Actions.REVIEW_CODE,{
                room_id: room_id
            })
        }
        
    }
    const handleDocumentCode = () => {

        if(loading_document){
            return;
        }
        if(socketref.current){

            setloading_document(true)
            socketref.current.emit(Actions.DOCUMENT_CODE,{
                room_id: room_id
            })
        }
        
    }

    useEffect(()=>{
        if(document_code_ref.current){
          document_code_ref.current.scrollIntoView({ behavior: "smooth" ,block: "start",inline: "nearest",alignToTop: false});
        }
    },[document_code])

    useEffect(()=>{
        if(socketref.current){
            socketref.current.on(Actions.REVIEW_CODE,({response})=>{
                // console.log(response);
                setloading(false)
                setcode_review(response);
                toast.success("Code Review Generated", {
                    duration: 2000,
                    position: 'top-right',
                    style: {
                        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(26, 26, 26, 0.95))',
                        backdropFilter: 'blur(20px)',
                        color: 'white',
                        fontWeight: '600',
                        borderRadius: '16px',
                        border: '1px solid rgba(159, 255, 107, 0.3)',
                    },
                    iconTheme: {
                        primary: '#9fff6b',
                        secondary: '#000000',
                    },
                });
            })
            

        }

        if(socketref.current){
            socketref.current.on(Actions.DOCUMENT_CODE,({response})=>{
                // console.log(response);
                setloading_document(false)
                setdocument_code(response);
             
                console.log(response);
                toast.success("Documentation Generated", {
                    duration: 2000,
                    position: 'top-right',
                    style: {
                        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(26, 26, 26, 0.95))',
                        backdropFilter: 'blur(20px)',
                        color: 'white',
                        fontWeight: '600',
                        borderRadius: '16px',
                        border: '1px solid rgba(159, 255, 107, 0.3)',
                    },
                    iconTheme: {
                        primary: '#9fff6b',
                        secondary: '#000000',
                    },
                });
            })
        }
        return ()=>{
            if(socketref.current){
                socketref.current.off(Actions.REVIEW_CODE);
                socketref.current.off(Actions.DOCUMENT_CODE);
            }
        }
    },[socketref.current])
  return (
    <div className={side_baropen ? "side_bar-open" : "side_bar"}>
        <div className='icons'>
            {!side_baropen && (
                <MdKeyboardArrowLeft 
                    className='arrow-icon' 
                    onClick={() => setside_baropen(true)}
                />
            )}

        </div>
        {
                side_baropen && (
                    <div className='container'>
                        <div className='side_bar-header'>
                        
                            <IoMdClose className='close-icon' onClick={handleClose}/>
                           
                        </div>
                        <div className='buttons_container'>
                            {/* <button className='freeuser_btn' onClick={handleAIcodeReview}>{loading ? `Generating...` : "AI Code Review"}</button> */}
                            {
                                loading && (
                                    <button className='freeuser_btn'><LuLoaderCircle className='loading-icon-freeuser'/></button>
                                )
                            }
                            {
                                !loading && (
                                    <button className='freeuser_btn' onClick={handleAIcodeReview}>{"AI Code Review"}</button>
                                )
                            }

                            {
                                loading_document && (
                                    <button className='freeuser_btn'><LuLoaderCircle className='loading-icon-freeuser'/></button>
                                )
                            }
                           {
                            !loading_document && (
                                <button className='freeuser_btn' onClick={handleDocumentCode}>{"Document Code"}</button>
                            )
                           }
                        </div>

                        <div className='Responses'>
                            
                            {
                                code_review && (
                                    <>
                                    <h1 className='code_review_title'>Code Review</h1>
                                    <div className='code_review'>
            
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeHighlight]}
                                    >
                                {code_review}
                                
                            </ReactMarkdown>
                                    
                                    </div>
                                    </>
                                )
                            }
                            {
                                document_code && (
                                    <>
                                    <h1 ref={document_code_ref} className='document_code_title'>Documentaion</h1>
                                    <div  className='document_code'>
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeHighlight]}
                                    >
                                {document_code}
                            </ReactMarkdown>
                                    </div>
                                    </>
                                )

                            }
                        </div>
                        
                    </div>
                )
        }

    </div>
  )
}

export default Freeusers