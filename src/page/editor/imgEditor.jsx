
import { useRef, useState,useEffect } from 'react'
import './imgEditor.css'
import { fabric } from 'fabric';
import { SquareIcon,CircleIcon, Cross1Icon, BorderNoneIcon,FolderOpenedIcon } from 'sebikostudio-icons';
import Settings from './Settings';
import SaveIcon from '@mui/icons-material/Save';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { handleObjectMoving,clearGuidelins, } from './snappingHelper.js';
import Cropping from './cropping';
import CroppingSettings from './CroppingSettings';
import ImgInputing from './imgInputing';
import TextInput from './TextInput';
import ToolTip from './ToolTip';
import { createRoot } from 'react-dom/client'
import {Switch} from '@mui/material';
import SideBarIcon from '../../components/SideBarIcon.jsx';


export default function ImgEditor(){
    let [canvas,setCanvas] = useState(null)
    const [guidelins,setGuildelins] = useState([]) 
    const [refreshKey,setRefreshKey] = useState(0);
    const [groupEle,setGroupEle] = useState([])
    const [showGuideLine, setShowGuideLine]  = useState(true)
    const canvaref = useRef(null)
    const groupEleRef = useRef(groupEle)
    const showGuideLineRef = useRef(showGuideLine)
    

    useEffect(() => {
        console.log('group ref is ',groupEle)
        groupEleRef.current = groupEle
    },[groupEle])

    const onAddRectangle = () => {
        if(canvas){
            canvas.add(new fabric.Rect({width:100,height:60,fill:'#d84d42',left: 100,top:60}))
        }
    };

    const onAddCircle = () => {
        if(canvas){
            let circle = new fabric.Circle({radius: 50,fill:'#000000',left: 100,top:100})
            canvas.add(circle)
        }
    };

    const handleFrameUpdated = () =>{
        setRefreshKey((prevKey) => prevKey +1);
    }

    const onChageShowGuideLine = (event) => {
        let showGuide = !showGuideLine
        if(!showGuide){
            clearGuidelins(canvas);
        }
        // query reverse state of data
        setShowGuideLine( showGuidLineItem => !showGuidLineItem)
       
    }

    const onGroupElements = () => {
        // cancel event listener
        canvas.off('selection:created')
        canvas.off('selection:updated')
        // create event listener
        canvas.on('selection:created',(event) => {
            if(event.selected.length> 0 && !groupEle.includes(event.selected[0]) && event && event.e){
                // event.selected[0].selectable = true
                let otherGroup = [...groupEleRef.current,event.selected[0]]
                setGroupEle(preGroupEle => [...preGroupEle,event.selected[0]])
                canvas.discardActiveObject()
                canvas.setActiveObject(new fabric.ActiveSelection(otherGroup,{canvas:canvas}))
                canvas.renderAll()
            }
          
        })
        canvas.on('selection:updated',(event) => {
            if(event.selected.length> 0 && !groupEle.includes(event.selected[0]) && event && event.e){
                let otherGroup = [...groupEleRef.current,event.selected[0]]
                setGroupEle(preGroupEle => [...preGroupEle,event.selected[0]])
                canvas.discardActiveObject()
                canvas.setActiveObject(new fabric.ActiveSelection(otherGroup,{canvas:canvas}))
                canvas.renderAll()
            }
        })
    }

   

    const onSaveCanavsToJson = async () => {
        const newHandle = await window.showSaveFilePicker();
        const writableStream = await newHandle.createWritable();
        let canvasJson  = JSON.stringify(canvas)
        console.log('canvasJson is',canvasJson)
        await writableStream.write(canvasJson)
        await writableStream.close();
        window.alert("文件已存储完毕")
    }

    const onReadFromCanvas = async () => {
        const pickerOpts = {
            excludeAcceptAllOption: true,
            multiple: false,
        };
        const [fileHandle] = await window.showOpenFilePicker(pickerOpts);
        const file = await fileHandle.getFile();
        const text = await file.text();
        if(text){
            let readJson = JSON.parse(text)
            canvas = new fabric.Canvas(canvaref.current)
            canvas.loadFromJSON(readJson)
        }
    }


    const onCombineGroups = () => {
        if(groupEle.length === 0){
            return
        }
        canvas.discardActiveObject()
        const groups = new  fabric.Group(groupEle)
        canvas.add(groups)
        canvas.renderAll()
        setGroupEle([])
        canvas.off('selection:created')
        canvas.off('selection:updated')
        
    }


    const handleObjectRight = (object,canvas) => {
        const container = document.getElementsByClassName('canvas-container')
        if(!container || container.length ==0) return
        let containerItem =  container[0]
        containerItem.childNodes.forEach((childNode) => {
            if(childNode.className.startsWith("tip-note")){
                containerItem.removeChild(childNode)
            }
        })
        const newChild = document.createElement('div');
        newChild.className = "tip-note"
        container[0].appendChild(newChild);
        const root = createRoot(newChild)
        root.render(<ToolTip obj={object} canvas={canvas}></ToolTip>)  
        
    }



    useEffect(() => {
        if(canvaref.current) {
            const initCanvas = new fabric.Canvas(canvaref.current,
                {
                    width: 600,
                    height: 600,
                    fireRightClick: true,
                    preserveObjectStacking: true
                });
            initCanvas.backgroundColor = '#fff'
            initCanvas.renderAll();
            setCanvas(initCanvas)

            initCanvas.on("object:moving",(event) => {
                if(showGuideLineRef.current){
                    handleObjectMoving(initCanvas,event.target,
                        guidelins,setGuildelins);
                } else {
                    clearGuidelins(initCanvas)
                }
                handleObjectRight(event.target,initCanvas)
            })
            initCanvas.on("object:modified",(event) => {
                if(showGuideLineRef.current){
                    handleObjectMoving(initCanvas,event.target,
                        guidelins,setGuildelins);
                    
                }else{
                    clearGuidelins(initCanvas)
                }
            })
            initCanvas.on("selection:created",(event) => {
                console.log('select ied is',event)
                handleObjectRight(event.selected[0],initCanvas)
            })
            return () => {
                initCanvas.dispose()
            }
        }
    }, [])

    useEffect(()=>{
        showGuideLineRef.current = showGuideLine
    },[showGuideLine])


    return (
        <div className="App" >
            <div className='toolbar darkmode'>
                <ImgInputing canvas={canvas}></ImgInputing>
                <TextInput canvas={canvas}></TextInput>
                <Cropping canvas={canvas} onFrameUpdated={handleFrameUpdated}>
                </Cropping>
    
                <SideBarIcon tipName={`打开Canvas`} jsxEle={<FileOpenIcon></FileOpenIcon>} func={onReadFromCanvas}>
                </SideBarIcon>
                
                <SideBarIcon tipName={`保存 Canvas`} jsxEle={<SaveIcon></SaveIcon>} func={onSaveCanavsToJson}>
                </SideBarIcon>

                <SideBarIcon tipName={`添加矩阵`} jsxEle={<SquareIcon></SquareIcon>} func={onAddRectangle}>
                </SideBarIcon>
                <SideBarIcon tipName={`添加圆形`} jsxEle={ <CircleIcon></CircleIcon>} func={onAddCircle}>
                </SideBarIcon>
                <SideBarIcon tipName={`形状组合`} jsxEle={ <BorderNoneIcon></BorderNoneIcon>} func={onGroupElements}>
                </SideBarIcon>
                {groupEle.length>0 && <SideBarIcon tipName={`组合确认`} jsxEle={ <FolderOpenedIcon></FolderOpenedIcon>} func={onCombineGroups}>
                </SideBarIcon>}
                <Switch  checked={showGuideLine}
                    onChange={onChageShowGuideLine}
                />
            </div>
            <div className='title'>Canvas画布</div>
            <canvas ref={canvaref} id="canvas" > 
            </canvas>
            <Settings canvas={canvas}></Settings>
            <CroppingSettings canvas={canvas} refreshKey={refreshKey}></CroppingSettings>
        </div>
    );
    
}