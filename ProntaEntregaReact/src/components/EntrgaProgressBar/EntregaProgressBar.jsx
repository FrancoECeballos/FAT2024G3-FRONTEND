import React from 'react';
import EPB1 from '../../assets/EntrgaProgressBar/EPB1.png';
import EPB2 from '../../assets/EntrgaProgressBar/EPB2.png';
import EPB3 from '../../assets/EntrgaProgressBar/EPB3.png';
import EPB4 from '../../assets/EntrgaProgressBar/EPB4.png';



function EntregaProgressBar({ estado }) {
    return (
        <div>
            {estado === 3 ? <img src={EPB4} alt="" style={{width:"12rem"}}/> : 
            estado === 2 ? <img src={EPB3} alt="" style={{width:"12rem"}}/> : 
            estado === 1 ? <img src={EPB2} alt="" style={{width:"12rem"}}/> : 
            <img src={EPB1} alt="" style={{width:"12rem"}}/>}
        </div>
    );
} export default EntregaProgressBar;