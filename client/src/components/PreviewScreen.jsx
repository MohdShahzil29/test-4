// import { useState } from "react";
// import { uploadWithTransform } from "../../utils/cloudinaryApi";

// export default function PreviewScreen({
//   layouts,
//   totalFrames,
//   getPhotosForFrames,
//   bgColor,
//   selectedRowIndex,
//   setSelectedRowIndex,
//   PRESET_BG_COLORS,
//   setBgColor,
//   filter,
//   setFilter,
//   applyFilterToAll,
//   handleProceedToPrintWholeSheet,
//   setPhotosTaken,
//   photosTaken,
//   setFilter: resetFilter,
//   lastAppliedFilterRef,
//   setStep,
//   btnPrimary,
//   btnSecondary,
//   btnFilter,
//   btnFilterSelected,
//   COLORS,
// }) {
//   const [uploadStatus, setUploadStatus] = useState("");
//   const [filterUploadQueue, setFilterUploadQueue] = useState([]);
//   const [isUploading, setIsUploading] = useState(false);

//   // ✅ Apply Filter + Upload Filtered Images
//   const handleApplyFilterAndUpload = async () => {
//     setIsUploading(true);
//     setUploadStatus("Applying filter...");

//     // Pehle filter apply karo locally
//     await applyFilterToAll();

//     // Ab filtered images ko Cloudinary pe upload karo
//     try {
//       setUploadStatus("☁️ Uploading filtered photos...");
//       console.log(`📤 Uploading ${photosTaken.length} filtered images...`);

//       const uploadPromises = photosTaken.map(async (photo, index) => {
//         try {
//           const base64Image = photo.filtered || photo.raw;

//           const result = await uploadWithTransform(base64Image, {
//             folder: "photo-booth/filtered",
//             filter: filter === "none" ? undefined : filter,
//             width: 1280,
//             height: 720,
//           });

//           if (result.success) {
//             console.log(
//               `✅ Filtered photo ${index + 1} uploaded:`,
//               result.data.url
//             );
//             setFilterUploadQueue((prev) => [...prev, index]);
//             return result.data;
//           }
//         } catch (error) {
//           console.error(
//             `❌ Filtered upload failed for photo ${index + 1}:`,
//             error
//           );
//           return null;
//         }
//       });

//       const results = await Promise.all(uploadPromises);
//       const successCount = results.filter((r) => r !== null).length;

//       setUploadStatus(
//         `✓ ${successCount}/${photosTaken?.length} filtered photos uploaded`
//       );
//       setTimeout(() => setUploadStatus(""), 3000);
//     } catch (error) {
//       console.error("❌ Filtered upload error:", error);
//       setUploadStatus("❌ Filtered upload failed");
//       setTimeout(() => setUploadStatus(""), 3000);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         width: "100%",
//         maxWidth: "1200px",
//         padding: "20px",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//       }}
//     >
//       {/* Upload Status Toast */}
//       {uploadStatus && (
//         <div
//           style={{
//             position: "fixed",
//             top: "20px",
//             right: "20px",
//             padding: "12px 24px",
//             background: `linear-gradient(135deg, ${COLORS.ACCENT_YELLOW} 0%, #ffd700 100%)`,
//             borderRadius: "12px",
//             fontSize: "14px",
//             fontWeight: "700",
//             color: COLORS.TEXT_BLACK,
//             boxShadow: `0 8px 24px ${COLORS.ACCENT_YELLOW}40`,
//             zIndex: 1000,
//             animation: "slideIn 0.3s ease-out",
//           }}
//         >
//           {uploadStatus}
//         </div>
//       )}

//       <h2 style={{ color: COLORS.TEXT_BLACK, marginBottom: "20px" }}>
//         Preview
//       </h2>

