// UploadPhotoScreen.jsx
import { useState } from "react";

export default function UploadPhotoScreen({
  photosToCapture,
  setUploadedPhotos,
  setStep,
  btnPrimary,
  btnSecondary,
  COLORS,
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + selectedFiles.length > photosToCapture) {
      alert(`Maximum ${photosToCapture} photos allowed`);
      return;
    }

    const newFiles = files.slice(0, photosToCapture - selectedFiles.length);
    setSelectedFiles([...selectedFiles, ...newFiles]);

    // Create preview URLs
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleProceed = () => {
    if (selectedFiles.length !== photosToCapture) {
      alert(`Please upload exactly ${photosToCapture} photos`);
      return;
    }

    // Convert to required format and move to editor
    setUploadedPhotos(
      previews.map((preview) => ({
        raw: preview,
        filtered: preview,
      }))
    );
    setStep("editor");
  };

  const progress = (selectedFiles.length / photosToCapture) * 100;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => setStep("select")}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "12px 20px",
          fontSize: "15px",
          fontWeight: "600",
          borderRadius: "12px",
          background: `linear-gradient(135deg, ${COLORS.BASE_WHITE} 0%, ${COLORS.LIGHT_GREY} 100%)`,
          border: `2px solid ${COLORS.PRIMARY_BLUE}20`,
          cursor: "pointer",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: COLORS.DEEP_BLUE,
          zIndex: 100,
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h2
          style={{
            background: `linear-gradient(135deg, ${COLORS.DEEP_BLUE} 0%, ${COLORS.PRIMARY_BLUE} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "8px",
            fontSize: "32px",
            fontWeight: "700",
          }}
        >
          Upload Your Photos
        </h2>
        <p style={{ color: "#5a6c7d", fontSize: "16px", fontWeight: "500" }}>
          Select {photosToCapture} photos from your device
        </p>
      </div>

      {/* Upload Area */}
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "40px",
          background: `linear-gradient(145deg, ${COLORS.BASE_WHITE} 0%, ${COLORS.LIGHT_BACKGROUND}40 100%)`,
          borderRadius: "20px",
          border: `3px dashed ${COLORS.PRIMARY_BLUE}40`,
          marginBottom: "24px",
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onClick={() => document.getElementById("fileInput").click()}
      >
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />

        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke={COLORS.PRIMARY_BLUE}
          strokeWidth="2"
          style={{ margin: "0 auto 16px" }}
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>

        <h3 style={{ color: COLORS.DEEP_BLUE, marginBottom: "8px" }}>
          Click to Upload Photos
        </h3>
        <p style={{ color: "#5a6c7d", fontSize: "14px" }}>
          or drag and drop your images here
        </p>
      </div>

      {/* Progress Bar */}
      {selectedFiles.length > 0 && (
        <div style={{ width: "100%", maxWidth: "600px", marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: COLORS.TEXT_BLACK,
              }}
            >
              {selectedFiles.length} / {photosToCapture} uploaded
            </span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: COLORS.PRIMARY_BLUE,
              }}
            >
              {Math.round(progress)}%
            </span>
          </div>
          <div
            style={{
              width: "100%",
              height: "8px",
              background: "rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${COLORS.ACCENT_YELLOW} 0%, #ffd700 100%)`,
                borderRadius: "10px",
                transition: "width 0.3s ease-out",
              }}
            />
          </div>
        </div>
      )}

      {/* Photo Previews */}
      {previews.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "16px",
            width: "100%",
            maxWidth: "600px",
            marginBottom: "32px",
          }}
        >
          {previews.map((preview, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                aspectRatio: "3/4",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto(index);
                }}
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "rgba(0, 0, 0, 0.7)",
                  border: "none",
                  color: COLORS.BASE_WHITE,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Proceed Button */}
      <button
        onClick={handleProceed}
        disabled={selectedFiles.length !== photosToCapture}
        style={{
          ...btnPrimary,
          padding: "16px 48px",
          fontSize: "17px",
          opacity: selectedFiles.length !== photosToCapture ? 0.5 : 1,
          cursor:
            selectedFiles.length !== photosToCapture
              ? "not-allowed"
              : "pointer",
        }}
      >
        Next: Edit Photos →
      </button>
    </div>
  );
}
