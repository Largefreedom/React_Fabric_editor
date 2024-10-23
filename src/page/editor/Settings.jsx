import { Input } from "blocksin-system";
import React,{useState,useEffect} from "react";


export default function Settings({canvas}){
    const [selectedObject, setSelectedObject] = useState(null);
    const [width,setWidth] = useState(0);
    const [height,setHeight] = useState(0);
    const [diameter,setDiameter]  = useState(0);
    const [color,setColor] = useState("");

    useEffect(() => {
        if(canvas){
            canvas.on('selection:created',(event) => {
                handleObjectSelection(event.selected[0])
            });
            canvas.on("selection:updated",(event) => {
                handleObjectSelection(event.selected[0])
            });
            canvas.on("selection:cleared",() => {
                setSelectedObject(null);
                clearSettings();
            });
            canvas.on("object:modified",(event) => {
                handleObjectSelection(event.target)
            });
            canvas.on("object:scaling",(event) => {
                handleObjectSelection(event.target)
            });

        
        }
    },[canvas]);
    const handleObjectSelection = (object) => {
        // canvas 发生变化
        if(!object) return;
        setSelectedObject(object);
        if(object.type === 'rect'){
            setWidth(Math.round(object.width*object.scaleX));
            setHeight(Math.round(object.height * object.scaleY));
            setDiameter("");
            setColor(object.fill);
        }else if(object.type === 'circle'){
            setDiameter(Math.round(object.radius * 2 * object.scaleX))
            setColor(object.fill);
            setWidth(0);
            setHeight(0);
        }
    }



    const clearSettings = ()=>{
        setWidth(0);
        setHeight(0);
        setColor("");
        setDiameter(0);
    }

    const handleWidthChange = (e) => {
        const intValue = parseInt(e,10);
        setWidth(intValue)
        if(selectedObject && selectedObject.type === "rect" && intValue >=0){
            selectedObject.set({width: intValue/selectedObject.scaleX});
            canvas.renderAll();
        }

    };
    const handleHeightChange = (e) => {

        const intValue = parseInt(e,10);
        setHeight(intValue)
        if(selectedObject && selectedObject.type === "rect" && intValue >=0){
            selectedObject.set({height: intValue/selectedObject.scaleY});
            canvas.renderAll();
        }
    };
    const handleColorChange = (e) => {
        const value = e.target.value;
        setColor(value)
        if(selectedObject){
            selectedObject.set({fill:value})
            canvas.renderAll();
        }
    };
    const handleDiameterChange = (value) => {

        const intValue = parseInt(value,10);
        setDiameter(intValue)
        if(selectedObject && selectedObject.type === "circle" && intValue >=0){
            selectedObject.set({radius: intValue / 2 /selectedObject.scaleX});
            canvas.renderAll();
        }

    };
    return (
        <>
        <div className="Settings darkmode">
            {selectedObject && selectedObject.type === "rect" && (
                <>
                <span>Width:</span>
                 <input type="number"  id="number-input" name="body" 
                                    placeholder="width"
                                    value={width}
                                    onChange={(event) => handleWidthChange(event.target.value)}/>
                <span>Height:</span>
                <input type="number" min="0" max="1000" id="number-input" placeholder="height" name="body" value={height}
                                    onChange={(event) => handleHeightChange(event.target.value)}/>
                 <span>Color:</span>                    
                <input type="color" id="color-input" name="body" value={color}
                                    onChange={handleColorChange}/>
                </>
            )}
            {selectedObject && selectedObject.type === "circle" && (
                <>
                  <span>Diameter:</span>
                    <input type="number" min="0" max="1000" id="number-input" placeholder="diameter" name="body" value={diameter}
                                    onChange={(event) => handleDiameterChange(event.target.value)}/>
                    <span>Color:</span>
                    <input type="color" id="color-input" name="body" value={color}
                                    onChange={handleColorChange}/>
                </>
            )}
        </div>
        </>
    )
}