//       <div
//         style={{
//           display: "flex",
//           flexWrap: "wrap",
//           justifyContent: "center",
//           gap: "40px",
//           width: "100%",
//         }}
//       >
//         {/* Preview Section */}
//         <div
//           style={{
//             flex: "1",
//             minWidth: "300px",
//             maxWidth: "500px",
//             display: "flex",
//             justifyContent: "center",
//           }}
//         >
//           {(() => {
//             const usingLayout = layouts.vertical[totalFrames];
//             if (!usingLayout) return <div>Invalid layout</div>;
//             const expanded = getPhotosForFrames();
//             const numCols = usingLayout.numCols;
//             const numRows = usingLayout.numRows;
//             return (
//               <div
//                 style={{
//                   width: "100%",
//                   maxWidth: 500,
//                   aspectRatio: `${usingLayout.finalWidth}/${usingLayout.finalHeight}`,
//                   backgroundColor: bgColor,
//                   padding: 20,
//                   boxSizing: "border-box",
//                   borderRadius: 10,
//                   boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: `repeat(${numCols}, 1fr)`,
//                     gridTemplateRows: `repeat(${numRows}, 1fr)`,
//                     gap: 20,
//                     width: "100%",
//                     height: "100%",
//                   }}
//                 >
//                   {Array.from({ length: totalFrames }).map((_, i) => {
//                     const src = expanded[i];
//                     const row = Math.floor(i / numCols);
//                     const isSelected = selectedRowIndex === row;
//                     return (
//                       <div
//                         key={i}
//                         onClick={() => setSelectedRowIndex(row)}
//                         style={{
//                           width: "100%",
//                           height: "100%",
//                           backgroundColor: COLORS.LIGHT_GREY,
//                           borderRadius: 5,
//                           overflow: "hidden",
//                           boxSizing: "border-box",
//                           border: isSelected
//                             ? `4px solid ${COLORS.DEEP_BLUE}`
//                             : "4px solid transparent",
//                           transition: "border 140ms ease",
//                           cursor: "pointer",
//                         }}
//                       >
//                         {src ? (
//                           <img
//                             src={src}
//                             alt={`Photo ${i + 1}`}
//                             style={{
//                               width: "100%",
//                               height: "100%",
//                               objectFit: "cover",
//                               pointerEvents: "none",
//                             }}
//                           />
//                         ) : (
//                           <div
//                             style={{
//                               width: "100%",
//                               height: "100%",
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               color: "#9aa0a6",
//                             }}
//                           >
//                             Empty
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             );
//           })()}
//         </div>

//         {/* Customize Section */}
//         <div
//           style={{
//             flex: "1",
//             minWidth: "250px",
//             maxWidth: "300px",
//             padding: "20px",
//             backgroundColor: COLORS.LIGHT_GREY,
//             borderRadius: "10px",
//             boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
//           }}
//         >
//           <h3 style={{ color: COLORS.TEXT_BLACK, marginBottom: "20px" }}>
//             Customize
//           </h3>

//           {/* Background Color Section */}
//           <div style={{ marginBottom: "20px" }}>
//             <label
//               style={{
//                 display: "block",
//                 marginBottom: "8px",
//                 color: COLORS.TEXT_BLACK,
//               }}
//             >
//               Background Color
//             </label>
//             <div
//               style={{
//                 display: "flex",
//                 gap: "8px",
//                 flexWrap: "wrap",
//                 marginBottom: "10px",
//               }}
//             >
//               {PRESET_BG_COLORS.map((c) => (
//                 <button
//                   key={c.value}
//                   aria-label={`Set background ${c.name}`}
//                   title={c.name}
//                   onClick={() => setBgColor(c.value)}
//                   className={`bg-preset-btn ${
//                     bgColor.toLowerCase() === c.value.toLowerCase()
//                       ? "selected"
//                       : ""
//                   }`}
//                   style={{ background: c.value }}
//                 />
//               ))}
//             </div>
//             <input
//               type="color"
//               value={bgColor}
//               onChange={(e) => setBgColor(e.target.value)}
//               style={{
//                 width: "100%",
//                 height: "40px",
//                 borderRadius: "5px",
//                 border: "1px solid #ccc",
//               }}
//             />
//             <div style={{ marginTop: "8px", fontSize: "12px", color: "#555" }}>
//               Tip: tap a preset for quick look — use the color picker for
//               fine-tuning.
//             </div>
//           </div>

