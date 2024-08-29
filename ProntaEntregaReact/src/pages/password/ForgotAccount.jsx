import React from 'react';
import BaseNavbar from '../../components/navbar/base_navbar/BaseNavbar.jsx';
import ForgotPasswordCard from '../../components/change_password/forgot_password_card/ForgotPasswordCard.jsx';

function ForgotAccount (){
    return (
        <div style={{backgroundColor: '#ECECEC'}}>
            <BaseNavbar />
            <ForgotPasswordCard />
        </div>
    );
}
export default ForgotAccount;