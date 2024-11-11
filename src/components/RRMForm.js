import axios from 'axios';
import { useState, useEffect } from 'react';
import './styles/RRMForm.css';

const currentYear = new Date().getFullYear();

const RRMForm = () => {
  const [formData, setFormData] = useState({
    scholarName: '',
    scholarImage: '',
    dateOfBirth: '',
    branch: '',
    rollNumber: '',
    scholarMobile: '',
    scholarEmail: '',
    supervisorName: '',
    supervisorMobile: '',
    supervisorEmail: '',
    coSupervisorName: '',
    coSupervisorMobile: '',
    coSupervisorEmail: '',
    titleOfResearch: '',
    areaOfResearch: '',
    progressFile: '',
    rrmApplicationFile: '',
    auditCourse: { courseName: '', year: '' },
    creditCourse: { courseName: '', year: '' },
    prePhDSubjects: [
      { courseName: '', year: '' },
      { courseName: '', year: '' },
    ],
    rrmDetails: [
      { date: '', status: '', satisfaction: '', rrmDetailsFile: '' },
    ],
    publications: [
      {
        title: '',
        authors: '',
        journalConference: '',
        freePaid: '',
        impactFactor: '',

      },
    ],
  });

  const [fileError, setFileError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert('Only .jpg, .jpeg, and .png formats are allowed.');
        return;
      }

      if (file.size > 2 * 1024 * 1024) { // 2MB in bytes
        alert('File size should be less than 2MB.');
        return;
      }

      setImageFile(file);
      setFormData(prevData => ({
        ...prevData,
        scholarImage: file
      }));
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        const uploadButton = document.querySelector('.upload-button');
        if (uploadButton) {
          uploadButton.style.backgroundImage = `url(${reader.result})`;
          uploadButton.style.backgroundSize = 'cover';
          uploadButton.style.backgroundPosition = 'center';
          uploadButton.classList.add('file-uploaded');
        }
      };
      reader.readAsDataURL(file);
      setFileError(''); // Clear any previous errors if file is valid
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    const maxFileSize = 2 * 1024 * 1024; // 2 MB in bytes

    if (file) {
      if (file.type !== 'application/pdf') {
        setFileError(`Only PDF files are allowed for ${fieldName}.`);
      } else if (file.size > maxFileSize) {
        setFileError(`The file size should be less than 2 MB for ${fieldName}.`);
      } else {
        setFileError(''); // Clear any previous errors if file is valid
        setFormData((prevData) => ({
          ...prevData,
          [fieldName]: file,
        }));
      }
    }
  };

  const handleNestedChange = (e, section, index, field) => {
    const { value } = e.target;
    setFormData((prevData) => {
      const updatedSection = Array.isArray(prevData[section]) ? [...prevData[section]] : [];
      updatedSection[index] = {
        ...(updatedSection[index] || {}),
        [field]: value,
      };
      return {
        ...prevData,
        [section]: updatedSection,
      };
    });
  };

  const handleNestedFileChange = (e, section, index) => {
    const file = e.target.files[0];
    const maxFileSize = 2 * 1024 * 1024; // 2 MB in bytes

    if (file) {
      if (file.type !== 'application/pdf') {
        setFileError(`Only PDF files are allowed for ${section}.`);
        setFormData((prevData) => {
          const updatedSection = [...prevData[section]];
          updatedSection[index] = {
            ...updatedSection[index],
            rrmDetailsFile: null, // Set to null on invalid file type
          };
          return { ...prevData, [section]: updatedSection };
        });
      } else if (file.size > maxFileSize) {
        setFileError(`The file size should be less than 2 MB for ${section}.`);
        setFormData((prevData) => {
          const updatedSection = [...prevData[section]];
          updatedSection[index] = {
            ...updatedSection[index],
            rrmDetailsFile: null, // Set to null if file size exceeds limit
          };
          return { ...prevData, [section]: updatedSection };
        });
      } else {
        // setFileError('');
        setFormData((prevData) => {
          const updatedSection = [...prevData[section]];
          updatedSection[index] = {
            ...updatedSection[index],
            rrmDetailsFile: file, // Attach valid file to state
          };
          return { ...prevData, [section]: updatedSection };
        });
      }
    }
  };

  const addEntry = (section) => {
    setFormData((prevData) => {
      const newEntry = section === 'rrmDetails'
        ? { date: '', status: '', satisfaction: '', rrmDetailsFile: '' }
        : {
          title: '',
          authors: '',
          journalConference: '',
          freePaid: '',
          impactFactor: '',
        };
      return {
        ...prevData,
        [section]: Array.isArray(prevData[section]) ? [...prevData[section], newEntry] : [newEntry],
      };
    });
  };

  const removeEntry = (section, index) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: Array.isArray(prevData[section]) ? prevData[section].filter((_, i) => i !== index) : [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dataToSubmit = new FormData();
    // Append simple fields
    for (const key in formData) {
      if (
        key !== 'rrmDetails' &&
        key !== 'publications' &&
        key !== 'prePhDSubjects' &&
        key !== 'auditCourse' &&
        key !== 'creditCourse'
      ){
        if (key === 'scholarImage') {
          dataToSubmit.append(key, imageFile, imageFile.name);
        } else if (key === 'progressFile' || key === 'rrmApplicationFile') {
          
          dataToSubmit.append(key, formData[key], formData[key].name);
        } else {
          dataToSubmit.append(key, formData[key]);
        }
      }
    }

    // Append nested fields: auditCourse, creditCourse, prePhDSubjects, etc.
    dataToSubmit.append('auditCourse', JSON.stringify(formData.auditCourse));
    dataToSubmit.append('creditCourse', JSON.stringify(formData.creditCourse));
    dataToSubmit.append('prePhDSubjects', JSON.stringify(formData.prePhDSubjects));

    // Append RRM Details and Files
    formData.rrmDetails.forEach((detail, index) => {
      dataToSubmit.append(`rrmDetails[${index}][date]`, detail.date);
      dataToSubmit.append(`rrmDetails[${index}][status]`, detail.status);
      dataToSubmit.append(`rrmDetails[${index}][satisfaction]`, detail.satisfaction);

      // Append the RRM file if it exists
      if (detail.rrmDetailsFile) {
        dataToSubmit.append(`rrmDetailsFile`, detail.rrmDetailsFile); // Append file dynamically
      }
    });

    // Append publications
    dataToSubmit.append('publications', JSON.stringify(formData.publications));
    try {
      const response = await axios.post('https://registerapi.jntugv.edu.in/api/submit-form', dataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // console.log('Form data submitted:', response.data);
      alert('Form submitted successfully!');
      // setFormData({}); 
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.response && error.response.status === 409) {
        alert('Scholar data is already submitted. Do not click Submit multiple times');
      } else if (error.response && error.response.status === 500) {
        alert('An error occurred while submitting the form, Try Again ...');
      } else if (error.response && error.response.status === 404) {
        alert('Resource not found, please try again.');
      } else {
        alert('An unexpected error occurred, please try again.');
      }
    } finally {
      setIsSubmitting(false);
      setFormData({});
    }
  };

  useEffect(() => {
    if (isSubmitting) {
      document.body.style.cursor = 'wait';
    } else {
      document.body.style.cursor = 'default';
    }
  }, [isSubmitting]);

  return (
    <>
      <div className='rrm-form-wrapper'>
        <div className="rrm-form-container">
          <div className="rrm-form-header">
            <header className="rrm-form-header-title">
              <img src="https://jntugv.edu.in/static/media/jntugvcev.b33bb43b07b2037ab043.jpg" alt="JNTUGV Logo" className="logo" />
              <div className="header-details">
                <h1>Directorate of Research and Development</h1>
                <h2>Jawaharlal Nehru Technological University - Gurajada, Vizianagaram</h2>
              </div>
              <div className="rrm-form-header-title-details">
                <h2 className="rrm-form-title">Application Form for RRM</h2>
                <h6 className="rrm-form-subtitle">Please fill in the details below to apply for RRM.</h6>
                <h6 className="rrm-form-subtitle">Note: All fields marked with an asterisk (*) are required.</h6>
              </div>
            </header>

          </div>

          <form onSubmit={handleSubmit} className="rrm-form">
            {/* Scholar Details Section */}
            <section className="form-section">
              <h3 className="section-title">Scholar Details</h3>
              <div className="input-group">
                <label htmlFor="scholarName">Scholar Name <span className="required-field">*</span></label>
                <input
                  type="text"
                  name="scholarName"
                  value={formData.scholarName}
                  onChange={handleChange}
                  placeholder="Name of the Scholar"
                  required
                  className="form-input" />
                <div className="file-upload-container">
                  <label htmlFor="imageUpload" className="file-upload-label">Upload Image <span className="required-field">*</span></label>
                  <p className="file-restrictions">Max Size: 2MB, Formats: .jpg, .jpeg, .png</p>
                  <div className="file-upload-group">
                    <button
                      type="button"
                      className="upload-button"
                      onClick={() => document.getElementById('imageUpload').click()}
                    >
                      <i className="fa fa-upload"></i>
                    </button>
                    <input
                      type="file"
                      id="imageUpload"
                      name="scholarImage"
                      accept=".jpg, .jpeg, .png"
                      onChange={handleImageChange}
                      required
                      className="file-upload-input" />
                  </div>
                </div>
                <label htmlFor="dateOfBirth">Date of Birth <span className="required-field">*</span></label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="form-input" />
              </div>
              <div className="input-group">
                <label htmlFor="branch">Branch/ Department <span className="required-field">*</span></label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="Branch / Department"
                  required
                  className="form-input" />
                <label htmlFor='rollNumber'>Roll Number <span className="required-field">*</span></label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  placeholder="Roll Number"
                  required
                  className="form-input" />
              </div>
              <div className="input-group">
                <label htmlFor='scholarMobile'>Contact No <span className="required-field">*</span></label>
                <input
                  type="tel"
                  name="scholarMobile"
                  value={formData.scholarMobile}
                  onChange={handleChange}
                  placeholder="Scholar Mobile Number"
                  pattern="[0-9]{10}"
                  required
                  className="form-input" />
                <label htmlFor='scholarEmail'>Email <span className="required-field">*</span></label>
                <input
                  type="email"
                  name="scholarEmail"
                  value={formData.scholarEmail}
                  onChange={handleChange}
                  placeholder="Scholar Email Address"
                  required
                  className="form-input" />
              </div>
              <div className='input-group'>
                <label htmlFor='supervisorName'>Supervisor Name <span className="required-field">*</span></label>
                <input
                  type="text"
                  name="supervisorName"
                  value={formData.supervisorName}
                  onChange={handleChange}
                  placeholder="Supervisor Name"
                  required
                  className="form-input" />
              </div>
              <div className="input-group">
                <label htmlFor='supervisorMobile'>Supervisor Contact No <span className="required-field">*</span></label>
                <input
                  type="tel"
                  name="supervisorMobile"
                  value={formData.supervisorMobile}
                  onChange={handleChange}
                  placeholder="Supervisor Mobile Number"
                  pattern="[0-9]{10}"
                  required
                  className="form-input" />
                <label htmlFor='supervisorEmail'>Supervisor Email <span className="required-field">*</span></label>
                <input
                  type="email"
                  name="supervisorEmail"
                  value={formData.supervisorEmail}
                  onChange={handleChange}
                  placeholder="Supervisor Email Address"
                  required
                  className="form-input" />
              </div>
              <div className="input-group">
                <label htmlFor='coSupervisorName'>Co-Supervisor Name</label>
                <input
                  type="text"
                  name="coSupervisorName"
                  value={formData.coSupervisorName}
                  onChange={handleChange}
                  placeholder="Co-Supervisor Name"
                  className="form-input" />
              </div>
              <div className="input-group">
                <label htmlFor='coSupervisorMobile'>Co-Supervisor Contact</label>
                <input
                  type="tel"
                  name="coSupervisorMobile"
                  value={formData.coSupervisorMobile}
                  onChange={handleChange}
                  placeholder="Co-Supervisor Mobile Number"
                  pattern="[0-9]{10}"
                  className="form-input" />
                <label htmlFor='coSupervisorEmail'>Co-Supervisor Email</label>
                <input
                  type="email"
                  name="coSupervisorEmail"
                  value={formData.coSupervisorEmail}
                  onChange={handleChange}
                  placeholder="Co-Supervisor Email Address"
                  className="form-input" />
              </div>
              <div className="input-group">
                <label htmlFor='titleOfResearch'>Title of Research <span className="required-field">*</span></label>
                <input
                  type="text"
                  name="titleOfResearch"
                  value={formData.titleOfResearch}
                  onChange={handleChange}
                  placeholder="Title of Research Work"
                  required
                  className="form-input" />
                <label htmlFor='areaOfResearch'>Area Of Research <span className="required-field">*</span></label>
                <input
                  type="text"
                  name="areaOfResearch"
                  value={formData.areaOfResearch}
                  onChange={handleChange}
                  placeholder="Area of Research Work"
                  required
                  className="form-input" />
              </div>
              <div className="input-group">
                <div className="file-upload-group">
                  <label htmlFor="progressFile" className="file-upload-label">Progress File (Attach as PDF) <span className="required-field">*</span></label>
                  <input
                    type="file"
                    name="progressFile"
                    onChange={(e) => handleFileChange(e, 'progressFile')}
                    accept=".pdf"
                    className="form-input file-upload-input" />
                </div>

                <div className="file-upload-group">
                  <label htmlFor="rrmApplicationFile" className="file-upload-label">RRM Application File (Attach as PDF)<span className='required-field' >*</span></label>
                  <input
                    type="file"
                    name="rrmApplicationFile"
                    onChange={(e) => handleFileChange(e, 'rrmApplicationFile')}
                    accept=".pdf"
                    className="form-input file-upload-input" />
                </div>
              </div>
            </section>

            {/* Audit Course Section */}
            <section className="form-section">
              <h3 className="section-title">Audit Course</h3>
              <div className="input-group">
                <label htmlFor="auditCourseName">Course Name </label>
                <input
                  type="text"
                  name="auditCourseName"
                  value={formData.auditCourse.courseName}
                  onChange={(e) => handleNestedChange(e, 'auditCourse', 0, 'courseName')}
                  placeholder="Course Name"
                  className="form-input" />
                <label htmlFor="auditCourseYear">Year of Completion </label>
                <input
                  type="number"
                  name="auditCourseYear"
                  value={formData.auditCourse.year}
                  onChange={(e) => handleNestedChange(e, 'auditCourse', 0, 'year')}
                  placeholder="Year of Completion"
                  min="1900"
                  max={currentYear + 10}
                  className="form-input" />
              </div>
            </section>

            {/* Credit Course Section */}
            <section className="form-section">
              <h3 className="section-title">Credit Course</h3>
              <div className="input-group">
                <label htmlFor="creditCourseName">Course Name </label>
                <input
                  type="text"
                  name="creditCourseName"
                  value={formData.creditCourse.courseName}
                  onChange={(e) => handleNestedChange(e, 'creditCourse', 0, 'courseName')}
                  placeholder="Course Name"
                  className="form-input" />
                <label htmlFor="creditCourseYear">Year of Completion </label>
                <input
                  type="number"
                  name="creditCourseYear"
                  value={formData.creditCourse.year}
                  onChange={(e) => handleNestedChange(e, 'creditCourse', 0, 'year')}
                  placeholder="Year of Completion"
                  min="1900"
                  max={currentYear + 10}
                  className="form-input" />
              </div>
            </section>

            {/* Pre-PhD Subjects Section */}
            <section className="form-section">
              <h3 className="section-title">Pre-Ph.D. Subjects</h3>
              {formData.prePhDSubjects.map((subject, index) => (
                <div key={index} className="input-group">
                  <label htmlFor={`prePhDSubject${index + 1}Name`}>{`Pre-Ph.D. Subject ${index + 1} Name`}</label>
                  <input
                    type="text"
                    name={`prePhDSubject${index + 1}Name`}
                    value={subject.courseName}
                    onChange={(e) => handleNestedChange(e, 'prePhDSubjects', index, 'courseName')}
                    placeholder={`Pre-Ph.D. Subject ${index + 1} Name`}
                    className="form-input" />
                  <label htmlFor={`prePhDSubject${index + 1}Year`}>Year of Completion </label>
                  <input
                    type="number"
                    name={`prePhDSubject${index + 1}Year`}
                    value={subject.year}
                    onChange={(e) => handleNestedChange(e, 'prePhDSubjects', index, 'year')}
                    placeholder="Year of Completion"
                    min="1900"
                    max={currentYear + 10}
                    className="form-input" />
                </div>
              ))}
            </section>

            {/* RRM Details Section */}
            <section className="form-section">
              <h3 className="section-title">Details of RRMs attended</h3>
              {formData.rrmDetails.map((rrm, index) => (
                <div key={index} className="rrm-detail">
                  <div className="input-group">
                    <label htmlFor={`rrmDate${index}`}>Date of RRM </label>
                    <input
                      type="date"
                      name={`rrmDate${index}`}
                      value={rrm.date}
                      onChange={(e) => handleNestedChange(e, 'rrmDetails', index, 'date')}
                      className="form-input" />
                    <label htmlFor={`rrmStatus${index}`}>Status of the Work </label>
                    <input
                      type="text"
                      name={`rrmStatus${index}`}
                      value={rrm.status}
                      onChange={(e) => handleNestedChange(e, 'rrmDetails', index, 'status')}
                      placeholder="Status of the Work"
                      className="form-input" />
                    <label htmlFor={`rrmSatisfaction${index}`}>Result </label>
                    <select
                      name={`rrmSatisfaction${index}`}
                      value={rrm.satisfaction}
                      onChange={(e) => handleNestedChange(e, 'rrmDetails', index, 'satisfaction')}
                      className="form-select"
                    >
                      <option value="">Select</option>
                      <option value="Satisfactory">Satisfactory</option>
                      <option value="Not Satisfactory">Not Satisfactory</option>
                    </select>
                  </div>
                  <label htmlFor={`rrmDetailsFile-${index}`} className="file-upload-label">Upload File (Attach as PDF)</label>
                  <input
                    type="file"
                    id={`rrmDetailsFile-${index}`}
                    name={`rrmDetailsFile-${index}`}
                    onChange={(e) => handleNestedFileChange(e, 'rrmDetails', index)}
                    accept=".pdf"
                    className="form-input" />
                  {index > 0 && (
                    <button type="button" onClick={() => removeEntry('rrmDetails', index)} className="remove-btn">
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addEntry('rrmDetails')} className="add-btn">
                Add More RRM Details
              </button>
            </section>

            {/* Publications Section */}
            <section className="form-section">
              <h3 className="section-title">Details of Publications</h3>
              {formData.publications.map((pub, index) => (
                <div key={index} className="publication-detail">
                  <div className="input-group">
                    <label htmlFor={`pubTitle${index}`}>Title of the Paper </label>
                    <input
                      type="text"
                      name={`pubTitle${index}`}
                      value={pub.title}
                      onChange={(e) => handleNestedChange(e, 'publications', index, 'title')}
                      placeholder="Title of the Paper"
                      className="form-input" />
                    <label htmlFor={`pubAuthors${index}`}>Name of the Authors </label>
                    <input
                      type="text"
                      name={`pubAuthors${index}`}
                      value={pub.authors}
                      onChange={(e) => handleNestedChange(e, 'publications', index, 'authors')}
                      placeholder="Name of the Authors"
                      className="form-input" />
                  </div>
                  <div className="input-group">
                    <label htmlFor={`pubJournalConference${index}`}>Journal/Conference Details </label>
                    <input
                      type="text"
                      name={`pubJournalConference${index}`}
                      value={pub.journalConference}
                      onChange={(e) => handleNestedChange(e, 'publications', index, 'journalConference')}
                      placeholder="Journal/Conference Details"
                      className="form-input" />
                    <label htmlFor={`pubFreePaid${index}`}>Free/Paid </label>
                    <select
                      name={`pubFreePaid${index}`}
                      value={pub.freePaid}
                      onChange={(e) => handleNestedChange(e, 'publications', index, 'freePaid')}
                      className="form-select"
                    >
                      <option value="">Select</option>
                      <option value="Free">Free</option>
                      <option value="Paid">Paid</option>
                    </select>
                    <label htmlFor={`pubImpactFactor${index}`}>Impact Factor (value as out of 10)</label>
                    <input
                      type="number"
                      name={`pubImpactFactor${index}`}
                      value={pub.impactFactor}
                      onChange={(e) => handleNestedChange(e, 'publications', index, 'impactFactor')}
                      placeholder="value as out of 10"
                      step="1"
                      min="0"
                      max="10"
                      className="form-input" />
                  </div>
                  {/* <label htmlFor={`publicationFile-${index}`}>Upload File</label>
            <input
              type="file"
              id={`publicationFile-${index}`}
              name="file"
              onChange={(e) => handleNestedFileChange(e, 'publications', index)}
              accept=".pdf"
              className="form-input"
            /> */}
                  {index > 0 && (
                    <button type="button" onClick={() => removeEntry('publications', index)} className="remove-btn">
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addEntry('publications')} className="add-btn">
                Add More Publications
              </button>
            </section>

            {fileError && <p className="error-message">{fileError}</p>}
            <button type="submit" className="submit-btn">Submit</button>
          </form>
        </div>
      </div>
      <footer className="rrm-form-footer">
        <p className="copyright">&copy; {new Date().getFullYear()} JNTU-GV Vizianagaram. All rights reserved.</p>
        <p className="credits">Designed, developed and maintained by <span className="department">Digital Monitoring Cell</span> of <span className="university">JNTU-GV Vizianagaram</span></p>
      </footer>
    </>
  );
};

export default RRMForm;
