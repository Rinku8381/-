// TermsModal.tsx

"use client";

import "../styles/TermsScreen.css";

interface TermsScreenProps {
  onAccept: () => void;
  onDecline: () => void;
  isVisible: boolean;
}

export default function TermsScreen({ onAccept, onDecline, isVisible }: TermsScreenProps) {
  return (
    <div className={`termsScreen ${isVisible ? 'visible' : ''}`} tabIndex={-1} role="dialog" aria-modal="true">
      <div className="termsContainer">
        <div className="termsHeader">
          <h1 className="termsTitle">Terms & Conditions</h1>
          <div className="ageRestriction">
            <span className="ageBadge">18+</span>
            <p className="ageText">This application is restricted to users 18 years and older</p>
          </div>
        </div>

        <div className="termsContent">
          {/* Sections truncated for brevity */}
        </div>

        <div className="termsActions">
          <button className="declineButton" onClick={onDecline}>Decline</button>
          <button className="acceptButton" onClick={onAccept}>Accept & Continue</button>
        </div>
      </div>
    </div>
  );
}