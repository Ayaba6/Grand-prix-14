import React, { useRef, useState } from "react";

import invitetemplate from "./invitetemplate.png";
import partnertemplate1 from "./partnertemplate1.png";
import partnertemplate2 from "./partnertemplate2.png";

function App() {

const canvasRef = useRef(null)

const [image,setImage] = useState(null)

const [size,setSize] = useState(300)
const [x,setX] = useState(400)
const [y,setY] = useState(300)

const [dragging,setDragging] = useState(false)

const [selectedTemplate,setSelectedTemplate] = useState(invitetemplate)

const CANVAS_WIDTH = 1080
const CANVAS_HEIGHT = 1080


const handleUpload = (e)=>{

const file = e.target.files[0]

if(!file) return

const reader = new FileReader()

reader.onload = function(event){

const photo = event.target.result

setImage(photo)

generatePoster(photo,x,y,size,selectedTemplate)

}

reader.readAsDataURL(file)

}


const generatePoster = (photo,posX,posY,s,templateSrc=selectedTemplate)=>{

const canvas = canvasRef.current
const ctx = canvas.getContext("2d")

canvas.width = CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT

const templateImage = new Image()

templateImage.src = templateSrc

templateImage.onload = ()=>{

ctx.clearRect(0,0,canvas.width,canvas.height)

ctx.drawImage(templateImage,0,0,CANVAS_WIDTH,CANVAS_HEIGHT)

if(photo){

const userImage = new Image()

userImage.src = photo

userImage.onload = ()=>{

ctx.save()

ctx.beginPath()
ctx.arc(posX + s/2 , posY + s/2 , s/2 , 0 , Math.PI*2)
ctx.clip()

ctx.drawImage(userImage,posX,posY,s,s)

ctx.restore()

}

}

}

}



const handleStart = ()=>{

setDragging(true)

}

const handleEnd = ()=>{

setDragging(false)

}



const handleMove = (clientX,clientY)=>{

if(!dragging || !image) return

const canvas = canvasRef.current

const rect = canvas.getBoundingClientRect()

const scaleX = canvas.width / rect.width
const scaleY = canvas.height / rect.height

const newX = (clientX - rect.left) * scaleX - size/2
const newY = (clientY - rect.top) * scaleY - size/2

setX(newX)
setY(newY)

generatePoster(image,newX,newY,size)

}



const handleMouseMove = (e)=>{

handleMove(e.clientX,e.clientY)

}



const handleTouchMove = (e)=>{

const touch = e.touches[0]

handleMove(touch.clientX,touch.clientY)

}



const updateSize = (newSize)=>{

setSize(newSize)

if(image){

generatePoster(image,x,y,newSize)

}

}



const changeTemplate = (template)=>{

setSelectedTemplate(template)

if(image){

generatePoster(image,x,y,size,template)

}else{

generatePoster(null,x,y,size,template)

}

}



const downloadPoster = ()=>{

const canvas = canvasRef.current

const link = document.createElement("a")

link.download = "Grand-prix-14.png"

link.href = canvas.toDataURL("image/png")

link.click()

}



return (

<div style={{
display:"flex",
flexDirection:"column",
minHeight:"100vh",
fontFamily:"Arial"
}}>

<div style={{
padding:"20px",
background:"#f4f4f4"
}}>

<h2>Paramètres</h2>

<h3>Template</h3>

<button onClick={()=>changeTemplate(invitetemplate)}>Invite</button>
<button onClick={()=>changeTemplate(partnertemplate1)}>Partner 1</button>
<button onClick={()=>changeTemplate(partnertemplate2)}>Partner 2</button>

<br/><br/>

<input type="file" accept="image/*" onChange={handleUpload}/>

<br/><br/>

<label>Taille photo</label>

<br/>

<input
type="range"
min="100"
max="800"
value={size}
onChange={(e)=>updateSize(Number(e.target.value))}
/>

<br/><br/>

<button onClick={downloadPoster}>
Télécharger l'affiche
</button>

</div>


<div style={{
flex:1,
display:"flex",
justifyContent:"center",
alignItems:"center",
padding:"20px"
}}>

<canvas

ref={canvasRef}

onMouseDown={handleStart}
onMouseUp={handleEnd}
onMouseMove={handleMouseMove}

onTouchStart={handleStart}
onTouchEnd={handleEnd}
onTouchMove={handleTouchMove}

style={{
width:"100%",
maxWidth:"500px",
border:"1px solid #ccc"
}}

/>

</div>

</div>

)

}

export default App