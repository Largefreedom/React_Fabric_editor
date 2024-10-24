
import { useRef, useState,useEffect } from 'react'
import './imgEditor.css'
import { fabric } from 'fabric';
import {IconButton} from 'blocksin-system'
import { SquareIcon,CircleIcon, Cross1Icon, BorderNoneIcon,FolderOpenedIcon } from 'sebikostudio-icons';
import Settings from './Settings';
import { handleObjectMoving,clearGuidelins } from './snappingHelper.js';
import Cropping from './cropping';
import CroppingSettings from './CroppingSettings';
import ImgInputing from './imgInputing';
import TextInput from './TextInput';
import ToolTip from './ToolTip';
import { createRoot } from 'react-dom/client'
import {Switch} from '@mui/material';
import SideBarIcon from '../../components/SideBarIcon.jsx';



export default function ImgEditor(){
    const [canvas,setCanvas] = useState(null)
    const [guidelins,setGuildelins] = useState([]) 
    const canvaref = useRef(null)
    const [refreshKey,setRefreshKey] = useState(0);
    const [groupEle,setGroupEle] = useState([])
    const [showGuideLine, setShowGuideLine]  = useState(true)

    const onAddRectangle = () => {
        if(canvas){
            canvas.add(new fabric.Rect({width:100,height:60,fill:'#d84d42',left: 100,top:60}))
        }
    };

    const onAddCircle = () => {
        if(canvas){
            canvas.add(new fabric.Circle({radius: 50,fill:'#000000',left: 100,top:100}))
        }
    };

    const onDelteItem = () => {
        if(canvas){
            canvas.remove(canvas.getActiveObject())
        }
    }

    const handleFrameUpdated = () =>{
        setRefreshKey((prevKey) => prevKey +1);
    }

    const onChageShowGuideLine = (event) => {
        let showGuide = !showGuideLine
        if(!showGuide){
            clearGuidelins(canvas);
        }
        setShowGuideLine(!showGuideLine)
       
    }

    const onGroupElements = () => {
        canvas.off('selection:created')
        canvas.off('selection:updated')
        canvas.on('selection:created',(event) => {
            if(!groupEle.includes(event.selected[0])){
                // event.selected[0].selectable = true
                groupEle.push(event.selected[0])
                setGroupEle((preGroupEle) => [...preGroupEle,event.selected[0]])
                console.log('groupEle created',groupEle)
                canvas.renderAll()
            }
           
          
        })
        canvas.on('selection:updated',(event) => {
            if(!groupEle.includes(event.selected[0])){
                // event.selected[0].hasBorders = true
                // event.selected[0].selectable = true
                groupEle.push(event.selected[0])
                setGroupEle((preGroupEle) => [...preGroupEle,event.selected[0]])
                console.log('groupEle updated',groupEle)
                canvas.renderAll()
                
            }
        })
    }

    const onCombineGroups = () => {
        if(groupEle.length === 0){
            return
        }
        console.log('groupEle is',groupEle,groupEle.length)
        const groups = new  fabric.Group([...groupEle])
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
                    width: 500,
                    height: 500,
                    fireRightClick: true,
                    preserveObjectStacking: true
                });
            initCanvas.backgroundColor = '#fff'
            initCanvas.renderAll();
            setCanvas(initCanvas)

            initCanvas.on("object:moving",(event) => {
                handleObjectMoving(initCanvas,event.target,
                    guidelins,setGuildelins);
                handleObjectRight(event.target,initCanvas)
            })

            initCanvas.on("object:modified",(event) => {
                handleObjectMoving(initCanvas,event.target,
                    guidelins,setGuildelins);
            })
            
            initCanvas.on("selection:created",(event) => {
                handleObjectRight(event.selected[0],initCanvas)
            })
            return () => {
                initCanvas.dispose()
            }
        }
    }, [])
    return (
        <div className="App" >
            <div className='toolbar darkmode'>

                <ImgInputing canvas={canvas}></ImgInputing>
                <TextInput canvas={canvas}></TextInput>
                <Cropping canvas={canvas} onFrameUpdated={handleFrameUpdated}>
                    </Cropping>
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