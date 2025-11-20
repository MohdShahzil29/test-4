// // import { useState } from "react";
// // import { uploadWithTransform } from "../../utils/cloudinaryApi";

// // export default function PreviewScreen({
// //   layouts,
// //   totalFrames,
// //   getPhotosForFrames,
// //   bgColor,
// //   selectedRowIndex,
// //   setSelectedRowIndex,
// //   PRESET_BG_COLORS,
// //   setBgColor,
// //   filter,
// //   setFilter,
// //   applyFilterToAll,
// //   handleProceedToPrintWholeSheet,
// //   setPhotosTaken,
// //   photosTaken,
// //   setFilter: resetFilter,
// //   lastAppliedFilterRef,
// //   setStep,
// //   btnPrimary,
// //   btnSecondary,
// //   btnFilter,
// //   btnFilterSelected,
// //   COLORS,
// // }) {
// //   const [uploadStatus, setUploadStatus] = useState("");
// //   const [filterUploadQueue, setFilterUploadQueue] = useState([]);
// //   const [isUploading, setIsUploading] = useState(false);

// //   // ✅ NEW: Photo rotation states
// //   const [photoRotations, setPhotoRotations] = useState({});
// //   const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

// //   // ✅ Rotate left function
// //   const rotateLeft = () => {
// //     if (selectedPhotoIndex !== null) {
// //       setPhotoRotations((prev) => ({
// //         ...prev,
// //         [selectedPhotoIndex]:
// //           ((prev[selectedPhotoIndex] || 0) - 90 + 360) % 360,
// //       }));
// //     }
// //   };

// //   // ✅ Rotate right function
// //   const rotateRight = () => {
// //     if (selectedPhotoIndex !== null) {
// //       setPhotoRotations((prev) => ({
// //         ...prev,
// //         [selectedPhotoIndex]: ((prev[selectedPhotoIndex] || 0) + 90) % 360,
// //       }));
// //     }
// //   };

// //   // ✅ Apply Filter + Upload Filtered Images
// //   const handleApplyFilterAndUpload = async () => {
// //     setIsUploading(true);
// //     setUploadStatus("Applying filter...");

// //     await applyFilterToAll();

// //     try {
// //       setUploadStatus("☁️ Uploading filtered photos...");
// //       console.log(`📤 Uploading ${photosTaken.length} filtered images...`);

// //       const uploadPromises = photosTaken.map(async (photo, index) => {
// //         try {
// //           const base64Image = photo.filtered || photo.raw;

// //           const result = await uploadWithTransform(base64Image, {
// //             folder: "photo-booth/filtered",
// //             filter: filter === "none" ? undefined : filter,
// //             width: 1280,
// //             height: 720,
// //           });

// //           if (result.success) {
// //             console.log(
// //               `✅ Filtered photo ${index + 1} uploaded:`,
// //               result.data.url
// //             );
// //             setFilterUploadQueue((prev) => [...prev, index]);
// //             return result.data;
// //           }
// //         } catch (error) {
// //           console.error(
// //             `❌ Filtered upload failed for photo ${index + 1}:`,
// //             error
// //           );
// //           return null;
// //         }
// //       });

// //       const results = await Promise.all(uploadPromises);
// //       const successCount = results.filter((r) => r !== null).length;

// //       setUploadStatus(
// //         `✓ ${successCount}/${photosTaken?.length} filtered photos uploaded`
// //       );
// //       setTimeout(() => setUploadStatus(""), 3000);
// //     } catch (error) {
// //       console.error("❌ Filtered upload error:", error);
// //       setUploadStatus("❌ Filtered upload failed");
// //       setTimeout(() => setUploadStatus(""), 3000);
// //     } finally {
// //       setIsUploading(false);
// //     }
// //   };

// //   return (
// //     <div
// //       style={{
// //         width: "100vw",
// //         height: "100vh",
// //         display: "flex",
// //         flexDirection: "column",
// //         alignItems: "center",
// //         justifyContent: "center",
// //         background: `linear-gradient(135deg, ${COLORS.BASE_WHITE} 0%, ${COLORS.LIGHT_BACKGROUND}25 50%, ${COLORS.BASE_WHITE} 100%)`,
// //         position: "relative",
// //         overflow: "hidden",
// //         padding: "20px",
// //         boxSizing: "border-box",
// //       }}
// //     >
// //       {/* Animated background blobs */}
// //       <div
// //         style={{
// //           position: "absolute",
// //           top: "-100px",
// //           right: "-100px",
// //           width: "400px",
// //           height: "400px",
// //           borderRadius: "50%",
// //           background: `radial-gradient(circle, ${COLORS.PRIMARY_BLUE}12 0%, transparent 70%)`,
// //           filter: "blur(80px)",
// //           zIndex: 0,
// //           animation: "float 20s ease-in-out infinite",
// //         }}
// //       />
// //       <div
// //         style={{
// //           position: "absolute",
// //           bottom: "-150px",
// //           left: "-150px",
// //           width: "500px",
// //           height: "500px",
// //           borderRadius: "50%",
// //           background: `radial-gradient(circle, ${COLORS.ACCENT_YELLOW}10 0%, transparent 70%)`,
// //           filter: "blur(90px)",
// //           zIndex: 0,
// //           animation: "float 25s ease-in-out infinite reverse",
// //         }}
// //       />

// //       {/* Upload Status Toast */}
// //       {uploadStatus && (
// //         <div
// //           style={{
// //             position: "fixed",
// //             top: "20px",
// //             right: "20px",
// //             padding: "12px 20px",
// //             background: `linear-gradient(135deg, ${COLORS.ACCENT_YELLOW} 0%, #ffd700 100%)`,
// //             borderRadius: "12px",
// //             fontSize: "13px",
// //             fontWeight: "700",
// //             color: COLORS.TEXT_BLACK,
// //             boxShadow: `0 8px 24px ${COLORS.ACCENT_YELLOW}50,
// //                         0 0 0 1px ${COLORS.ACCENT_YELLOW}60,
// //                         inset 0 1px 0 rgba(255, 255, 255, 0.7)`,
// //             zIndex: 1000,
// //             animation: "slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
// //             backdropFilter: "blur(10px)",
// //             display: "flex",
// //             alignItems: "center",
// //             gap: "8px",
// //           }}
// //         >
// //           <div
// //             style={{
// //               width: "6px",
// //               height: "6px",
// //               borderRadius: "50%",
// //               background: COLORS.DEEP_BLUE,
// //               animation: "pulse 2s ease-in-out infinite",
// //             }}
// //           />
// //           {uploadStatus}
// //         </div>
// //       )}

// //       {/* Content Container - Compact */}
// //       <div
// //         style={{
// //           width: "100%",
// //           maxWidth: "1400px",
// //           height: "100%",
// //           display: "flex",
// //           flexDirection: "column",
// //           position: "relative",
// //           zIndex: 1,
// //         }}
// //       >
// //         {/* Compact Header */}
// //         <div
// //           style={{
// //             textAlign: "center",
// //             marginBottom: "20px",
// //             animation: "fadeInDown 0.6s ease-out",
// //           }}
// //         >
// //           <h1
// //             style={{
// //               background: `linear-gradient(135deg, ${COLORS.DEEP_BLUE} 0%, ${COLORS.PRIMARY_BLUE} 100%)`,
// //               WebkitBackgroundClip: "text",
// //               WebkitTextFillColor: "transparent",
// //               backgroundClip: "text",
// //               fontSize: "28px",
// //               fontWeight: "800",
// //               marginBottom: "6px",
// //               letterSpacing: "-0.8px",
// //             }}
// //           >
// //             Preview & Customize
// //           </h1>
// //           <p
// //             style={{
// //               color: "#5a6c7d",
// //               fontSize: "14px",
// //               fontWeight: "500",
// //               margin: 0,
// //               letterSpacing: "0.2px",
// //             }}
// //           >
// //             Fine-tune your photo strip with filters and colors
// //           </p>
// //         </div>

// //         {/* Main Content - Optimized Height */}
// //         <div
// //           style={{
// //             display: "flex",
// //             gap: "24px",
// //             alignItems: "stretch",
// //             justifyContent: "center",
// //             flex: 1,
// //             width: "100%",
// //             minHeight: 0,
// //           }}
// //         >
// //           {/* Preview Section - Compact */}
// //           <div
// //             style={{
// //               flex: "1 1 50%",
// //               maxWidth: "600px",
// //               display: "flex",
// //               flexDirection: "column",
// //               animation: "fadeInLeft 0.6s ease-out",
// //             }}
// //           >
// //             <div
// //               style={{
// //                 background: `linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)`,
// //                 backdropFilter: "blur(20px) saturate(180%)",
// //                 WebkitBackdropFilter: "blur(20px) saturate(180%)",
// //                 borderRadius: "20px",
// //                 padding: "20px",
// //                 boxShadow: `0 15px 40px rgba(0, 0, 0, 0.12),
// //                             0 0 0 1px rgba(255, 255, 255, 0.8),
// //                             inset 0 1px 0 rgba(255, 255, 255, 1)`,
// //                 border: `2px solid rgba(255, 255, 255, 0.5)`,
// //                 height: "100%",
// //                 display: "flex",
// //                 flexDirection: "column",
// //               }}
// //             >
// //               {/* Compact Label */}
// //               <div
// //                 style={{
// //                   marginBottom: "16px",
// //                   display: "flex",
// //                   alignItems: "center",
// //                   gap: "10px",
// //                 }}
// //               >
// //                 <div
// //                   style={{
// //                     width: "6px",
// //                     height: "6px",
// //                     borderRadius: "50%",
// //                     background: `linear-gradient(135deg, ${COLORS.ACCENT_YELLOW} 0%, #ffd700 100%)`,
// //                     boxShadow: `0 0 12px ${COLORS.ACCENT_YELLOW}80`,
// //                   }}
// //                 />
// //                 <h3
// //                   style={{
// //                     color: COLORS.TEXT_BLACK,
// //                     fontSize: "18px",
// //                     fontWeight: "800",
// //                     margin: 0,
// //                     letterSpacing: "-0.4px",
// //                   }}
// //                 >
// //                   Your Photo Strip
// //                 </h3>
// //               </div>

