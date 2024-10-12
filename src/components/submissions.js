import axios from 'axios';
import { saveAs } from 'file-saver';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import './styles/submissions.css';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

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
      // Create flat submission object with all single-valued fields
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
      };
  
      // Handle multi-value arrays and concatenate them into single fields
      // Courses
      flatSubmission.coursesYears = submission.courses?.map(course => course.year).join(', ') || 'N/A';
      flatSubmission.coursesNames = submission.courses?.map(course => course.course_name).join(', ') || 'N/A';
      flatSubmission.coursesTypes = submission.courses?.map(course => course.course_type).join(', ') || 'N/A';
  
      // RRM Details
      flatSubmission.rrmStatuses = submission.rrmDetails?.map(rrm => rrm.status).join(', ') || 'N/A';
      flatSubmission.rrmDates = submission.rrmDetails?.map(rrm => rrm.rrm_date).join(', ') || 'N/A';
      flatSubmission.rrmSatisfactions = submission.rrmDetails?.map(rrm => rrm.satisfaction).join(', ') || 'N/A';
      flatSubmission.rrmFiles = submission.rrmDetails?.map(rrm => rrm.file).join(', ') || 'N/A';
  
      // Publications
      flatSubmission.publicationTitles = submission.publications?.map(pub => pub.title).join(', ') || 'N/A';
      flatSubmission.publicationAuthors = submission.publications?.map(pub => pub.authors).join(', ') || 'N/A';
      flatSubmission.journalConferences = submission.publications?.map(pub => pub.journal_conference).join(', ') || 'N/A';
      flatSubmission.impactFactors = submission.publications?.map(pub => pub.impact_factor).join(', ') || 'N/A';
  
      return flatSubmission;
    });
  };
  
  const downloadExcel = () => {
    const dataForExcel = prepareExcelData(submissions);
  
    // Define the worksheet with headers
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, {
      header: [
        "scholarId", "scholarName", "dateOfBirth", "branch", "rollNumber",
        "scholarMobile", "scholarEmail", "supervisorName", "supervisorMobile",
        "supervisorEmail", "coSupervisorName", "coSupervisorMobile", "coSupervisorEmail",
        "titleOfResearch", "areaOfResearch", "progressFile", "rrmApplicationFile",
        "created_at", "coursesYears", "coursesNames", "coursesTypes", 
        "rrmStatuses", "rrmDates", "rrmSatisfactions", "rrmFiles",
        "publicationTitles", "publicationAuthors", "journalConferences", "impactFactors"
      ]
    });
  
    // Adjust column widths (optional)
    const columnWidths = Array(30).fill({ wpx: 150 });
  
    worksheet['!cols'] = columnWidths;
  
    // Define workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");
  
    // Create Excel file and trigger download
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `submissions-${new Date().toISOString().split('T')[0]}.xlsx`);
  };
  return (
    <div className="submissions-container">
      <h2>Submitted Applications</h2>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {submissions.length > 0 ? (
        <div>
          {/* Excel Download Button */}
          <div className="excel-download-button">
            <button className="btn" onClick={downloadExcel}>
              Download Excel
            </button>
          </div>

          <table className="submissions-table">
            <thead>
              <tr>
                {/* Column Headers for table view */}
                <th>Scholar Name</th>
                <th>Branch</th>
                <th>Roll Number</th>
                <th>Supervisor Name</th>
                <th>Progress File URL</th>
                <th>RRM Application File URL</th>
                <th>RRM File URL</th>
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
                  <td><a href={submission.progressFile} target="_blank" rel="noopener noreferrer">View File</a></td>
                  <td><a href={submission.rrmApplicationFile} target="_blank" rel="noopener noreferrer">View File</a></td>
                  <td><a href={submission.rrmDetails[0]?.file} target="_blank" rel="noopener noreferrer">View File</a></td>
                  <td>{submission.titleOfResearch}</td>
                  <td>{submission.areaOfResearch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No submissions found.</p>
      )}
    </div>
  );
};

export default Submissions;
