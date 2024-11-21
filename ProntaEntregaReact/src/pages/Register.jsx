import React from "react";
import { useState, useEffect } from "react";
import RegisterCard from "../components/register/register_card/RegisterCard.jsx";
import BaseNavbar from "../components/navbar/base_navbar/BaseNavbar.jsx";

function Register() {
  return (
    <div style={{ backgroundColor: "#ECECEC" }}>
      <BaseNavbar />
      <RegisterCard />
    </div>
  );
}
export default Register;