// //               {/* Preview Display */}
// //               {(() => {
// //                 const usingLayout = layouts.vertical[totalFrames];
// //                 if (!usingLayout) return <div>Invalid layout</div>;
// //                 const expanded = getPhotosForFrames();
// //                 const numCols = usingLayout.numCols;
// //                 const numRows = usingLayout.numRows;
// //                 return (
// //                   <div
// //                     style={{
// //                       width: "100%",
// //                       flex: 1,
// //                       backgroundColor: bgColor,
// //                       padding: "18px",
// //                       boxSizing: "border-box",
// //                       borderRadius: "14px",
// //                       boxShadow: `0 10px 28px rgba(0, 0, 0, 0.15),
// //                                   inset 0 2px 0 rgba(255, 255, 255, 0.3)`,
// //                       transition: "background-color 0.4s ease",
// //                       display: "flex",
// //                       alignItems: "center",
// //                       justifyContent: "center",
// //                     }}
// //                   >
// //                     <div
// //                       style={{
// //                         width: "100%",
// //                         maxHeight: "100%",
// //                         aspectRatio: `${usingLayout.finalWidth}/${usingLayout.finalHeight}`,
// //                         display: "grid",
// //                         gridTemplateColumns: `repeat(${numCols}, 1fr)`,
// //                         gridTemplateRows: `repeat(${numRows}, 1fr)`,
// //                         gap: "14px",
// //                       }}
// //                     >
// //                       {Array.from({ length: totalFrames }).map((_, i) => {
// //                         const src = expanded[i];
// //                         const isSelected = selectedPhotoIndex === i;
// //                         const rotation = photoRotations[i] || 0;

// //                         return (
// //                           <div
// //                             key={i}
// //                             onClick={() => setSelectedPhotoIndex(i)}
// //                             style={{
// //                               width: "100%",
// //                               height: "100%",
// //                               backgroundColor: "#f0f0f0",
// //                               borderRadius: "8px",
// //                               overflow: "hidden",
// //                               boxSizing: "border-box",
// //                               border: isSelected
// //                                 ? `3px solid ${COLORS.ACCENT_YELLOW}`
// //                                 : "3px solid transparent",
// //                               boxShadow: isSelected
// //                                 ? `0 6px 20px ${COLORS.ACCENT_YELLOW}40,
// //                                    0 0 0 1px ${COLORS.ACCENT_YELLOW}60`
// //                                 : "0 3px 10px rgba(0, 0, 0, 0.08)",
// //                               transition:
// //                                 "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
// //                               cursor: "pointer",
// //                               transform: isSelected
// //                                 ? "scale(0.98)"
// //                                 : "scale(1)",
// //                               position: "relative",
// //                             }}
// //                             onMouseEnter={(e) => {
// //                               if (!isSelected) {
// //                                 e.currentTarget.style.transform = "scale(1.02)";
// //                                 e.currentTarget.style.boxShadow =
// //                                   "0 6px 16px rgba(0, 0, 0, 0.15)";
// //                               }
// //                             }}
// //                             onMouseLeave={(e) => {
// //                               if (!isSelected) {
// //                                 e.currentTarget.style.transform = "scale(1)";
// //                                 e.currentTarget.style.boxShadow =
// //                                   "0 3px 10px rgba(0, 0, 0, 0.08)";
// //                               }
// //                             }}
// //                           >
// //                             {src ? (
// //                               <img
// //                                 src={src}
// //                                 alt={`Photo ${i + 1}`}
// //                                 style={{
// //                                   width: "100%",
// //                                   height: "100%",
// //                                   objectFit: "cover",
// //                                   pointerEvents: "none",
// //                                   transform: `rotate(${rotation}deg)`, // ✅ Rotation applied
// //                                   transition: "transform 0.3s ease",
// //                                 }}
// //                               />
// //                             ) : (
// //                               <div
// //                                 style={{
// //                                   width: "100%",
// //                                   height: "100%",
// //                                   display: "flex",
// //                                   alignItems: "center",
// //                                   justifyContent: "center",
// //                                   color: "#9aa0a6",
// //                                   fontSize: "12px",
// //                                   fontWeight: "600",
// //                                 }}
// //                               >
// //                                 Empty
// //                               </div>
// //                             )}
// //                           </div>
// //                         );
// //                       })}
// //                     </div>
// //                   </div>
// //                 );
// //               })()}
// //             </div>
// //           </div>

// //           {/* Customize Sidebar - Compact & Scrollable */}
// //           <div
// //             style={{
// //               flex: "1 1 40%",
// //               maxWidth: "380px",
// //               display: "flex",
// //               flexDirection: "column",
// //               animation: "fadeInRight 0.6s ease-out",
// //               minHeight: 0,
// //             }}
// //           >
// //             <div
// //               style={{
// //                 background: `linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)`,
// //                 backdropFilter: "blur(20px) saturate(180%)",
// //                 WebkitBackdropFilter: "blur(20px) saturate(180%)",
// //                 borderRadius: "20px",
// //                 padding: "20px",
// //                 boxShadow: `0 15px 40px rgba(0, 0, 0, 0.12),
// //                             0 0 0 1px rgba(255, 255, 255, 0.8),
// //                             inset 0 1px 0 rgba(255, 255, 255, 1)`,
// //                 border: `2px solid rgba(255, 255, 255, 0.5)`,
// //                 height: "100%",
// //                 display: "flex",
// //                 flexDirection: "column",
// //                 overflow: "hidden",
// //               }}
// //             >
// //               {/* Sidebar Header */}
// //               <div
// //                 style={{
// //                   marginBottom: "20px",
// //                   display: "flex",
// //                   alignItems: "center",
// //                   gap: "10px",
// //                 }}
// //               >
// //                 <div
// //                   style={{
// //                     width: "6px",
// //                     height: "6px",
// //                     borderRadius: "50%",
// //                     background: `linear-gradient(135deg, ${COLORS.PRIMARY_BLUE} 0%, ${COLORS.DEEP_BLUE} 100%)`,
// //                     boxShadow: `0 0 12px ${COLORS.PRIMARY_BLUE}80`,
// //                   }}
// //                 />
// //                 <h3
// //                   style={{
// //                     color: COLORS.TEXT_BLACK,
// //                     fontSize: "18px",
// //                     fontWeight: "800",
// //                     margin: 0,
// //                     letterSpacing: "-0.4px",
// //                   }}
// //                 >
// //                   Customize
// //                 </h3>
// //               </div>

// //               {/* Scrollable Content */}
// //               <div
// //                 style={{
// //                   flex: 1,
// //                   overflowY: "auto",
// //                   overflowX: "hidden",
// //                   paddingRight: "8px",
// //                   marginRight: "-8px",
// //                 }}
// //               >
// //                 {/* ✅ NEW: Rotation Controls */}
// //                 {selectedPhotoIndex !== null && (
// //                   <div
// //                     style={{
// //                       marginBottom: "24px",
// //                       padding: "16px",
// //                       background: `${COLORS.PRIMARY_BLUE}10`,
// //                       borderRadius: "12px",
// //                       border: `2px solid ${COLORS.PRIMARY_BLUE}30`,
// //                     }}
// //                   >
// //                     <label
// //                       style={{
// //                         display: "block",
// //                         marginBottom: "12px",
// //                         color: COLORS.TEXT_BLACK,
// //                         fontSize: "14px",
// //                         fontWeight: "700",
// //                         letterSpacing: "-0.2px",
// //                       }}
// //                     >
// //                       Rotate Photo #{selectedPhotoIndex + 1}
// //                     </label>
// //                     <div
// //                       style={{
// //                         display: "flex",
// //                         gap: "10px",
// //                         justifyContent: "space-between",
// //                       }}
// //                     >
// //                       <button
// //                         onClick={rotateLeft}
// //                         style={{
// //                           flex: 1,
// //                           padding: "12px",
// //                           fontSize: "14px",
// //                           fontWeight: "700",
// //                           borderRadius: "10px",
// //                           border: `2px solid ${COLORS.PRIMARY_BLUE}`,
// //                           background: COLORS.BASE_WHITE,
// //                           color: COLORS.DEEP_BLUE,
// //                           cursor: "pointer",
// //                           display: "flex",
// //                           alignItems: "center",
// //                           justifyContent: "center",
// //                           gap: "6px",
// //                           transition: "all 0.3s ease",
// //                         }}
// //                         onMouseEnter={(e) => {
// //                           e.currentTarget.style.background =
// //                             COLORS.LIGHT_BACKGROUND;
// //                           e.currentTarget.style.transform = "scale(1.05)";
// //                         }}
// //                         onMouseLeave={(e) => {
// //                           e.currentTarget.style.background = COLORS.BASE_WHITE;
// //                           e.currentTarget.style.transform = "scale(1)";
// //                         }}
// //                       >
// //                         <svg
// //                           width="18"
// //                           height="18"
// //                           viewBox="0 0 24 24"
// //                           fill="none"
// //                           stroke="currentColor"
// //                           strokeWidth="2"
// //                         >
// //                           <path d="M2.5 2v6h6M21.5 22v-6h-6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
// //                         </svg>
// //                         Left
// //                       </button>

// //                       <button
// //                         onClick={rotateRight}
// //                         style={{
// //                           flex: 1,
// //                           padding: "12px",
// //                           fontSize: "14px",
// //                           fontWeight: "700",
// //                           borderRadius: "10px",
// //                           border: "none",
// //                           background: `linear-gradient(135deg, ${COLORS.DEEP_BLUE} 0%, ${COLORS.PRIMARY_BLUE} 100%)`,
// //                           color: COLORS.BASE_WHITE,
// //                           cursor: "pointer",
// //                           display: "flex",
// //                           alignItems: "center",
// //                           justifyContent: "center",
// //                           gap: "6px",
// //                           transition: "all 0.3s ease",
// //                           boxShadow: `0 4px 12px ${COLORS.DEEP_BLUE}30`,
// //                         }}
// //                         onMouseEnter={(e) => {
// //                           e.currentTarget.style.transform = "translateY(-2px)";
// //                           e.currentTarget.style.boxShadow = `0 6px 16px ${COLORS.DEEP_BLUE}40`;
// //                         }}
// //                         onMouseLeave={(e) => {
// //                           e.currentTarget.style.transform = "translateY(0)";
// //                           e.currentTarget.style.boxShadow = `0 4px 12px ${COLORS.DEEP_BLUE}30`;
// //                         }}
// //                       >
// //                         Right
// //                         <svg
// //                           width="18"
// //                           height="18"
// //                           viewBox="0 0 24 24"
// //                           fill="none"
// //                           stroke="currentColor"
// //                           strokeWidth="2"
// //                         >
// //                           <path d="M21.5 2v6h-6M2.5 22v-6h6M22 11.5a10 10 0 0 0-18.8-4.3M2 12.5a10 10 0 0 0 18.8 4.2" />
// //                         </svg>
// //                       </button>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {/* Background Color Section */}
// //                 <div style={{ marginBottom: "24px" }}>
// //                   <label
// //                     style={{
// //                       display: "block",
// //                       marginBottom: "12px",
// //                       color: COLORS.TEXT_BLACK,
// //                       fontSize: "14px",
// //                       fontWeight: "700",
// //                       letterSpacing: "-0.2px",
// //                     }}
// //                   >
// //                     Background Color
// //                   </label>

