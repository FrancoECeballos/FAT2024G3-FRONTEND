import React from 'react';
import { useState, useEffect } from 'react'
import RegisterCard from '../components/register/register_card/RegisterCard.jsx';
import BaseNavbar from '../components/navbar/base_navbar/base_navbar.jsx';

function Register (){
  const url = 'http://localhost:8000';

  useEffect(() => {
    init()
  } ,[])

  const init = async() => {
    let full_url = `${url}/user/`;
    let result = await fetch(full_url);
    result = await result.json();

    console.log(`result`, result);
  }

  return (
    <div>
      <BaseNavbar />
      <RegisterCard />
    </div>
  );
};
export default Register;