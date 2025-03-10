// PromptBox.jsx
import React, { useRef } from 'react';
import useAuthStore from './Store';
import './PromptBox.css';

const PromptBox = () => {
  const { user, logout } = useAuthStore();
  const fileInputRef = useRef(null);

  if (!user) {
    return null;
  }

  return (
    <div className="prompt-container">
      <header className="prompt-header">
        <h1>AI Prompt Assistant</h1>
        <div className="user-info">
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <div className="prompt-content">
        <div className="prompt-card main-prompt">
          <h2>Create Your Prompt</h2>
          <textarea 
            className="prompt-textarea" 
            placeholder="Enter your prompt here... (e.g., 'Write a poem about space exploration')"
            rows={5}
          ></textarea>
          <div className="button-group">
            <button className="generate-button">Generate</button>
            <button className="clear-button">Clear</button>
          </div>
          <div>
            {/* <div className="custom-file-button" onClick={handleFileClick}>
              📎 Attach File
            </div> */}
            <input type="file" ref={fileInputRef} className="hidden-file-input" />
          </div>
          <div className="actions">
            <button className="button">Search</button>
            <button className="button">Summarize</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptBox;