import { React, useRef } from "react";
import { Icon } from "@iconify/react";

import SendButton from "../send_button/send_button";
import './uploadImage.scss';

function UploadImage ({ wide = '15', onFileChange, titulo = "" }) {

    const handleFileButtonClick = () => {
        fileInputRef.current.click();
    };
    const fileInputRef = useRef(null);
    
    const handleInputChange = (event) => {
        const { files } = event.target;
        const file = files[0];
        if (file) {
          onFileChange(file);
        }
    }

    return (
        <div className="flex-grow-1 d-flex flex-column align-items-center">
            <div className="font-rubik" style={{ fontSize: '0.8rem' }}>{titulo}</div>
            <div className="mb-2">
            <input
                type="file"
                name="imagen"
                ref={fileInputRef}
                className="hidden-file-input"
                onChange={handleInputChange}
            />
                <Icon onClick={handleFileButtonClick} icon="line-md:edit-twotone" style={{ width: '1.5rem', height: '1.5rem', alignContent: 'center' }}></Icon>
            </div>
        </div>
    );
}; export default UploadImage;