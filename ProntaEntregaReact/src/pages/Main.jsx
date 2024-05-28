import React from 'react';
import { useState, useEffect } from 'react'

//importacion de los renders
import FullNavbar from '../components/navbar/full_navbar/FullNavbar'

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
        <FullNavbar />
    </div>
  );
};
export default Main;