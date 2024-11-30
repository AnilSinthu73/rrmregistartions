import React from "react";
import "./styles/pageDown.css";
import Footer from "./pages/Footer";
import Header from "./pages/header"; // Corrected import for Header

function PageDown() {
  return (
    <><Header /> 
    <div className="page-down-container">
    
      <div className="overlay"></div>
      <div className="page-down-content">
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="red" stroke="currentColor" strokeWidth="2" className="w-12 h-12" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-3.733 0-6.93-3.194-6.93-7V1c0-3.806 3.184-7 7-7s7 3.194 7 7v11.162c0 3.806-3.184 7-7 7z" />
          </svg>
        <div className="page-down-title animate__animated animate__fadeInDown" style={{color: 'red'}}>
        
          <span>Important Announcement</span>
        </div>
        <p className="page-down-message animate__animated animate__fadeInUp">
          Registrations for the Year 2024 have been closed. Please wait for
          further notification. For any inquiries, kindly contact the Director
          of Research and Development (DRD) at JNTU-GV Vizianagaram.
        </p>
        <div className="loader"></div>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default PageDown;