// //                   {/* Color Presets Grid */}
// //                   <div
// //                     style={{
// //                       display: "grid",
// //                       gridTemplateColumns: "repeat(4, 1fr)",
// //                       gap: "10px",
// //                       marginBottom: "12px",
// //                     }}
// //                   >
// //                     {PRESET_BG_COLORS.map((c) => {
// //                       const isActive =
// //                         bgColor.toLowerCase() === c.value.toLowerCase();
// //                       return (
// //                         <button
// //                           key={c.value}
// //                           aria-label={`Set background ${c.name}`}
// //                           title={c.name}
// //                           onClick={() => setBgColor(c.value)}
// //                           style={{
// //                             width: "100%",
// //                             aspectRatio: "1",
// //                             borderRadius: "10px",
// //                             border: isActive
// //                               ? `3px solid ${COLORS.ACCENT_YELLOW}`
// //                               : "3px solid #e0e0e0",
// //                             background: c.value,
// //                             cursor: "pointer",
// //                             transition:
// //                               "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
// //                             boxShadow: isActive
// //                               ? `0 6px 16px ${COLORS.ACCENT_YELLOW}40,
// //                                  0 0 0 1px ${COLORS.ACCENT_YELLOW}30`
// //                               : "0 3px 10px rgba(0, 0, 0, 0.08)",
// //                             transform: isActive ? "scale(1.05)" : "scale(1)",
// //                             outline: "none",
// //                           }}
// //                           onMouseEnter={(e) => {
// //                             if (!isActive) {
// //                               e.currentTarget.style.transform = "scale(1.08)";
// //                               e.currentTarget.style.boxShadow =
// //                                 "0 5px 14px rgba(0, 0, 0, 0.15)";
// //                             }
// //                           }}
// //                           onMouseLeave={(e) => {
// //                             if (!isActive) {
// //                               e.currentTarget.style.transform = "scale(1)";
// //                               e.currentTarget.style.boxShadow =
// //                                 "0 3px 10px rgba(0, 0, 0, 0.08)";
// //                             }
// //                           }}
// //                         />
// //                       );
// //                     })}
// //                   </div>

// //                   {/* Custom Color Picker */}
// //                   <input
// //                     type="color"
// //                     value={bgColor}
// //                     onChange={(e) => setBgColor(e.target.value)}
// //                     style={{
// //                       width: "100%",
// //                       height: "42px",
// //                       borderRadius: "10px",
// //                       border: `2px solid ${COLORS.LIGHT_GREY}`,
// //                       cursor: "pointer",
// //                       boxShadow: "0 3px 10px rgba(0, 0, 0, 0.08)",
// //                       marginBottom: "10px",
// //                     }}
// //                   />
// //                   <div
// //                     style={{
// //                       padding: "10px 14px",
// //                       background: `${COLORS.LIGHT_BACKGROUND}30`,
// //                       borderRadius: "8px",
// //                       fontSize: "11px",
// //                       color: "#5a6c7d",
// //                       fontWeight: "500",
// //                       lineHeight: "1.4",
// //                       border: `1px solid ${COLORS.PRIMARY_BLUE}20`,
// //                     }}
// //                   >
// //                     💡 Tap preset or use picker
// //                   </div>
// //                 </div>

// //                 {/* Filter Section */}
// //                 <div style={{ marginBottom: "24px" }}>
// //                   <label
// //                     style={{
// //                       display: "block",
// //                       marginBottom: "12px",
// //                       color: COLORS.TEXT_BLACK,
// //                       fontSize: "14px",
// //                       fontWeight: "700",
// //                       letterSpacing: "-0.2px",
// //                     }}
// //                   >
// //                     Photo Filter
// //                   </label>

// //                   {/* Filter Buttons Grid */}
// //                   <div
// //                     style={{
// //                       display: "grid",
// //                       gridTemplateColumns: "repeat(2, 1fr)",
// //                       gap: "10px",
// //                     }}
// //                   >
// //                     {[
// //                       { value: "none", label: "None" },
// //                       { value: "burnt-coffee", label: "Burnt Coffee" },
// //                       { value: "ocean-wave", label: "Ocean Wave" },
// //                       { value: "old-wood", label: "Old Wood" },
// //                       { value: "vintage-may", label: "Vintage May" },
// //                       { value: "bw", label: "B & W" },
// //                     ].map((filterOption) => {
// //                       const isActive = filter === filterOption.value;
// //                       return (
// //                         <button
// //                           key={filterOption.value}
// //                           onClick={() => setFilter(filterOption.value)}
// //                           style={{
// //                             padding: "12px 16px",
// //                             borderRadius: "10px",
// //                             border: isActive
// //                               ? `3px solid ${COLORS.ACCENT_YELLOW}`
// //                               : `2px solid ${COLORS.LIGHT_GREY}`,
// //                             background: isActive
// //                               ? `linear-gradient(135deg, ${COLORS.ACCENT_YELLOW} 0%, #ffd700 100%)`
// //                               : `linear-gradient(135deg, ${COLORS.BASE_WHITE} 0%, ${COLORS.LIGHT_GREY}40 100%)`,
// //                             color: COLORS.TEXT_BLACK,
// //                             fontSize: "12px",
// //                             fontWeight: isActive ? "800" : "600",
// //                             cursor: "pointer",
// //                             transition:
// //                               "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
// //                             boxShadow: isActive
// //                               ? `0 6px 16px ${COLORS.ACCENT_YELLOW}35,
// //                                  0 0 0 1px ${COLORS.ACCENT_YELLOW}40`
// //                               : "0 3px 10px rgba(0, 0, 0, 0.06)",
// //                             transform: isActive ? "scale(1.02)" : "scale(1)",
// //                             outline: "none",
// //                             letterSpacing: "0.2px",
// //                           }}
// //                           onMouseEnter={(e) => {
// //                             if (!isActive) {
// //                               e.currentTarget.style.transform = "scale(1.05)";
// //                               e.currentTarget.style.boxShadow =
// //                                 "0 5px 14px rgba(0, 0, 0, 0.12)";
// //                             }
// //                           }}
// //                           onMouseLeave={(e) => {
// //                             if (!isActive) {
// //                               e.currentTarget.style.transform = "scale(1)";
// //                               e.currentTarget.style.boxShadow =
// //                                 "0 3px 10px rgba(0, 0, 0, 0.06)";
// //                             }
// //                           }}
// //                         >
// //                           {filterOption.label}
// //                           {isActive && (
// //                             <span
// //                               style={{ marginLeft: "5px", fontSize: "11px" }}
// //                             >
// //                               ✓
// //                             </span>
// //                           )}
// //                         </button>
// //                       );
// //                     })}
// //                   </div>
// //                 </div>

// //                 {/* Upload Progress Indicator */}
// //                 {filterUploadQueue?.length > 0 && (
// //                   <div
// //                     style={{
// //                       padding: "14px 18px",
// //                       background: `linear-gradient(135deg, ${COLORS.PRIMARY_BLUE}15 0%, ${COLORS.PRIMARY_BLUE}08 100%)`,
// //                       borderRadius: "12px",
// //                       fontSize: "12px",
// //                       fontWeight: "700",
// //                       textAlign: "center",
// //                       marginBottom: "20px",
// //                       color: COLORS.DEEP_BLUE,
// //                       border: `2px solid ${COLORS.PRIMARY_BLUE}25`,
// //                       boxShadow: "0 3px 10px rgba(0, 0, 0, 0.06)",
// //                       animation: "slideUp 0.4s ease-out",
// //                     }}
// //                   >
// //                     <div
// //                       style={{
// //                         display: "flex",
// //                         alignItems: "center",
// //                         justifyContent: "center",
// //                         gap: "8px",
// //                       }}
// //                     >
// //                       <div
// //                         style={{
// //                           width: "6px",
// //                           height: "6px",
// //                           borderRadius: "50%",
// //                           background: COLORS.ACCENT_YELLOW,
// //                           animation: "pulse 2s ease-in-out infinite",
// //                         }}
// //                       />
// //                       ☁️ {filterUploadQueue?.length}/{photosTaken?.length} saved
// //                     </div>
// //                   </div>
// //                 )}

// //                 {/* Action Button */}
// //                 <button
// //                   onClick={handleProceedToPrintWholeSheet}
// //                   onMouseEnter={(e) => {
// //                     e.currentTarget.style.transform =
// //                       "translateY(-3px) scale(1.02)";
// //                     e.currentTarget.style.boxShadow = `0 14px 35px ${COLORS.DEEP_BLUE}45`;
// //                   }}
// //                   onMouseLeave={(e) => {
// //                     e.currentTarget.style.transform = "translateY(0) scale(1)";
// //                     e.currentTarget.style.boxShadow = `0 8px 24px ${COLORS.DEEP_BLUE}40`;
// //                   }}
// //                   style={{
// //                     width: "100%",
// //                     padding: "16px 28px",
// //                     fontSize: "15px",
// //                     fontWeight: "800",
// //                     borderRadius: "12px",
// //                     border: "none",
// //                     background: `linear-gradient(135deg, ${COLORS.DEEP_BLUE} 0%, ${COLORS.PRIMARY_BLUE} 100%)`,
// //                     color: COLORS.BASE_WHITE,
// //                     cursor: "pointer",
// //                     boxShadow: `0 8px 24px ${COLORS.DEEP_BLUE}40,
// //                                 inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
// //                     transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
// //                     letterSpacing: "0.5px",
// //                     outline: "none",
// //                     position: "relative",
// //                     overflow: "hidden",
// //                   }}
// //                 >
// //                   <div
// //                     style={{
// //                       position: "absolute",
// //                       top: 0,
// //                       left: "-100%",
// //                       width: "100%",
// //                       height: "100%",
// //                       background:
// //                         "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
// //                       animation: "shimmer 3s infinite",
// //                     }}
// //                   />
// //                   <span style={{ position: "relative", zIndex: 1 }}>
// //                     Continue to Print →
// //                   </span>
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* CSS Animations */}
// //       <style>
// //         {`
// //           @keyframes slideInRight {
// //             from {
// //               opacity: 0;
// //               transform: translateX(30px);
// //             }
// //             to {
// //               opacity: 1;
// //               transform: translateX(0);
// //             }
// //           }

