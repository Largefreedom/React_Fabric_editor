// data transfer 

import { useState } from "react";
import './dataTransfer.less'



export default function DataTransfer(){

    const [fileNum,setFileNum] = useState(0)
    const [files,setFiles] = useState([
        {"id": "1",
        "name":"sample1",
        "size": 20488},
        {"id": "2",
        "name":"sample2",
        "size": 20488},
    
    ])
    // const changeInput = (event) => {
    //     console.log('event is ',event)
        
    // }
    

    return (
        <>
            <div className="all">
                <div>
                    File Transfer Module - Chunk version
                </div>
                
                <div className="btn-list">
                    <button>File Query</button>
                </div>
                {files.length> 0 &&
                    <div className="file-list">
                        {files.map((fileItem,index) => (
                            <div key={index} className="list-item">
                                <div className="meta-item">
                                    <div className="file-name">
                                        {fileItem.name}
                                    </div>
                                    <div className="file-size">
                                        {fileItem.size}
                                    </div>
                                </div>
                                <div className="operate">
                                    <button>START</button>
                                </div>
                            </div>

                        ))
                        
                        }
                    
                    </div>
                }

            </div>
        
        </>
    )
}