import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="rrm-form-footer">
      <p className="copyright">&copy; {new Date().getFullYear()} JNTU-GV Vizianagaram. All rights reserved.</p>
      <p className="credits">Designed, developed and maintained by <a href='dmc.jntugv.edu.in' style={{ textDecoration: 'none', color:'white'}}><span className="department">Digital Monitoring Cell</span></a> of <a href='jntugv.edu.in' style={{ textDecoration: 'none',color:'white'}}><span className="university">JNTU-GV Vizianagaram</span></a></p>
    </footer>
  );
};

export default Footer;
