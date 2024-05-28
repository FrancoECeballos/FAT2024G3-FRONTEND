import React from 'react';
import { useState, useEffect } from 'react'

//importacion de los renders
import BaseNavbar from '../components/navbar/base_navbar/base_navbar'

function Main (){
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
        <div>
            {result}
        </div>
    </div>
  );
};
export default Main;