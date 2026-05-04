# Antigravity Design System (Light Mode)

This document specifies the architecture and tokens for the immersive background system.

## 1. Core Philosophy

The background should feel weightless, deep, and reactive. It uses a custom **Motion Engine** that combines mouse interaction, scroll position, and time-based floating into a single unified transform.

## 2. Motion Engine Specification

### A. Smoothing (useMotionEngine.js)

- **Linear Interpolation (Lerp)**: Applied to all raw inputs to ensure 60fps fluidity.
- **Mouse Normalization**: Maps cursor position to `-0.5` to `0.5` relative to center.
- **Scroll Mapping**: Maps scroll offset to a `0.0` - `1.0` progress value.

### B. Transformation Logic (Layer.js)

- **Depth Variable**: The master controller for intensity.
  - `depth < 1`: Moves slower, appears distant.
  - `depth = 1`: Focus plane (maps 1:1 with motion).
  - `depth > 1`: Moves faster, appears closer.
- **Components of Transform**:
  - `Parallax`: Driven by scroll progress.
  - `Influence`: Driven by mouse offset.
  - `Floating`: Sinusoidal drifting driven by time.

## 3. Visual Specification (Light Mode)

### A. Color Palette

- **Background**: `#F9FAFB` (Soft White)
- **Primary Accent**: `#3B82F6` (Ocean Blue)
- **Secondary Accent**: `#8B5CF6` (Soft Violet)

### B. Element Architecture

1. **Atmospheric Blobs (5 units)**:
   - Deep background layers (depth 0.1 - 0.9).
   - Radial gradients with 100px blur.
   - Extremely low opacity (8%) to create scattered light.

2. **Background Particle Field (300 units)**:
   - Micro-dots (0.5px - 3px).
   - Low opacity (5% - 25%).
   - Provides texture and scale across the entire canvas.

3. **Hero Dots (20 units)**:
   - Prominent, visible interactive elements.
   - Size: 4px - 8px.
   - High Opacity: 30% - 60%.
   - High Amplitude: Noticeable floating motion (30px - 70px range).
   - Interactive Glow: Dynamic `box-shadow` matching accent colors.

## 4. Layout Transparency

To maintain immersion, all main sections must have `background-color: transparent`. Glassmorphism components use `rgba(249, 250, 251, 0.7)` with `backdrop-filter: blur(20px)` to maintain readability without breaking the background depth.