// //           @keyframes fadeInDown {
// //             from {
// //               opacity: 0;
// //               transform: translateY(-20px);
// //             }
// //             to {
// //               opacity: 1;
// //               transform: translateY(0);
// //             }
// //           }

// //           @keyframes fadeInLeft {
// //             from {
// //               opacity: 0;
// //               transform: translateX(-30px);
// //             }
// //             to {
// //               opacity: 1;
// //               transform: translateX(0);
// //             }
// //           }

// //           @keyframes fadeInRight {
// //             from {
// //               opacity: 0;
// //               transform: translateX(30px);
// //             }
// //             to {
// //               opacity: 1;
// //               transform: translateX(0);
// //             }
// //           }

// //           @keyframes slideUp {
// //             from {
// //               opacity: 0;
// //               transform: translateY(20px);
// //             }
// //             to {
// //               opacity: 1;
// //               transform: translateY(0);
// //             }
// //           }

// //           @keyframes pulse {
// //             0%, 100% {
// //               opacity: 1;
// //               transform: scale(1);
// //             }
// //             50% {
// //               opacity: 0.7;
// //               transform: scale(1.2);
// //             }
// //           }

// //           @keyframes shimmer {
// //             0% { left: -100%; }
// //             100% { left: 100%; }
// //           }

// //           @keyframes float {
// //             0%, 100% {
// //               transform: translate(0, 0);
// //             }
// //             50% {
// //               transform: translate(30px, -30px);
// //             }
// //           }
// //         `}
// //       </style>
// //     </div>
// //   );
// // }

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

//   // ✅ Photo rotation states
//   const [photoRotations, setPhotoRotations] = useState({});
//   const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

//   // ✅ NEW: Photo position states (for left/right movement)
//   const [photoPositions, setPhotoPositions] = useState({});

//   // ✅ Rotate left function
//   const rotateLeft = () => {
//     if (selectedPhotoIndex !== null) {
//       setPhotoRotations((prev) => ({
//         ...prev,
//         [selectedPhotoIndex]:
//           ((prev[selectedPhotoIndex] || 0) - 90 + 360) % 360,
//       }));
//     }
//   };

//   // ✅ Rotate right function
//   const rotateRight = () => {
//     if (selectedPhotoIndex !== null) {
//       setPhotoRotations((prev) => ({
//         ...prev,
//         [selectedPhotoIndex]: ((prev[selectedPhotoIndex] || 0) + 90) % 360,
//       }));
//     }
//   };

//   // ✅ NEW: Move photo left
//   const moveLeft = () => {
//     if (selectedPhotoIndex !== null) {
//       setPhotoPositions((prev) => ({
//         ...prev,
//         [selectedPhotoIndex]: (prev[selectedPhotoIndex] || 0) - 10, // Move 10px left
//       }));
//     }
//   };

//   // ✅ NEW: Move photo right
//   const moveRight = () => {
//     if (selectedPhotoIndex !== null) {
//       setPhotoPositions((prev) => ({
//         ...prev,
//         [selectedPhotoIndex]: (prev[selectedPhotoIndex] || 0) + 10, // Move 10px right
//       }));
//     }
//   };

//   // ✅ NEW: Reset position
//   const resetPosition = () => {
//     if (selectedPhotoIndex !== null) {
//       setPhotoPositions((prev) => ({
//         ...prev,
//         [selectedPhotoIndex]: 0,
//       }));
//     }
//   };

//   // ✅ Apply Filter + Upload Filtered Images
//   const handleApplyFilterAndUpload = async () => {
//     setIsUploading(true);
//     setUploadStatus("Applying filter...");

//     await applyFilterToAll();

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
//         width: "100vw",
//         height: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         background: `linear-gradient(135deg, ${COLORS.BASE_WHITE} 0%, ${COLORS.LIGHT_BACKGROUND}25 50%, ${COLORS.BASE_WHITE} 100%)`,
//         position: "relative",
//         overflow: "hidden",
//         padding: "20px",
//         boxSizing: "border-box",
//       }}
//     >
//       {/* Animated background blobs */}
//       <div
//         style={{
//           position: "absolute",
//           top: "-100px",
//           right: "-100px",
//           width: "400px",
//           height: "400px",
//           borderRadius: "50%",
//           background: `radial-gradient(circle, ${COLORS.PRIMARY_BLUE}12 0%, transparent 70%)`,
//           filter: "blur(80px)",
//           zIndex: 0,
//           animation: "float 20s ease-in-out infinite",
//         }}
//       />
//       <div
//         style={{
//           position: "absolute",
//           bottom: "-150px",
//           left: "-150px",
//           width: "500px",
//           height: "500px",
//           borderRadius: "50%",
//           background: `radial-gradient(circle, ${COLORS.ACCENT_YELLOW}10 0%, transparent 70%)`,
//           filter: "blur(90px)",
//           zIndex: 0,
//           animation: "float 25s ease-in-out infinite reverse",
//         }}
//       />

//       {/* Upload Status Toast */}
//       {uploadStatus && (
//         <div
//           style={{
//             position: "fixed",
//             top: "20px",
//             right: "20px",
//             padding: "12px 20px",
//             background: `linear-gradient(135deg, ${COLORS.ACCENT_YELLOW} 0%, #ffd700 100%)`,
//             borderRadius: "12px",
//             fontSize: "13px",
//             fontWeight: "700",
//             color: COLORS.TEXT_BLACK,
//             boxShadow: `0 8px 24px ${COLORS.ACCENT_YELLOW}50,
//                         0 0 0 1px ${COLORS.ACCENT_YELLOW}60,
//                         inset 0 1px 0 rgba(255, 255, 255, 0.7)`,
//             zIndex: 1000,
//             animation: "slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
//             backdropFilter: "blur(10px)",
//             display: "flex",
//             alignItems: "center",
//             gap: "8px",
//           }}
//         >
//           <div
//             style={{
//               width: "6px",
//               height: "6px",
//               borderRadius: "50%",
//               background: COLORS.DEEP_BLUE,
//               animation: "pulse 2s ease-in-out infinite",
//             }}
//           />
//           {uploadStatus}
//         </div>
//       )}

//       {/* Content Container - Compact */}
//       <div
//         style={{
//           width: "100%",
//           maxWidth: "1400px",
//           height: "100%",
//           display: "flex",
//           flexDirection: "column",
//           position: "relative",
//           zIndex: 1,
//         }}
//       >
//         {/* Compact Header */}
//         <div
//           style={{
//             textAlign: "center",
//             marginBottom: "20px",
//             animation: "fadeInDown 0.6s ease-out",
//           }}
//         >
//           <h1
//             style={{
//               background: `linear-gradient(135deg, ${COLORS.DEEP_BLUE} 0%, ${COLORS.PRIMARY_BLUE} 100%)`,
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               backgroundClip: "text",
//               fontSize: "28px",
//               fontWeight: "800",
//               marginBottom: "6px",
//               letterSpacing: "-0.8px",
//             }}
//           >
//             Preview & Customize
//           </h1>
//           <p
//             style={{
//               color: "#5a6c7d",
//               fontSize: "14px",
//               fontWeight: "500",
//               margin: 0,
//               letterSpacing: "0.2px",
//             }}
//           >
//             Fine-tune your photo strip with filters and colors
//           </p>
//         </div>

//         {/* Main Content - Optimized Height */}
//         <div
//           style={{
//             display: "flex",
//             gap: "24px",
//             alignItems: "stretch",
//             justifyContent: "center",
//             flex: 1,
//             width: "100%",
//             minHeight: 0,
//           }}
//         >
//           {/* Preview Section - Compact */}
//           <div
//             style={{
//               flex: "1 1 50%",
//               maxWidth: "600px",
//               display: "flex",
//               flexDirection: "column",
//               animation: "fadeInLeft 0.6s ease-out",
//             }}
//           >
//             <div
//               style={{
//                 background: `linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)`,
//                 backdropFilter: "blur(20px) saturate(180%)",
//                 WebkitBackdropFilter: "blur(20px) saturate(180%)",
//                 borderRadius: "20px",
//                 padding: "20px",
//                 boxShadow: `0 15px 40px rgba(0, 0, 0, 0.12),
//                             0 0 0 1px rgba(255, 255, 255, 0.8),
//                             inset 0 1px 0 rgba(255, 255, 255, 1)`,
//                 border: `2px solid rgba(255, 255, 255, 0.5)`,
//                 height: "100%",
//                 display: "flex",
//                 flexDirection: "column",
//               }}
//             >
//               {/* Compact Label */}
//               <div
//                 style={{
//                   marginBottom: "16px",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "10px",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: "6px",
//                     height: "6px",
//                     borderRadius: "50%",
//                     background: `linear-gradient(135deg, ${COLORS.ACCENT_YELLOW} 0%, #ffd700 100%)`,
//                     boxShadow: `0 0 12px ${COLORS.ACCENT_YELLOW}80`,
//                   }}
//                 />
//                 <h3
//                   style={{
//                     color: COLORS.TEXT_BLACK,
//                     fontSize: "18px",
//                     fontWeight: "800",
//                     margin: 0,
//                     letterSpacing: "-0.4px",
//                   }}
//                 >
//                   Your Photo Strip
//                 </h3>
//               </div>

//               {/* Preview Display */}
//               {(() => {
//                 const usingLayout = layouts.vertical[totalFrames];
//                 if (!usingLayout) return <div>Invalid layout</div>;
//                 const expanded = getPhotosForFrames();
//                 const numCols = usingLayout.numCols;
//                 const numRows = usingLayout.numRows;
//                 return (
//                   <div
//                     style={{
//                       width: "100%",
//                       flex: 1,
//                       backgroundColor: bgColor,
//                       padding: "18px",
//                       boxSizing: "border-box",
//                       borderRadius: "14px",
//                       boxShadow: `0 10px 28px rgba(0, 0, 0, 0.15),
//                                   inset 0 2px 0 rgba(255, 255, 255, 0.3)`,
//                       transition: "background-color 0.4s ease",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: "100%",
//                         maxHeight: "100%",
//                         aspectRatio: `${usingLayout.finalWidth}/${usingLayout.finalHeight}`,
//                         display: "grid",
//                         gridTemplateColumns: `repeat(${numCols}, 1fr)`,
//                         gridTemplateRows: `repeat(${numRows}, 1fr)`,
//                         gap: "14px",
//                       }}
//                     >
//                       {Array.from({ length: totalFrames }).map((_, i) => {
//                         const src = expanded[i];
//                         const isSelected = selectedPhotoIndex === i;
//                         const rotation = photoRotations[i] || 0;
//                         const positionX = photoPositions[i] || 0; // ✅ Get X position