//           {/* Filter Section */}
//           <div style={{ marginBottom: "20px", color: COLORS.TEXT_BLACK }}>
//             <label
//               style={{
//                 display: "block",
//                 marginBottom: "8px",
//                 color: COLORS.TEXT_BLACK,
//               }}
//             >
//               Filter
//             </label>
//             <div style={{ display: "flex", flexWrap: "wrap" }}>
//               <button
//                 onClick={() => setFilter("none")}
//                 style={filter === "none" ? btnFilterSelected : btnFilter}
//               >
//                 None
//               </button>
//               <button
//                 onClick={() => setFilter("burnt-coffee")}
//                 style={
//                   filter === "burnt-coffee" ? btnFilterSelected : btnFilter
//                 }
//               >
//                 Burnt Coffee
//               </button>
//               <button
//                 onClick={() => setFilter("ocean-wave")}
//                 style={filter === "ocean-wave" ? btnFilterSelected : btnFilter}
//               >
//                 Ocean Wave
//               </button>
//               <button
//                 onClick={() => setFilter("old-wood")}
//                 style={filter === "old-wood" ? btnFilterSelected : btnFilter}
//               >
//                 Old Wood
//               </button>
//               <button
//                 onClick={() => setFilter("vintage-may")}
//                 style={filter === "vintage-may" ? btnFilterSelected : btnFilter}
//               >
//                 Vintage May
//               </button>
//               <button
//                 onClick={() => setFilter("bw")}
//                 style={filter === "bw" ? btnFilterSelected : btnFilter}
//               >
//                 B & W
//               </button>
//             </div>
//           </div>

//           {/* Upload Progress Indicator */}
//           {filterUploadQueue?.length > 0 && (
//             <div
//               style={{
//                 padding: "8px 12px",
//                 background: `${COLORS.PRIMARY_BLUE}20`,
//                 borderRadius: "8px",
//                 fontSize: "13px",
//                 fontWeight: "600",
//                 textAlign: "center",
//                 marginBottom: "15px",
//                 color: COLORS.DEEP_BLUE,
//               }}
//             >
//               ☁️ {filterUploadQueue?.length}/{photosTaken?.length} filtered
//               photos saved
//             </div>
//           )}

//           {/* Other Buttons */}
//           <button
//             onClick={handleProceedToPrintWholeSheet}
//             style={{ ...btnPrimary, width: "100%", marginBottom: "15px" }}
//           >
//             Proceed to Print (whole sheet)
//           </button>
//         </div>
//       </div>

//       {/* CSS Animation */}
//       <style>
//         {`
//           @keyframes slideIn {
//             from {
//               opacity: 0;
//               transform: translateX(20px);
//             }
//             to {
//               opacity: 1;
//               transform: translateX(0);
//             }
//           }
//         `}
//       </style>
//     </div>
//   );
// }

