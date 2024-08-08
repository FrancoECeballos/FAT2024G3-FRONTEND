import {React, useState, useRef} from "react";
import { Icon } from "@iconify/react";

import defaultImage from '../../../assets/user_default.png';

import SendButton from "../send_button/send_button";
import './uploadImage.scss';

function UploadImage ({wide}){

    const handleFileButtonClick = () => {
        fileInputRef.current.click();
    };
    const fileInputRef = useRef(null);
    const [imageSrc, setImageSrc] = useState(defaultImage);
    
    const handleInputChange = (event) => {
        const { files } = event.target;
        const file = files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImageSrc(reader.result);
          };
          reader.readAsDataURL(file);
          onFileChange(file);
        }
    }

    return (
        <div className="flex-grow-1 d-flex flex-column align-items-center">
            <div className="font-rubik" style={{ fontSize: '0.8rem' }}>Imagen de perfil</div>
            <img src={imageSrc} alt="Imagen de perfil" className="user-image" style={{ marginBottom: '4%',width:`${wide}rem`}}/>
            <div className="mb-2">
            <input
                type="file"
                name="imagen"
                ref={fileInputRef}
                className="hidden-file-input"
                onChange={handleInputChange}
            />
            <SendButton onClick={handleFileButtonClick} text="Seleccionar Archivo" wide={wide}>
                <Icon icon="line-md:upload-loop" style={{ width: '1.5rem', height:"1.5rem", alignContent: 'center' }}></Icon>
            </SendButton>
            </div>
        </div>
    );
}; export default UploadImage;