//                         return (
//                           <div
//                             key={i}
//                             onClick={() => setSelectedPhotoIndex(i)}
//                             style={{
//                               width: "100%",
//                               height: "100%",
//                               backgroundColor: "#f0f0f0",
//                               borderRadius: "8px",
//                               overflow: "hidden",
//                               boxSizing: "border-box",
//                               border: isSelected
//                                 ? `3px solid ${COLORS.ACCENT_YELLOW}`
//                                 : "3px solid transparent",
//                               boxShadow: isSelected
//                                 ? `0 6px 20px ${COLORS.ACCENT_YELLOW}40,
//                                    0 0 0 1px ${COLORS.ACCENT_YELLOW}60`
//                                 : "0 3px 10px rgba(0, 0, 0, 0.08)",
//                               transition:
//                                 "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
//                               cursor: "pointer",
//                               transform: isSelected
//                                 ? "scale(0.98)"
//                                 : "scale(1)",
//                               position: "relative",
//                             }}
//                             onMouseEnter={(e) => {
//                               if (!isSelected) {
//                                 e.currentTarget.style.transform = "scale(1.02)";
//                                 e.currentTarget.style.boxShadow =
//                                   "0 6px 16px rgba(0, 0, 0, 0.15)";
//                               }
//                             }}
//                             onMouseLeave={(e) => {
//                               if (!isSelected) {
//                                 e.currentTarget.style.transform = "scale(1)";
//                                 e.currentTarget.style.boxShadow =
//                                   "0 3px 10px rgba(0, 0, 0, 0.08)";
//                               }
//                             }}
//                           >
//                             {src ? (
//                               <img
//                                 src={src}
//                                 alt={`Photo ${i + 1}`}
//                                 style={{
//                                   width: "100%",
//                                   height: "100%",
//                                   objectFit: "cover",
//                                   pointerEvents: "none",
//                                   // ✅ Combined transform: translate + rotate
//                                   transform: `translateX(${positionX}px) rotate(${rotation}deg)`,
//                                   transition: "transform 0.3s ease",
//                                 }}
//                               />
//                             ) : (
//                               <div
//                                 style={{
//                                   width: "100%",
//                                   height: "100%",
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "center",
//                                   color: "#9aa0a6",
//                                   fontSize: "12px",
//                                   fontWeight: "600",
//                                 }}
//                               >
//                                 Empty
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 );
//               })()}
//             </div>
//           </div>

//           {/* Customize Sidebar - Compact & Scrollable */}
//           <div
//             style={{
//               flex: "1 1 40%",
//               maxWidth: "380px",
//               display: "flex",
//               flexDirection: "column",
//               animation: "fadeInRight 0.6s ease-out",
//               minHeight: 0,
//             }}
//           >
//             <div
//               style={{
//                 background: `linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)`,
//                 backdropFilter: "blur(20px) saturate(180%)",
//                 WebkitBackdropFilter: "blur(20px) saturate(180%)",
//                 borderRadius: "20px",
//                 padding: "20px",
//                 boxShadow: `0 15px 40px rgba(0, 0, 0, 0.12),
//                             0 0 0 1px rgba(255, 255, 255, 0.8),
//                             inset 0 1px 0 rgba(255, 255, 255, 1)`,
//                 border: `2px solid rgba(255, 255, 255, 0.5)`,
//                 height: "100%",
//                 display: "flex",
//                 flexDirection: "column",
//                 overflow: "hidden",
//               }}
//             >
//               {/* Sidebar Header */}
//               <div
//                 style={{
//                   marginBottom: "20px",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "10px",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: "6px",
//                     height: "6px",
//                     borderRadius: "50%",
//                     background: `linear-gradient(135deg, ${COLORS.PRIMARY_BLUE} 0%, ${COLORS.DEEP_BLUE} 100%)`,
//                     boxShadow: `0 0 12px ${COLORS.PRIMARY_BLUE}80`,
//                   }}
//                 />
//                 <h3
//                   style={{
//                     color: COLORS.TEXT_BLACK,
//                     fontSize: "18px",
//                     fontWeight: "800",
//                     margin: 0,
//                     letterSpacing: "-0.4px",
//                   }}
//                 >
//                   Customize
//                 </h3>
//               </div>

//               {/* Scrollable Content */}
//               <div
//                 style={{
//                   flex: 1,
//                   overflowY: "auto",
//                   overflowX: "hidden",
//                   paddingRight: "8px",
//                   marginRight: "-8px",
//                 }}
//               >
//                 {/* ✅ NEW: Photo Controls (Position + Rotation) */}
//                 {selectedPhotoIndex !== null && (
//                   <div
//                     style={{
//                       marginBottom: "24px",
//                       padding: "16px",
//                       background: `${COLORS.PRIMARY_BLUE}10`,
//                       borderRadius: "12px",
//                       border: `2px solid ${COLORS.PRIMARY_BLUE}30`,
//                     }}
//                   >
//                     <label
//                       style={{
//                         display: "block",
//                         marginBottom: "12px",
//                         color: COLORS.TEXT_BLACK,
//                         fontSize: "14px",
//                         fontWeight: "700",
//                         letterSpacing: "-0.2px",
//                       }}
//                     >
//                       Edit Photo #{selectedPhotoIndex + 1}
//                     </label>

//                     {/* ✅ Position Controls */}
//                     <div style={{ marginBottom: "12px" }}>
//                       <div
//                         style={{
//                           fontSize: "12px",
//                           color: "#5a6c7d",
//                           marginBottom: "8px",
//                           fontWeight: "600",
//                         }}
//                       >
//                         Position
//                       </div>
//                       <div
//                         style={{
//                           display: "grid",
//                           gridTemplateColumns: "1fr 1fr 1fr",
//                           gap: "8px",
//                         }}
//                       >
//                         <button
//                           onClick={moveLeft}
//                           style={{
//                             padding: "10px",
//                             fontSize: "13px",
//                             fontWeight: "700",
//                             borderRadius: "8px",
//                             border: `2px solid ${COLORS.PRIMARY_BLUE}`,
//                             background: COLORS.BASE_WHITE,
//                             color: COLORS.DEEP_BLUE,
//                             cursor: "pointer",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             gap: "4px",
//                             transition: "all 0.3s ease",
//                           }}
//                           onMouseEnter={(e) => {
//                             e.currentTarget.style.background =
//                               COLORS.LIGHT_BACKGROUND;
//                             e.currentTarget.style.transform = "scale(1.05)";
//                           }}
//                           onMouseLeave={(e) => {
//                             e.currentTarget.style.background =
//                               COLORS.BASE_WHITE;
//                             e.currentTarget.style.transform = "scale(1)";
//                           }}
//                         >
//                           <svg
//                             width="16"
//                             height="16"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                           >
//                             <path d="M19 12H5M12 19l-7-7 7-7" />
//                           </svg>
//                           Left
//                         </button>

//                         <button
//                           onClick={resetPosition}
//                           style={{
//                             padding: "10px",
//                             fontSize: "13px",
//                             fontWeight: "700",
//                             borderRadius: "8px",
//                             border: `2px solid ${COLORS.LIGHT_GREY}`,
//                             background: COLORS.BASE_WHITE,
//                             color: COLORS.TEXT_BLACK,
//                             cursor: "pointer",
//                             transition: "all 0.3s ease",
//                           }}
//                           onMouseEnter={(e) => {
//                             e.currentTarget.style.background =
//                               COLORS.LIGHT_BACKGROUND;
//                             e.currentTarget.style.transform = "scale(1.05)";
//                           }}
//                           onMouseLeave={(e) => {
//                             e.currentTarget.style.background =
//                               COLORS.BASE_WHITE;
//                             e.currentTarget.style.transform = "scale(1)";
//                           }}
//                         >
//                           Reset
//                         </button>

//                         <button
//                           onClick={moveRight}
//                           style={{
//                             padding: "10px",
//                             fontSize: "13px",
//                             fontWeight: "700",
//                             borderRadius: "8px",
//                             border: `2px solid ${COLORS.PRIMARY_BLUE}`,
//                             background: COLORS.BASE_WHITE,
//                             color: COLORS.DEEP_BLUE,
//                             cursor: "pointer",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             gap: "4px",
//                             transition: "all 0.3s ease",
//                           }}
//                           onMouseEnter={(e) => {
//                             e.currentTarget.style.background =
//                               COLORS.LIGHT_BACKGROUND;
//                             e.currentTarget.style.transform = "scale(1.05)";
//                           }}
//                           onMouseLeave={(e) => {
//                             e.currentTarget.style.background =
//                               COLORS.BASE_WHITE;
//                             e.currentTarget.style.transform = "scale(1)";
//                           }}
//                         >
//                           Right
//                           <svg
//                             width="16"
//                             height="16"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                           >
//                             <path d="M5 12h14M12 5l7 7-7 7" />
//                           </svg>
//                         </button>
//                       </div>
//                     </div>

//                     {/* ✅ Rotation Controls */}
//                     <div>
//                       <div
//                         style={{
//                           fontSize: "12px",
//                           color: "#5a6c7d",
//                           marginBottom: "8px",
//                           fontWeight: "600",
//                         }}
//                       >
//                         Rotation
//                       </div>
//                       <div
//                         style={{
//                           display: "flex",
//                           gap: "8px",
//                         }}
//                       >
//                         <button
//                           onClick={rotateLeft}
//                           style={{
//                             flex: 1,
//                             padding: "10px",
//                             fontSize: "13px",
//                             fontWeight: "700",
//                             borderRadius: "8px",
//                             border: `2px solid ${COLORS.PRIMARY_BLUE}`,
//                             background: COLORS.BASE_WHITE,
//                             color: COLORS.DEEP_BLUE,
//                             cursor: "pointer",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             gap: "4px",
//                             transition: "all 0.3s ease",
//                           }}
//                           onMouseEnter={(e) => {
//                             e.currentTarget.style.background =
//                               COLORS.LIGHT_BACKGROUND;
//                             e.currentTarget.style.transform = "scale(1.05)";
//                           }}
//                           onMouseLeave={(e) => {
//                             e.currentTarget.style.background =
//                               COLORS.BASE_WHITE;
//                             e.currentTarget.style.transform = "scale(1)";
//                           }}
//                         >
//                           <svg
//                             width="16"
//                             height="16"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                           >
//                             <path d="M2.5 2v6h6M21.5 22v-6h-6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
//                           </svg>
//                           Rotate ↺
//                         </button>

