import { useState, useEffect, useRef } from "react";
import { uploadWithTransform } from "../../utils/cloudinaryApi";

export default function PreviewScreen({
  layouts,
  totalFrames,
  getPhotosForFrames,
  bgColor,
  selectedRowIndex,
  setSelectedRowIndex,
  PRESET_BG_COLORS,
  setBgColor,
  filter,
  setFilter,
  applyFilterToAll,
  handleProceedToPrintWholeSheet,
  setPhotosTaken,
  photosTaken,
  setFilter: resetFilter,
  lastAppliedFilterRef,
  setStep,
  btnPrimary,
  btnSecondary,
  btnFilter,
  btnFilterSelected,
  COLORS,
}) {
  const [uploadStatus, setUploadStatus] = useState("");
  const [filterUploadQueue, setFilterUploadQueue] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [photoRotations, setPhotoRotations] = useState({});
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [photoPositions, setPhotoPositions] = useState({});
  const [showMobileControls, setShowMobileControls] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const usingLayout = layouts.vertical[totalFrames];
  const previewRef = useRef(null);

  const minSwipeDistance = 50;

  // Rotate functions
  const rotateLeft = () => {
    if (selectedPhotoIndex !== null) {
      setPhotoRotations((prev) => ({
        ...prev,
        [selectedPhotoIndex]:
          ((prev[selectedPhotoIndex] || 0) - 90 + 360) % 360,
      }));
    }
  };

  const rotateRight = () => {
    if (selectedPhotoIndex !== null) {
      setPhotoRotations((prev) => ({
        ...prev,
        [selectedPhotoIndex]: ((prev[selectedPhotoIndex] || 0) + 90) % 360,
      }));
    }
  };

  // Move functions
  const moveLeft = () => {
    if (selectedPhotoIndex !== null) {
      setPhotoPositions((prev) => ({
        ...prev,
        [selectedPhotoIndex]: {
          x: (prev[selectedPhotoIndex]?.x || 0) - 10,
          y: prev[selectedPhotoIndex]?.y || 0,
        },
      }));
    }
  };

  const moveRight = () => {
    if (selectedPhotoIndex !== null) {
      setPhotoPositions((prev) => ({
        ...prev,
        [selectedPhotoIndex]: {
          x: (prev[selectedPhotoIndex]?.x || 0) + 10,
          y: prev[selectedPhotoIndex]?.y || 0,
        },
      }));
    }
  };

  const moveUp = () => {
    if (selectedPhotoIndex !== null) {
      setPhotoPositions((prev) => ({
        ...prev,
        [selectedPhotoIndex]: {
          x: prev[selectedPhotoIndex]?.x || 0,
          y: (prev[selectedPhotoIndex]?.y || 0) - 10,
        },
      }));
    }
  };

  const moveDown = () => {
    if (selectedPhotoIndex !== null) {
      setPhotoPositions((prev) => ({
        ...prev,
        [selectedPhotoIndex]: {
          x: prev[selectedPhotoIndex]?.x || 0,
          y: (prev[selectedPhotoIndex]?.y || 0) + 10,
        },
      }));
    }
  };

  const resetPosition = () => {
    if (selectedPhotoIndex !== null) {
      setPhotoPositions((prev) => ({
        ...prev,
        [selectedPhotoIndex]: { x: 0, y: 0 },
      }));
    }
  };

  // Swipe gesture handlers
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e) => {
    if (!touchStart) return;

    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || selectedPhotoIndex === null) {
      setTouchStart(null);
      setTouchEnd(null);
      return;
    }

    const distance = {
      x: touchStart.x - touchEnd.x,
      y: touchStart.y - touchEnd.y,
    };

    const isHorizontalSwipe = Math.abs(distance.x) > Math.abs(distance.y);

    if (isHorizontalSwipe && Math.abs(distance.x) > minSwipeDistance) {
      if (distance.x > 0) {
        moveLeft();
      } else {
        moveRight();
      }
    } else if (!isHorizontalSwipe && Math.abs(distance.y) > minSwipeDistance) {
      if (distance.y > 0) {
        moveUp();
      } else {
        moveDown();
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (selectedPhotoIndex === null) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          moveLeft();
          break;
        case "ArrowRight":
          e.preventDefault();
          moveRight();
          break;
        case "ArrowUp":
          e.preventDefault();
          moveUp();
          break;
        case "ArrowDown":
          e.preventDefault();
          moveDown();
          break;
        case "r":
        case "R":
          e.preventDefault();
          resetPosition();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedPhotoIndex, photoPositions]);

  // Prevent body scroll when mobile controls are open
  useEffect(() => {
    if (showMobileControls) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showMobileControls]);

  // Apply Filter + Upload
  const handleApplyFilterAndUpload = async () => {
    setIsUploading(true);
    setUploadStatus("Applying filter...");

    await applyFilterToAll();

    try {
      setUploadStatus("☁️ Uploading filtered photos...");
      console.log(`📤 Uploading ${photosTaken.length} filtered images...`);

      const uploadPromises = photosTaken.map(async (photo, index) => {
        try {
          const base64Image = photo.filtered || photo.raw;

          const result = await uploadWithTransform(base64Image, {
            folder: "photo-booth/filtered",
            filter: filter === "none" ? undefined : filter,
            width: 1280,
            height: 720,
          });

          if (result.success) {
            console.log(
              `✅ Filtered photo ${index + 1} uploaded:`,
              result.data.url
            );
            setFilterUploadQueue((prev) => [...prev, index]);
            return result.data;
          }
        } catch (error) {
          console.error(
            `❌ Filtered upload failed for photo ${index + 1}:`,
            error
          );
          return null;
        }
      });

      const results = await Promise.all(uploadPromises);
      const successCount = results.filter((r) => r !== null).length;

      setUploadStatus(
        `✓ ${successCount}/${photosTaken?.length} filtered photos uploaded`
      );
      setTimeout(() => setUploadStatus(""), 3000);
    } catch (error) {
      console.error("❌ Filtered upload error:", error);
      setUploadStatus("❌ Filtered upload failed");
      setTimeout(() => setUploadStatus(""), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  if (!usingLayout) {
    return <div className="preview-screen-container">Invalid layout</div>;
  }

  return (
    <div className="preview-screen-container">
      {/* Animated background blobs */}
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />

      {/* Upload Status Toast */}
      {uploadStatus && (
        <div className="upload-toast">
          <div className="toast-indicator" />
          {uploadStatus}
        </div>
      )}

      {/* Keyboard shortcuts hint - hidden on mobile */}
      {selectedPhotoIndex !== null && (
        <div className="keyboard-hint mobile-hidden">
          Use arrow keys to move • R to reset
        </div>
      )}

      {/* Content Container */}
      <div className="content-wrapper">
        {/* Header */}
        <div className="header">
          <h1 className="title">Preview & Customize</h1>
          <p className="subtitle">
            Fine-tune your photo strip with filters and colors
          </p>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Preview Section */}
          <div className="preview-section">
            <div className="preview-card">
              {/* Label */}
              <div className="section-label">
                <div className="label-dot" />
                <h3>Your Photo Strip</h3>
              </div>

              {/* Preview Display with touch support */}
              <div
                className="preview-canvas"
                style={{ backgroundColor: bgColor }}
                ref={previewRef}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div
                  className="photo-grid"
                  style={{
                    gridTemplateColumns: `repeat(${usingLayout.numCols}, 1fr)`,
                    gridTemplateRows: `repeat(${usingLayout.numRows}, 1fr)`,
                    aspectRatio: `${usingLayout.finalWidth}/${usingLayout.finalHeight}`,
                  }}
                >
                  {Array.from({ length: totalFrames }).map((_, i) => {
                    const src = getPhotosForFrames()[i];
                    const isSelected = selectedPhotoIndex === i;
                    const rotation = photoRotations[i] || 0;
                    const position = photoPositions[i] || { x: 0, y: 0 };

                    return (
                      <div
                        key={i}
                        onClick={() => setSelectedPhotoIndex(i)}
                        className={`photo-frame ${
                          isSelected ? "selected" : ""
                        }`}
                      >
                        {src ? (
                          <img
                            src={src}
                            alt={`Photo ${i + 1}`}
                            className="photo-img"
                            style={{
                              transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
                            }}
                            loading="lazy"
                            draggable={false}
                          />
                        ) : (
                          <div className="empty-frame">Empty</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile selection hint */}
              <div className="mobile-selection-hint">
                Tap any photo to select and edit • Swipe to move
              </div>
            </div>
          </div>

          {/* ✅ DESKTOP: Original Sidebar (Hidden on mobile) */}
          <div className="customize-section desktop-only">
            <div className="customize-card">
              {/* Sidebar Header */}
              <div className="section-label">
                <div className="label-dot label-dot-blue" />
                <h3>Customize</h3>
              </div>

              {/* Scrollable Content */}
              <div className="customize-content">
                {/* Photo Controls */}
                {selectedPhotoIndex !== null && (
                  <div className="photo-controls">
                    <label className="control-label">
                      Edit Photo #{selectedPhotoIndex + 1}
                    </label>

                    {/* Position Controls */}
                    <div className="control-group">
                      <div className="control-group-label">Position</div>

                      {/* Up button */}
                      <div className="position-up">
                        <button
                          onClick={moveUp}
                          className="control-btn control-btn-outline"
                          aria-label="Move up"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M12 19V5M5 12l7-7 7 7" />
                          </svg>
                          Up
                        </button>
                      </div>

                      {/* Left, Reset, Right buttons */}
                      <div className="position-controls">
                        <button
                          onClick={moveLeft}
                          className="control-btn control-btn-outline"
                          aria-label="Move left"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                          </svg>
                          Left
                        </button>

                        <button
                          onClick={resetPosition}
                          className="control-btn control-btn-outline"
                          aria-label="Reset position"
                        >
                          Reset
                        </button>

                        <button
                          onClick={moveRight}
                          className="control-btn control-btn-outline"
                          aria-label="Move right"
                        >
                          Right
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>

                      {/* Down button */}
                      <div className="position-down">
                        <button
                          onClick={moveDown}
                          className="control-btn control-btn-outline"
                          aria-label="Move down"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M12 5v14M5 12l7 7 7-7" />
                          </svg>
                          Down
                        </button>
                      </div>
                    </div>

                    {/* Rotation Controls */}
                    <div className="control-group">
                      <div className="control-group-label">Rotation</div>
                      <div className="rotation-controls">
                        <button
                          onClick={rotateLeft}
                          className="control-btn control-btn-outline"
                          aria-label="Rotate left"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M2.5 2v6h6M21.5 22v-6h-6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                          </svg>
                          ↺ Rotate
                        </button>
                        <button
                          onClick={rotateRight}
                          className="control-btn control-btn-primary"
                          aria-label="Rotate right"
                        >
                          Rotate ↻
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M21.5 2v6h-6M2.5 22v-6h6M22 11.5a10 10 0 0 0-18.8-4.3M2 12.5a10 10 0 0 0 18.8 4.2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Background Color Section */}
                <div className="customize-group">
                  <label className="control-label">Background Color</label>

                  {/* Color Presets Grid */}
                  <div className="color-grid">
                    {PRESET_BG_COLORS.map((c) => {
                      const isActive =
                        bgColor.toLowerCase() === c.value.toLowerCase();
                      return (
                        <button
                          key={c.value}
                          aria-label={`Set background ${c.name}`}
                          title={c.name}
                          onClick={() => setBgColor(c.value)}
                          className={`color-btn ${isActive ? "active" : ""}`}
                          style={{ background: c.value }}
                        />
                      );
                    })}
                  </div>

                  {/* Custom Color Picker */}
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="color-picker"
                    aria-label="Custom color picker"
                  />
                  <div className="info-box">💡 Tap preset or use picker</div>
                </div>

                {/* Filter Section */}
                <div className="customize-group">
                  <label className="control-label">Photo Filter</label>

                  {/* Filter Buttons Grid */}
                  <div className="filter-grid">
                    {[
                      { value: "none", label: "None" },
                      { value: "burnt-coffee", label: "Burnt Coffee" },
                      { value: "ocean-wave", label: "Ocean Wave" },
                      { value: "old-wood", label: "Old Wood" },
                      { value: "vintage-may", label: "Vintage May" },
                      { value: "bw", label: "B&W" },
                    ].map((filterOption) => {
                      const isActive = filter === filterOption.value;
                      return (
                        <button
                          key={filterOption.value}
                          onClick={() => setFilter(filterOption.value)}
                          className={`filter-btn ${isActive ? "active" : ""}`}
                        >
                          {filterOption.label}
                          {isActive && <span className="checkmark">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Upload Progress */}
                {filterUploadQueue?.length > 0 && (
                  <div className="upload-progress">
                    <div className="progress-indicator" />
                    ☁️ {filterUploadQueue?.length}/{photosTaken?.length} saved
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={handleProceedToPrintWholeSheet}
                  className="action-btn"
                  disabled={isUploading}
                >
                  <span>
                    {isUploading ? "Processing..." : "Continue to Print →"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ MOBILE: Horizontal Toolbar (Hidden on desktop) */}
      <div className="mobile-toolbar">
        <div className="mobile-toolbar-scroll">
          {/* Position Group */}
          <div className="mobile-tool-group">
            <div className="mobile-tool-group-label">Position</div>
            <div className="mobile-tool-buttons">
              <button
                onClick={moveLeft}
                className="mobile-tool-btn"
                aria-label="Move left"
              >
                <span className="mobile-tool-icon">←</span>
              </button>
              <button
                onClick={moveUp}
                className="mobile-tool-btn"
                aria-label="Move up"
              >
                <span className="mobile-tool-icon">↑</span>
              </button>
              <button
                onClick={moveDown}
                className="mobile-tool-btn"
                aria-label="Move down"
              >
                <span className="mobile-tool-icon">↓</span>
              </button>
              <button
                onClick={moveRight}
                className="mobile-tool-btn"
                aria-label="Move right"
              >
                <span className="mobile-tool-icon">→</span>
              </button>
              <button
                onClick={resetPosition}
                className="mobile-tool-btn mobile-tool-btn-primary"
                aria-label="Reset"
              >
                <span className="mobile-tool-icon">⟲</span>
              </button>
            </div>
          </div>

          {/* Rotation Group */}
          <div className="mobile-tool-group">
            <div className="mobile-tool-group-label">Rotate</div>
            <div className="mobile-tool-buttons">
              <button
                onClick={rotateLeft}
                className="mobile-tool-btn"
                aria-label="Rotate left"
              >
                <span className="mobile-tool-icon">↺</span>
              </button>
              <button
                onClick={rotateRight}
                className="mobile-tool-btn"
                aria-label="Rotate right"
              >
                <span className="mobile-tool-icon">↻</span>
              </button>
            </div>
          </div>

          {/* Filters Group */}
          <div className="mobile-tool-group">
            <div className="mobile-tool-group-label">Filters</div>
            <div className="mobile-filter-list">
              {[
                { value: "none", label: "None" },
                { value: "burnt-coffee", label: "Burnt Coffee" },
                { value: "ocean-wave", label: "Ocean Wave" },
                { value: "old-wood", label: "Old Wood" },
                { value: "vintage-may", label: "Vintage May" },
                { value: "bw", label: "B&W" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`mobile-filter-item ${
                    filter === f.value ? "active" : ""
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Background Group */}
          <div className="mobile-tool-group">
            <div className="mobile-tool-group-label">Background</div>
            <div className="mobile-color-list">
              {PRESET_BG_COLORS.map((c) => {
                const isActive =
                  bgColor.toLowerCase() === c.value.toLowerCase();
                return (
                  <button
                    key={c.value}
                    onClick={() => setBgColor(c.value)}
                    className={`mobile-color-item ${isActive ? "active" : ""}`}
                    style={{ background: c.value }}
                  />
                );
              })}
            </div>
          </div>

          {/* Actions Group */}
          <div className="mobile-tool-group">
            <div className="mobile-tool-group-label">Actions</div>
            <div className="mobile-tool-buttons">
              <button
                onClick={handleApplyFilterAndUpload}
                className="mobile-tool-btn mobile-tool-btn-success"
                disabled={isUploading}
              >
                <span className="mobile-tool-icon">☁️</span>
              </button>
              <button
                onClick={handleProceedToPrintWholeSheet}
                className="mobile-tool-btn mobile-tool-btn-primary"
              >
                <span className="mobile-tool-icon">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Reset and base styles */
        * {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }

        /* Main Container - Mobile Optimized */
        .preview-screen-container {
          width: 100%;
          min-height: 100vh;
          min-height: -webkit-fill-available;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            135deg,
            ${COLORS.BASE_WHITE} 0%,
            ${COLORS.LIGHT_BACKGROUND}25 50%,
            ${COLORS.BASE_WHITE} 100%
          );
          position: relative;
          overflow-x: hidden;
          padding: 12px;
        }

        /* Desktop: Normal padding, Mobile: Extra bottom padding for toolbar */
        @media (min-width: 769px) {
          .preview-screen-container {
            padding: 20px;
          }
        }

        @media (max-width: 768px) {
          .preview-screen-container {
            padding: 12px;
            padding-bottom: 120px; /* Space for mobile toolbar */
          }
        }

        /* Background Blobs */
        .bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          z-index: 0;
          animation: float 20s ease-in-out infinite;
        }

        .bg-blob-1 {
          top: -60px;
          right: -60px;
          width: 250px;
          height: 250px;
          background: radial-gradient(
            circle,
            ${COLORS.PRIMARY_BLUE}12 0%,
            transparent 70%
          );
        }

        .bg-blob-2 {
          bottom: -80px;
          left: -80px;
          width: 300px;
          height: 300px;
          background: radial-gradient(
            circle,
            ${COLORS.ACCENT_YELLOW}10 0%,
            transparent 70%
          );
          animation-delay: -5s;
        }

        /* Upload Toast */
        .upload-toast {
          position: fixed;
          top: 12px;
          right: 12px;
          left: 12px;
          padding: 12px 16px;
          background: linear-gradient(
            135deg,
            ${COLORS.ACCENT_YELLOW} 0%,
            #ffd700 100%
          );
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          color: ${COLORS.TEXT_BLACK};
          box-shadow: 0 8px 24px ${COLORS.ACCENT_YELLOW}50,
            0 0 0 1px ${COLORS.ACCENT_YELLOW}60,
            inset 0 1px 0 rgba(255, 255, 255, 0.7);
          z-index: 1000;
          animation: slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          gap: 8px;
          max-width: calc(100% - 24px);
        }

        .toast-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${COLORS.DEEP_BLUE};
          animation: pulse 2s ease-in-out infinite;
        }

        /* Keyboard Hint */
        .keyboard-hint {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          padding: 8px 16px;
          background: ${COLORS.PRIMARY_BLUE}20;
          border-radius: 8px;
          font-size: 11px;
          color: ${COLORS.DEEP_BLUE};
          font-weight: 600;
          backdrop-filter: blur(10px);
          z-index: 100;
          animation: slideUp 0.4s ease-out;
        }

        .mobile-hidden {
          display: none;
        }

        /* Content Wrapper */
        .content-wrapper {
          width: 100%;
          max-width: 1400px;
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 1;
        }

        .header {
          text-align: center;
          margin-bottom: 16px;
          animation: fadeInDown 0.6s ease-out;
          padding: 0 8px;
        }

        .title {
          background: linear-gradient(
            135deg,
            ${COLORS.DEEP_BLUE} 0%,
            ${COLORS.PRIMARY_BLUE} 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 6px;
          letter-spacing: -0.8px;
          line-height: 1.2;
        }

        .subtitle {
          color: #5a6c7d;
          font-size: 13px;
          font-weight: 500;
          margin: 0;
          letter-spacing: 0.2px;
          line-height: 1.4;
        }

        .main-content {
          display: flex;
          gap: 16px;
          align-items: stretch;
          justify-content: center;
          flex: 1;
          width: 100%;
          min-height: 0;
        }

        /* Preview Section */
        .preview-section {
          flex: 1 1 50%;
          max-width: 600px;
          display: flex;
          flex-direction: column;
          animation: fadeInLeft 0.6s ease-out;
        }

        .preview-card {
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 255, 255, 0.7) 100%
          );
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12),
            0 0 0 1px rgba(255, 255, 255, 0.8),
            inset 0 1px 0 rgba(255, 255, 255, 1);
          border: 2px solid rgba(255, 255, 255, 0.5);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .section-label {
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .label-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: linear-gradient(
            135deg,
            ${COLORS.ACCENT_YELLOW} 0%,
            #ffd700 100%
          );
          box-shadow: 0 0 12px ${COLORS.ACCENT_YELLOW}80;
        }

        .section-label h3 {
          color: ${COLORS.TEXT_BLACK};
          font-size: 16px;
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.4px;
        }

        .preview-canvas {
          width: 100%;
          flex: 1;
          background-color: ${bgColor};
          padding: 12px;
          box-sizing: border-box;
          border-radius: 12px;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.15),
            inset 0 2px 0 rgba(255, 255, 255, 0.3);
          transition: background-color 0.4s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
        }

        .photo-grid {
          width: 100%;
          max-height: 100%;
          aspect-ratio: ${usingLayout.finalWidth} / ${usingLayout.finalHeight};
          display: grid;
          grid-template-columns: repeat(${usingLayout.numCols}, 1fr);
          grid-template-rows: repeat(${usingLayout.numRows}, 1fr);
          gap: 8px;
        }

        .photo-frame {
          width: 100%;
          height: 100%;
          background-color: #f0f0f0;
          border-radius: 6px;
          overflow: hidden;
          box-sizing: border-box;
          border: 2px solid transparent;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          transform: scale(1);
          position: relative;
          touch-action: manipulation;
        }

        .photo-frame.selected {
          border: 2px solid ${COLORS.ACCENT_YELLOW};
          box-shadow: 0 4px 16px ${COLORS.ACCENT_YELLOW}40,
            0 0 0 1px ${COLORS.ACCENT_YELLOW}60;
          transform: scale(0.98);
        }

        .photo-frame:active:not(.selected) {
          transform: scale(0.95);
        }

        .photo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
          transition: transform 0.3s ease;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
        }

        .empty-frame {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9aa0a6;
          font-size: 11px;
          font-weight: 600;
        }

        .mobile-selection-hint {
          display: none;
          text-align: center;
          margin-top: 8px;
          font-size: 11px;
          color: #5a6c7d;
          font-weight: 500;
        }

        /* ✅ DESKTOP: Original Sidebar */
        .customize-section {
          flex: 1 1 40%;
          max-width: 380px;
          display: flex;
          flex-direction: column;
          animation: fadeInRight 0.6s ease-out;
        }

        .customize-card {
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 255, 255, 0.7) 100%
          );
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12),
            0 0 0 1px rgba(255, 255, 255, 0.8),
            inset 0 1px 0 rgba(255, 255, 255, 1);
          border: 2px solid rgba(255, 255, 255, 0.5);
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .customize-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: 8px;
          margin-right: -8px;
          -webkit-overflow-scrolling: touch;
        }

        /* DESKTOP: Photo Controls */
        .photo-controls {
          margin-bottom: 20px;
          padding: 12px;
          background: ${COLORS.PRIMARY_BLUE}10;
          border-radius: 10px;
          border: 1px solid ${COLORS.PRIMARY_BLUE}30;
        }

        .control-label {
          display: block;
          margin-bottom: 10px;
          color: ${COLORS.TEXT_BLACK};
          font-size: 13px;
          font-weight: 700;
        }

        .control-group {
          margin-bottom: 10px;
        }

        .control-group:last-child {
          margin-bottom: 0;
        }

        .control-group-label {
          font-size: 11px;
          color: #5a6c7d;
          margin-bottom: 6px;
          font-weight: 600;
        }

        .position-controls,
        .rotation-controls {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 6px;
        }

        .rotation-controls {
          grid-template-columns: 1fr 1fr;
        }

        .position-up,
        .position-down {
          display: grid;
          grid-template-columns: 1fr;
          gap: 6px;
          margin-bottom: 6px;
        }

        .position-down {
          margin-top: 6px;
          margin-bottom: 0;
        }

        .control-btn {
          padding: 8px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          transition: all 0.3s ease;
          border: none;
          min-height: 40px;
          touch-action: manipulation;
        }

        .control-btn-outline {
          border: 1px solid ${COLORS.PRIMARY_BLUE};
          background: ${COLORS.BASE_WHITE};
          color: ${COLORS.DEEP_BLUE};
        }

        .control-btn-outline:hover {
          background: ${COLORS.LIGHT_BACKGROUND};
        }

        .control-btn-outline:active {
          transform: scale(0.95);
        }

        .control-btn-primary {
          border: none;
          background: linear-gradient(
            135deg,
            ${COLORS.DEEP_BLUE} 0%,
            ${COLORS.PRIMARY_BLUE} 100%
          );
          color: ${COLORS.BASE_WHITE};
          box-shadow: 0 4px 12px ${COLORS.DEEP_BLUE}30;
        }

        .control-btn-primary:active {
          transform: scale(0.95);
        }

        /* Customize Group */
        .customize-group {
          margin-bottom: 20px;
        }

        .color-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 10px;
        }

        .color-btn {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 8px;
          border: 2px solid #e0e0e0;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          min-height: 40px;
          touch-action: manipulation;
        }

        .color-btn.active {
          border: 2px solid ${COLORS.ACCENT_YELLOW};
          box-shadow: 0 4px 16px ${COLORS.ACCENT_YELLOW}40;
          transform: scale(1.05);
        }

        .color-btn:active:not(.active) {
          transform: scale(0.95);
        }

        .color-picker {
          width: 100%;
          height: 44px;
          border-radius: 8px;
          border: 1px solid ${COLORS.LIGHT_GREY};
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          margin-bottom: 8px;
          touch-action: manipulation;
        }

        .info-box {
          padding: 8px 12px;
          background: ${COLORS.LIGHT_BACKGROUND}30;
          border-radius: 6px;
          font-size: 10px;
          color: #5a6c7d;
          font-weight: 500;
          border: 1px solid ${COLORS.PRIMARY_BLUE}20;
        }

        /* Filter Grid */
        .filter-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .filter-btn {
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid ${COLORS.LIGHT_GREY};
          background: linear-gradient(
            135deg,
            ${COLORS.BASE_WHITE} 0%,
            ${COLORS.LIGHT_GREY}40 100%
          );
          color: ${COLORS.TEXT_BLACK};
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          min-height: 44px;
          touch-action: manipulation;
        }

        .filter-btn.active {
          border: 2px solid ${COLORS.ACCENT_YELLOW};
          background: linear-gradient(
            135deg,
            ${COLORS.ACCENT_YELLOW} 0%,
            #ffd700 100%
          );
          font-weight: 800;
          box-shadow: 0 4px 16px ${COLORS.ACCENT_YELLOW}35;
          transform: scale(1.02);
        }

        .filter-btn:active:not(.active) {
          transform: scale(0.95);
        }

        .checkmark {
          margin-left: 4px;
          font-size: 10px;
        }

        /* Upload Progress */
        .upload-progress {
          padding: 12px 16px;
          background: linear-gradient(
            135deg,
            ${COLORS.PRIMARY_BLUE}15 0%,
            ${COLORS.PRIMARY_BLUE}08 100%
          );
          border-radius: 10px;
          font-size: 11px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 16px;
          color: ${COLORS.DEEP_BLUE};
          border: 1px solid ${COLORS.PRIMARY_BLUE}25;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .progress-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${COLORS.ACCENT_YELLOW};
          animation: pulse 2s ease-in-out infinite;
        }

        /* Action Button */
        .action-btn {
          width: 100%;
          padding: 14px 24px;
          font-size: 14px;
          font-weight: 800;
          border-radius: 10px;
          border: none;
          background: linear-gradient(
            135deg,
            ${COLORS.DEEP_BLUE} 0%,
            ${COLORS.PRIMARY_BLUE} 100%
          );
          color: ${COLORS.BASE_WHITE};
          cursor: pointer;
          box-shadow: 0 6px 20px ${COLORS.DEEP_BLUE}40,
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
          min-height: 48px;
          touch-action: manipulation;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px ${COLORS.DEEP_BLUE}45;
        }

        .action-btn:active {
          transform: translateY(0) scale(0.98);
        }

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .action-btn span {
          position: relative;
          z-index: 1;
        }

        .action-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          animation: shimmer 3s infinite;
        }

        /* ✅ MOBILE: Horizontal Toolbar */
        .mobile-toolbar {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          padding: 12px;
          box-shadow: 0 -5px 30px rgba(0, 0, 0, 0.15);
          z-index: 999;
          animation: slideUp 0.4s ease-out;
        }

        .mobile-toolbar-scroll {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 8px;
        }

        .mobile-toolbar-scroll::-webkit-scrollbar {
          height: 4px;
        }

        .mobile-toolbar-scroll::-webkit-scrollbar-track {
          background: ${COLORS.LIGHT_GREY}40;
          border-radius: 2px;
        }

        .mobile-toolbar-scroll::-webkit-scrollbar-thumb {
          background: ${COLORS.PRIMARY_BLUE};
          border-radius: 2px;
        }

        .mobile-tool-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          min-width: fit-content;
        }

        .mobile-tool-group-label {
          font-size: 10px;
          font-weight: 700;
          color: ${COLORS.TEXT_BLACK};
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .mobile-tool-buttons {
          display: flex;
          gap: 4px;
        }

        .mobile-tool-btn {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 1px solid ${COLORS.LIGHT_GREY};
          background: ${COLORS.BASE_WHITE};
          color: ${COLORS.DEEP_BLUE};
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          touch-action: manipulation;
        }

        .mobile-tool-btn:active {
          transform: scale(0.95);
        }

        .mobile-tool-btn-primary {
          border: none;
          background: linear-gradient(
            135deg,
            ${COLORS.DEEP_BLUE} 0%,
            ${COLORS.PRIMARY_BLUE} 100%
          );
          color: ${COLORS.BASE_WHITE};
        }

        .mobile-tool-btn-success {
          border: none;
          background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
          color: white;
        }

        .mobile-tool-icon {
          font-size: 16px;
        }

        .mobile-filter-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .mobile-filter-item {
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid ${COLORS.LIGHT_GREY};
          background: ${COLORS.BASE_WHITE};
          color: ${COLORS.TEXT_BLACK};
          font-size: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .mobile-filter-item.active {
          border: 2px solid ${COLORS.ACCENT_YELLOW};
          background: ${COLORS.ACCENT_YELLOW}20;
        }

        .mobile-color-list {
          display: flex;
          gap: 4px;
        }

        .mobile-color-item {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 2px solid #e0e0e0;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mobile-color-item.active {
          border: 2px solid ${COLORS.ACCENT_YELLOW};
          transform: scale(1.1);
        }

        /* Show/hide based on screen size */
        .desktop-only {
          display: block;
        }

        .mobile-only {
          display: none;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .main-content {
            flex-direction: column;
            gap: 16px;
          }

          .preview-section {
            max-width: 100%;
          }

          .desktop-only {
            display: none;
          }

          .mobile-only {
            display: block;
          }

          .customize-section {
            display: none; /* Hide desktop sidebar on mobile */
          }

          .mobile-toolbar {
            display: block; /* Show mobile toolbar on mobile */
          }

          .mobile-selection-hint {
            display: block;
          }

          .mobile-fab {
            display: none; /* Hide FAB since toolbar is always visible */
          }
        }

        @media (max-width: 768px) {
          .preview-screen-container {
            padding: 8px;
            padding-bottom: 120px; /* Space for mobile toolbar */
          }

          .header {
            margin-bottom: 12px;
          }

          .title {
            font-size: 20px;
          }

          .subtitle {
            font-size: 12px;
          }

          .preview-card {
            padding: 12px;
          }

          .photo-grid {
            gap: 6px;
          }

          .mobile-toolbar-scroll {
            gap: 16px;
            padding: 0 8px 8px;
          }

          .mobile-tool-btn {
            width: 36px;
            height: 36px;
          }

          .mobile-tool-icon {
            font-size: 14px;
          }
        }

        @media (max-width: 480px) {
          .title {
            font-size: 18px;
          }

          .mobile-tool-group-label {
            font-size: 9px;
          }

          .mobile-filter-item {
            font-size: 9px;
            padding: 6px 10px;
          }

          .mobile-color-item {
            width: 28px;
            height: 28px;
          }
        }

        /* Animations */
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.2);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(20px, -20px);
          }
        }
      `}</style>
    </div>
  );
}
