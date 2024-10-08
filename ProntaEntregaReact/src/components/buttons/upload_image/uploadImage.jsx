import { React, useState, useRef } from "react";
import { Icon } from "@iconify/react";

import profileImage from '../../../assets/user_default.png';

import SendButton from "../send_button/send_button";
import './uploadImage.scss';

function UploadImage({ wide = '15', onFileChange, titulo = "Imagen de perfil", defaultImage = profileImage, usingIcon = false, buttonHidden = false }) {

    const handleFileButtonClick = () => {
        if (usingIcon & buttonHidden) {
            fileInputRef.current.click();
        } else if (!usingIcon & !buttonHidden) {
            fileInputRef.current.click();
        }
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
            {!usingIcon && <>
                <div className="font-rubik" style={{ fontSize: '0.8rem' }}>{titulo}</div>
                <img src={imageSrc} alt="Imagen de perfil" className="user-image" style={{ marginBottom: '4%', width: `${wide}rem` }} />
            </>}
            <div className="mb-2">
                <input
                    type="file"
                    name="imagen"
                    ref={fileInputRef}
                    className="hidden-file-input"
                    onChange={handleInputChange}
                />
                {usingIcon ? (
                    <Icon
                        onClick={handleFileButtonClick}
                        icon="line-md:edit-twotone"
                        style={{
                            width: '1.5rem',
                            height: '1.5rem',
                            alignContent: 'center',
                            color: buttonHidden ? '#02005D' : 'transparent',
                            cursor: buttonHidden ? 'pointer' : 'default'
                        }}
                    >
                    </Icon>
                ) : (
                    <SendButton
                        onClick={handleFileButtonClick}
                        text="Seleccionar Archivo"
                        wide={wide}
                        backcolor="#02005D"
                        letercolor='white'
                        radius='0.5rem'
                        shadow='none'
                        hid={buttonHidden}
                    >
                        <Icon
                            icon="line-md:upload-loop"
                            style={{ width: '1.5rem', height: '1.5rem', alignContent: 'center' }}
                        ></Icon>
                    </SendButton>
                )}
            </div>
        </div>
    );
};

export default UploadImage;
