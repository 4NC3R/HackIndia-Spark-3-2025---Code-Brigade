// Landing.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './landing.css';
import './LoginForm.css';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="hero">
        <div className="container">
          <nav className="navbar">
            <div className="logo">DocuSearch AI</div>
            <ul className="nav-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#benefits">Benefits</a></li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li><a href="#contact">Contact</a></li>
            </ul>
            <button className="cta-button demo-button" onClick={() => navigate('/login')}>
              Login
            </button>
          </nav>

          <div className="hero-content">
            <div className="hero-text">
              <h1>AI-Powered Document Search & Retrieval</h1>
              <p>Find exactly what you need, when you need it. Our intelligent assistant understands natural language and provides instant insights from your documents.</p>
              <div className="hero-buttons">
                <button className="cta-button primary">Discover</button>
                <button
                  className="cta-button secondary"
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>
              </div>
            </div>
            <div className="hero-image">
              <video src="" alt="AI Document Search Illustration" />
            </div>
          </div>
        </div>
      </header>

      <section id="features" className="features">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Smart Search</h3>
              <p>Find documents using natural language queries instead of just keywords.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>AI-Powered Summaries</h3>
              <p>Get concise summaries of lengthy documents with key insights highlighted.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Context-Aware Recommendations</h3>
              <p>Discover related files and topics based on your current search.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📁</div>
              <h3>Multi-Format Support</h3>
              <p>Process PDFs, Word files, presentations, and other common formats.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast & Efficient</h3>
              <p>Get results instantly without compromising on accuracy or relevance.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Access</h3>
              <p>Maintain data security while providing efficient retrieval capabilities.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="benefits">
        <div className="container">
          <h2 className="section-title">Why Choose DocuSearch AI?</h2>
          <div className="benefits-content">
            <div className="benefits-image">
              <img src="/api/placeholder/450/350" alt="Productivity Graph" />
            </div>
            <div className="benefits-list">
              <div className="benefit-item">
                <h3>Save Valuable Time</h3>
                <p>Reduce document search time by up to 70% with intelligent natural language processing.</p>
              </div>
              <div className="benefit-item">
                <h3>Enhance Decision Making</h3>
                <p>Access key insights quickly to make better-informed decisions.</p>
              </div>
              <div className="benefit-item">
                <h3>Boost Productivity</h3>
                <p>Eliminate frustration and focus on what matters most instead of searching for information.</p>
              </div>
              <div className="benefit-item">
                <h3>Streamline Knowledge Access</h3>
                <p>Democratize information access across your organization with intuitive interfaces.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Upload Documents</h3>
              <p>Connect your document repositories or upload files directly to the platform.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Ask Questions</h3>
              <p>Type natural language queries about what you're looking for.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Get Instant Results</h3>
              <p>Receive relevant documents, summaries, and recommendations immediately.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="about">
        <div className="container">
          <h2 className="section-title">About Our Project</h2>
          <div className="about-content">
            <p>This AI-powered Document Search & Retrieval Assistant was developed for the HackIndia Hackathon to address the common challenge of information retrieval in the workplace. Our team combined natural language processing, machine learning, and document analysis techniques to create a solution that transforms how people interact with document repositories.</p>
            <p>Our goal is to boost workplace efficiency by reducing the time spent searching for information, streamlining knowledge access, and empowering employees with instant insights from large document collections.</p>
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">Get in Touch</h2>
          <div className="contact-content">
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" placeholder="Your name" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Your email" />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" placeholder="Tell us about your needs"></textarea>
              </div>
              <button type="submit" className="cta-button primary">Send Message</button>
            </form>
            <div className="contact-info">
              <h3>Contact Information</h3>
              <p>Email: team@docusearchai.com</p>
              <p>Twitter: @DocuSearchAI</p>
              <p>GitHub: github.com/docusearchai</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">DocuSearch AI</div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <ul>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#benefits">Benefits</a></li>
                  <li><a href="#demo">Demo</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <ul>
                  <li><a href="#about">About</a></li>
                  <li><a href="#team">Team</a></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Resources</h4>
                <ul>
                  <li><a href="#blog">Blog</a></li>
                  <li><a href="#docs">Documentation</a></li>
                  <li><a href="#faq">FAQ</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 DocuSearch AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;