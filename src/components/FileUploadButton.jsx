import React from 'react';
import './FileUploadButton.css';

// FileUploadButton: Custom file input component with enhanced styling, responsiveness, and hover effects.
function FileUploadButton({ onFileSelect }) {
  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e);
    }
  };

  return (
    <div className="file-upload-container">
      <input
        type="file"
        id="fileUpload"
        className="file-input"
        accept=".log,.txt"
        onChange={handleChange}
      />
      <label htmlFor="fileUpload" className="file-upload-button">
        ファイルを選択
      </label>
    </div>
  );
}

export default FileUploadButton;
