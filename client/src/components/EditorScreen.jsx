// EditorScreen.jsx - Fixed Drawing for Fabric.js v6
import { useState, useRef, useEffect } from "react";
import * as fabric from "fabric";

export default function EditorScreen({
  uploadedPhotos,
  setPhotosTaken,
  totalFrames,
  filter,
  setFilter,
  bgColor,
  setStep,
  btnPrimary,
  btnSecondary,
  COLORS,
}) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("adjust");
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [fabricImage, setFabricImage] = useState(null);

  // Adjustment states
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [hue, setHue] = useState(0);

  // Crop states
  const [cropMode, setCropMode] = useState(false);
  const [cropRect, setCropRect] = useState(null);

  // Drawing states
  const [drawingMode, setDrawingMode] = useState(false);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);

  // History for undo/redo
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);

  const currentPhoto = uploadedPhotos[currentPhotoIndex];

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current || !currentPhoto) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#f0f0f0",
    });

    fabricCanvasRef.current = canvas;

    // ✅ CRITICAL: Initialize PencilBrush for v6
    const brush = new fabric.PencilBrush(canvas);
    brush.color = brushColor;
    brush.width = brushSize;
    canvas.freeDrawingBrush = brush;

    fabric.FabricImage.fromURL(currentPhoto.raw, {
      crossOrigin: "anonymous",
    }).then((img) => {
      const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
      );
      img.scale(scale);
      img.set({
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: "center",
        originY: "center",
        selectable: false,
        evented: false, // Prevent image from blocking drawing
      });
      canvas.add(img);
      setFabricImage(img);
      canvas.renderAll();
      saveHistory();
    });

    return () => {
      canvas.dispose();
    };
  }, [currentPhoto]);

  // Apply filters
  useEffect(() => {
    if (!fabricImage) return;

    const filters = [];

    // Brightness
    if (brightness !== 100) {
      filters.push(
        new fabric.filters.Brightness({
          brightness: (brightness - 100) / 100,
        })
      );
    }

    // Contrast
    if (contrast !== 100) {
      filters.push(
        new fabric.filters.Contrast({
          contrast: (contrast - 100) / 100,
        })
      );
    }

    // Saturation
    if (saturation !== 100) {
      filters.push(
        new fabric.filters.Saturation({
          saturation: (saturation - 100) / 100,
        })
      );
    }

    // Blur
    if (blur > 0) {
      filters.push(new fabric.filters.Blur({ blur: blur / 10 }));
    }

    // Hue Rotation
    if (hue !== 0) {
      filters.push(new fabric.filters.HueRotation({ rotation: hue / 360 }));
    }

    fabricImage.filters = filters;
    fabricImage.applyFilters();
    fabricCanvasRef.current.renderAll();
  }, [brightness, contrast, saturation, blur, hue, fabricImage]);

  // Save history for undo
  const saveHistory = () => {
    if (!fabricCanvasRef.current) return;
    const json = fabricCanvasRef.current.toJSON();
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(json);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  // Undo
  const undo = () => {
    if (historyStep > 0) {
      const prevStep = historyStep - 1;
      fabricCanvasRef.current.loadFromJSON(history[prevStep]).then(() => {
        fabricCanvasRef.current.renderAll();
        setHistoryStep(prevStep);

        // Re-get fabric image reference after undo
        const objects = fabricCanvasRef.current.getObjects();
        const img = objects.find((obj) => obj.type === "image");
        if (img) setFabricImage(img);
      });
    }
  };

  // Redo
  const redo = () => {
    if (historyStep < history.length - 1) {
      const nextStep = historyStep + 1;
      fabricCanvasRef.current.loadFromJSON(history[nextStep]).then(() => {
        fabricCanvasRef.current.renderAll();
        setHistoryStep(nextStep);

        // Re-get fabric image reference after redo
        const objects = fabricCanvasRef.current.getObjects();
        const img = objects.find((obj) => obj.type === "image");
        if (img) setFabricImage(img);
      });
    }
  };

  // Enable Crop Mode
  const enableCropMode = () => {
    setCropMode(true);
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 400,
      height: 300,
      fill: "rgba(0,0,0,0.3)",
      stroke: "#fff",
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      selectable: true,
      hasControls: true,
    });
    fabricCanvasRef.current.add(rect);
    setCropRect(rect);
    fabricCanvasRef.current.setActiveObject(rect);
  };

  // Apply Crop
  const applyCrop = () => {
    if (!cropRect || !fabricImage) return;

    const canvas = fabricCanvasRef.current;
    const left = cropRect.left;
    const top = cropRect.top;
    const width = cropRect.width * cropRect.scaleX;
    const height = cropRect.height * cropRect.scaleY;

    // Create cropped image
    const croppedDataUrl = canvas.toDataURL({
      left: left,
      top: top,
      width: width,
      height: height,
    });

    // Reload canvas with cropped image
    canvas.clear();

    // Reinitialize brush after clearing canvas
    const brush = new fabric.PencilBrush(canvas);
    brush.color = brushColor;
    brush.width = brushSize;
    canvas.freeDrawingBrush = brush;

    fabric.FabricImage.fromURL(croppedDataUrl, {
      crossOrigin: "anonymous",
    }).then((img) => {
      const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
      );
      img.scale(scale);
      img.set({
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: "center",
        originY: "center",
        selectable: false,
        evented: false,
      });
      canvas.add(img);
      setFabricImage(img);
      canvas.renderAll();
      saveHistory();
    });

    setCropMode(false);
    setCropRect(null);
  };

  // Add Text
  const addText = () => {
    const text = new fabric.IText("Double click to edit", {
      left: 100,
      top: 100,
      fontSize: 40,
      fill: "#000",
      fontFamily: "Arial",
      editable: true,
    });
    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    saveHistory();
  };

  // Add Shape (Rectangle)
  const addRectangle = () => {
    const rect = new fabric.Rect({
      left: 150,
      top: 150,
      width: 200,
      height: 150,
      fill: "transparent",
      stroke: brushColor,
      strokeWidth: 3,
    });
    fabricCanvasRef.current.add(rect);
    saveHistory();
  };

  // Add Circle
  const addCircle = () => {
    const circle = new fabric.Circle({
      left: 150,
      top: 150,
      radius: 75,
      fill: "transparent",
      stroke: brushColor,
      strokeWidth: 3,
    });
    fabricCanvasRef.current.add(circle);
    saveHistory();
  };

  // Toggle Drawing Mode - FIXED for v6
  const toggleDrawingMode = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const newDrawingMode = !drawingMode;
    setDrawingMode(newDrawingMode);

    // Make sure brush exists before toggling
    if (!canvas.freeDrawingBrush) {
      const brush = new fabric.PencilBrush(canvas);
      brush.color = brushColor;
      brush.width = brushSize;
      canvas.freeDrawingBrush = brush;
    }

    canvas.isDrawingMode = newDrawingMode;

    if (newDrawingMode) {
      canvas.freeDrawingBrush.color = brushColor;
      canvas.freeDrawingBrush.width = brushSize;

      // Save after each path is created
      canvas.on("path:created", () => {
        saveHistory();
      });
    } else {
      canvas.off("path:created");
    }
  };

  // Update brush settings - FIXED for v6
  useEffect(() => {
    if (fabricCanvasRef.current) {
      // Ensure brush exists
      if (!fabricCanvasRef.current.freeDrawingBrush) {
        const brush = new fabric.PencilBrush(fabricCanvasRef.current);
        fabricCanvasRef.current.freeDrawingBrush = brush;
      }

      // Update brush properties
      fabricCanvasRef.current.freeDrawingBrush.color = brushColor;
      fabricCanvasRef.current.freeDrawingBrush.width = brushSize;
    }
  }, [brushColor, brushSize]);

  // Preset Filters
  const applyPresetFilter = (filterName) => {
    if (!fabricImage) return;

    let filters = [];

    switch (filterName) {
      case "grayscale":
        filters.push(new fabric.filters.Grayscale());
        break;
      case "sepia":
        filters.push(new fabric.filters.Sepia());
        break;
      case "invert":
        filters.push(new fabric.filters.Invert());
        break;
      case "vintage":
        filters.push(
          new fabric.filters.Sepia(),
          new fabric.filters.Brightness({ brightness: 0.1 }),
          new fabric.filters.Contrast({ contrast: -0.1 })
        );
        break;
      case "warm":
        filters.push(
          new fabric.filters.HueRotation({ rotation: 0.05 }),
          new fabric.filters.Saturation({ saturation: 0.2 })
        );
        break;
      case "cool":
        filters.push(
          new fabric.filters.HueRotation({ rotation: -0.05 }),
          new fabric.filters.Saturation({ saturation: 0.1 })
        );
        break;
      default:
        break;
    }

    fabricImage.filters = filters;
    fabricImage.applyFilters();
    fabricCanvasRef.current.renderAll();
    saveHistory();
  };

  // Reset all adjustments
  const resetControls = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setHue(0);

    if (fabricImage) {
      fabricImage.filters = [];
      fabricImage.applyFilters();
      fabricCanvasRef.current.renderAll();
    }
  };

  // Delete selected object
  const deleteSelected = () => {
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject && activeObject !== fabricImage) {
      fabricCanvasRef.current.remove(activeObject);
      saveHistory();
    }
  };

  // Flip Horizontal
  const flipHorizontal = () => {
    if (!fabricImage) return;
    fabricImage.set("flipX", !fabricImage.flipX);
    fabricCanvasRef.current.renderAll();
    saveHistory();
  };

  // Flip Vertical
  const flipVertical = () => {
    if (!fabricImage) return;
    fabricImage.set("flipY", !fabricImage.flipY);
    fabricCanvasRef.current.renderAll();
    saveHistory();
  };

  // Rotate Image
  const rotateImage = (angle) => {
    if (!fabricImage) return;
    fabricImage.rotate((fabricImage.angle + angle) % 360);
    fabricCanvasRef.current.renderAll();
    saveHistory();
  };

  // Apply and move to next photo
  const applyEdits = () => {
    const canvas = fabricCanvasRef.current;
    const editedDataUrl = canvas.toDataURL({
      format: "jpeg",
      quality: 0.95,
    });

    const updatedPhotos = [...uploadedPhotos];
    updatedPhotos[currentPhotoIndex] = {
      raw: currentPhoto.raw,
      filtered: editedDataUrl,
    };

    if (currentPhotoIndex < uploadedPhotos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
      resetControls();
    } else {
      setPhotosTaken(updatedPhotos);
      setStep("preview");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1400px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <div style={{ width: "100%", marginBottom: "20px", textAlign: "center" }}>
        <h2
          style={{
            background: `linear-gradient(135deg, ${COLORS.DEEP_BLUE} 0%, ${COLORS.PRIMARY_BLUE} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "28px",
            fontWeight: "700",
            marginBottom: "8px",
          }}
        >
          Professional Editor - Photo {currentPhotoIndex + 1} of{" "}
          {uploadedPhotos.length}
        </h2>

        {/* Undo/Redo Buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            marginTop: "12px",
          }}
        >
          <button
            onClick={undo}
            disabled={historyStep <= 0}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "2px solid " + COLORS.PRIMARY_BLUE,
              background: COLORS.BASE_WHITE,
              cursor: historyStep <= 0 ? "not-allowed" : "pointer",
              opacity: historyStep <= 0 ? 0.5 : 1,
              fontWeight: "600",
            }}
          >
            ↶ Undo
          </button>
          <button
            onClick={redo}
            disabled={historyStep >= history.length - 1}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "2px solid " + COLORS.PRIMARY_BLUE,
              background: COLORS.BASE_WHITE,
              cursor:
                historyStep >= history.length - 1 ? "not-allowed" : "pointer",
              opacity: historyStep >= history.length - 1 ? 0.5 : 1,
              fontWeight: "600",
            }}
          >
            ↷ Redo
          </button>
          <button
            onClick={deleteSelected}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "2px solid #e74c3c",
              background: COLORS.BASE_WHITE,
              color: "#e74c3c",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px", width: "100%" }}>
        {/* Canvas */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#2c3e50",
            borderRadius: "16px",
            padding: "20px",
            minHeight: "600px",
          }}
        >
          <canvas ref={canvasRef} />
        </div>

        {/* Controls Panel */}
        <div
          style={{
            width: "360px",
            background: COLORS.BASE_WHITE,
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            maxHeight: "700px",
            overflowY: "auto",
          }}
        >
          {/* Tab Navigation */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "20px",
              borderBottom: "2px solid " + COLORS.LIGHT_GREY,
              paddingBottom: "8px",
            }}
          >
            {["adjust", "filters", "crop", "draw", "text"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "8px",
                  border: "none",
                  background:
                    activeTab === tab ? COLORS.PRIMARY_BLUE : "transparent",
                  color:
                    activeTab === tab ? COLORS.BASE_WHITE : COLORS.DEEP_BLUE,
                  fontWeight: "600",
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Adjust Tab */}
          {activeTab === "adjust" && (
            <div>
              <h3 style={{ marginBottom: "16px", color: COLORS.DEEP_BLUE }}>
                Adjustments
              </h3>

              {/* Brightness */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  ☀️ Brightness: {brightness}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>

              {/* Contrast */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  ◐ Contrast: {contrast}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>

              {/* Saturation */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  🎨 Saturation: {saturation}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>

              {/* Blur */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  〰️ Blur: {blur}
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={blur}
                  onChange={(e) => setBlur(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>

              {/* Hue */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  🌈 Hue Rotation: {hue}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hue}
                  onChange={(e) => setHue(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>

              {/* Transform Buttons */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                  marginTop: "16px",
                }}
              >
                <button
                  onClick={() => rotateImage(90)}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "2px solid " + COLORS.PRIMARY_BLUE,
                    background: COLORS.BASE_WHITE,
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  ↻ Rotate 90°
                </button>
                <button
                  onClick={() => rotateImage(-90)}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "2px solid " + COLORS.PRIMARY_BLUE,
                    background: COLORS.BASE_WHITE,
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  ↺ Rotate -90°
                </button>
                <button
                  onClick={flipHorizontal}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "2px solid " + COLORS.PRIMARY_BLUE,
                    background: COLORS.BASE_WHITE,
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  ↔️ Flip H
                </button>
                <button
                  onClick={flipVertical}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "2px solid " + COLORS.PRIMARY_BLUE,
                    background: COLORS.BASE_WHITE,
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  ↕️ Flip V
                </button>
              </div>

              <button
                onClick={resetControls}
                style={{
                  ...btnSecondary,
                  width: "100%",
                  marginTop: "16px",
                }}
              >
                Reset All
              </button>
            </div>
          )}

          {/* Filters Tab */}
          {activeTab === "filters" && (
            <div>
              <h3 style={{ marginBottom: "16px", color: COLORS.DEEP_BLUE }}>
                Preset Filters
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                {[
                  { name: "None", value: "none" },
                  { name: "Grayscale", value: "grayscale" },
                  { name: "Sepia", value: "sepia" },
                  { name: "Invert", value: "invert" },
                  { name: "Vintage", value: "vintage" },
                  { name: "Warm", value: "warm" },
                  { name: "Cool", value: "cool" },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() =>
                      filter.value === "none"
                        ? resetControls()
                        : applyPresetFilter(filter.value)
                    }
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: "2px solid " + COLORS.PRIMARY_BLUE,
                      background: COLORS.BASE_WHITE,
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Crop Tab */}
          {activeTab === "crop" && (
            <div>
              <h3 style={{ marginBottom: "16px", color: COLORS.DEEP_BLUE }}>
                Crop Image
              </h3>
              {!cropMode ? (
                <button
                  onClick={enableCropMode}
                  style={{
                    ...btnPrimary,
                    width: "100%",
                  }}
                >
                  ✂️ Start Cropping
                </button>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <button
                    onClick={applyCrop}
                    style={{
                      ...btnPrimary,
                      width: "100%",
                    }}
                  >
                    ✓ Apply Crop
                  </button>
                  <button
                    onClick={() => {
                      if (cropRect) {
                        fabricCanvasRef.current.remove(cropRect);
                        setCropRect(null);
                      }
                      setCropMode(false);
                    }}
                    style={{
                      ...btnSecondary,
                      width: "100%",
                    }}
                  >
                    ✕ Cancel
                  </button>
                </div>
              )}
              <p style={{ marginTop: "12px", fontSize: "13px", color: "#666" }}>
                Drag and resize the crop area, then click Apply Crop
              </p>
            </div>
          )}

          {/* Draw Tab */}
          {activeTab === "draw" && (
            <div>
              <h3 style={{ marginBottom: "16px", color: COLORS.DEEP_BLUE }}>
                Drawing Tools
              </h3>

              {/* Drawing Mode Toggle */}
              <button
                onClick={toggleDrawingMode}
                style={{
                  ...btnPrimary,
                  width: "100%",
                  marginBottom: "16px",
                  background: drawingMode ? "#e74c3c" : COLORS.PRIMARY_BLUE,
                }}
              >
                {drawingMode ? "🛑 Stop Drawing" : "✏️ Start Drawing"}
              </button>

              {/* Brush Color */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                  }}
                >
                  Brush Color
                </label>
                <input
                  type="color"
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                  style={{ width: "100%", height: "40px", cursor: "pointer" }}
                />
              </div>

              {/* Brush Size */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                  }}
                >
                  Brush Size: {brushSize}px
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>

              <h4 style={{ marginTop: "20px", marginBottom: "12px" }}>
                Add Shapes
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                }}
              >
                <button
                  onClick={addRectangle}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "2px solid " + COLORS.PRIMARY_BLUE,
                    background: COLORS.BASE_WHITE,
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  ▭ Rectangle
                </button>
                <button
                  onClick={addCircle}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "2px solid " + COLORS.PRIMARY_BLUE,
                    background: COLORS.BASE_WHITE,
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  ● Circle
                </button>
              </div>
            </div>
          )}

          {/* Text Tab */}
          {activeTab === "text" && (
            <div>
              <h3 style={{ marginBottom: "16px", color: COLORS.DEEP_BLUE }}>
                Add Text
              </h3>
              <button
                onClick={addText}
                style={{
                  ...btnPrimary,
                  width: "100%",
                }}
              >
                + Add Text
              </button>
              <p style={{ marginTop: "12px", fontSize: "13px", color: "#666" }}>
                Double-click on the text to edit. Drag to move. Use handles to
                resize.
              </p>
            </div>
          )}

          {/* Apply Button */}
          <button
            onClick={applyEdits}
            style={{
              ...btnPrimary,
              width: "100%",
              marginTop: "24px",
              padding: "14px",
              fontSize: "16px",
            }}
          >
            {currentPhotoIndex < uploadedPhotos.length - 1
              ? "Next Photo →"
              : "Finish Editing ✓"}
          </button>
        </div>
      </div>
    </div>
  );
}
