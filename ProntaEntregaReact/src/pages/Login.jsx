import React from 'react';
import LoginNavbar from '../components/login/login_nav/LoginNavbar.jsx';
import LoginCard from '../components/login/login_card/LoginCard.jsx';
import './login.scss';
function Login (){
  return (
    <div>
      <LoginNavbar />
      <LoginCard />
    </div>
  );
};
export default Login;