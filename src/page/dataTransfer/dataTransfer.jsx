// data transfer 

import { useState,useRef,useEffect } from "react";
import './dataTransfer.less'
import ButtonSpinner from "../../components/small/ButtonSpinner";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import DoneIcon from '@mui/icons-material/Done';
import { _submitDir,_startProcesData } from "../../api/utilsApi";




export default function DataTransfer(){
    const [ btnLoading,setBtnLoading] = useState(false)
    const [files,setFiles] = useState([])
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [proBar,setProBar] = useState([])
    

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8001/api/ws');
        // Set up event listeners for WebSocket
        ws.onopen = () => {
            console.log('WebSocket connection established');
        };
        ws.onmessage = (event) => {
            console.log('Message received:', event.data);
        // Append new message to the messages state
            let parseData = JSON.parse(event.data)
            console.log("data",parseData)
        };
        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };
        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
        // Clean up the WebSocket connection on component unmount
        setSocket(ws);
        if(files.length === 0 ){
            queryFileList()
        }
        return () => {
            ws.close();
        };
    },[])

    const queryFileList = async () => {
        setBtnLoading(true)
        const res = await _submitDir({})
        if(res){
            // restore loading status
            setBtnLoading(false)
            setFiles(res.file_info.slice(0,1))
            let progressBarList = []
            res.file_info.forEach(element => {
                progressBarList.push({
                    "id": element.id,
                    "process": element.process,
                    "status": element.status,
                    "isShow": false,
                    // 是否开始
                    "isStart": false
                })
            });
            setProBar(progressBarList.slice(0,1))
        }
    }
    const changeItem = (fileItem,changeIndex) =>{
        if(!fileItem.isStart){
            // 不展示禁掉
            return
        }
        if(fileItem.process >= 100){
            fileItem.isStart = false
            changeProBarUtil(fileItem,changeIndex)
            return;
        }
        fileItem.process += 1
        changeProBarUtil(fileItem,changeIndex)
        setTimeout(()=>{
            changeItem(fileItem,changeIndex)
        },100)

    }

    const changeProBarUtil = (fileItem,changeIndex) => {
        if(changeIndex == proBar.length -1){
            setProBar(proBar =>[...proBar.slice(0,changeIndex),fileItem])
        }else{
            setProBar(proBar =>[...proBar.slice(0,changeIndex),fileItem,...proBar.slice(changeIndex+1)])
        }
    }

    // const emitStartEvent = async (changeIndex) => {
    //     console.log('before ',proBar,changeIndex)
    //     let fileItem =  proBar[changeIndex]
    //     if(fileItem.process>=100){
    //         return
    //     }
    //     fileItem.isStart = !fileItem.isStart
    //     changeProBarUtil(fileItem,changeIndex)
    //     if(!fileItem.isStart){
    //         // 不展示时禁掉
    //         return
    //     }
    //     console.log("end",proBar)
    //     changeItem(fileItem,changeIndex)
    // }


    const emitStartEvent = async (changeIndex) => {
        console.log('before ',proBar,changeIndex)
        let fileItem =  proBar[changeIndex]
        console.log('fileItem is',fileItem.id)
        socket.send(JSON.stringify({
            "clientId":fileItem.id
        }));
        const res = await _startProcesData({
            "id": fileItem.id
        })
        if(res){
            console.log("response is",res)
        }
    }
    

  return (
        <>
            <div className="all">
                <div>
                    File Transfer Module - Chunk version
                </div>                
                <div className="btn-list">
                    <ButtonSpinner text={`File Query`} loading={btnLoading} onSubmit={queryFileList} ></ButtonSpinner>
                </div>
                {files.length> 0 &&
                    <div className="file-list">
                        {files.map((fileItem,index) => (
                            <div key={index} className="list-item probar">
                                <div className="meta-item">
                                    <div className="file-name">
                                        {fileItem.file_path}
                                    </div>
                                    <div className="file-size">
                                        {fileItem.file_size} MB
                                    </div>
                                    { proBar.length >=0 && proBar[index] && proBar[index].isStart &&  
                                     <div className="pro-bar" style={{width: `${proBar[index].process}%`}}>
                                        {`${proBar[index].process}%`}
                                     </div>
                                    }
                                   
                                </div>
                                <div className="operate">
                                    <div className="item"
                                        onClick={()=>{
                                        emitStartEvent(index)   
                                        }}>   {
                                         proBar[index] && proBar[index].isStart === false && proBar[index].process<100 && (
                                            <PlayCircleOutlineIcon></PlayCircleOutlineIcon>
                                         )}{
                                         proBar[index] && proBar[index].isStart === true  && proBar[index].process <100 && (
                                            <PauseCircleOutlineIcon></PauseCircleOutlineIcon>
                                         )}
                                         {
                                            // done 
                                            proBar[index] && proBar[index].process === 100 && (
                                                <DoneIcon></DoneIcon>
                                            )
                                         }
                                    </div>
                                    
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </>
    )
}