import React, { useRef, useState } from "react";

import invitetemplate from "./invitetemplate.png";
import partnertemplate1 from "./partnertemplate1.png";
import partnertemplate2 from "./partnertemplate2.png";

function App() {

  const canvasRef = useRef(null);

  const [image, setImage] = useState(null);

  const [size, setSize] = useState(300);
  const [x, setX] = useState(420);
  const [y, setY] = useState(300);

  const [zoom, setZoom] = useState(0.5);

  const [dragging, setDragging] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState(invitetemplate);

  const handleUpload = (e) => {

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(event) {

      const photo = event.target.result;

      setImage(photo);

      generatePoster(photo, x, y, size, selectedTemplate);

    };

    reader.readAsDataURL(file);

  };

  const generatePoster = (photo, posX, posY, s, templateSrc = selectedTemplate) => {

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const templateImage = new Image();
    templateImage.src = templateSrc;

    templateImage.onload = () => {

      canvas.width = templateImage.width;
      canvas.height = templateImage.height;

      ctx.clearRect(0,0,canvas.width,canvas.height);

      ctx.drawImage(templateImage, 0, 0);

      if(photo){

        const userImage = new Image();
        userImage.src = photo;

        userImage.onload = () => {

          ctx.save();

          ctx.beginPath();
          ctx.arc(posX + s/2, posY + s/2, s/2, 0, Math.PI * 2);
          ctx.clip();

          ctx.drawImage(userImage, posX, posY, s, s);

          ctx.restore();

        };

      }

    };

  };

  const handleMouseDown = () => {
    setDragging(true);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseMove = (e) => {

    if(!dragging || !image) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const newX = (e.clientX - rect.left) / zoom - size/2;
    const newY = (e.clientY - rect.top) / zoom - size/2;

    setX(newX);
    setY(newY);

    generatePoster(image, newX, newY, size);

  };

  const updateSize = (newSize) => {

    setSize(newSize);

    if(image){
      generatePoster(image, x, y, newSize);
    }

  };

  const changeTemplate = (template) => {

    setSelectedTemplate(template);

    if(image){
      generatePoster(image, x, y, size, template);
    } else {
      generatePoster(null, x, y, size, template);
    }

  };

  const downloadPoster = () => {

    const canvas = canvasRef.current;

    const link = document.createElement("a");

    link.download = "Grand-prix-14.png";
    link.href = canvas.toDataURL("image/png");

    link.click();

  };

  return (

    <div style={{display:"flex", height:"100vh"}}>

      {/* PARAMÈTRES */}
      <div style={{
        width:"300px",
        padding:"30px",
        background:"#f4f4f4",
        borderRight:"1px solid #ddd"
      }}>

        <h2>Paramètres</h2>

        <h3>Choisir le template</h3>

        <button onClick={()=>changeTemplate(invitetemplate)}>
          Invite
        </button>

        <br/><br/>

        <button onClick={()=>changeTemplate(partnertemplate1)}>
          Partenaire 1
        </button>

        <br/><br/>

        <button onClick={()=>changeTemplate(partnertemplate2)}>
          Partenaire 2
        </button>

        <br/><br/>

        <input type="file" onChange={handleUpload} />

        <br/><br/>

        <label>Zoom / Dézoom</label>
        <br/>

        <input
          type="range"
          min="0.2"
          max="1"
          step="0.1"
          value={zoom}
          onChange={(e)=>setZoom(Number(e.target.value))}
        />

        <br/><br/>

        <label>Taille de la photo</label>
        <br/>

        <input
          type="range"
          min="100"
          max="900"
          value={size}
          onChange={(e)=>updateSize(Number(e.target.value))}
        />

        <br/><br/>

        <button onClick={downloadPoster}>
          Télécharger mon affiche
        </button>

      </div>

      {/* ZONE TEMPLATE */}
      <div style={{
        flex:1,
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center"
      }}>

        <h1>Créer mon affiche "J'y serai"</h1>

        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{
            transform:`scale(${zoom})`,
            transformOrigin:"center",
            border:"1px solid #ccc",
            cursor:"grab"
          }}
        />

      </div>

    </div>

  );

}

export default App;