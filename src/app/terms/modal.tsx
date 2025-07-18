"use client";

import "./TermsScreen.css";

interface TermsScreenProps {
  onAccept: () => void;
  onDecline: () => void;
  isVisible: boolean;
}

export default function TermsScreen({ onAccept, onDecline, isVisible }: TermsScreenProps) {
  return (
    <div className={`terms-screen ${isVisible ? 'visible' : ''}`} tabIndex={-1} role="dialog" aria-modal="true">
      <div className="terms-container">
        <div className="terms-header">
          <h1 className="terms-title">Terms & Conditions</h1>
          <div className="age-restriction">
            <span className="age-badge">18+</span>
            <p className="age-text">
              This application is restricted to users 18 years and older
            </p>
          </div>
        </div>

        <div className="terms-content">
          <div className="terms-section">
            <h3 className="section-title">Privacy Policy</h3>
            <div className="section-content">
              <p>
                We respect your privacy and are committed to protecting your
                personal data. This privacy policy explains how we collect, use,
                and safeguard your information when using Seraphine Hybrid V1.
              </p>
              <ul>
                <li>Data collection is limited to essential functionality</li>
                <li>Personal information is encrypted and stored securely</li>
                <li>
                  We do not share your data with third parties without consent
                </li>
                <li>
                  You have the right to access, modify, or delete your data
                </li>
              </ul>
            </div>
          </div>

          <div className="terms-section">
            <h3 className="section-title">Usage Terms</h3>
            <div className="section-content">
              <p>
                By using this application, you agree to comply with all
                applicable laws and regulations. Prohibited activities include:
              </p>
              <ul>
                <li>
                  Attempting to reverse engineer or modify the application
                </li>
                <li>Using the service for illegal or unauthorized purposes</li>
                <li>
                  Interfering with or disrupting the service infrastructure
                </li>
                <li>Violating intellectual property rights</li>
              </ul>
            </div>
          </div>

          <div className="terms-section">
            <h3 className="section-title">Security Statement</h3>
            <div className="section-content">
              <p>
                Security is our top priority. We implement industry-standard
                measures to protect your data:
              </p>
              <ul>
                <li>End-to-end encryption for all communications</li>
                <li>Regular security audits and updates</li>
                <li>Multi-factor authentication support</li>
                <li>Secure data transmission protocols</li>
              </ul>
            </div>
          </div>

          <div className="terms-section">
            <h3 className="section-title">Content Rules</h3>
            <div className="section-content">
              <p>
                Users are responsible for content they create or share. The
                following content is prohibited:
              </p>
              <ul>
                <li>Harmful, threatening, or harassing material</li>
                <li>Content that violates privacy or publicity rights</li>
                <li>Spam, malware, or malicious code</li>
                <li>Content that infringes on intellectual property</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="terms-actions">
          <button className="decline-button" onClick={onDecline}>
            Decline
          </button>
          <button className="accept-button" onClick={onAccept}>
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
