
import { useState,useEffect, useRef} from "react"
import './upload.css'
import { hexToRgb } from "@mui/material";
import { _segImgInvoke,_uploadData,_queryHistory } from "./api/segImgApi";
import { _queryProcess } from "./api/commonApi";


export default function Upload(){
    // 是否显示
    const [isShow, setIsShow] = useState(null);
    const [bgColor,setBgColor] = useState('#000000')
    // 上传文件数量
    const [fileNum,setFileNum] = useState(0);
    const [imgContent,setImgContent] = useState({})
    const [result,setResult] = useState({output_images: []})
    const [resultList,setResultList] = useState([])
    const [process,setProcess] = useState({"is_finished": "no"})
      
    // useEffect(() => {
    //     console.log("更新为----------",process)
    //  },[process])

    // 点击上传图片
    function changeInput(event){
        console.log('event',event)
        setFileNum(event.target.files.length)
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
                setImgContent({
                    "name": file.name,
                    "img": base64String,
                    "file_path": event.target.value
                })
            };
            // Read the file as a Data URL (Base64)
            reader.readAsDataURL(file);
        } else {
            console.log('No file selected.');
        }   
    }
    // 移出图片
    function removeImg(){
        // 全部重置
        setFileNum(0)
        setImgContent({})
        setIsShow(null)
        setResult({output_images: []})
        setResultList([])
    }

    function changeColorInput(event){
        console.log('color change is ',event)
        setBgColor(event.target.value)
        console.log(hexToRgb(event.target.value))
    }
    // 触发图片分割
    async function SegImgInvoke() {  
        const resultTest = await _uploadData({
            "image":imgContent.img,
            "name":imgContent.name,
            "file_path": imgContent.file_path
        })
        if(resultTest){
            console.log('result is',resultTest)
            // 触发prompt
            const invokePrompt = await _segImgInvoke({
                "img_path": resultTest.name,
                "color": bgColor,
            })
            if(invokePrompt){
                console.log('invokePrompt is',invokePrompt)
                // 重置数据
                result["prompt_id"] = invokePrompt.prompt_id
                result["client_id"] = invokePrompt.client_id
                // 分割标识物，是否在分割中
                setIsShow('FALSE')
                // 设置新值
                setResult(result)
                setResultList((preResultList) => ([]))
                setProcess({})
                // 查询结果
                queryReslt()
                queryProcess()
        }
    }

    async function queryReslt() {
        const res = await _queryHistory({
            "prompt_id": result['prompt_id']
        })
        if(res){
            console.log('查询历史结果 is',res)
            if(res.output_images.length === 0){
                setTimeout(async () => queryReslt(), 3000);
            }else{
                result["output_images"] = res.output_images
                result['is_seging'] = false
                setResult(result)
                setIsShow('TRUE')
                setResultList(res.output_images)
                return
            }
        }
        
    }
    
    async function queryProcess() {
 
        const res = await _queryProcess({
            "prompt_id": result["prompt_id"]
        })
        if(res){
            console.log('res is',res)
            if(res.is_finished  && res.is_finished ==='yes'){
                return
            }else{
                if(res.is_finished){
                    setProcess(preProcess => ({...preProcess,
                        is_finished:res.is_finished,
                        total_process: res.total_process,
                        is_sample_node: res.sub_process.is_sample_node,
                        sample_process:res.sub_process.sample_process
                    }));
                }
           
                setTimeout(async () => queryProcess(),1000)
            }
        }else{
            setTimeout(async () => queryProcess(),1000)
        }
    }
  
    }
    return (
        <>
    
        <div className="main">
            <h1>分割人物,指定背景颜色</h1>
            <label className="upload-button" htmlFor="input-file"  >{ fileNum == 0 ?'点击上传' :'重新上传'}</label>
                {/* {fileNum >0 && <label className="upload-button remove" onClick={removeImg} >清空列表</label>} */}
                {/* <p className="fileNum-span">当前共上传 {fileNum} 张图片</p> */}
            <input className="input-class" type="file" id="input-file" onChange={changeInput} name="avatar" accept="image/png, image/jpeg" />
             { fileNum>0  && imgContent.img &&
                <div className="img-btn-color-div">
                    <img src={imgContent.img} className="show-img"/>
                    <div  className="seg-button-div">
                        <button className="seg-button" onClick={SegImgInvoke}
                        disabled={isShow === 'FALSE'}
                        >
                            开始分割
                        </button>

                        <div className="color-area">
                            <span>
                            背景颜色：
                            </span>
                                <div className="color-sub">
                                    <input type="color" id="body" name="body" value={bgColor}
                                    onChange={changeColorInput}/>
                                    <div htmlFor="body"  className="color-label">{hexToRgb(bgColor)}</div>
                                </div>
                            </div>
                            <div>
                       
                        </div>
                    </div>
                </div>
                }
        { isShow === 'FALSE' && 
        <>
        <div className="process-div">正在处理中，请稍后...</div>
         {process && process.is_finished ==='no' && 
         <div>总进度为{process.total_process}{ process.is_sample_node === 'yes' && `，子任务当前进度为 ${process.sample_process}`}</div>}
        </>}
        { resultList.length>0 && isShow === 'TRUE' && 
        <div className="result_div">
            {
            resultList.map((item, index) => (
                <div key={index}  className="result-item-class">
                    <img  className="result-img" src={`data:image/png;base64,${item.image_data}`}>
                    </img>
                    <span key={index}>{item.file_name}</span>
            </div>
            ))}
        </div>}
        {resultList.length>0  &&  <span className="bottom-tip">{`一共生成结果共 ${resultList.length} 张图片,左侧透明底，右侧为指定的颜色`}</span>}          
        </div>
        {/* <Dialog
        open={fileNum === 0}
        onClose={() => {}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{
            
          }}>Disagree</Button>
          <Button onClick={() => {setFileNum(1)}} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog> */}
    </>
    )
    
}