import { useState } from "react";
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

  // ✅ Apply Filter + Upload Filtered Images
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

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${COLORS.BASE_WHITE} 0%, ${COLORS.LIGHT_BACKGROUND}25 50%, ${COLORS.BASE_WHITE} 100%)`,
        position: "relative",
        overflow: "hidden",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* Animated background blobs */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.PRIMARY_BLUE}12 0%, transparent 70%)`,
          filter: "blur(80px)",
          zIndex: 0,
          animation: "float 20s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-150px",
          left: "-150px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.ACCENT_YELLOW}10 0%, transparent 70%)`,
          filter: "blur(90px)",
          zIndex: 0,
          animation: "float 25s ease-in-out infinite reverse",
        }}
      />

      {/* Upload Status Toast */}
      {uploadStatus && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "12px 20px",
            background: `linear-gradient(135deg, ${COLORS.ACCENT_YELLOW} 0%, #ffd700 100%)`,
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: "700",
            color: COLORS.TEXT_BLACK,
            boxShadow: `0 8px 24px ${COLORS.ACCENT_YELLOW}50,
                        0 0 0 1px ${COLORS.ACCENT_YELLOW}60,
                        inset 0 1px 0 rgba(255, 255, 255, 0.7)`,
            zIndex: 1000,
            animation: "slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: COLORS.DEEP_BLUE,
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          {uploadStatus}
        </div>
      )}

      {/* Content Container - Compact */}
      <div
        style={{
          width: "100%",
          maxWidth: "1400px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Compact Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            animation: "fadeInDown 0.6s ease-out",
          }}
        >
          <h1
            style={{
              background: `linear-gradient(135deg, ${COLORS.DEEP_BLUE} 0%, ${COLORS.PRIMARY_BLUE} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: "28px",
              fontWeight: "800",
              marginBottom: "6px",
              letterSpacing: "-0.8px",
            }}
          >
            Preview & Customize
          </h1>
          <p
            style={{
              color: "#5a6c7d",
              fontSize: "14px",
              fontWeight: "500",
              margin: 0,
              letterSpacing: "0.2px",
            }}
          >
            Fine-tune your photo strip with filters and colors
          </p>
        </div>

        {/* Main Content - Optimized Height */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "stretch",
            justifyContent: "center",
            flex: 1,
            width: "100%",
            minHeight: 0,
          }}
        >
          {/* Preview Section - Compact */}
          <div
            style={{
              flex: "1 1 50%",
              maxWidth: "600px",
              display: "flex",
              flexDirection: "column",
              animation: "fadeInLeft 0.6s ease-out",
            }}
          >
            <div
              style={{
                background: `linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)`,
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                borderRadius: "20px",
                padding: "20px",
                boxShadow: `0 15px 40px rgba(0, 0, 0, 0.12),
                            0 0 0 1px rgba(255, 255, 255, 0.8),
                            inset 0 1px 0 rgba(255, 255, 255, 1)`,
                border: `2px solid rgba(255, 255, 255, 0.5)`,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Compact Label */}
              <div
                style={{
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${COLORS.ACCENT_YELLOW} 0%, #ffd700 100%)`,
                    boxShadow: `0 0 12px ${COLORS.ACCENT_YELLOW}80`,
                  }}
                />
                <h3
                  style={{
                    color: COLORS.TEXT_BLACK,
                    fontSize: "18px",
                    fontWeight: "800",
                    margin: 0,
                    letterSpacing: "-0.4px",
                  }}
                >
                  Your Photo Strip
                </h3>
              </div>

              {/* Preview Display */}
              {(() => {
                const usingLayout = layouts.vertical[totalFrames];
                if (!usingLayout) return <div>Invalid layout</div>;
                const expanded = getPhotosForFrames();
                const numCols = usingLayout.numCols;
                const numRows = usingLayout.numRows;
                return (
                  <div
                    style={{
                      width: "100%",
                      flex: 1,
                      backgroundColor: bgColor,
                      padding: "18px",
                      boxSizing: "border-box",
                      borderRadius: "14px",
                      boxShadow: `0 10px 28px rgba(0, 0, 0, 0.15),
                                  inset 0 2px 0 rgba(255, 255, 255, 0.3)`,
                      transition: "background-color 0.4s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        maxHeight: "100%",
                        aspectRatio: `${usingLayout.finalWidth}/${usingLayout.finalHeight}`,
                        display: "grid",
                        gridTemplateColumns: `repeat(${numCols}, 1fr)`,
                        gridTemplateRows: `repeat(${numRows}, 1fr)`,
                        gap: "14px",
                      }}
                    >
                      {Array.from({ length: totalFrames }).map((_, i) => {
                        const src = expanded[i];
                        const row = Math.floor(i / numCols);
                        const isSelected = selectedRowIndex === row;
                        return (
                          <div
                            key={i}
                            onClick={() => setSelectedRowIndex(row)}
                            style={{
                              width: "100%",
                              height: "100%",
                              backgroundColor: "#f0f0f0",
                              borderRadius: "8px",
                              overflow: "hidden",
                              boxSizing: "border-box",
                              border: isSelected
                                ? `3px solid ${COLORS.ACCENT_YELLOW}`
                                : "3px solid transparent",
                              boxShadow: isSelected
                                ? `0 6px 20px ${COLORS.ACCENT_YELLOW}40,
                                   0 0 0 1px ${COLORS.ACCENT_YELLOW}60`
                                : "0 3px 10px rgba(0, 0, 0, 0.08)",
                              transition:
                                "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                              cursor: "pointer",
                              transform: isSelected
                                ? "scale(0.98)"
                                : "scale(1)",
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.transform = "scale(1.02)";
                                e.currentTarget.style.boxShadow =
                                  "0 6px 16px rgba(0, 0, 0, 0.15)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.boxShadow =
                                  "0 3px 10px rgba(0, 0, 0, 0.08)";
                              }
                            }}
                          >
                            {src ? (
                              <img
                                src={src}
                                alt={`Photo ${i + 1}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  pointerEvents: "none",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "#9aa0a6",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                }}
                              >
                                Empty
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Customize Sidebar - Compact & Scrollable */}
          <div
            style={{
              flex: "1 1 40%",
              maxWidth: "380px",
              display: "flex",
              flexDirection: "column",
              animation: "fadeInRight 0.6s ease-out",
              minHeight: 0,
            }}
          >
            <div
              style={{
                background: `linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)`,
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                borderRadius: "20px",
                padding: "20px",
                boxShadow: `0 15px 40px rgba(0, 0, 0, 0.12),
                            0 0 0 1px rgba(255, 255, 255, 0.8),
                            inset 0 1px 0 rgba(255, 255, 255, 1)`,
                border: `2px solid rgba(255, 255, 255, 0.5)`,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Sidebar Header */}
              <div
                style={{
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${COLORS.PRIMARY_BLUE} 0%, ${COLORS.DEEP_BLUE} 100%)`,
                    boxShadow: `0 0 12px ${COLORS.PRIMARY_BLUE}80`,
                  }}
                />
                <h3
                  style={{
                    color: COLORS.TEXT_BLACK,
                    fontSize: "18px",
                    fontWeight: "800",
                    margin: 0,
                    letterSpacing: "-0.4px",
                  }}
                >
                  Customize
                </h3>
              </div>

              {/* Scrollable Content */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  overflowX: "hidden",
                  paddingRight: "8px",
                  marginRight: "-8px",
                }}
              >
                {/* Background Color Section */}
                <div style={{ marginBottom: "24px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "12px",
                      color: COLORS.TEXT_BLACK,
                      fontSize: "14px",
                      fontWeight: "700",
                      letterSpacing: "-0.2px",
                    }}
                  >
                    Background Color
                  </label>

                  {/* Color Presets Grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "10px",
                      marginBottom: "12px",
                    }}
                  >
                    {PRESET_BG_COLORS.map((c) => {
                      const isActive =
                        bgColor.toLowerCase() === c.value.toLowerCase();
                      return (
                        <button
                          key={c.value}
                          aria-label={`Set background ${c.name}`}
                          title={c.name}
                          onClick={() => setBgColor(c.value)}
                          style={{
                            width: "100%",
                            aspectRatio: "1",
                            borderRadius: "10px",
                            border: isActive
                              ? `3px solid ${COLORS.ACCENT_YELLOW}`
                              : "3px solid #e0e0e0",
                            background: c.value,
                            cursor: "pointer",
                            transition:
                              "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                            boxShadow: isActive
                              ? `0 6px 16px ${COLORS.ACCENT_YELLOW}40,
                                 0 0 0 1px ${COLORS.ACCENT_YELLOW}30`
                              : "0 3px 10px rgba(0, 0, 0, 0.08)",
                            transform: isActive ? "scale(1.05)" : "scale(1)",
                            outline: "none",
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.transform = "scale(1.08)";
                              e.currentTarget.style.boxShadow =
                                "0 5px 14px rgba(0, 0, 0, 0.15)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.transform = "scale(1)";
                              e.currentTarget.style.boxShadow =
                                "0 3px 10px rgba(0, 0, 0, 0.08)";
                            }
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Custom Color Picker */}
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    style={{
                      width: "100%",
                      height: "42px",
                      borderRadius: "10px",
                      border: `2px solid ${COLORS.LIGHT_GREY}`,
                      cursor: "pointer",
                      boxShadow: "0 3px 10px rgba(0, 0, 0, 0.08)",
                      marginBottom: "10px",
                    }}
                  />
                  <div
                    style={{
                      padding: "10px 14px",
                      background: `${COLORS.LIGHT_BACKGROUND}30`,
                      borderRadius: "8px",
                      fontSize: "11px",
                      color: "#5a6c7d",
                      fontWeight: "500",
                      lineHeight: "1.4",
                      border: `1px solid ${COLORS.PRIMARY_BLUE}20`,
                    }}
                  >
                    💡 Tap preset or use picker
                  </div>
                </div>

                {/* Filter Section */}
                <div style={{ marginBottom: "24px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "12px",
                      color: COLORS.TEXT_BLACK,
                      fontSize: "14px",
                      fontWeight: "700",
                      letterSpacing: "-0.2px",
                    }}
                  >
                    Photo Filter
                  </label>

                  {/* Filter Buttons Grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "10px",
                    }}
                  >
                    {[
                      { value: "none", label: "None" },
                      { value: "burnt-coffee", label: "Burnt Coffee" },
                      { value: "ocean-wave", label: "Ocean Wave" },
                      { value: "old-wood", label: "Old Wood" },
                      { value: "vintage-may", label: "Vintage May" },
                      { value: "bw", label: "B & W" },
                    ].map((filterOption) => {
                      const isActive = filter === filterOption.value;
                      return (
                        <button
                          key={filterOption.value}
                          onClick={() => setFilter(filterOption.value)}
                          style={{
                            padding: "12px 16px",
                            borderRadius: "10px",
                            border: isActive
                              ? `3px solid ${COLORS.ACCENT_YELLOW}`
                              : `2px solid ${COLORS.LIGHT_GREY}`,
                            background: isActive
                              ? `linear-gradient(135deg, ${COLORS.ACCENT_YELLOW} 0%, #ffd700 100%)`
                              : `linear-gradient(135deg, ${COLORS.BASE_WHITE} 0%, ${COLORS.LIGHT_GREY}40 100%)`,
                            color: COLORS.TEXT_BLACK,
                            fontSize: "12px",
                            fontWeight: isActive ? "800" : "600",
                            cursor: "pointer",
                            transition:
                              "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                            boxShadow: isActive
                              ? `0 6px 16px ${COLORS.ACCENT_YELLOW}35,
                                 0 0 0 1px ${COLORS.ACCENT_YELLOW}40`
                              : "0 3px 10px rgba(0, 0, 0, 0.06)",
                            transform: isActive ? "scale(1.02)" : "scale(1)",
                            outline: "none",
                            letterSpacing: "0.2px",
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.transform = "scale(1.05)";
                              e.currentTarget.style.boxShadow =
                                "0 5px 14px rgba(0, 0, 0, 0.12)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.transform = "scale(1)";
                              e.currentTarget.style.boxShadow =
                                "0 3px 10px rgba(0, 0, 0, 0.06)";
                            }
                          }}
                        >
                          {filterOption.label}
                          {isActive && (
                            <span
                              style={{ marginLeft: "5px", fontSize: "11px" }}
                            >
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Upload Progress Indicator */}
                {filterUploadQueue?.length > 0 && (
                  <div
                    style={{
                      padding: "14px 18px",
                      background: `linear-gradient(135deg, ${COLORS.PRIMARY_BLUE}15 0%, ${COLORS.PRIMARY_BLUE}08 100%)`,
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "700",
                      textAlign: "center",
                      marginBottom: "20px",
                      color: COLORS.DEEP_BLUE,
                      border: `2px solid ${COLORS.PRIMARY_BLUE}25`,
                      boxShadow: "0 3px 10px rgba(0, 0, 0, 0.06)",
                      animation: "slideUp 0.4s ease-out",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: COLORS.ACCENT_YELLOW,
                          animation: "pulse 2s ease-in-out infinite",
                        }}
                      />
                      ☁️ {filterUploadQueue?.length}/{photosTaken?.length} saved
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={handleProceedToPrintWholeSheet}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-3px) scale(1.02)";
                    e.currentTarget.style.boxShadow = `0 14px 35px ${COLORS.DEEP_BLUE}45`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow = `0 8px 24px ${COLORS.DEEP_BLUE}40`;
                  }}
                  style={{
                    width: "100%",
                    padding: "16px 28px",
                    fontSize: "15px",
                    fontWeight: "800",
                    borderRadius: "12px",
                    border: "none",
                    background: `linear-gradient(135deg, ${COLORS.DEEP_BLUE} 0%, ${COLORS.PRIMARY_BLUE} 100%)`,
                    color: COLORS.BASE_WHITE,
                    cursor: "pointer",
                    boxShadow: `0 8px 24px ${COLORS.DEEP_BLUE}40,
                                inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
                    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    letterSpacing: "0.5px",
                    outline: "none",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                      animation: "shimmer 3s infinite",
                    }}
                  />
                  <span style={{ position: "relative", zIndex: 1 }}>
                    Continue to Print →
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
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
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(1.2);
            }
          }
          
          @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translate(0, 0);
            }
            50% {
              transform: translate(30px, -30px);
            }
          }
        `}
      </style>
    </div>
  );
}
