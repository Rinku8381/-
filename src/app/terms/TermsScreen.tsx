"use client";

interface TermsScreenProps {
  onAccept: () => void;
  onDecline: () => void;
  isVisible: boolean;
}

export default function TermsScreen({ onAccept, onDecline, isVisible }: TermsScreenProps) {
  return (
    <div className={`terms-container ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="terms-content">
        <h2 className="terms-title">Terms & Conditions</h2>
        <div className="terms-text">
          <p>Please review our terms and conditions carefully:</p>
          <ul>
            <li>By using our application, you agree to our terms of service.</li>
            <li>We respect your privacy and will not share your data without consent.</li>
            <li>You must be 18 years or older to use this application.</li>
          </ul>
        </div>
        <div className="terms-buttons">
          <button className="accept-button" onClick={onAccept}>
            Accept
          </button>
          <button className="decline-button" onClick={onDecline}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
