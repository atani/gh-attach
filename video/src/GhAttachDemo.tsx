import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Sequence,
} from "remotion";
import { Terminal } from "./Terminal";
import { TerminalLine, TypingLine, type TextSegment } from "./TerminalLine";

const PROMPT: TextSegment[] = [
  { text: "$ ", color: "green", bold: true },
];

// Scene 1: Title (frames 0-89, 3s)
const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [70, 89], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d1117",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          opacity: titleOpacity,
          fontSize: 72,
          fontWeight: "bold",
          color: "#e5e5e5",
          fontFamily: "'SF Mono', 'Monaco', 'Menlo', monospace",
          letterSpacing: -2,
        }}
      >
        gh-attach
      </div>
      <div
        style={{
          opacity: subtitleOpacity,
          fontSize: 24,
          color: "#8b949e",
          fontFamily: "'SF Mono', 'Monaco', 'Menlo', monospace",
          marginTop: 16,
        }}
      >
        Upload images to GitHub Issues with one command
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Install (frames 90-179, 3s)
const InstallScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d1117",
        padding: 40,
        opacity: fadeIn,
      }}
    >
      <div
        style={{
          fontSize: 16,
          color: "#8b949e",
          fontFamily: "'SF Mono', monospace",
          marginBottom: 12,
          textTransform: "uppercase",
          letterSpacing: 2,
        }}
      >
        Install
      </div>
      <Terminal title="Terminal -- Install">
        <TerminalLine
          segments={[{ text: "# Homebrew", color: "gray" }]}
          showAtFrame={5}
        />
        <TypingLine
          text="brew install atani/tap/gh-attach"
          startFrame={15}
          typingSpeed={0.8}
          prefix={PROMPT}
        />
        <TerminalLine
          segments={[]}
          showAtFrame={65}
        />
        <TerminalLine
          segments={[{ text: "# Or as gh extension", color: "gray" }]}
          showAtFrame={65}
        />
        <TypingLine
          text="gh extension install atani/gh-attach"
          startFrame={75}
          typingSpeed={0.8}
          prefix={PROMPT}
        />
      </Terminal>
    </AbsoluteFill>
  );
};

// Scene 3: Basic Usage (frames 180-299, 4s)
const BasicUsageScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d1117",
        padding: 40,
        opacity: fadeIn,
      }}
    >
      <div
        style={{
          fontSize: 16,
          color: "#8b949e",
          fontFamily: "'SF Mono', monospace",
          marginBottom: 12,
          textTransform: "uppercase",
          letterSpacing: 2,
        }}
      >
        Basic Usage
      </div>
      <Terminal title="Terminal -- gh-attach">
        <TypingLine
          text="gh-attach --issue 123 --image ./screenshot.png"
          startFrame={10}
          typingSpeed={0.6}
          prefix={PROMPT}
        />
        <TerminalLine
          segments={[
            { text: "Waiting for GitHub page to load...", color: "gray" },
          ]}
          showAtFrame={95}
        />
        <TerminalLine
          segments={[
            { text: "GitHub page loaded.", color: "gray" },
          ]}
          showAtFrame={105}
        />
        <TerminalLine
          segments={[
            { text: "Comment updated: ", color: "white" },
            {
              text: "https://github.com/you/repo/pull/123#issuecomment-123456",
              color: "cyan",
            },
          ]}
          showAtFrame={115}
        />
      </Terminal>
    </AbsoluteFill>
  );
};

// Scene 4: Release Mode (frames 300-389, 3s)
const ReleaseModeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });
  const badgeOpacity = interpolate(frame, [80, 90], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d1117",
        padding: 40,
        opacity: fadeIn,
      }}
    >
      <div
        style={{
          fontSize: 16,
          color: "#8b949e",
          fontFamily: "'SF Mono', monospace",
          marginBottom: 12,
          textTransform: "uppercase",
          letterSpacing: 2,
        }}
      >
        Release Mode
      </div>
      <Terminal title="Terminal -- Release Mode">
        <TypingLine
          text="gh-attach --issue 123 --image ./e2e.png --release"
          startFrame={10}
          typingSpeed={0.6}
          prefix={PROMPT}
        />
        <TerminalLine
          segments={[
            { text: "Comment updated: ", color: "white" },
            {
              text: "https://github.com/you/repo/pull/123#issuecomment-789012",
              color: "cyan",
            },
          ]}
          showAtFrame={70}
        />
      </Terminal>
      <div
        style={{
          opacity: badgeOpacity,
          marginTop: 16,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#238636",
            color: "#ffffff",
            padding: "8px 20px",
            borderRadius: 6,
            fontSize: 18,
            fontFamily: "'SF Mono', monospace",
            fontWeight: "bold",
          }}
        >
          No browser needed -- CLI auth only
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Summary (frames 390-449, 2s)
const SummaryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const features = [
    "GitHub.com & Enterprise",
    "Browser mode & Release mode",
    "Single & multiple images",
    "gh extension support",
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d1117",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeIn,
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: "bold",
          color: "#e5e5e5",
          fontFamily: "'SF Mono', monospace",
          marginBottom: 24,
        }}
      >
        gh-attach
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 24,
        }}
      >
        {features.map((feature, i) => {
          const itemOpacity = interpolate(
            frame,
            [10 + i * 5, 15 + i * 5],
            [0, 1],
            { extrapolateRight: "clamp" },
          );
          return (
            <div
              key={i}
              style={{
                opacity: itemOpacity,
                fontSize: 20,
                color: "#8b949e",
                fontFamily: "'SF Mono', monospace",
              }}
            >
              <span style={{ color: "#22c55e" }}>&#10003; </span>
              {feature}
            </div>
          );
        })}
      </div>
      <div
        style={{
          fontSize: 22,
          color: "#58a6ff",
          fontFamily: "'SF Mono', monospace",
        }}
      >
        github.com/atani/gh-attach
      </div>
    </AbsoluteFill>
  );
};

export const GhAttachDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0d1117" }}>
      <Sequence from={0} durationInFrames={90}>
        <TitleScene />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <InstallScene />
      </Sequence>
      <Sequence from={180} durationInFrames={120}>
        <BasicUsageScene />
      </Sequence>
      <Sequence from={300} durationInFrames={90}>
        <ReleaseModeScene />
      </Sequence>
      <Sequence from={390} durationInFrames={60}>
        <SummaryScene />
      </Sequence>
    </AbsoluteFill>
  );
};
