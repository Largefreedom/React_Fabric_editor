import { fabric } from "fabric";
import {IconButton} from "blocksin-system";
import { CropIcon } from "sebikostudio-icons";


export default function Cropping({canvas,onFrameUpdated}) {

    const addFrameToCanvas = () => {
        const fileName = `Frame ${canvas.getObjects("rect").length +1}`;
        
        const frame  = new fabric.Rect({
            left: 100,
            top:100,
            width: 200,
            height: 200,
            fill: "transparent",
            stroke: "#07FE3D",
            strokeWidth: 1,
            selectable: true,
            evented: true,
            name: fileName
        })
        canvas.add(frame);
        canvas.renderAll();
        
        const maintainStrokeWidth = (object) => {
            const scaleX = object.scaleX || 1;
            const scaleY = object.scaleY || 1;
            object.set({
                width: object.width * scaleX,
                height: object.height * scaleY,
                scaleX: 1,
                scaleY: 1,
                strokeWidth: 1
            })
            
            object.setCoords();
        };
        frame.on("scaling",()=>{
            maintainStrokeWidth(frame);
            canvas.renderAll();
        });
        
        frame.on("modified",()=> {
            maintainStrokeWidth(frame);
            canvas.renderAll();
        });
        onFrameUpdated();
    }
    return (
        <div className="FrameComponent">
            <IconButton variant="ghost" onClick={addFrameToCanvas}>
                <CropIcon></CropIcon>
            </IconButton>
            
        </div>
    )
}