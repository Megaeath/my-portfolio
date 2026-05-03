import React from "react";

function LanguageToggle({ currentLanguage, onChange }) {
  return (
    <div className="language-toggle" aria-label="Language switcher">
      <button
        type="button"
        className={currentLanguage === "en" ? "active" : ""}
        onClick={() => onChange("en")}
      >
        EN
      </button>
      <button
        type="button"
        className={currentLanguage === "th" ? "active" : ""}
        onClick={() => onChange("th")}
      >
        TH
      </button>
    </div>
  );
}

export default LanguageToggle;