//                         <button
//                           onClick={rotateRight}
//                           style={{
//                             flex: 1,
//                             padding: "10px",
//                             fontSize: "13px",
//                             fontWeight: "700",
//                             borderRadius: "8px",
//                             border: "none",
//                             background: `linear-gradient(135deg, ${COLORS.DEEP_BLUE} 0%, ${COLORS.PRIMARY_BLUE} 100%)`,
//                             color: COLORS.BASE_WHITE,
//                             cursor: "pointer",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             gap: "4px",
//                             transition: "all 0.3s ease",
//                             boxShadow: `0 4px 12px ${COLORS.DEEP_BLUE}30`,
//                           }}
//                           onMouseEnter={(e) => {
//                             e.currentTarget.style.transform =
//                               "translateY(-2px)";
//                             e.currentTarget.style.boxShadow = `0 6px 16px ${COLORS.DEEP_BLUE}40`;
//                           }}
//                           onMouseLeave={(e) => {
//                             e.currentTarget.style.transform = "translateY(0)";
//                             e.currentTarget.style.boxShadow = `0 4px 12px ${COLORS.DEEP_BLUE}30`;
//                           }}
//                         >
//                           Rotate ↻
//                           <svg
//                             width="16"
//                             height="16"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                           >
//                             <path d="M21.5 2v6h-6M2.5 22v-6h6M22 11.5a10 10 0 0 0-18.8-4.3M2 12.5a10 10 0 0 0 18.8 4.2" />
//                           </svg>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Background Color Section */}
//                 <div style={{ marginBottom: "24px" }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: "12px",
//                       color: COLORS.TEXT_BLACK,
//                       fontSize: "14px",
//                       fontWeight: "700",
//                       letterSpacing: "-0.2px",
//                     }}
//                   >
//                     Background Color
//                   </label>

//                   {/* Color Presets Grid */}
//                   <div
//                     style={{
//                       display: "grid",
//                       gridTemplateColumns: "repeat(4, 1fr)",
//                       gap: "10px",
//                       marginBottom: "12px",
//                     }}
//                   >
//                     {PRESET_BG_COLORS.map((c) => {
//                       const isActive =
//                         bgColor.toLowerCase() === c.value.toLowerCase();
//                       return (
//                         <button
//                           key={c.value}
//                           aria-label={`Set background ${c.name}`}
//                           title={c.name}
//                           onClick={() => setBgColor(c.value)}
//                           style={{
//                             width: "100%",
//                             aspectRatio: "1",
//                             borderRadius: "10px",
//                             border: isActive
//                               ? `3px solid ${COLORS.ACCENT_YELLOW}`
//                               : "3px solid #e0e0e0",
//                             background: c.value,
//                             cursor: "pointer",
//                             transition:
//                               "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
//                             boxShadow: isActive
//                               ? `0 6px 16px ${COLORS.ACCENT_YELLOW}40,
//                                  0 0 0 1px ${COLORS.ACCENT_YELLOW}30`
//                               : "0 3px 10px rgba(0, 0, 0, 0.08)",
//                             transform: isActive ? "scale(1.05)" : "scale(1)",
//                             outline: "none",
//                           }}
//                           onMouseEnter={(e) => {
//                             if (!isActive) {
//                               e.currentTarget.style.transform = "scale(1.08)";
//                               e.currentTarget.style.boxShadow =
//                                 "0 5px 14px rgba(0, 0, 0, 0.15)";
//                             }
//                           }}
//                           onMouseLeave={(e) => {
//                             if (!isActive) {
//                               e.currentTarget.style.transform = "scale(1)";
//                               e.currentTarget.style.boxShadow =
//                                 "0 3px 10px rgba(0, 0, 0, 0.08)";
//                             }
//                           }}
//                         />
//                       );
//                     })}
//                   </div>

//                   {/* Custom Color Picker */}
//                   <input
//                     type="color"
//                     value={bgColor}
//                     onChange={(e) => setBgColor(e.target.value)}
//                     style={{
//                       width: "100%",
//                       height: "42px",
//                       borderRadius: "10px",
//                       border: `2px solid ${COLORS.LIGHT_GREY}`,
//                       cursor: "pointer",
//                       boxShadow: "0 3px 10px rgba(0, 0, 0, 0.08)",
//                       marginBottom: "10px",
//                     }}
//                   />
//                   <div
//                     style={{
//                       padding: "10px 14px",
//                       background: `${COLORS.LIGHT_BACKGROUND}30`,
//                       borderRadius: "8px",
//                       fontSize: "11px",
//                       color: "#5a6c7d",
//                       fontWeight: "500",
//                       lineHeight: "1.4",
//                       border: `1px solid ${COLORS.PRIMARY_BLUE}20`,
//                     }}
//                   >
//                     💡 Tap preset or use picker
//                   </div>
//                 </div>

//                 {/* Filter Section */}
//                 <div style={{ marginBottom: "24px" }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: "12px",
//                       color: COLORS.TEXT_BLACK,
//                       fontSize: "14px",
//                       fontWeight: "700",
//                       letterSpacing: "-0.2px",
//                     }}
//                   >
//                     Photo Filter
//                   </label>

//                   {/* Filter Buttons Grid */}
//                   <div
//                     style={{
//                       display: "grid",
//                       gridTemplateColumns: "repeat(2, 1fr)",
//                       gap: "10px",
//                     }}
//                   >
//                     {[
//                       { value: "none", label: "None" },
//                       { value: "burnt-coffee", label: "Burnt Coffee" },
//                       { value: "ocean-wave", label: "Ocean Wave" },
//                       { value: "old-wood", label: "Old Wood" },
//                       { value: "vintage-may", label: "Vintage May" },
//                       { value: "bw", label: "B & W" },
//                     ].map((filterOption) => {
//                       const isActive = filter === filterOption.value;
//                       return (
//                         <button
//                           key={filterOption.value}
//                           onClick={() => setFilter(filterOption.value)}
//                           style={{
//                             padding: "12px 16px",
//                             borderRadius: "10px",
//                             border: isActive
//                               ? `3px solid ${COLORS.ACCENT_YELLOW}`
//                               : `2px solid ${COLORS.LIGHT_GREY}`,
//                             background: isActive
//                               ? `linear-gradient(135deg, ${COLORS.ACCENT_YELLOW} 0%, #ffd700 100%)`
//                               : `linear-gradient(135deg, ${COLORS.BASE_WHITE} 0%, ${COLORS.LIGHT_GREY}40 100%)`,
//                             color: COLORS.TEXT_BLACK,
//                             fontSize: "12px",
//                             fontWeight: isActive ? "800" : "600",
//                             cursor: "pointer",
//                             transition:
//                               "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
//                             boxShadow: isActive
//                               ? `0 6px 16px ${COLORS.ACCENT_YELLOW}35,
//                                  0 0 0 1px ${COLORS.ACCENT_YELLOW}40`
//                               : "0 3px 10px rgba(0, 0, 0, 0.06)",
//                             transform: isActive ? "scale(1.02)" : "scale(1)",
//                             outline: "none",
//                             letterSpacing: "0.2px",
//                           }}
//                           onMouseEnter={(e) => {
//                             if (!isActive) {
//                               e.currentTarget.style.transform = "scale(1.05)";
//                               e.currentTarget.style.boxShadow =
//                                 "0 5px 14px rgba(0, 0, 0, 0.12)";
//                             }
//                           }}
//                           onMouseLeave={(e) => {
//                             if (!isActive) {
//                               e.currentTarget.style.transform = "scale(1)";
//                               e.currentTarget.style.boxShadow =
//                                 "0 3px 10px rgba(0, 0, 0, 0.06)";
//                             }
//                           }}
//                         >
//                           {filterOption.label}
//                           {isActive && (
//                             <span
//                               style={{ marginLeft: "5px", fontSize: "11px" }}
//                             >
//                               ✓
//                             </span>
//                           )}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>

//                 {/* Upload Progress Indicator */}
//                 {filterUploadQueue?.length > 0 && (
//                   <div
//                     style={{
//                       padding: "14px 18px",
//                       background: `linear-gradient(135deg, ${COLORS.PRIMARY_BLUE}15 0%, ${COLORS.PRIMARY_BLUE}08 100%)`,
//                       borderRadius: "12px",
//                       fontSize: "12px",
//                       fontWeight: "700",
//                       textAlign: "center",
//                       marginBottom: "20px",
//                       color: COLORS.DEEP_BLUE,
//                       border: `2px solid ${COLORS.PRIMARY_BLUE}25`,
//                       boxShadow: "0 3px 10px rgba(0, 0, 0, 0.06)",
//                       animation: "slideUp 0.4s ease-out",
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         gap: "8px",
//                       }}
//                     >
//                       <div
//                         style={{
//                           width: "6px",
//                           height: "6px",
//                           borderRadius: "50%",
//                           background: COLORS.ACCENT_YELLOW,
//                           animation: "pulse 2s ease-in-out infinite",
//                         }}
//                       />
//                       ☁️ {filterUploadQueue?.length}/{photosTaken?.length} saved
//                     </div>
//                   </div>
//                 )}

//                 {/* Action Button */}
//                 <button
//                   onClick={handleProceedToPrintWholeSheet}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.transform =
//                       "translateY(-3px) scale(1.02)";
//                     e.currentTarget.style.boxShadow = `0 14px 35px ${COLORS.DEEP_BLUE}45`;
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = "translateY(0) scale(1)";
//                     e.currentTarget.style.boxShadow = `0 8px 24px ${COLORS.DEEP_BLUE}40`;
//                   }}
//                   style={{
//                     width: "100%",
//                     padding: "16px 28px",
//                     fontSize: "15px",
//                     fontWeight: "800",
//                     borderRadius: "12px",
//                     border: "none",
//                     background: `linear-gradient(135deg, ${COLORS.DEEP_BLUE} 0%, ${COLORS.PRIMARY_BLUE} 100%)`,
//                     color: COLORS.BASE_WHITE,
//                     cursor: "pointer",
//                     boxShadow: `0 8px 24px ${COLORS.DEEP_BLUE}40,
//                                 inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
//                     transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
//                     letterSpacing: "0.5px",
//                     outline: "none",
//                     position: "relative",
//                     overflow: "hidden",
//                   }}
//                 >
//                   <div
//                     style={{
//                       position: "absolute",
//                       top: 0,
//                       left: "-100%",
//                       width: "100%",
//                       height: "100%",
//                       background:
//                         "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
//                       animation: "shimmer 3s infinite",
//                     }}
//                   />
//                   <span style={{ position: "relative", zIndex: 1 }}>
//                     Continue to Print →
//                   </span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* CSS Animations */}
//       <style>
//         {`
//           @keyframes slideInRight {
//             from {
//               opacity: 0;
//               transform: translateX(30px);
//             }
//             to {
//               opacity: 1;
//               transform: translateX(0);
//             }
//           }

