// ToastNotification.js
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastNotification = () => (
  <ToastContainer
    autoClose={2000}
    position="top-center"
    style={{ width: "250px", margin: "0 auto" }}
  />
);

export default ToastNotification;
