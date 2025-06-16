// PromptBox.jsx
import React, { useRef, useState } from 'react';
import useAuthStore from './Store';
import './PromptBox.css';

const PromptBox = () => {
  const { user, logout } = useAuthStore();
  const fileInputRef = useRef(null);
  const [promptText, setPromptText] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  if (!user) {
    return null;
  }

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handlePromptChange = (e) => {
    setPromptText(e.target.value);
  };

  const handleClear = () => {
    setPromptText('');
    setResponse('');
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
    if (!promptText) {
      setError('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      
      if (selectedFile) {
        formData.append('file_path', selectedFile);
      }

      // Add query directly to FormData
      formData.append('query', promptText);

      const response = await fetch('http://localhost:8888/ragchat', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setResponse(data.answer || 'No response from server');
    } catch (error) {
      console.error('Error generating response:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!selectedFile) {
      setError('Please select a file to search');
      return;
    }

    if (!promptText) {
      setError('Please enter a search query');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file_path', selectedFile);
      formData.append('query', promptText);

      const response = await fetch('http://localhost:8888/ragchat', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setResponse(data.answer || 'No search results found');
    } catch (error) {
      console.error('Error searching document:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!selectedFile) {
      setError('Please select a file to summarize');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file_path', selectedFile);

      const response = await fetch('http://localhost:8888/summarize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setResponse(data.summary || 'No summary available');
    } catch (error) {
      console.error('Error summarizing document:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

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
            value={promptText}
            onChange={handlePromptChange}
          ></textarea>
          <div className="button-group">
            <button 
              className="generate-button" 
              onClick={handleGenerate}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Generate'}
            </button>
            <button 
              className="clear-button" 
              onClick={handleClear}
              disabled={isLoading}
            >
              Clear
            </button>
          </div>
          <div>
            <div className="custom-file-button" onClick={handleFileClick}>
              📎 Attach File {selectedFile && `(${selectedFile.name})`}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden-file-input" 
              onChange={handleFileChange}
            />
          </div>
          <div className="actions">
            <button 
              className="button" 
              onClick={handleSearch}
              disabled={isLoading}
            >
              Search
            </button>
            <button 
              className="button" 
              onClick={handleSummarize}
              disabled={isLoading}
            >
              Summarize
            </button>
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {response && (
            <div className="response-container">
              <h3>Response:</h3>
              <div className="response-content">
                {response}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptBox;