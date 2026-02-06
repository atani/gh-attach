import React from "react";

interface TerminalProps {
  children: React.ReactNode;
  title?: string;
}

export const Terminal: React.FC<TerminalProps> = ({
  children,
  title = "Terminal",
}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#1e1e1e",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'SF Mono', 'Monaco', 'Menlo', monospace",
        fontSize: 18,
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        style={{
          height: 40,
          backgroundColor: "#323232",
          display: "flex",
          alignItems: "center",
          paddingLeft: 14,
          gap: 8,
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: "#ff5f57",
          }}
        />
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: "#febc2e",
          }}
        />
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: "#28c840",
          }}
        />
        <span style={{ marginLeft: 8, color: "#888", fontSize: 14 }}>
          {title}
        </span>
      </div>
      <div style={{ flex: 1, padding: 20, overflowY: "auto", lineHeight: 1.7 }}>
        {children}
      </div>
    </div>
  );
};
