import React from 'react';
import { useState, useEffect } from 'react'

//importacion de los renders
import FullNavbar from '../components/navbar/full_navbar/FullNavbar'

function Main (){
  /*useEffect(() => {
    init()
  } ,[])

  const init = async() => {
    let full_url = `${import.meta.env.VITE_API_URL}/user/`;
    let result = await fetch(full_url);
    result = await result.json();

    console.log(`result`, result);
  } */

  return (
    <div>
        <FullNavbar />
        
    </div>
  );
};
export default Main;