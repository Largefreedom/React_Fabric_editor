import './imgCover.less'
import { useState,useEffect } from 'react'
import CodeIcon from '@mui/icons-material/Code';
import downloadjs from 'downloadjs';
import html2canvas from 'html2canvas';

// 生成 封面图
export default function ImgCover(){
    const [fileNum,setFileNum] = useState(0)
    const [title,setTitle] = useState('')
    const [imgs,setImgs]  = useState([])

    let val = ""
    useEffect(() => {
        console.log('change imgs is ',imgs)
    },[imgs])

    function changeValue(event){
        console.log('event is ',event)
        setTitle(event.target.value)
        
    }
    async function downImgCanvas(){
        const canvas = await html2canvas(document.getElementById('canvas-id'));
        const dataURL = canvas.toDataURL('image/png');
        downloadjs(dataURL, 'download.png', 'image/png');
    }
    function uploadFile(event){
        // setFileNum(event.target.files.length)
        const file = event.target.files[0];  // Get the first selected file
        if (file) {
            if(file.size > 1024 * 1024 * 5){
                alert('图片太大,仅支持5MB以下')
                return
            }
            const reader = new FileReader();  // Create a FileReader instance
            // Set up the onload event handler to process the file after it's read
            reader.onload = (e) => {
                const base64String = e.target.result;  // Get the Base64 string from result
                console.log('imags',base64String)
                setImgs(preImgs => ([...preImgs,base64String]))
                console.log('imgs is ',imgs)
            };
            // Read the file as a Data URL (Base64)
            reader.readAsDataURL(file);
        } else {
            console.log('No file selected.');
        }   
        
    }
    
    return (
        <>
            <div className='main'>
                <div className='canvas-download'>
                    Canvas  Downloader
                </div>
                <div className='top-district'>
                    <label htmlFor="input-file" >上传</label>
                    <button onClick={()=>setImgs((preImgs) => ([]))}>清空</button>
                    {imgs.length>1 && <button onClick={downImgCanvas}>下载</button>}
                    <input type='file' id="input-file" className='type-input' onChange={uploadFile}></input>
                    <span>
                        已上传 { imgs.length} 个文件
                    </span>
                    <div className='input-cs'>
                        输入文本:
                        <input placeholder='请输入文本'
                        defaultValue={val} onChange={changeValue}></input>
                    </div>
                </div>
                {
                    (title || imgs.length>0 ) &&   
                <div className='bottom-pic'>
                    <div className='cavans-cls' id="canvas-id">
                        <div className='title'>
                            {title}
                        </div>
                        { imgs.length>0 &&<div className='img-list'>
                            {
                                imgs.map((item,index) => (
                                    <>
                                        <img src={item}></img>
                                        {index !== imgs.length-1 &&
                                         <CodeIcon color='white'></CodeIcon>
                                        }
                                    </>
                                    
                                ))
                            }
                            
                        </div>
                        }
                    </div>
                    
                </div>
                }
              
            </div>
        
        </>)
}