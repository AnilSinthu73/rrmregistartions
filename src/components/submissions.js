import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import './styles/submissions.css';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get('http://localhost:9999/api/get-submissions');
        setSubmissions(response.data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setErrorMessage('There was an error fetching submissions. Please try again.');
      }
    };

    fetchSubmissions();
  }, []);

  // Define full headers for CSV download
  const fullHeaders = [
    { label: "Scholar ID", key: "scholarId" },
    { label: "Scholar Name", key: "scholarName" },
    { label: "Date of Birth", key: "dateOfBirth" },
    { label: "Branch", key: "branch" },
    { label: "Roll Number", key: "rollNumber" },
    { label: "Scholar Mobile", key: "scholarMobile" },
    { label: "Scholar Email", key: "scholarEmail" },
    { label: "Supervisor Mobile", key: "supervisorMobile" },
    { label: "Supervisor Email", key: "supervisorEmail" },
    { label: "Co-Supervisor Mobile", key: "coSupervisorMobile" },
    { label: "Co-Supervisor Email", key: "coSupervisorEmail" },
    { label: "Title of Research", key: "titleOfResearch" },
    { label: "Area of Research", key: "areaOfResearch" },
    { label: "Progress File URL", key: "progressFile" },
    { label: "RRM Application File URL", key: "rrmApplicationFile" },
    { label: "Created At", key: "created_at" },
    { label: "Courses", key: "courses" },
    { label: "RRM Details", key: "rrmDetails" },
    { label: "Publications", key: "publications" }
  ];

  // Define headers for the table view (only the first few columns)
  const viewHeaders = [
    { label: "Scholar Name", key: "scholarName" },
    { label: "Branch", key: "branch" },
    { label: "Roll Number", key: "rollNumber" },
    { label: "Supervisor Name", key: "supervisorName" },
    { label: "Progress File URL", key: "progressFile" },
    { label: "RRM Application File URL", key: "rrmApplicationFile" },
    { label: "Title of Research", key: "titleOfResearch" },
    { label: "Area of Research", key: "areaOfResearch" },
  ];

  return (
    <div className="submissions-container">
      <h2>Submitted Applications</h2>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {submissions.length > 0 ? (
        <div>
          {/* CSV Download Link */}
          <div className="csv-download-button">
            <CSVLink
              data={submissions}
              headers={fullHeaders}
              filename={`submissions-${new Date().toISOString().split('T')[0]}.csv`}
              className="btn"
              target="_blank"
            >
              Download CSV
            </CSVLink>
          </div>

          <table className="submissions-table">
            <thead>
              <tr>
                {viewHeaders.map((header) => (
                  <th key={header.key}>{header.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission, index) => (
                <tr key={index}>
                  {viewHeaders.map((header) => {
                    const value = submission[header.key];

                    if (typeof value === 'object' && value !== null) {
                      // Render each property of the object (if it's an object)
                      return (
                        <td key={header.key}>
                          {header.key === 'courses' && value.map((course, i) => (
                            <div key={i}>
                              Year: {course.year}, Course Name: {course.courseName}, Course Type: {course.courseType}
                            </div>
                          ))}
                          {header.key === 'rrmDetails' && value.map((detail, i) => (
                            <div key={i}>
                              Status: {detail.status}, Date: {detail.rrmDate}, Satisfaction: {detail.satisfaction}
                            </div>
                          ))}
                          {header.key === 'publications' && value.map((pub, i) => (
                            <div key={i}>
                              Authors: {pub.authors}, Title: {pub.publicationTitle}, Journal: {pub.journalConference}
                            </div>
                          ))}
                          
                        </td>
                      );
                    }

                    // Render directly if not an object, and make URLs clickable
                    if (header.key === 'progressFile' || header.key === 'rrmApplicationFile') {
                      return <td key={header.key}><a href={value} target="_blank" rel="noopener noreferrer">View File</a></td>;
                    }

                    return <td key={header.key}>{value}</td>; // Render directly if not an object
                  })}
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
