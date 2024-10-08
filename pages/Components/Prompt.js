import React, { useEffect, useState } from 'react';
import { FaArrowUp } from "react-icons/fa";
import styles from '@/styles/Prompt.module.css'


const Prompt = ({chat,setChat,chatRef,prompt,setPrompt}) => {
  const [disabled, setDisabled] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(()=>{
    setDisabled(prompt === '')
  },[prompt])

  useEffect(()=>{
    if(generating){
      setDisabled(true)
    }
  },[generating,disabled])


  const enterPrompt = async (e) =>{
    e.preventDefault()
    setChat((prevChat) => [...prevChat, prompt,'...'])
     setPrompt('')
     setDisabled(true)
     setGenerating(true)
     //make post request to localhost:5000/query using fetch
     try{
     fetch('/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({query:prompt,memory:chat.slice(-10).filter((e,i)=>{return i % 2 === 0})
      })
        }).then((e)=>e.json())
        .then((data)=>{
          console.log(data)
          try{
            console.log(data.data.response)
            setChat((prevChat) => [...prevChat.slice(0, -1), data.data.response]);
            console.log(chat)
          }
          catch(err){
            console.log(err)
          }
          setGenerating(false)

        }
      )}
      catch(e){
        console.log(e)
      }
     
  }
  
  return (
    <div style={{ position: "relative", width: "100%"}}>
      
      <div
        style={{
          background: "var(--bg-color)",
          display: "flex",
          justifyContent: "center",
          width: "100%",
          paddingBottom:"18px",
          paddingTop:"20px"
          
        }}
      >
        <div
          style={{
            width: "98%",
            background: "var(--prompt-color)",
            borderRadius: "500px",
            padding: "0px",
            overflow:"hidden",
            position:"relative",
            paddingRight:"4px",
            
            
          }}
        >
          <form onSubmit={enterPrompt} style={{
            display:"flex",
            alignItems:"center"
            }}>
          <input
            type="text"
            className={styles.input}
            style={{ color:"var(--input-color)",outline:"none",border:"none",background:"transparent",fontSize: "1em", padding: "14px 20px", border: "none", width: "100%" }}
            placeholder="Enter the message"
            onChange={(e)=>{
              setPrompt(e.target.value)
            }}
            value={prompt}
          />
          <button type='submit' disabled={disabled} style={{width:"45px",height:"40px",borderRadius:"50%",marginRight:"10px",outline:"none",border:"none",background:disabled ? "var(--button-disable)":"var(--button-enable)",color:"var(--button-color)",fontSize:"1.2em",fontWeight:"900",display:"flex",alignItems:"center",textAlign:"center",justifyContent:"center",marginRight:"10px"}}><FaArrowUp></FaArrowUp></button>
          </form>
        </div>
      </div>
          </div>
  );
};

export default Prompt;