import './header.css';

const Header = () => {
  return (
    <header className="submissions-header">
      <img src="https://jntugv.edu.in/static/media/jntugvcev.b33bb43b07b2037ab043.jpg" alt="JNTUGV Logo" className="logo" />
      <div className="header-details">
        <h1>Directorate of Research and Development</h1>
        <h2>Jawaharlal Nehru Technological University - Gurajada, Vizianagaram</h2>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <a href='http://drd.jntugv.edu.in' style={{ marginRight: '50px',textDecoration:'none', color:'white' }}>
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="white">
              <path d="M19 13H5v-2h14v2z" />
              <path d="M21 3H3v10h5v-6h3v6h5v-10h5v10h-2V5h-4v4h-4V5h-4v4h-4v-6h4v6h4v-6h4v6h4v-10z" />
            </svg> */}
            <h6 style={{ marginLeft: '5px'}}>drd.jntugv.edu.in</h6>
          </a>
          <a href='mailto:dr@jntugv.edu.in' style={{ marginLeft: '10px',textDecoration:'none', color:'white' }}>
            <h6>dr[at]jntugv[dot]edu[dot]in</h6>
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="white">
              <path d="M20 4H4v5h16v-5zm0 10H4v-5h16v5zm0-10H4v5h16v-5zm0 10H4v-5h16v5z" />
              <path d="M2 0h20v24H2z" fill="none" />
            </svg> */}
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;