import { useState,useEffect } from "react"
import ToolTipIcon from "../../components/ToolTipIcon";
import { 
    Delete,
 } from "@mui/icons-material"
 import ExpandLessIcon from '@mui/icons-material/ExpandLess';
 import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
 import AllInclusiveIcon from '@mui/icons-material/AllInclusive';

export default function ToolTip({obj,canvas}){
    const [display,setDisplay] = useState(true)

    // 删除 obj
    const onRemove = (event) =>{
        canvas.remove(obj)
        canvas.renderAll()
        // 设为
        setDisplay(false)
    }
    

    // 上移 obj
    const  onUp = (event) => {
        console.log('up is',obj)
        canvas.bringForward(obj)
        canvas.renderAll()
    }

     // 下移 obj
     const  onDown = (event) => {
        canvas.sendBackwards(obj)
        canvas.renderAll()
    }


    // 动画 animate
    const onAnimate = (event) => {
        // console.log('obj is ', obj)
        obj.animate('angle', "+=10", {
            onChange: canvas.renderAll.bind(canvas),
            duration: 300,
        });
    }


    useEffect(()=>{
        canvas.on("selection:cleared",() => {
            setDisplay(false)
        });
    },[canvas]);

    return (
        <div className="tool-tip tip-note" style={{
            left: `${obj.left + 5}px`,
            top: `${obj.top - 55}px`,
            display: display? 'flex': 'none'
        }}>
            <ToolTipIcon jsxEle={ <Delete onClick={onRemove} fontSize="small" style={{
                    color: 'white'}}> </Delete>}
                    tip={`删除`}>
            </ToolTipIcon>

            <ToolTipIcon jsxEle={  <ExpandLessIcon onClick={onUp} fontSize="small" style={{
                    color: 'white'}}> </ExpandLessIcon>}
                    tip={`图层上移`}>
            </ToolTipIcon>

            <ToolTipIcon jsxEle={  <ExpandMoreIcon onClick={onDown} fontSize="small" style={{
                    color: 'white'}}> </ExpandMoreIcon>}
                    tip={`图层下移`}>
            </ToolTipIcon>


            <ToolTipIcon jsxEle={  <AllInclusiveIcon onClick={onAnimate} fontSize="small" style={{
                    color: 'white'}}> </AllInclusiveIcon>}
                    tip={`旋转动画`}>
            </ToolTipIcon>
        </div>
    )
}