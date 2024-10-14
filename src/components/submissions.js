import axios from 'axios';
import { saveAs } from 'file-saver';
import React, { useEffect, useState } from 'react';
import { FaDownload, FaSignOutAlt } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import './styles/submissions.css';

const Submissions = ({ onLogout }) => {
  const [submissions, setSubmissions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showLogout, setShowLogout] = useState(false);
  const username = 'drd@jntugv.edu.in';
  
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get('https://registerapi.jntugv.edu.in/api/get-submissions');
        setSubmissions(response.data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setErrorMessage('There was an error fetching submissions. Please try again.');
      }
    };

    fetchSubmissions();
  }, []);

  const prepareExcelData = (data) => {
    return data.map(submission => {
      const flatSubmission = {
        scholarId: submission.scholarId || 'N/A',
        scholarName: submission.scholarName || 'N/A',
        dateOfBirth: submission.dateOfBirth || 'N/A',
        branch: submission.branch || 'N/A',
        rollNumber: submission.rollNumber || 'N/A',
        scholarMobile: submission.scholarMobile || 'N/A',
        scholarEmail: submission.scholarEmail || 'N/A',
        supervisorName: submission.supervisorName || 'N/A',
        supervisorMobile: submission.supervisorMobile || 'N/A',
        supervisorEmail: submission.supervisorEmail || 'N/A',
        coSupervisorName: submission.coSupervisorName || 'N/A',
        coSupervisorMobile: submission.coSupervisorMobile || 'N/A',
        coSupervisorEmail: submission.coSupervisorEmail || 'N/A',
        titleOfResearch: submission.titleOfResearch || 'N/A',
        areaOfResearch: submission.areaOfResearch || 'N/A',
        progressFile: submission.progressFile || 'N/A',
        rrmApplicationFile: submission.rrmApplicationFile || 'N/A',
        created_at: submission.created_at || 'N/A',
        coursesYears: submission.courses?.map(course => course.year).join(', ') || 'N/A',
        coursesNames: submission.courses?.map(course => course.course_name).join(', ') || 'N/A',
        coursesTypes: submission.courses?.map(course => course.course_type).join(', ') || 'N/A',
        rrmStatuses: submission.rrmDetails?.map(rrm => rrm.status).join(', ') || 'N/A',
        rrmDates: submission.rrmDetails?.map(rrm => rrm.rrm_date).join(', ') || 'N/A',
        rrmSatisfactions: submission.rrmDetails?.map(rrm => rrm.satisfaction).join(', ') || 'N/A',
        rrmFiles: submission.rrmDetails?.map(rrm => rrm.file).join(', ') || 'N/A',
        publicationTitles: submission.publications?.map(pub => pub.title).join(', ') || 'N/A',
        publicationAuthors: submission.publications?.map(pub => pub.authors).join(', ') || 'N/A',
        journalConferences: submission.publications?.map(pub => pub.journal_conference).join(', ') || 'N/A',
        impactFactors: submission.publications?.map(pub => pub.impact_factor).join(', ') || 'N/A',
      };
  
      return flatSubmission;
    });
  };

  const downloadExcel = () => {
    const dataForExcel = prepareExcelData(submissions);
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `submissions-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="submissions-container">
      <header className="submissions-header">
        <img src="https://jntugv.edu.in/static/media/jntugvcev.b33bb43b07b2037ab043.jpg" alt="JNTUGV Logo" className="logo" />
        <div className="header-details">
          <h1>Directorate of Research and Development</h1>
          <h2>Jawaharlal Nehru Technological University - Gurajada, Vizianagaram</h2>
        </div>
        <div className="user-info"
             onMouseEnter={() => setShowLogout(true)}
             onMouseLeave={() => setShowLogout(false)}>
          <span>{username}</span>
          {showLogout && (
            <button className="btn logout-btn" onClick={onLogout}>
              <FaSignOutAlt /> Logout
            </button>
          )}
        </div>
      </header>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {submissions.length > 0 ? (
        <div>
          <div className="excel-download-button">
            <button className="btn download-btn" onClick={downloadExcel}>
              <FaDownload /> Download
            </button>
          </div>

          {/* Desktop Table */}
          <div className="submissions-table-container">
            <table className="submissions-table">
              <thead>
                <tr>
                  <th>Scholar Name</th>
                  <th>Branch</th>
                  <th>Roll Number</th>
                  <th>Supervisor Name</th>
                  <th>Progress File</th>
                  <th>RRM Application File</th>
                  <th>RRM File</th>
                  <th>Title of Research</th>
                  <th>Area of Research</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission, index) => (
                  <tr key={index}>
                    <td>{submission.scholarName}</td>
                    <td>{submission.branch}</td>
                    <td>{submission.rollNumber}</td>
                    <td>{submission.supervisorName}</td>
                    <td>
                      <a href={submission.progressFile} target="_blank" rel="noopener noreferrer">View File</a>
                    </td>
                    <td>
                      <a href={submission.rrmApplicationFile} target="_blank" rel="noopener noreferrer">View File</a>
                    </td>
                    <td>
                      <a href={submission.rrmDetails[0]?.file} target="_blank" rel="noopener noreferrer">View File</a>
                    </td>
                    <td>{submission.titleOfResearch}</td>
                    <td>{submission.areaOfResearch}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="submissions-list">
            {submissions.map((submission, index) => (
              <div className="submission-card" key={index}>
                <h3>{submission.scholarName}</h3>
                <div><strong>Branch:</strong> {submission.branch}</div>
                <div><strong>Roll Number:</strong> {submission.rollNumber}</div>
                <div><strong>Supervisor Name:</strong> {submission.supervisorName}</div>
                <div><strong>Title of Research:</strong> {submission.titleOfResearch}</div>
                <div><strong>Area of Research:</strong> {submission.areaOfResearch}</div>
                <div className="file-links">
                  <strong>Files:</strong>
                  <a href={submission.progressFile} target="_blank" rel="noopener noreferrer">Progress File</a>
                  <a href={submission.rrmApplicationFile} target="_blank" rel="noopener noreferrer">RRM Application File</a>
                  <a href={submission.rrmDetails[0]?.file} target="_blank" rel="noopener noreferrer">RRM File</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No submissions found.</p>
      )}
    </div>
  );
};

export default Submissions;
