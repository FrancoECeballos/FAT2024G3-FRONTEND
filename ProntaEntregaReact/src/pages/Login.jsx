import React from 'react';
import LoginNavbar from '../components/login/login_nav/LoginNavbar.jsx';
import LoginCard from '../components/login/login_card/LoginCard.jsx';

function Login (){
  return (
    <div>
      <h1>Login Page</h1>
      <LoginNavbar />
      <LoginCard />
    </div>
  );
};
export default Login;