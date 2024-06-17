import React from 'react';
import BaseNavbar from '../components/navbar/base_navbar/BaseNavbar.jsx';
import LoginCard from '../components/login/login_card/LoginCard.jsx';

function Login (){
  return (
    <div style={{backgroundColor: '#ECECEC'}}>
      <BaseNavbar />
      <LoginCard />
    </div>
  );
};
export default Login;