import { useState } from "react";

function FoodScanner({ onBack }) {
  const [scanned, setScanned] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setFileName(file.name);

    setTimeout(() => {
      setScanned(true);
    }, 600);
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <span>AI FOOD SCANNER</span>

          <h1>Understand what's inside.</h1>

          <p>
            Upload a packaged-food label to explore ingredient
            and nutrition information.
          </p>
        </div>

        <button
          className="outline-btn"
          onClick={onBack}
        >
          ← Dashboard
        </button>
      </header>

      {!scanned ? (
        <div className="scanner-layout">
          <div className="scanner-upload">
            <div className="scanner-icon">
              ⌕
            </div>

            <span>IMAGE ANALYSIS</span>

            <h2>Scan a food label</h2>

            <p>
              Upload an image of a packaged-food nutrition or
              ingredient label. FitAI will analyze the visible
              information in this prototype.
            </p>

            <label className="upload-button">
              Choose Image

              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
              />
            </label>

            {fileName && (
              <div className="selected-file">
                Selected: {fileName}
              </div>
            )}

            <div className="scanner-features">
              <span>✓ Ingredients</span>
              <span>✓ Nutrition facts</span>
              <span>✓ AI explanation</span>
            </div>
          </div>

          <div className="scanner-info">
            <div className="scanner-info-icon">
              ✦
            </div>

            <h3>How it works</h3>

            <div className="scanner-step">
              <b>01</b>
              <span>
                Upload a food-label image.
              </span>
            </div>

            <div className="scanner-step">
              <b>02</b>
              <span>
                OCR extracts visible information.
              </span>
            </div>

            <div className="scanner-step">
              <b>03</b>
              <span>
                AI explains the information in simple language.
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="scan-result">
          <div className="scan-success">
            <div className="scan-success-icon">
              ✓
            </div>

            <span>ANALYSIS COMPLETE</span>

            <h2>Here's what FitAI found.</h2>

            <p>
              This is a demonstration result for your prototype.
            </p>
          </div>

          <div className="result-grid">
            <div className="result-card">
              <span>01</span>

              <h3>Ingredients</h3>

              <p>
                Review the ingredient list and identify the
                main components of the product.
              </p>
            </div>

            <div className="result-card">
              <span>02</span>

              <h3>Nutrition</h3>

              <p>
                Check serving information and nutrition values
                shown on the label.
              </p>
            </div>

            <div className="result-card">
              <span>03</span>

              <h3>AI Explanation</h3>

              <p>
                FitAI can turn technical label information into
                easier-to-understand guidance.
              </p>
            </div>
          </div>

          <button
            className="outline-btn"
            onClick={() => {
              setScanned(false);
              setFileName("");
            }}
          >
            Scan Another Image
          </button>
        </div>
      )}

      <div className="info-note">
        <strong>ⓘ</strong>
        Food scanning is intended for general awareness and
        education. It does not diagnose health conditions or
        replace advice from a qualified professional.
      </div>
    </div>
  );
}

export default FoodScanner;