//           @keyframes fadeInDown {
//             from {
//               opacity: 0;
//               transform: translateY(-20px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }

//           @keyframes fadeInLeft {
//             from {
//               opacity: 0;
//               transform: translateX(-30px);
//             }
//             to {
//               opacity: 1;
//               transform: translateX(0);
//             }
//           }

//           @keyframes fadeInRight {
//             from {
//               opacity: 0;
//               transform: translateX(30px);
//             }
//             to {
//               opacity: 1;
//               transform: translateX(0);
//             }
//           }

//           @keyframes slideUp {
//             from {
//               opacity: 0;
//               transform: translateY(20px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }

//           @keyframes pulse {
//             0%, 100% {
//               opacity: 1;
//               transform: scale(1);
//             }
//             50% {
//               opacity: 0.7;
//               transform: scale(1.2);
//             }
//           }

//           @keyframes shimmer {
//             0% { left: -100%; }
//             100% { left: 100%; }
//           }

//           @keyframes float {
//             0%, 100% {
//               transform: translate(0, 0);
//             }
//             50% {
//               transform: translate(30px, -30px);
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

  // Photo rotation and position states
  const [photoRotations, setPhotoRotations] = useState({});
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [photoPositions, setPhotoPositions] = useState({});

  // Mobile menu toggle
  const [showMobileControls, setShowMobileControls] = useState(false);

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
        [selectedPhotoIndex]: (prev[selectedPhotoIndex] || 0) - 10,
      }));
    }
  };

  const moveRight = () => {
    if (selectedPhotoIndex !== null) {
      setPhotoPositions((prev) => ({
        ...prev,
        [selectedPhotoIndex]: (prev[selectedPhotoIndex] || 0) + 10,
      }));
    }
  };

  const resetPosition = () => {
    if (selectedPhotoIndex !== null) {
      setPhotoPositions((prev) => ({
        ...prev,
        [selectedPhotoIndex]: 0,
      }));
    }
  };

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

              {/* Preview Display */}
              {(() => {
                const usingLayout = layouts.vertical[totalFrames];
                if (!usingLayout) return <div>Invalid layout</div>;
                const expanded = getPhotosForFrames();
                const numCols = usingLayout.numCols;
                const numRows = usingLayout.numRows;

                return (
                  <div
                    className="preview-canvas"
                    style={{ backgroundColor: bgColor }}
                  >
                    <div
                      className="photo-grid"
                      style={{
                        gridTemplateColumns: `repeat(${numCols}, 1fr)`,
                        gridTemplateRows: `repeat(${numRows}, 1fr)`,
                        aspectRatio: `${usingLayout.finalWidth}/${usingLayout.finalHeight}`,
                      }}
                    >
                      {Array.from({ length: totalFrames }).map((_, i) => {
                        const src = expanded[i];
                        const isSelected = selectedPhotoIndex === i;
                        const rotation = photoRotations[i] || 0;
                        const positionX = photoPositions[i] || 0;

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
                                  transform: `translateX(${positionX}px) rotate(${rotation}deg)`,
                                }}
                              />
                            ) : (
                              <div className="empty-frame">Empty</div>
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

          {/* Customize Sidebar */}
          <div className="customize-section">
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
                      <div className="position-controls">
                        <button
                          onClick={moveLeft}
                          className="control-btn control-btn-outline"
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
                        >
                          Reset
                        </button>

                        <button
                          onClick={moveRight}
                          className="control-btn control-btn-outline"
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
                    </div>

                    {/* Rotation Controls */}
                    <div className="control-group">
                      <div className="control-group-label">Rotation</div>
                      <div className="rotation-controls">
                        <button
                          onClick={rotateLeft}
                          className="control-btn control-btn-outline"
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
                          Rotate ↺
                        </button>

                        <button
                          onClick={rotateRight}
                          className="control-btn control-btn-primary"
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
                      { value: "bw", label: "B & W" },
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
                >
                  <span>Continue to Print →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button (FAB) */}
      <button
        className="mobile-fab"
        onClick={() => setShowMobileControls(!showMobileControls)}
      >
        {showMobileControls ? "✕" : "✎"}
      </button>

      {/* Mobile Controls Bottom Sheet */}
      {showMobileControls && (
        <div className="mobile-bottom-sheet">
          <div className="bottom-sheet-content">
            {/* Photo Controls - Mobile Version */}
            {selectedPhotoIndex !== null && (
              <div className="mobile-photo-controls">
                <div className="mobile-control-header">
                  Photo #{selectedPhotoIndex + 1}
                </div>

                {/* Position */}
                <div className="mobile-control-row">
                  <button onClick={moveLeft} className="mobile-control-btn">
                    ← Left
                  </button>
                  <button
                    onClick={resetPosition}
                    className="mobile-control-btn"
                  >
                    Reset
                  </button>
                  <button onClick={moveRight} className="mobile-control-btn">
                    Right →
                  </button>
                </div>

                {/* Rotation */}
                <div className="mobile-control-row">
                  <button onClick={rotateLeft} className="mobile-control-btn">
                    ↺ Rotate L
                  </button>
                  <button
                    onClick={rotateRight}
                    className="mobile-control-btn mobile-control-btn-primary"
                  >
                    Rotate R ↻
                  </button>
                </div>
              </div>
            )}

            {/* Quick Filters */}
            <div className="mobile-quick-section">
              <div className="mobile-section-title">Filters</div>
              <div className="mobile-filter-row">
                {["none", "burnt-coffee", "ocean-wave", "bw"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`mobile-filter-btn ${
                      filter === f ? "active" : ""
                    }`}
                  >
                    {f === "none" ? "None" : f.split("-")[0]}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleProceedToPrintWholeSheet}
              className="mobile-action-btn"
            >
              Continue to Print →
            </button>
          </div>
        </div>
      )}

      {/* CSS Styles */}
      <style jsx>{`
        .preview-screen-container {
          width: 100vw;
          min-height: 100vh;
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
          padding: 16px;
          box-sizing: border-box;
        }

        /* Background Blobs */
        .bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          z-index: 0;
          animation: float 20s ease-in-out infinite;
        }

        .bg-blob-1 {
          top: -100px;
          right: -100px;
          width: 300px;
          height: 300px;
          background: radial-gradient(
            circle,
            ${COLORS.PRIMARY_BLUE}12 0%,
            transparent 70%
          );
        }

        .bg-blob-2 {
          bottom: -150px;
          left: -150px;
          width: 400px;
          height: 400px;
          background: radial-gradient(
            circle,
            ${COLORS.ACCENT_YELLOW}10 0%,
            transparent 70%
          );
          animation: float 25s ease-in-out infinite reverse;
        }

        /* Upload Toast */
        .upload-toast {
          position: fixed;
          top: 16px;
          right: 16px;
          padding: 12px 20px;
          background: linear-gradient(
            135deg,
            ${COLORS.ACCENT_YELLOW} 0%,
            #ffd700 100%
          );
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          color: ${COLORS.TEXT_BLACK};
          box-shadow: 0 8px 24px ${COLORS.ACCENT_YELLOW}50;
          z-index: 1000;
          animation: slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .toast-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${COLORS.DEEP_BLUE};
          animation: pulse 2s ease-in-out infinite;
        }

        /* Content Wrapper */
        .content-wrapper {
          width: 100%;
          max-width: 1400px;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 1;
        }

        /* Header */
        .header {
          text-align: center;
          margin-bottom: 20px;
          animation: fadeInDown 0.6s ease-out;
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
          font-size: clamp(20px, 5vw, 28px);
          font-weight: 800;
          margin-bottom: 6px;
          letter-spacing: -0.8px;
        }

        .subtitle {
          color: #5a6c7d;
          font-size: clamp(12px, 3vw, 14px);
          font-weight: 500;
          margin: 0;
        }

        /* Main Content */
        .main-content {
          display: flex;
          gap: 24px;
          align-items: stretch;
          justify-content: center;
          width: 100%;
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
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
          border: 2px solid rgba(255, 255, 255, 0.5);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        /* Section Label */
        .section-label {
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
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

        .label-dot-blue {
          background: linear-gradient(
            135deg,
            ${COLORS.PRIMARY_BLUE} 0%,
            ${COLORS.DEEP_BLUE} 100%
          );
          box-shadow: 0 0 12px ${COLORS.PRIMARY_BLUE}80;
        }

        .section-label h3 {
          color: ${COLORS.TEXT_BLACK};
          font-size: clamp(16px, 4vw, 18px);
          font-weight: 800;
          margin: 0;
        }

        /* Preview Canvas */
        .preview-canvas {
          width: 100%;
          flex: 1;
          padding: 18px;
          box-sizing: border-box;
          border-radius: 14px;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.15);
          transition: background-color 0.4s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .photo-grid {
          width: 100%;
          max-height: 100%;
          display: grid;
          gap: 14px;
        }

        .photo-frame {
          width: 100%;
          height: 100%;
          background-color: #f0f0f0;
          border-radius: 8px;
          overflow: hidden;
          box-sizing: border-box;
          border: 3px solid transparent;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          position: relative;
        }

        .photo-frame.selected {
          border: 3px solid ${COLORS.ACCENT_YELLOW};
          box-shadow: 0 6px 20px ${COLORS.ACCENT_YELLOW}40;
          transform: scale(0.98);
        }

        .photo-frame:hover:not(.selected) {
          transform: scale(1.02);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        .photo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
          transition: transform 0.3s ease;
        }

        .empty-frame {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9aa0a6;
          font-size: 12px;
          font-weight: 600;
        }

        /* Customize Section */
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
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
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
        }

        /* Photo Controls */
        .photo-controls {
          margin-bottom: 24px;
          padding: 16px;
          background: ${COLORS.PRIMARY_BLUE}10;
          border-radius: 12px;
          border: 2px solid ${COLORS.PRIMARY_BLUE}30;
        }

        .control-label {
          display: block;
          margin-bottom: 12px;
          color: ${COLORS.TEXT_BLACK};
          font-size: 14px;
          font-weight: 700;
        }

        .control-group {
          margin-bottom: 12px;
        }

        .control-group:last-child {
          margin-bottom: 0;
        }

        .control-group-label {
          font-size: 12px;
          color: #5a6c7d;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .position-controls,
        .rotation-controls {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
        }

        .rotation-controls {
          grid-template-columns: 1fr 1fr;
        }

        .control-btn {
          padding: 10px;
          font-size: 13px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          transition: all 0.3s ease;
          border: none;
          min-height: 44px; /* Touch-friendly */
        }

        .control-btn-outline {
          border: 2px solid ${COLORS.PRIMARY_BLUE};
          background: ${COLORS.BASE_WHITE};
          color: ${COLORS.DEEP_BLUE};
        }

        .control-btn-outline:hover {
          background: ${COLORS.LIGHT_BACKGROUND};
          transform: scale(1.05);
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

        .control-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px ${COLORS.DEEP_BLUE}40;
        }

        /* Customize Group */
        .customize-group {
          margin-bottom: 24px;
        }

        .color-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 12px;
        }

        .color-btn {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 10px;
          border: 3px solid #e0e0e0;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
          min-height: 44px; /* Touch-friendly */
        }

        .color-btn.active {
          border: 3px solid ${COLORS.ACCENT_YELLOW};
          box-shadow: 0 6px 16px ${COLORS.ACCENT_YELLOW}40;
          transform: scale(1.05);
        }

        .color-btn:hover:not(.active) {
          transform: scale(1.08);
          box-shadow: 0 5px 14px rgba(0, 0, 0, 0.15);
        }

        .color-picker {
          width: 100%;
          height: 48px; /* Touch-friendly height */
          border-radius: 10px;
          border: 2px solid ${COLORS.LIGHT_GREY};
          cursor: pointer;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
          margin-bottom: 10px;
        }

        .info-box {
          padding: 10px 14px;
          background: ${COLORS.LIGHT_BACKGROUND}30;
          border-radius: 8px;
          font-size: 11px;
          color: #5a6c7d;
          font-weight: 500;
          border: 1px solid ${COLORS.PRIMARY_BLUE}20;
        }

        /* Filter Grid */
        .filter-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .filter-btn {
          padding: 12px 16px;
          border-radius: 10px;
          border: 2px solid ${COLORS.LIGHT_GREY};
          background: linear-gradient(
            135deg,
            ${COLORS.BASE_WHITE} 0%,
            ${COLORS.LIGHT_GREY}40 100%
          );
          color: ${COLORS.TEXT_BLACK};
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
          min-height: 48px; /* Touch-friendly */
        }

        .filter-btn.active {
          border: 3px solid ${COLORS.ACCENT_YELLOW};
          background: linear-gradient(
            135deg,
            ${COLORS.ACCENT_YELLOW} 0%,
            #ffd700 100%
          );
          font-weight: 800;
          box-shadow: 0 6px 16px ${COLORS.ACCENT_YELLOW}35;
          transform: scale(1.02);
        }

        .filter-btn:hover:not(.active) {
          transform: scale(1.05);
          box-shadow: 0 5px 14px rgba(0, 0, 0, 0.12);
        }

        .checkmark {
          margin-left: 5px;
          font-size: 11px;
        }

        /* Upload Progress */
        .upload-progress {
          padding: 14px 18px;
          background: linear-gradient(
            135deg,
            ${COLORS.PRIMARY_BLUE}15 0%,
            ${COLORS.PRIMARY_BLUE}08 100%
          );
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 20px;
          color: ${COLORS.DEEP_BLUE};
          border: 2px solid ${COLORS.PRIMARY_BLUE}25;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
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
          padding: 16px 28px;
          font-size: 15px;
          font-weight: 800;
          border-radius: 12px;
          border: none;
          background: linear-gradient(
            135deg,
            ${COLORS.DEEP_BLUE} 0%,
            ${COLORS.PRIMARY_BLUE} 100%
          );
          color: ${COLORS.BASE_WHITE};
          cursor: pointer;
          box-shadow: 0 8px 24px ${COLORS.DEEP_BLUE}40;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
          min-height: 52px; /* Touch-friendly */
        }

        .action-btn:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 14px 35px ${COLORS.DEEP_BLUE}45;
        }

        /* Mobile FAB - Hidden on Desktop */
        .mobile-fab {
          display: none;
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(
            135deg,
            ${COLORS.DEEP_BLUE} 0%,
            ${COLORS.PRIMARY_BLUE} 100%
          );
          color: white;
          border: none;
          font-size: 24px;
          box-shadow: 0 8px 24px ${COLORS.DEEP_BLUE}60;
          cursor: pointer;
          z-index: 999;
          transition: all 0.3s ease;
        }

        .mobile-fab:active {
          transform: scale(0.95);
        }

        /* Mobile Bottom Sheet - Hidden on Desktop */
        .mobile-bottom-sheet {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-radius: 24px 24px 0 0;
          box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.2);
          z-index: 998;
          animation: slideUp 0.3s ease-out;
          max-height: 70vh;
          overflow-y: auto;
        }

        .bottom-sheet-content {
          padding: 24px;
        }

        .mobile-photo-controls {
          margin-bottom: 20px;
          padding: 16px;
          background: ${COLORS.PRIMARY_BLUE}10;
          border-radius: 12px;
        }

        .mobile-control-header {
          font-size: 14px;
          font-weight: 700;
          color: ${COLORS.TEXT_BLACK};
          margin-bottom: 12px;
        }

        .mobile-control-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          margin-bottom: 8px;
        }

        .mobile-control-row:last-child {
          grid-template-columns: 1fr 1fr;
          margin-bottom: 0;
        }

        .mobile-control-btn {
          padding: 12px;
          font-size: 14px;
          font-weight: 700;
          border-radius: 10px;
          border: 2px solid ${COLORS.PRIMARY_BLUE};
          background: white;
          color: ${COLORS.DEEP_BLUE};
          cursor: pointer;
          min-height: 48px; /* Touch-friendly */
          transition: all 0.2s ease;
        }

        .mobile-control-btn:active {
          transform: scale(0.95);
        }

        .mobile-control-btn-primary {
          background: linear-gradient(
            135deg,
            ${COLORS.DEEP_BLUE} 0%,
            ${COLORS.PRIMARY_BLUE} 100%
          );
          color: white;
          border: none;
        }

        .mobile-quick-section {
          margin-bottom: 20px;
        }

        .mobile-section-title {
          font-size: 14px;
          font-weight: 700;
          color: ${COLORS.TEXT_BLACK};
          margin-bottom: 12px;
        }

        .mobile-filter-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .mobile-filter-btn {
          padding: 10px;
          font-size: 12px;
          font-weight: 600;
          border-radius: 8px;
          border: 2px solid ${COLORS.LIGHT_GREY};
          background: white;
          color: ${COLORS.TEXT_BLACK};
          cursor: pointer;
          min-height: 44px; /* Touch-friendly */
          transition: all 0.2s ease;
        }

        .mobile-filter-btn.active {
          background: ${COLORS.ACCENT_YELLOW};
          border-color: ${COLORS.ACCENT_YELLOW};
          font-weight: 700;
        }

        .mobile-filter-btn:active {
          transform: scale(0.95);
        }

        .mobile-action-btn {
          width: 100%;
          padding: 16px;
          font-size: 16px;
          font-weight: 800;
          border-radius: 12px;
          border: none;
          background: linear-gradient(
            135deg,
            ${COLORS.DEEP_BLUE} 0%,
            ${COLORS.PRIMARY_BLUE} 100%
          );
          color: white;
          cursor: pointer;
          min-height: 52px; /* Touch-friendly */
        }

        .mobile-action-btn:active {
          transform: scale(0.98);
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
            transform: translate(30px, -30px);
          }
        }

        /* 📱 RESPONSIVE MEDIA QUERIES */

        /* Tablet (≤1024px) */
        @media (max-width: 1024px) {
          .main-content {
            flex-direction: column;
            gap: 20px;
          }

          .preview-section,
          .customize-section {
            max-width: 100%;
          }

          .customize-card {
            max-height: 500px;
          }
        }

        /* Mobile Large (≤768px) */
        @media (max-width: 768px) {
          .preview-screen-container {
            padding: 12px;
            min-height: 100dvh; /* Dynamic viewport height for mobile */
          }

          .header {
            margin-bottom: 16px;
          }

          .title {
            font-size: 20px;
          }

          .subtitle {
            font-size: 12px;
          }

          .main-content {
            gap: 16px;
          }

          .preview-card,
          .customize-card {
            padding: 16px;
            border-radius: 16px;
          }

          .photo-grid {
            gap: 10px;
          }

          .photo-frame {
            border-radius: 6px;
          }

          /* Hide desktop customize section on mobile */
          .customize-section {
            display: none;
          }

          /* Show mobile FAB and bottom sheet */
          .mobile-fab {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .mobile-bottom-sheet {
            display: block;
          }

          .color-grid {
            grid-template-columns: repeat(6, 1fr);
            gap: 8px;
          }

          .filter-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
          }
        }

        /* Mobile Small (≤480px) */
        @media (max-width: 480px) {
          .preview-screen-container {
            padding: 8px;
          }

          .header {
            margin-bottom: 12px;
          }

          .title {
            font-size: 18px;
          }

          .subtitle {
            font-size: 11px;
          }

          .preview-card {
            padding: 12px;
          }

          .photo-grid {
            gap: 8px;
          }

          .section-label h3 {
            font-size: 14px;
          }

          .upload-toast {
            top: 12px;
            right: 12px;
            left: 12px;
            font-size: 11px;
            padding: 10px 16px;
          }

          .mobile-fab {
            width: 52px;
            height: 52px;
            bottom: 16px;
            right: 16px;
            font-size: 20px;
          }

          .bottom-sheet-content {
            padding: 20px;
          }

          .color-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .filter-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .mobile-filter-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Extra Small Mobile (≤360px) */
        @media (max-width: 360px) {
          .title {
            font-size: 16px;
          }

          .mobile-control-row {
            grid-template-columns: 1fr;
          }

          .mobile-filter-row {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* Landscape Mobile */
        @media (max-height: 600px) and (orientation: landscape) {
          .preview-screen-container {
            min-height: auto;
            padding: 12px;
          }

          .header {
            margin-bottom: 12px;
          }

          .main-content {
            flex-direction: row;
            gap: 16px;
          }

          .preview-section {
            flex: 1 1 60%;
          }

          .customize-section {
            display: flex;
            flex: 1 1 40%;
            max-width: 320px;
          }

          .mobile-fab,
          .mobile-bottom-sheet {
            display: none;
          }
        }

        /* Touch Device Optimization */
        @media (hover: none) and (pointer: coarse) {
          .control-btn,
          .color-btn,
          .filter-btn,
          .action-btn,
          .mobile-control-btn,
          .mobile-filter-btn,
          .mobile-action-btn {
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }

          /* Increase touch target sizes */
          .photo-frame {
            min-height: 80px;
            min-width: 80px;
          }
        }
      `}</style>
    </div>
  );
}
