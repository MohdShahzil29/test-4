import { useState } from "react";
import React from "react";
export default function PrintScreen({
  printCopies,
  resetApp,
  btnPrimary,
  COLORS,
}) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("preparing");

  // Simulate printing progress
  React.useEffect(() => {
    const steps = [
      { label: "preparing", duration: 1000, progress: 25 },
      { label: "processing", duration: 1500, progress: 50 },
      { label: "printing", duration: 2000, progress: 85 },
      { label: "complete", duration: 1000, progress: 100 },
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < steps.length) {
        setCurrentStep(steps[currentIndex].label);
        setProgress(steps[currentIndex].progress);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const getStepMessage = () => {
    const messages = {
      preparing: "Preparing your photos...",
      processing: "Processing image data...",
      printing: `Printing ${printCopies} ${
        printCopies === 1 ? "copy" : "copies"
      }...`,
      complete: "Print complete! ✓",
    };
    return messages[currentStep];
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
          background: `radial-gradient(circle, ${COLORS.ACCENT_YELLOW}15 0%, transparent 70%)`,
          filter: "blur(80px)",
          zIndex: 0,
          animation: "float 15s ease-in-out infinite",
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
          background: `radial-gradient(circle, ${COLORS.PRIMARY_BLUE}12 0%, transparent 70%)`,
          filter: "blur(90px)",
          zIndex: 0,
          animation: "float 20s ease-in-out infinite reverse",
        }}
      />

      {/* Main Content Card */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "600px",
          width: "100%",
          background: `linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)`,
          backdropFilter: "blur(30px) saturate(180%)",
          WebkitBackdropFilter: "blur(30px) saturate(180%)",
          borderRadius: "32px",
          padding: "50px 40px",
          boxShadow: `0 30px 60px rgba(0, 0, 0, 0.15),
                      0 0 0 1px rgba(255, 255, 255, 0.8),
                      inset 0 1px 0 rgba(255, 255, 255, 1)`,
          border: `2px solid rgba(255, 255, 255, 0.6)`,
          textAlign: "center",
          animation: "scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Header */}
        <h1
          style={{
            background: `linear-gradient(135deg, ${COLORS.DEEP_BLUE} 0%, ${COLORS.PRIMARY_BLUE} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontSize: "32px",
            fontWeight: "900",
            marginBottom: "12px",
            letterSpacing: "-0.8px",
          }}
        >
          {currentStep === "complete" ? "All Done! 🎉" : "Printing in Progress"}
        </h1>

        <p
          style={{
            color: "#5a6c7d",
            fontSize: "16px",
            fontWeight: "500",
            marginBottom: "50px",
            letterSpacing: "0.2px",
          }}
        >
          {getStepMessage()}
        </p>

        {/* Enhanced Printer Animation */}
        <div
          style={{
            position: "relative",
            width: "280px",
            height: "220px",
            margin: "0 auto 50px",
          }}
        >
          {/* Printer Body - Modern Design */}
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "50%",
              transform: "translateX(-50%)",
              width: "240px",
              height: "110px",
              background: `linear-gradient(145deg, #34495e 0%, #2c3e50 100%)`,
              borderRadius: "16px 16px 0 0",
              boxShadow: `0 10px 30px rgba(0,0,0,0.3),
                          inset 0 2px 0 rgba(255, 255, 255, 0.1)`,
              zIndex: 2,
            }}
          >
            {/* Printer Display Screen */}
            <div
              style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                width: "80px",
                height: "40px",
                background: `linear-gradient(135deg, ${COLORS.PRIMARY_BLUE}30 0%, ${COLORS.DEEP_BLUE}20 100%)`,
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: "800",
                color: COLORS.DEEP_BLUE,
                border: `2px solid ${COLORS.PRIMARY_BLUE}40`,
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {progress}%
            </div>

            {/* Status Light */}
            <div
              style={{
                position: "absolute",
                top: "25px",
                right: "30px",
                width: "16px",
                height: "16px",
                background:
                  currentStep === "complete"
                    ? `linear-gradient(135deg, #10b981 0%, #059669 100%)`
                    : `linear-gradient(135deg, ${COLORS.ACCENT_YELLOW} 0%, #ffd700 100%)`,
                borderRadius: "50%",
                boxShadow:
                  currentStep === "complete"
                    ? "0 0 20px #10b981"
                    : `0 0 20px ${COLORS.ACCENT_YELLOW}`,
                animation:
                  currentStep === "complete"
                    ? "pulse 1.5s ease-in-out 3"
                    : "blink 1s ease-in-out infinite",
              }}
            />

            {/* Printer Control Panel Lines */}
            <div
              style={{
                position: "absolute",
                bottom: "15px",
                left: "30px",
                display: "flex",
                gap: "8px",
              }}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: "30px",
                    height: "4px",
                    background: "#1a252f",
                    borderRadius: "2px",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Paper Tray Base */}
          <div
            style={{
              position: "absolute",
              bottom: "0",
              left: "50%",
              transform: "translateX(-50%)",
              width: "260px",
              height: "30px",
              background: `linear-gradient(145deg, #95a5a6 0%, #7f8c8d 100%)`,
              borderRadius: "4px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              zIndex: 0,
            }}
          />

          {/* Paper Coming Out - Enhanced */}
          <div
            style={{
              position: "absolute",
              bottom: "30px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "180px",
              height: currentStep === "complete" ? "140px" : "120px",
              background: `linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)`,
              border: `3px solid ${COLORS.LIGHT_GREY}`,
              borderRadius: "8px 8px 0 0",
              boxShadow: `0 8px 20px rgba(0,0,0,0.15),
                          inset 0 2px 0 rgba(255, 255, 255, 1)`,
              animation:
                currentStep === "printing"
                  ? "printPaper 2s ease-in-out infinite"
                  : currentStep === "complete"
                  ? "paperComplete 0.6s ease-out forwards"
                  : "none",
              zIndex: 1,
              transition: "height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            {/* Photo Grid Preview on Paper */}
            <div
              style={{
                padding: "16px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                height: "100%",
              }}
            >
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.LIGHT_BACKGROUND}60 0%, ${COLORS.PRIMARY_BLUE}20 100%)`,
                    borderRadius: "6px",
                    opacity: 0,
                    animation: `fadeInPhoto 0.8s ease-out ${i * 0.3}s forwards`,
                    border: `2px solid ${COLORS.PRIMARY_BLUE}30`,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                />
              ))}
            </div>

            {/* Success Checkmark on Complete */}
            {currentStep === "complete" && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${COLORS.ACCENT_YELLOW} 0%, #ffd700 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 8px 24px ${COLORS.ACCENT_YELLOW}60,
                              0 0 0 4px ${COLORS.BASE_WHITE}`,
                  animation:
                    "checkmarkPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                  zIndex: 10,
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.TEXT_BLACK}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    animation: "drawCheck 0.5s ease-out 0.3s forwards",
                  }}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar - Modern Design */}
        <div
          style={{
            width: "100%",
            marginBottom: "40px",
          }}
        >
          {/* Progress Bar Container */}
          <div
            style={{
              width: "100%",
              height: "12px",
              background: `${COLORS.LIGHT_GREY}`,
              borderRadius: "20px",
              overflow: "hidden",
              position: "relative",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {/* Progress Fill */}
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${COLORS.DEEP_BLUE} 0%, ${COLORS.PRIMARY_BLUE} 50%, ${COLORS.ACCENT_YELLOW} 100%)`,
                borderRadius: "20px",
                transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                boxShadow: `0 0 20px ${COLORS.PRIMARY_BLUE}60`,
                position: "relative",
              }}
            >
              {/* Shimmer Effect on Progress Bar */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                  animation: "shimmer 2s infinite",
                }}
              />
            </div>
          </div>

          {/* Progress Steps Indicators */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
              gap: "10px",
            }}
          >
            {["Prepare", "Process", "Print", "Done"].map((step, index) => {
              const stepProgress = [25, 50, 85, 100][index];
              const isActive = progress >= stepProgress;
              const isCurrent =
                progress >= stepProgress &&
                progress < (stepProgress + 25 || 101);

              return (
                <div
                  key={step}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: isActive
                        ? `linear-gradient(135deg, ${COLORS.ACCENT_YELLOW} 0%, #ffd700 100%)`
                        : `${COLORS.LIGHT_GREY}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "800",
                      color: isActive ? COLORS.TEXT_BLACK : "#9ca3af",
                      border: `3px solid ${
                        isActive ? COLORS.ACCENT_YELLOW : "#e0e0e0"
                      }`,
                      boxShadow: isActive
                        ? `0 6px 20px ${COLORS.ACCENT_YELLOW}40`
                        : "none",
                      transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      transform: isCurrent ? "scale(1.15)" : "scale(1)",
                    }}
                  >
                    {isActive ? "✓" : index + 1}
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: isActive ? COLORS.TEXT_BLACK : "#9ca3af",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Message */}
        <div
          style={{
            padding: "18px 24px",
            background: `linear-gradient(135deg, ${COLORS.LIGHT_BACKGROUND}40 0%, ${COLORS.PRIMARY_BLUE}10 100%)`,
            borderRadius: "16px",
            marginBottom: "30px",
            border: `2px solid ${COLORS.PRIMARY_BLUE}20`,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#5a6c7d",
              fontSize: "14px",
              fontWeight: "600",
              lineHeight: "1.6",
            }}
          >
            {currentStep === "complete"
              ? "🎉 Your photos have been printed successfully!"
              : "⏱️ Please wait while we prepare your photo strip..."}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={resetApp}
          disabled={currentStep !== "complete"}
          onMouseEnter={(e) => {
            if (currentStep === "complete") {
              e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
              e.currentTarget.style.boxShadow = `0 16px 40px ${COLORS.DEEP_BLUE}45`;
            }
          }}
          onMouseLeave={(e) => {
            if (currentStep === "complete") {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = `0 10px 28px ${COLORS.DEEP_BLUE}40`;
            }
          }}
          style={{
            width: "100%",
            padding: "18px 32px",
            fontSize: "17px",
            fontWeight: "800",
            borderRadius: "14px",
            border: "none",
            background:
              currentStep === "complete"
                ? `linear-gradient(135deg, ${COLORS.DEEP_BLUE} 0%, ${COLORS.PRIMARY_BLUE} 100%)`
                : "#c5c9d0",
            color: COLORS.BASE_WHITE,
            cursor: currentStep === "complete" ? "pointer" : "not-allowed",
            opacity: currentStep === "complete" ? 1 : 0.6,
            boxShadow:
              currentStep === "complete"
                ? `0 10px 28px ${COLORS.DEEP_BLUE}40,
                   inset 0 1px 0 rgba(255, 255, 255, 0.3)`
                : "none",
            transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            letterSpacing: "0.5px",
            outline: "none",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {currentStep === "complete" && (
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
          )}
          <span style={{ position: "relative", zIndex: 1 }}>
            {currentStep === "complete"
              ? "Start New Session →"
              : "Please Wait..."}
          </span>
        </button>
      </div>

      {/* Enhanced CSS Animations */}
      <style>{`
        @keyframes printPaper {
          0% {
            transform: translateX(-50%) translateY(30px);
          }
          50% {
            transform: translateX(-50%) translateY(-5px);
          }
          100% {
            transform: translateX(-50%) translateY(30px);
          }
        }

        @keyframes paperComplete {
          from {
            transform: translateX(-50%) translateY(0);
          }
          to {
            transform: translateX(-50%) translateY(-10px);
          }
        }

        @keyframes fadeInPhoto {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes checkmarkPop {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes drawCheck {
          from {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
          }
          to {
            stroke-dasharray: 100;
            stroke-dashoffset: 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(30px, -30px);
          }
        }
      `}</style>
    </div>
  );
}
