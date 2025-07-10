import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";
import styles from "../../styles/SoundSpectrum.module.css";

interface SoundSpectrumProps {}

// Add visualization mode type
type VisualizationMode =
  | "bars"
  | "sphere"
  | "sphere3D"
  | "sphere4D"
  | "lightning"
  | "plasma"
  | "electricOrb";

const SoundSpectrum: React.FC<SoundSpectrumProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const frameCountRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  const rotationRef = useRef<number>(0);
  const rotation3DRef = useRef<{ x: number; y: number; z: number }>({
    x: 0,
    y: 0,
    z: 0,
  });
  const rotation4DRef = useRef<{
    xy: number;
    xz: number;
    xw: number;
    yz: number;
    yw: number;
    zw: number;
  }>({ xy: 0, xz: 0, xw: 0, yz: 0, yw: 0, zw: 0 });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState("/sounds/xiaoxingxing.mp3");
  const [visualizationMode, setVisualizationMode] =
    useState<VisualizationMode>("bars");

  const tracks = [
    { name: "Little Star", url: "/sounds/xiaoxingxing.mp3" },
    { name: "Piano Melody", url: "/sounds/marry_me_piano.mp3" },
    { name: "Xiaojiuwo", url: "/sounds/xiaojiuwo.mp3" },
  ];

  const drawInitialCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Clear canvas with dark background
        ctx.fillStyle = "rgb(15, 15, 35)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw initial message
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          "Click Play to start audio visualization",
          canvas.width / 2,
          canvas.height / 2
        );

        // Draw a subtle border
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  useEffect(() => {
    drawInitialCanvas();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const initializeAudio = async () => {
    if (!audioRef.current) return;

    try {
      // Create audio context if it doesn't exist
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        console.log("Audio context created:", audioContextRef.current);
      }

      // Resume audio context if suspended
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
        console.log("Audio context resumed");
      }

      // Create analyser if it doesn't exist
      if (!analyserRef.current) {
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 512; // Increased for better resolution
        analyserRef.current.smoothingTimeConstant = 0.3; // Reduced for more responsive visualization
        analyserRef.current.minDecibels = -90;
        analyserRef.current.maxDecibels = -10;

        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
        console.log("Analyser created, buffer length:", bufferLength);
      }

      // Create and connect audio source if it doesn't exist
      if (!sourceRef.current) {
        sourceRef.current = audioContextRef.current.createMediaElementSource(
          audioRef.current
        );
        console.log("Audio source created:", sourceRef.current);

        // Connect the audio graph
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        console.log("Audio graph connected");
      }

      console.log("Audio context state:", audioContextRef.current.state);
    } catch (error) {
      console.error("Error initializing audio:", error);
    }
  };

  const togglePlayPause = async () => {
    if (!audioRef.current) {
      console.log("Audio ref is null");
      return;
    }

    try {
      if (isPlaying) {
        console.log("Pausing audio");
        audioRef.current.pause();
        setIsPlaying(false);
        isPlayingRef.current = false;
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      } else {
        console.log("Starting audio");
        await initializeAudio();

        // Wait a bit for audio context to be ready
        await new Promise((resolve) => setTimeout(resolve, 100));

        console.log("Playing audio");
        await audioRef.current.play();
        setIsPlaying(true);
        isPlayingRef.current = true;

        console.log("Starting animation");
        draw();
      }
    } catch (error) {
      console.error("Error toggling play/pause:", error);
    }
  };

  const changeTrack = (trackUrl: string) => {
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      console.log("Changing track to:", trackUrl);

      audioRef.current.pause();
      setIsPlaying(false);
      isPlayingRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // Reset audio context connection
      if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
        console.log("Audio source disconnected");
      }

      setCurrentTrack(trackUrl);

      // Wait for the audio element to load the new track
      setTimeout(() => {
        if (wasPlaying) {
          console.log("Resuming playback with new track");
          togglePlayPause();
        }
      }, 200);
    }
  };

  const drawBars = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    dataArray: Uint8Array
  ) => {
    // Calculate bar dimensions
    const barWidth = canvas.width / dataArray.length;
    const barSpacing = 2;
    const actualBarWidth = barWidth - barSpacing;

    // Draw frequency bars
    for (let i = 0; i < dataArray.length; i++) {
      const frequency = dataArray[i];
      const barHeight = (frequency / 255) * canvas.height * 0.8; // Scale to 80% of canvas height
      const x = i * barWidth;
      const y = canvas.height - barHeight;

      // Create gradient for each bar based on frequency intensity
      const gradient = ctx.createLinearGradient(0, canvas.height, 0, y);
      const intensity = frequency / 255;

      if (intensity > 0.8) {
        gradient.addColorStop(0, "rgb(255, 20, 147)"); // Deep pink
        gradient.addColorStop(0.5, "rgb(255, 105, 180)"); // Hot pink
        gradient.addColorStop(1, "rgb(255, 182, 193)"); // Light pink
      } else if (intensity > 0.6) {
        gradient.addColorStop(0, "rgb(255, 69, 0)"); // Red orange
        gradient.addColorStop(0.5, "rgb(255, 140, 0)"); // Dark orange
        gradient.addColorStop(1, "rgb(255, 215, 0)"); // Gold
      } else if (intensity > 0.4) {
        gradient.addColorStop(0, "rgb(50, 205, 50)"); // Lime green
        gradient.addColorStop(0.5, "rgb(144, 238, 144)"); // Light green
        gradient.addColorStop(1, "rgb(173, 255, 47)"); // Green yellow
      } else if (intensity > 0.2) {
        gradient.addColorStop(0, "rgb(30, 144, 255)"); // Dodger blue
        gradient.addColorStop(0.5, "rgb(135, 206, 235)"); // Sky blue
        gradient.addColorStop(1, "rgb(173, 216, 230)"); // Light blue
      } else {
        gradient.addColorStop(0, "rgb(72, 61, 139)"); // Dark slate blue
        gradient.addColorStop(0.5, "rgb(147, 112, 219)"); // Medium purple
        gradient.addColorStop(1, "rgb(221, 160, 221)"); // Plum
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, actualBarWidth, barHeight);

      // Add a subtle glow effect for higher frequencies
      if (intensity > 0.3) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsl(${i * 2}, 70%, 50%)`;
        ctx.fillRect(x, y, actualBarWidth, barHeight);
        ctx.shadowBlur = 0;
      }
    }

    // Draw frequency labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";

    // Low, Mid, High frequency labels
    ctx.fillText("Low", canvas.width * 0.15, canvas.height - 10);
    ctx.fillText("Mid", canvas.width * 0.5, canvas.height - 10);
    ctx.fillText("High", canvas.width * 0.85, canvas.height - 10);
  };

  const drawSphere = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    dataArray: Uint8Array
  ) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = Math.min(canvas.width, canvas.height) * 0.15;
    const maxRadius = Math.min(canvas.width, canvas.height) * 0.35;

    // Calculate average amplitude for overall sphere size
    const avgAmplitude =
      dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
    const sphereRadius =
      baseRadius + (avgAmplitude / 255) * (maxRadius - baseRadius);

    // Update rotation
    rotationRef.current += 0.01;

    // Draw concentric circles with different frequencies
    const numLayers = 8;
    for (let layer = 0; layer < numLayers; layer++) {
      const layerRadius = sphereRadius * (1 - layer / numLayers);
      const segmentCount = Math.max(
        8,
        Math.floor(dataArray.length / numLayers)
      );

      for (let i = 0; i < segmentCount; i++) {
        const dataIndex = Math.floor((i / segmentCount) * dataArray.length);
        const frequency = dataArray[dataIndex];
        const intensity = frequency / 255;

        // Calculate position with rotation
        const angle =
          (i / segmentCount) * 2 * Math.PI + rotationRef.current * (layer + 1);
        const x = centerX + Math.cos(angle) * layerRadius;
        const y = centerY + Math.sin(angle) * layerRadius;

        // Vary particle size based on frequency
        const particleSize = 2 + intensity * 8;

        // Color based on frequency and layer
        const hue = (i / segmentCount) * 360 + layer * 45;
        const saturation = 70 + intensity * 30;
        const lightness = 30 + intensity * 60;

        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        ctx.shadowBlur = intensity * 20;
        ctx.shadowColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

        // Draw particle
        ctx.beginPath();
        ctx.arc(x, y, particleSize, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw central core
    const coreIntensity = Math.max.apply(null, Array.from(dataArray)) / 255;
    const coreRadius = 15 + coreIntensity * 25;
    const coreGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      coreRadius
    );
    coreGradient.addColorStop(0, `rgba(255, 255, 255, ${coreIntensity})`);
    coreGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, coreRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Draw outer ring
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 + coreIntensity * 0.3})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, sphereRadius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw mode label
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Sphere Mode", centerX, canvas.height - 20);
  };

  const drawSphere3D = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    dataArray: Uint8Array
  ) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = Math.min(canvas.width, canvas.height) * 0.2;
    const maxRadius = Math.min(canvas.width, canvas.height) * 0.3;

    // Calculate average amplitude for overall sphere size
    const avgAmplitude =
      dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
    const sphereRadius =
      baseRadius + (avgAmplitude / 255) * (maxRadius - baseRadius);

    // Update 3D rotation
    rotation3DRef.current.x += 0.005;
    rotation3DRef.current.y += 0.008;
    rotation3DRef.current.z += 0.003;

    // 3D sphere coordinates
    const numPoints = Math.min(dataArray.length, 200); // Limit points for performance
    const points3D: Array<{
      x: number;
      y: number;
      z: number;
      intensity: number;
      frequency: number;
      originalIndex: number;
    }> = [];

    // Generate points on sphere surface
    for (let i = 0; i < numPoints; i++) {
      const dataIndex = Math.floor((i / numPoints) * dataArray.length);
      const frequency = dataArray[dataIndex];
      const intensity = frequency / 255;

      // Spherical coordinates to Cartesian
      const phi = Math.acos(1 - 2 * (i / numPoints)); // 0 to PI
      const theta = Math.PI * (1 + Math.sqrt(5)) * i; // Golden angle spiral

      // Base sphere coordinates
      const radius = sphereRadius * (0.8 + intensity * 0.4); // Vary radius based on intensity
      let x = radius * Math.sin(phi) * Math.cos(theta);
      let y = radius * Math.sin(phi) * Math.sin(theta);
      let z = radius * Math.cos(phi);

      // Apply 3D rotation
      const { x: rx, y: ry, z: rz } = rotation3DRef.current;

      // Rotation around X-axis
      const y1 = y * Math.cos(rx) - z * Math.sin(rx);
      const z1 = y * Math.sin(rx) + z * Math.cos(rx);

      // Rotation around Y-axis
      const x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
      const z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);

      // Rotation around Z-axis
      const x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
      const y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);

      points3D.push({
        x: x3,
        y: y3,
        z: z2,
        intensity,
        frequency,
        originalIndex: i,
      });
    }

    // Sort points by z-depth (back to front)
    points3D.sort((a, b) => a.z - b.z);

    // Draw points with perspective projection
    const focalLength = 400;

    points3D.forEach((point, index) => {
      // Perspective projection
      const distance = focalLength + point.z;
      const scale = focalLength / distance;
      const x2D = centerX + point.x * scale;
      const y2D = centerY + point.y * scale;

      // Skip points that are too far behind
      if (distance <= 0) return;

      // Calculate depth-based effects
      const depthFactor = Math.max(0.1, Math.min(1, scale));
      const size = (3 + point.intensity * 12) * depthFactor;
      const alpha = 0.3 + point.intensity * 0.7 * depthFactor;

      // Color based on frequency position and depth
      const hue =
        (point.originalIndex / numPoints) * 360 + rotation3DRef.current.y * 50;
      const saturation = 60 + point.intensity * 40;
      const lightness = 20 + point.intensity * 60 + depthFactor * 20;

      // Add glow effect for high intensity points
      if (point.intensity > 0.5) {
        ctx.shadowBlur = point.intensity * 25 * depthFactor;
        ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
      }

      // Draw point
      ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x2D, y2D, size, 0, 2 * Math.PI);
      ctx.fill();

      // Reset shadow for next point
      ctx.shadowBlur = 0;
    });

    // Draw central core with 3D effect
    const coreIntensity = Math.max.apply(null, Array.from(dataArray)) / 255;
    const coreRadius = 20 + coreIntensity * 30;

    // Core gradient
    const coreGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      coreRadius
    );
    coreGradient.addColorStop(0, `rgba(255, 255, 255, ${coreIntensity * 0.8})`);
    coreGradient.addColorStop(
      0.5,
      `rgba(100, 200, 255, ${coreIntensity * 0.5})`
    );
    coreGradient.addColorStop(1, `rgba(50, 150, 255, 0)`);

    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, coreRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Draw wireframe sphere outline
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 + coreIntensity * 0.25})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, sphereRadius * 0.7, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw mode label
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText("3D Sphere Mode", centerX, canvas.height - 20);
  };

  const drawSphere4D = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    dataArray: Uint8Array
  ) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = Math.min(canvas.width, canvas.height) * 0.15;
    const maxRadius = Math.min(canvas.width, canvas.height) * 0.25;

    // Calculate average amplitude for overall hypersphere size
    const avgAmplitude =
      dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
    const hyperRadius =
      baseRadius + (avgAmplitude / 255) * (maxRadius - baseRadius);

    // Update 4D rotation (6 planes of rotation in 4D space)
    rotation4DRef.current.xy += 0.003;
    rotation4DRef.current.xz += 0.005;
    rotation4DRef.current.xw += 0.007;
    rotation4DRef.current.yz += 0.004;
    rotation4DRef.current.yw += 0.006;
    rotation4DRef.current.zw += 0.008;

    // 4D hypersphere coordinates
    const numPoints = Math.min(dataArray.length, 150); // Limit for performance
    const points4D: Array<{
      x: number;
      y: number;
      z: number;
      w: number;
      x3d: number;
      y3d: number;
      z3d: number; // After 4D→3D projection
      intensity: number;
      frequency: number;
      originalIndex: number;
    }> = [];

    // Generate points on 4D hypersphere surface
    for (let i = 0; i < numPoints; i++) {
      const dataIndex = Math.floor((i / numPoints) * dataArray.length);
      const frequency = dataArray[dataIndex];
      const intensity = frequency / 255;

      // 4D hypersphere parametric equations
      // Using generalized spherical coordinates for 4D
      const t1 = (i / numPoints) * 2 * Math.PI;
      const t2 = ((i * 0.618034) % 1) * Math.PI; // Golden ratio for distribution
      const t3 = ((i * 0.381966) % 1) * Math.PI;

      // 4D hypersphere coordinates (unit hypersphere)
      const radius = hyperRadius * (0.7 + intensity * 0.6); // Vary radius based on intensity
      const x = radius * Math.cos(t1) * Math.sin(t2) * Math.sin(t3);
      const y = radius * Math.sin(t1) * Math.sin(t2) * Math.sin(t3);
      const z = radius * Math.cos(t2) * Math.sin(t3);
      const w = radius * Math.cos(t3);

      // Apply 4D rotation (6 rotation planes in 4D space)
      const rot = rotation4DRef.current;

      // XY plane rotation
      const x1 = x * Math.cos(rot.xy) - y * Math.sin(rot.xy);
      const y1 = x * Math.sin(rot.xy) + y * Math.cos(rot.xy);
      let z1 = z;
      let w1 = w;

      // XZ plane rotation
      const x2 = x1 * Math.cos(rot.xz) - z1 * Math.sin(rot.xz);
      const z2 = x1 * Math.sin(rot.xz) + z1 * Math.cos(rot.xz);
      let y2 = y1;
      let w2 = w1;

      // XW plane rotation
      const x3 = x2 * Math.cos(rot.xw) - w2 * Math.sin(rot.xw);
      const w3 = x2 * Math.sin(rot.xw) + w2 * Math.cos(rot.xw);
      let y3 = y2;
      let z3 = z2;

      // YZ plane rotation
      const y4 = y3 * Math.cos(rot.yz) - z3 * Math.sin(rot.yz);
      const z4 = y3 * Math.sin(rot.yz) + z3 * Math.cos(rot.yz);
      let x4 = x3;
      let w4 = w3;

      // YW plane rotation
      const y5 = y4 * Math.cos(rot.yw) - w4 * Math.sin(rot.yw);
      const w5 = y4 * Math.sin(rot.yw) + w4 * Math.cos(rot.yw);
      let x5 = x4;
      let z5 = z4;

      // ZW plane rotation
      const z6 = z5 * Math.cos(rot.zw) - w5 * Math.sin(rot.zw);
      const w6 = z5 * Math.sin(rot.zw) + w5 * Math.cos(rot.zw);
      const x6 = x5;
      const y6 = y5;

      // 4D to 3D projection (stereographic projection)
      const distance4D = 300; // Distance from 4D hyperplane
      const scale4D = distance4D / (distance4D + w6);
      const x3d = x6 * scale4D;
      const y3d = y6 * scale4D;
      const z3d = z6 * scale4D;

      points4D.push({
        x: x6,
        y: y6,
        z: z6,
        w: w6,
        x3d,
        y3d,
        z3d,
        intensity,
        frequency,
        originalIndex: i,
      });
    }

    // Sort points by combined 3D and 4D depth
    points4D.sort((a, b) => a.z3d + a.w * 0.5 - (b.z3d + b.w * 0.5));

    // Draw points with double perspective projection (4D→3D→2D)
    const focalLength3D = 300;

    points4D.forEach((point, index) => {
      // 3D to 2D perspective projection
      const distance3D = focalLength3D + point.z3d;
      const scale3D = focalLength3D / distance3D;
      const x2D = centerX + point.x3d * scale3D;
      const y2D = centerY + point.y3d * scale3D;

      // Skip points that are too far behind in either dimension
      if (distance3D <= 0) return;

      // Calculate combined depth factor from both 3D and 4D projections
      const depth3D = Math.max(0.1, Math.min(1, scale3D));
      const depth4D = Math.max(0.1, Math.min(1, (300 + point.w) / 300));
      const combinedDepth = (depth3D + depth4D) / 2;

      // Point size based on intensity and depth
      const size = (2 + point.intensity * 15) * combinedDepth;
      const alpha = 0.2 + point.intensity * 0.8 * combinedDepth;

      // Color based on 4D position and rotation
      const hue =
        (point.originalIndex / numPoints) * 360 +
        (rotation4DRef.current.xw + rotation4DRef.current.yw) * 30;
      const saturation = 50 + point.intensity * 50;
      const lightness = 15 + point.intensity * 70 + combinedDepth * 15;

      // 4D-specific color modulation based on w coordinate
      const wFactor = (point.w + hyperRadius) / (2 * hyperRadius);
      const hueShift = wFactor * 120; // Shift hue based on 4D position
      const finalHue = (hue + hueShift) % 360;

      // Enhanced glow for higher dimensional effects
      if (point.intensity > 0.3) {
        ctx.shadowBlur = point.intensity * 30 * combinedDepth;
        ctx.shadowColor = `hsla(${finalHue}, ${saturation}%, ${lightness}%, ${
          alpha * 0.7
        })`;
      }

      // Draw point with 4D-enhanced colors
      ctx.fillStyle = `hsla(${finalHue}, ${saturation}%, ${lightness}%, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x2D, y2D, size, 0, 2 * Math.PI);
      ctx.fill();

      // Reset shadow
      ctx.shadowBlur = 0;
    });

    // Draw central hypersphere core
    const coreIntensity = Math.max.apply(null, Array.from(dataArray)) / 255;
    const coreRadius = 15 + coreIntensity * 35;

    // Multi-layer core to suggest 4D depth
    for (let layer = 0; layer < 3; layer++) {
      const layerRadius = coreRadius * (1 - layer * 0.3);
      const layerAlpha = coreIntensity * 0.4 * (1 - layer * 0.3);

      const coreGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        layerRadius
      );

      // Colors shift through 4D space
      const coreHue =
        (rotation4DRef.current.xw + rotation4DRef.current.zw) * 50;
      coreGradient.addColorStop(0, `hsla(${coreHue}, 80%, 80%, ${layerAlpha})`);
      coreGradient.addColorStop(
        0.5,
        `hsla(${coreHue + 60}, 70%, 60%, ${layerAlpha * 0.7})`
      );
      coreGradient.addColorStop(1, `hsla(${coreHue + 120}, 60%, 40%, 0)`);

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, layerRadius, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Draw multiple wireframe outlines to suggest 4D cross-sections
    const numRings = 4;
    for (let ring = 0; ring < numRings; ring++) {
      const ringRadius = hyperRadius * (0.4 + ring * 0.15);
      const ringAlpha = (0.1 + coreIntensity * 0.2) * (1 - ring * 0.2);
      const ringHue = (rotation4DRef.current.yw + ring * 45) % 360;

      ctx.strokeStyle = `hsla(${ringHue}, 60%, 70%, ${ringAlpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Draw mode label
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText("4D Hypersphere Mode", centerX, canvas.height - 20);
  };

  const drawLightning = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    dataArray: Uint8Array
  ) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Calculate overall energy for global effects
    const totalEnergy = dataArray.reduce((sum, val) => sum + val, 0);
    const avgEnergy = totalEnergy / dataArray.length;
    const maxEnergy = Math.max.apply(null, Array.from(dataArray));

    // Update rotation for dynamic effects
    rotationRef.current += 0.02;

    // Sphere parameters
    const baseRadius = Math.min(canvas.width, canvas.height) * 0.25;
    const maxRadius = Math.min(canvas.width, canvas.height) * 0.4;
    const sphereRadius =
      baseRadius + (avgEnergy / 255) * (maxRadius - baseRadius);
    const innerRadius = sphereRadius * 0.1; // Core radius for lightning origin

    // Lightning bolt generation parameters
    const numBolts = Math.min(Math.floor(avgEnergy / 12) + 4, 16); // 4-16 bolts based on energy
    const maxBranches = 2;
    const maxSegments = 20;

    // Generate multiple lightning bolts within sphere
    for (let boltIndex = 0; boltIndex < numBolts; boltIndex++) {
      const dataIndex = Math.floor((boltIndex / numBolts) * dataArray.length);
      const frequency = dataArray[dataIndex];
      const intensity = frequency / 255;

      // Skip low-intensity bolts occasionally for dynamic effect
      if (intensity < 0.15 && Math.random() > 0.4) continue;

      // Generate bolt from center/inner area to sphere edge
      const angle =
        (boltIndex / numBolts) * 2 * Math.PI + rotationRef.current * 0.5;
      const targetAngle = angle + (Math.random() - 0.5) * 0.8; // Add some randomness

      // Inner starting point (near center, with some variation)
      const startRadius = innerRadius + Math.random() * (innerRadius * 2);
      const startAngle = angle + (Math.random() - 0.5) * 0.3;
      const startX = centerX + Math.cos(startAngle) * startRadius;
      const startY = centerY + Math.sin(startAngle) * startRadius;

      // Outer ending point (at sphere edge)
      const endRadius = sphereRadius * (0.8 + Math.random() * 0.2);
      const endX = centerX + Math.cos(targetAngle) * endRadius;
      const endY = centerY + Math.sin(targetAngle) * endRadius;

      // Add some animation to points
      const timeOffset = rotationRef.current + boltIndex * 0.3;
      const animStartX = startX + Math.sin(timeOffset * 2) * 10 * intensity;
      const animStartY = startY + Math.cos(timeOffset * 2) * 10 * intensity;
      const animEndX = endX + Math.sin(timeOffset * 1.5) * 15 * intensity;
      const animEndY = endY + Math.cos(timeOffset * 1.5) * 15 * intensity;

      // Generate main lightning bolt
      const mainBolt = generateLightningPath(
        animStartX,
        animStartY,
        animEndX,
        animEndY,
        intensity,
        maxSegments
      );

      // Clip bolt to sphere boundary
      const clippedBolt = clipPathToSphere(
        mainBolt,
        centerX,
        centerY,
        sphereRadius
      );

      // Draw main bolt
      drawLightningBolt(ctx, clippedBolt, intensity, boltIndex, numBolts);

      // Generate and draw branches
      const numBranches = Math.floor(intensity * maxBranches);
      for (let branch = 0; branch < numBranches; branch++) {
        const branchStart = Math.floor(
          clippedBolt.length * 0.4 + Math.random() * clippedBolt.length * 0.3
        );
        if (branchStart < clippedBolt.length) {
          const branchPoint = clippedBolt[branchStart];

          // Branch toward sphere edge
          const branchAngle =
            Math.atan2(branchPoint.y - centerY, branchPoint.x - centerX) +
            (Math.random() - 0.5) * 1.2;

          const branchLength = intensity * 80 + Math.random() * 60;
          const branchEndX =
            branchPoint.x + Math.cos(branchAngle) * branchLength;
          const branchEndY =
            branchPoint.y + Math.sin(branchAngle) * branchLength;

          const branchBolt = generateLightningPath(
            branchPoint.x,
            branchPoint.y,
            branchEndX,
            branchEndY,
            intensity * 0.7,
            Math.floor(maxSegments * 0.5)
          );

          // Clip branch to sphere boundary
          const clippedBranch = clipPathToSphere(
            branchBolt,
            centerX,
            centerY,
            sphereRadius
          );

          drawLightningBolt(
            ctx,
            clippedBranch,
            intensity * 0.7,
            boltIndex,
            numBolts
          );
        }
      }
    }

    // Draw sphere boundary and effects
    drawSphereContainer(
      ctx,
      centerX,
      centerY,
      sphereRadius,
      avgEnergy,
      maxEnergy
    );

    // Draw electric field effects within sphere
    drawElectricFieldInSphere(ctx, centerX, centerY, sphereRadius, dataArray);

    // Draw mode label
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Lightning Sphere Mode", centerX, canvas.height - 20);
  };

  const drawPlasma = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    dataArray: Uint8Array
  ) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Calculate overall energy for global effects
    const totalEnergy = dataArray.reduce((sum, val) => sum + val, 0);
    const avgEnergy = totalEnergy / dataArray.length;
    const maxEnergy = Math.max.apply(null, Array.from(dataArray));

    // Update rotation for seamless loop animation
    rotationRef.current += 0.008;

    // Sphere parameters
    const baseRadius = Math.min(canvas.width, canvas.height) * 0.2;
    const maxRadius = Math.min(canvas.width, canvas.height) * 0.35;
    const sphereRadius =
      baseRadius + (avgEnergy / 255) * (maxRadius - baseRadius);

    // Draw cloud background
    drawCloudBackground(ctx, canvas, rotationRef.current);

    // Create soft energy waves that form the plasma sphere
    const numLayers = 6;
    const waveDetail = 100;

    for (let layer = 0; layer < numLayers; layer++) {
      const layerRadius = sphereRadius * (0.3 + layer * 0.15);
      const layerIntensity = avgEnergy / 255;
      const layerAlpha = (0.15 + layerIntensity * 0.3) * (1 - layer * 0.12);

      // Create soft wave pattern for this layer
      const wavePoints: Array<{ x: number; y: number; alpha: number }> = [];

      for (let i = 0; i < waveDetail; i++) {
        const angle = (i / waveDetail) * 2 * Math.PI;

        // Multiple wave frequencies for organic appearance
        const wave1 = Math.sin(angle * 3 + rotationRef.current * 2) * 0.2;
        const wave2 = Math.sin(angle * 5 + rotationRef.current * 1.5) * 0.15;
        const wave3 = Math.sin(angle * 7 + rotationRef.current * 2.5) * 0.1;

        // Audio-responsive wave modulation
        const dataIndex = Math.floor((i / waveDetail) * dataArray.length);
        const frequency = dataArray[dataIndex];
        const audioWave = (frequency / 255) * 0.25;

        // Combine all waves
        const waveAmplitude = wave1 + wave2 + wave3 + audioWave;
        const finalRadius = layerRadius * (1 + waveAmplitude);

        const x = centerX + Math.cos(angle) * finalRadius;
        const y = centerY + Math.sin(angle) * finalRadius;

        // Dynamic alpha based on wave intensity
        const waveIntensity = Math.abs(waveAmplitude);
        const pointAlpha = layerAlpha * (0.5 + waveIntensity * 2);

        wavePoints.push({ x, y, alpha: pointAlpha });
      }

      // Draw soft energy wave layer
      drawSoftEnergyWave(ctx, wavePoints, layer, numLayers, layerIntensity);
    }

    // Draw glowing plasma core
    drawPlasmaCore(ctx, centerX, centerY, sphereRadius, avgEnergy, maxEnergy);

    // Add atmospheric glow effect
    drawAtmosphericGlow(ctx, centerX, centerY, sphereRadius, avgEnergy);

    // Draw mode label
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Plasma Glow Mode", centerX, canvas.height - 20);
  };

  const drawElectricOrb = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    dataArray: Uint8Array
  ) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Calculate overall energy for global effects
    const totalEnergy = dataArray.reduce((sum, val) => sum + val, 0);
    const avgEnergy = totalEnergy / dataArray.length;
    const maxEnergy = Math.max.apply(null, Array.from(dataArray));

    // Update rotation for dynamic effects
    rotationRef.current += 0.005;

    // Sphere parameters
    const baseRadius = Math.min(canvas.width, canvas.height) * 0.25;
    const maxRadius = Math.min(canvas.width, canvas.height) * 0.4;
    const sphereRadius =
      baseRadius + (avgEnergy / 255) * (maxRadius - baseRadius);

    // Draw dark atmospheric background
    drawDarkBackground(ctx, canvas);

    // Generate fractal lightning branches
    const numMainBranches = Math.min(Math.floor(avgEnergy / 15) + 6, 16);

    for (let branchIndex = 0; branchIndex < numMainBranches; branchIndex++) {
      const dataIndex = Math.floor(
        (branchIndex / numMainBranches) * dataArray.length
      );
      const frequency = dataArray[dataIndex];
      const intensity = frequency / 255;

      // Skip low-intensity branches occasionally
      if (intensity < 0.1 && Math.random() > 0.6) continue;

      // Start from center with slight randomness
      const startX = centerX + (Math.random() - 0.5) * 20;
      const startY = centerY + (Math.random() - 0.5) * 20;

      // Direction radiating outward
      const baseAngle =
        (branchIndex / numMainBranches) * 2 * Math.PI + rotationRef.current;
      const direction = baseAngle + (Math.random() - 0.5) * 0.3;

      // Create fractal branch system
      drawFractalBranch(
        ctx,
        startX,
        startY,
        direction,
        sphereRadius * 0.8,
        intensity,
        4, // max generations
        centerX,
        centerY,
        sphereRadius
      );
    }

    // Draw glowing orb boundary
    drawGoldenOrbBoundary(
      ctx,
      centerX,
      centerY,
      sphereRadius,
      avgEnergy,
      maxEnergy
    );

    // Add atmospheric glow
    drawGoldenAtmosphericGlow(ctx, centerX, centerY, sphereRadius, avgEnergy);

    // Draw electric particles
    drawElectricParticles(ctx, centerX, centerY, sphereRadius, dataArray);

    // Draw mode label
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Electric Orb Mode", centerX, canvas.height - 20);
  };

  // Helper function to draw fractal lightning branch
  const drawFractalBranch = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    direction: number,
    length: number,
    intensity: number,
    generation: number,
    centerX: number,
    centerY: number,
    sphereRadius: number
  ) => {
    if (generation <= 0 || length < 10) return;

    // Calculate end point
    const endX = startX + Math.cos(direction) * length;
    const endY = startY + Math.sin(direction) * length;

    // Check if end point is within sphere
    const distFromCenter = Math.sqrt(
      (endX - centerX) ** 2 + (endY - centerY) ** 2
    );
    let actualEndX = endX;
    let actualEndY = endY;

    if (distFromCenter > sphereRadius) {
      // Clip to sphere boundary
      const angle = Math.atan2(endY - centerY, endX - centerX);
      actualEndX = centerX + Math.cos(angle) * sphereRadius;
      actualEndY = centerY + Math.sin(angle) * sphereRadius;
    }

    // Draw the branch segment
    drawGoldenLightningSegment(
      ctx,
      startX,
      startY,
      actualEndX,
      actualEndY,
      intensity,
      generation
    );

    // Generate child branches
    const numChildren =
      generation > 2
        ? 2 + Math.floor(Math.random() * 3)
        : 1 + Math.floor(Math.random() * 2);

    for (let child = 0; child < numChildren; child++) {
      const branchPoint = 0.3 + Math.random() * 0.4; // Branch somewhere along the segment
      const branchX = startX + (actualEndX - startX) * branchPoint;
      const branchY = startY + (actualEndY - startY) * branchPoint;

      // Branch angle variation
      const angleDeviation = (Math.random() - 0.5) * Math.PI * 0.6;
      const childDirection = direction + angleDeviation;
      const childLength = length * (0.4 + Math.random() * 0.4);
      const childIntensity = intensity * (0.7 + Math.random() * 0.3);

      // Recursively create child branches
      drawFractalBranch(
        ctx,
        branchX,
        branchY,
        childDirection,
        childLength,
        childIntensity,
        generation - 1,
        centerX,
        centerY,
        sphereRadius
      );
    }
  };

  // Helper function to draw golden lightning segment
  const drawGoldenLightningSegment = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    intensity: number,
    generation: number
  ) => {
    // Golden color palette
    const hue = 45 + Math.random() * 15; // Golden yellow range
    const saturation = 90 + intensity * 10;
    const lightness = 70 + intensity * 20 + generation * 5;
    const alpha = 0.7 + intensity * 0.3;

    // Line thickness based on generation and intensity
    const baseWidth =
      (generation * 0.8 + intensity * 2) * (0.8 + Math.random() * 0.4);

    // Draw multiple layers for glow effect
    const layers = [
      { width: baseWidth * 3, alpha: alpha * 0.1 },
      { width: baseWidth * 2, alpha: alpha * 0.3 },
      { width: baseWidth * 1.2, alpha: alpha * 0.6 },
      { width: baseWidth, alpha: alpha },
    ];

    layers.forEach((layer, layerIndex) => {
      ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${
        lightness + layerIndex * 8
      }%, ${layer.alpha})`;
      ctx.lineWidth = layer.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Add glow for outer layers
      if (layerIndex === 0) {
        ctx.shadowBlur = 12 + intensity * 18;
        ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, ${
          alpha * 0.7
        })`;
      }

      // Create slightly jagged line for realism
      ctx.beginPath();
      const segments = Math.max(
        2,
        Math.floor(Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2) / 15)
      );

      ctx.moveTo(startX, startY);

      for (let i = 1; i < segments; i++) {
        const t = i / segments;
        let x = startX + (endX - startX) * t;
        let y = startY + (endY - startY) * t;

        // Add slight randomness for organic feel
        const deviation = (Math.random() - 0.5) * 8 * intensity;
        const perpX =
          -(endY - startY) /
          Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
        const perpY =
          (endX - startX) /
          Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);

        x += perpX * deviation;
        y += perpY * deviation;

        ctx.lineTo(x, y);
      }

      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
  };

  // Helper function to draw dark background
  const drawDarkBackground = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    // Create subtle dark gradient background
    const bgGradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      Math.max(canvas.width, canvas.height) / 2
    );

    bgGradient.addColorStop(0, "rgba(25, 20, 15, 0.3)");
    bgGradient.addColorStop(1, "rgba(15, 10, 5, 0.5)");

    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Helper function to draw golden orb boundary
  const drawGoldenOrbBoundary = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    avgEnergy: number,
    maxEnergy: number
  ) => {
    const energyIntensity = avgEnergy / 255;
    const peakIntensity = maxEnergy / 255;

    // Bright golden boundary
    const boundaryGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      radius * 0.95,
      centerX,
      centerY,
      radius * 1.1
    );

    boundaryGradient.addColorStop(
      0,
      `rgba(255, 220, 100, ${0.8 + peakIntensity * 0.2})`
    );
    boundaryGradient.addColorStop(
      0.5,
      `rgba(255, 200, 80, ${0.6 + peakIntensity * 0.3})`
    );
    boundaryGradient.addColorStop(1, `rgba(255, 180, 60, 0)`);

    ctx.fillStyle = boundaryGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.1, 0, 2 * Math.PI);
    ctx.fill();

    // Bright rim
    ctx.strokeStyle = `rgba(255, 235, 120, ${0.9 + peakIntensity * 0.1})`;
    ctx.lineWidth = 2 + peakIntensity * 3;
    ctx.shadowBlur = 15 + peakIntensity * 25;
    ctx.shadowColor = `rgba(255, 220, 100, ${0.8 + peakIntensity * 0.2})`;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  // Helper function to draw golden atmospheric glow
  const drawGoldenAtmosphericGlow = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    sphereRadius: number,
    avgEnergy: number
  ) => {
    const energyIntensity = avgEnergy / 255;

    // Outer atmospheric glow
    const glowRadius = sphereRadius * 1.8;
    const glowGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      sphereRadius * 0.9,
      centerX,
      centerY,
      glowRadius
    );

    glowGradient.addColorStop(
      0,
      `rgba(255, 200, 80, ${energyIntensity * 0.2})`
    );
    glowGradient.addColorStop(
      0.5,
      `rgba(255, 160, 60, ${energyIntensity * 0.1})`
    );
    glowGradient.addColorStop(1, `rgba(200, 120, 40, 0)`);

    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, glowRadius, 0, 2 * Math.PI);
    ctx.fill();
  };

  // Helper function to draw electric particles
  const drawElectricParticles = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    dataArray: Uint8Array
  ) => {
    const fieldStrength = Math.max.apply(null, Array.from(dataArray)) / 255;

    // Draw electric particles within sphere
    const numParticles = Math.floor(fieldStrength * 25 + 10);

    for (let i = 0; i < numParticles; i++) {
      // Generate random point within sphere
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.sqrt(Math.random()) * radius * 0.9;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      const size = Math.random() * 2 + 0.5;
      const alpha = fieldStrength * 0.4 + Math.random() * 0.3;

      // Golden electric spark colors
      const hue = 45 + Math.random() * 20; // Golden range
      const saturation = 80 + Math.random() * 20;
      const lightness = 70 + Math.random() * 25;

      ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
      ctx.shadowBlur = size * 6;
      ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  };

  // Helper function to draw cloud background
  const drawCloudBackground = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    time: number
  ) => {
    // Create atmospheric cloud gradients
    const numClouds = 8;

    for (let cloud = 0; cloud < numClouds; cloud++) {
      const cloudX =
        (cloud / numClouds) * canvas.width + Math.sin(time * 0.5 + cloud) * 50;
      const cloudY =
        canvas.height * 0.3 + Math.cos(time * 0.3 + cloud * 2) * 100;
      const cloudSize = 150 + Math.sin(time * 0.7 + cloud * 3) * 50;

      const cloudGradient = ctx.createRadialGradient(
        cloudX,
        cloudY,
        0,
        cloudX,
        cloudY,
        cloudSize
      );

      // Soft purple/blue cloud colors
      cloudGradient.addColorStop(0, `rgba(100, 80, 150, 0.03)`);
      cloudGradient.addColorStop(0.5, `rgba(80, 60, 120, 0.02)`);
      cloudGradient.addColorStop(1, `rgba(60, 40, 100, 0)`);

      ctx.fillStyle = cloudGradient;
      ctx.beginPath();
      ctx.arc(cloudX, cloudY, cloudSize, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  // Helper function to draw soft energy wave
  const drawSoftEnergyWave = (
    ctx: CanvasRenderingContext2D,
    wavePoints: Array<{ x: number; y: number; alpha: number }>,
    layer: number,
    totalLayers: number,
    intensity: number
  ) => {
    if (wavePoints.length < 3) return;

    // Color palette for plasma - pink/purple/magenta
    const hue = 300 + (layer / totalLayers) * 80 + intensity * 30; // Pink to purple range
    const saturation = 60 + intensity * 40;
    const lightness = 40 + intensity * 40;

    // Create gradient fill for the wave
    const avgX =
      wavePoints.reduce((sum, p) => sum + p.x, 0) / wavePoints.length;
    const avgY =
      wavePoints.reduce((sum, p) => sum + p.y, 0) / wavePoints.length;
    const maxDistance = Math.max(
      ...wavePoints.map((p) => Math.sqrt((p.x - avgX) ** 2 + (p.y - avgY) ** 2))
    );

    const waveGradient = ctx.createRadialGradient(
      avgX,
      avgY,
      0,
      avgX,
      avgY,
      maxDistance
    );

    const avgAlpha =
      wavePoints.reduce((sum, p) => sum + p.alpha, 0) / wavePoints.length;
    waveGradient.addColorStop(
      0,
      `hsla(${hue}, ${saturation}%, ${lightness + 20}%, ${avgAlpha * 0.8})`
    );
    waveGradient.addColorStop(
      0.7,
      `hsla(${hue}, ${saturation}%, ${lightness}%, ${avgAlpha * 0.4})`
    );
    waveGradient.addColorStop(
      1,
      `hsla(${hue}, ${saturation}%, ${lightness - 10}%, 0)`
    );

    // Draw the soft wave shape
    ctx.fillStyle = waveGradient;
    ctx.shadowBlur = 20 + intensity * 30;
    ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, ${
      avgAlpha * 0.5
    })`;

    ctx.beginPath();
    ctx.moveTo(wavePoints[0].x, wavePoints[0].y);

    // Create smooth curves through all points
    for (let i = 1; i < wavePoints.length; i++) {
      const current = wavePoints[i];
      const next = wavePoints[(i + 1) % wavePoints.length];
      const cpX = (current.x + next.x) / 2;
      const cpY = (current.y + next.y) / 2;
      ctx.quadraticCurveTo(current.x, current.y, cpX, cpY);
    }

    // Close the path smoothly
    const first = wavePoints[0];
    const second = wavePoints[1];
    const cpX = (first.x + second.x) / 2;
    const cpY = (first.y + second.y) / 2;
    ctx.quadraticCurveTo(first.x, first.y, cpX, cpY);

    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  // Helper function to draw plasma core
  const drawPlasmaCore = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    sphereRadius: number,
    avgEnergy: number,
    maxEnergy: number
  ) => {
    const energyIntensity = avgEnergy / 255;
    const peakIntensity = maxEnergy / 255;

    // Multiple core layers for depth
    const numCoreLayers = 4;

    for (let coreLayer = 0; coreLayer < numCoreLayers; coreLayer++) {
      const coreRadius = (8 + peakIntensity * 20) * (1 - coreLayer * 0.2);
      const coreAlpha = (0.6 + peakIntensity * 0.4) * (1 - coreLayer * 0.15);

      const coreGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        coreRadius
      );

      const coreHue = 320 + coreLayer * 10; // Pink to magenta
      coreGradient.addColorStop(0, `hsla(${coreHue}, 90%, 80%, ${coreAlpha})`);
      coreGradient.addColorStop(
        0.5,
        `hsla(${coreHue}, 80%, 60%, ${coreAlpha * 0.7})`
      );
      coreGradient.addColorStop(1, `hsla(${coreHue}, 70%, 40%, 0)`);

      ctx.fillStyle = coreGradient;
      ctx.shadowBlur = 25 + peakIntensity * 35;
      ctx.shadowColor = `hsla(${coreHue}, 80%, 70%, ${coreAlpha * 0.8})`;

      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  };

  // Helper function to draw atmospheric glow
  const drawAtmosphericGlow = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    sphereRadius: number,
    avgEnergy: number
  ) => {
    const energyIntensity = avgEnergy / 255;

    // Outer atmospheric glow
    const glowRadius = sphereRadius * 1.5;
    const glowGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      sphereRadius * 0.8,
      centerX,
      centerY,
      glowRadius
    );

    glowGradient.addColorStop(
      0,
      `rgba(200, 100, 255, ${energyIntensity * 0.1})`
    );
    glowGradient.addColorStop(
      0.5,
      `rgba(150, 80, 200, ${energyIntensity * 0.05})`
    );
    glowGradient.addColorStop(1, `rgba(100, 60, 150, 0)`);

    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, glowRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Subtle rim lighting
    ctx.strokeStyle = `rgba(255, 150, 255, ${energyIntensity * 0.3})`;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 15 + energyIntensity * 25;
    ctx.shadowColor = `rgba(255, 150, 255, ${energyIntensity * 0.4})`;

    ctx.beginPath();
    ctx.arc(centerX, centerY, sphereRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  // Helper function to draw plasma stream (legacy - kept for compatibility)
  const drawPlasmaStream = (
    ctx: CanvasRenderingContext2D,
    streamPath: Array<{ x: number; y: number; width: number; alpha: number }>,
    intensity: number,
    streamIndex: number,
    totalStreams: number
  ) => {
    if (streamPath.length < 2) return;

    // Color palette - pink/purple/magenta like the reference image
    const hue = 300 + (streamIndex / totalStreams) * 60 + intensity * 20; // 300-380 range (pink to purple)
    const saturation = 70 + intensity * 30;
    const lightness = 50 + intensity * 30;

    // Draw stream with multiple layers for smooth glow
    const layers = [
      { widthMult: 3, alpha: 0.1 },
      { widthMult: 2, alpha: 0.2 },
      { widthMult: 1.5, alpha: 0.4 },
      { widthMult: 1, alpha: 0.7 },
    ];

    layers.forEach((layer, layerIndex) => {
      ctx.beginPath();
      ctx.moveTo(streamPath[0].x, streamPath[0].y);

      // Use quadratic curves for smooth flow
      for (let i = 1; i < streamPath.length - 1; i++) {
        const point = streamPath[i];
        const nextPoint = streamPath[i + 1];
        const cpX = (point.x + nextPoint.x) / 2;
        const cpY = (point.y + nextPoint.y) / 2;
        ctx.quadraticCurveTo(point.x, point.y, cpX, cpY);
      }

      // Final point
      const lastPoint = streamPath[streamPath.length - 1];
      ctx.lineTo(lastPoint.x, lastPoint.y);

      // Stream styling
      const avgWidth =
        streamPath.reduce((sum, p) => sum + p.width, 0) / streamPath.length;
      const avgAlpha =
        streamPath.reduce((sum, p) => sum + p.alpha, 0) / streamPath.length;

      ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${
        lightness + layerIndex * 5
      }%, ${avgAlpha * layer.alpha})`;
      ctx.lineWidth = avgWidth * layer.widthMult;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Add glow effect
      if (layerIndex === 0) {
        ctx.shadowBlur = 15 + intensity * 20;
        ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, ${
          avgAlpha * 0.6
        })`;
      }

      ctx.stroke();
      ctx.shadowBlur = 0;
    });
  };

  // Helper function to draw plasma field effects (legacy - kept for compatibility)
  const drawPlasmaFieldEffects = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    dataArray: Uint8Array
  ) => {
    const fieldStrength = Math.max.apply(null, Array.from(dataArray)) / 255;

    // Draw flowing plasma particles
    const numParticles = Math.floor(fieldStrength * 30 + 10);

    for (let i = 0; i < numParticles; i++) {
      // Generate random point within sphere
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.sqrt(Math.random()) * radius * 0.9;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      const size = Math.random() * 2 + 0.5;
      const alpha = fieldStrength * 0.3 + Math.random() * 0.2;

      // Plasma colors - pink/purple/magenta
      const hue = 300 + Math.random() * 80; // Pink to purple range
      const saturation = 70 + Math.random() * 30;
      const lightness = 60 + Math.random() * 30;

      ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
      ctx.shadowBlur = size * 5;
      ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  };

  // Helper function to generate lightning path
  const generateLightningPath = (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    intensity: number,
    maxSegments: number
  ): Array<{ x: number; y: number }> => {
    const path: Array<{ x: number; y: number }> = [];
    const segments = Math.floor(maxSegments * (0.5 + intensity * 0.5));

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;

      // Linear interpolation
      let x = startX + (endX - startX) * t;
      let y = startY + (endY - startY) * t;

      // Add jagged deviation - more jagged with higher intensity
      if (i > 0 && i < segments) {
        const maxDeviation = 30 + intensity * 50;
        const deviation = (Math.random() - 0.5) * maxDeviation;
        const perpX =
          -(endY - startY) /
          Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
        const perpY =
          (endX - startX) /
          Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);

        x += perpX * deviation;
        y += perpY * deviation;

        // Add some randomness in the forward direction too
        const forwardDeviation = (Math.random() - 0.5) * 20 * intensity;
        x += (endX - startX) * forwardDeviation * 0.01;
        y += (endY - startY) * forwardDeviation * 0.01;
      }

      path.push({ x, y });
    }

    return path;
  };

  // Helper function to draw lightning bolt
  const drawLightningBolt = (
    ctx: CanvasRenderingContext2D,
    path: Array<{ x: number; y: number }>,
    intensity: number,
    boltIndex: number,
    totalBolts: number
  ) => {
    if (path.length < 2) return;

    // Color based on intensity and bolt index
    const hue = (boltIndex / totalBolts) * 60 + 180; // Blue to cyan range
    const saturation = 80 + intensity * 20;
    const lightness = 60 + intensity * 30;
    const alpha = 0.6 + intensity * 0.4;

    // Draw bolt with multiple layers for glow effect
    const layers = [
      { width: 8 + intensity * 12, alpha: alpha * 0.2 },
      { width: 4 + intensity * 8, alpha: alpha * 0.4 },
      { width: 2 + intensity * 4, alpha: alpha * 0.7 },
      { width: 1 + intensity * 2, alpha: alpha },
    ];

    layers.forEach((layer, layerIndex) => {
      ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${
        lightness + layerIndex * 10
      }%, ${layer.alpha})`;
      ctx.lineWidth = layer.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Add glow effect for outer layers
      if (layerIndex === 0) {
        ctx.shadowBlur = 15 + intensity * 20;
        ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, ${
          alpha * 0.8
        })`;
      }

      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);

      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }

      ctx.stroke();
      ctx.shadowBlur = 0;
    });
  };

  // Helper function to clip lightning path to sphere boundary
  const clipPathToSphere = (
    path: Array<{ x: number; y: number }>,
    centerX: number,
    centerY: number,
    radius: number
  ): Array<{ x: number; y: number }> => {
    const clippedPath: Array<{ x: number; y: number }> = [];

    for (let i = 0; i < path.length; i++) {
      const point = path[i];
      const distance = Math.sqrt(
        (point.x - centerX) ** 2 + (point.y - centerY) ** 2
      );

      if (distance <= radius) {
        clippedPath.push(point);
      } else {
        // If point is outside sphere, clip it to sphere boundary
        const angle = Math.atan2(point.y - centerY, point.x - centerX);
        const clippedX = centerX + Math.cos(angle) * radius;
        const clippedY = centerY + Math.sin(angle) * radius;
        clippedPath.push({ x: clippedX, y: clippedY });
        break; // Stop processing further points
      }
    }

    return clippedPath;
  };

  // Helper function to draw sphere container
  const drawSphereContainer = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    avgEnergy: number,
    maxEnergy: number
  ) => {
    const energyIntensity = avgEnergy / 255;
    const peakIntensity = maxEnergy / 255;

    // Draw glass sphere with multiple layers for depth
    // Base glass sphere with very subtle boundary
    const glassGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      radius * 0.7,
      centerX,
      centerY,
      radius
    );
    glassGradient.addColorStop(
      0,
      `rgba(180, 220, 255, ${0.02 + energyIntensity * 0.03})`
    );
    glassGradient.addColorStop(
      1,
      `rgba(100, 200, 255, ${0.08 + energyIntensity * 0.12})`
    );

    ctx.fillStyle = glassGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();

    // Glass highlight (top-left reflection)
    const highlightGradient = ctx.createRadialGradient(
      centerX - radius * 0.3,
      centerY - radius * 0.3,
      0,
      centerX - radius * 0.3,
      centerY - radius * 0.3,
      radius * 0.6
    );
    highlightGradient.addColorStop(
      0,
      `rgba(255, 255, 255, ${0.15 + peakIntensity * 0.1})`
    );
    highlightGradient.addColorStop(
      0.3,
      `rgba(255, 255, 255, ${0.08 + peakIntensity * 0.05})`
    );
    highlightGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

    ctx.fillStyle = highlightGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();

    // Subtle glass edge with soft glow
    ctx.strokeStyle = `rgba(200, 230, 255, ${0.15 + energyIntensity * 0.15})`;
    ctx.lineWidth = 1;
    ctx.shadowBlur = 8 + peakIntensity * 12;
    ctx.shadowColor = `rgba(150, 220, 255, ${0.3 + peakIntensity * 0.2})`;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Inner glass reflections (subtle concentric circles)
    const numReflections = 2;
    for (let ref = 0; ref < numReflections; ref++) {
      const refRadius = radius * (0.85 - ref * 0.15);
      const refAlpha = (0.05 + energyIntensity * 0.08) * (1 - ref * 0.3);

      ctx.strokeStyle = `rgba(220, 240, 255, ${refAlpha})`;
      ctx.lineWidth = 0.5;
      ctx.setLineDash([2, 4]);

      ctx.beginPath();
      ctx.arc(centerX, centerY, refRadius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Glass refraction effect - subtle inner rings
    const numRings = 2;
    for (let ring = 0; ring < numRings; ring++) {
      const ringRadius = radius * (0.4 + ring * 0.2);
      const ringAlpha = (0.08 + energyIntensity * 0.12) * (1 - ring * 0.3);

      ctx.strokeStyle = `rgba(180, 220, 255, ${ringAlpha})`;
      ctx.lineWidth = 0.5;
      ctx.setLineDash([1, 3]);

      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Central energy core with glass-like transparency
    const coreRadius = 6 + peakIntensity * 12;
    const coreGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      coreRadius
    );
    coreGradient.addColorStop(0, `rgba(255, 255, 255, ${peakIntensity * 0.6})`);
    coreGradient.addColorStop(
      0.3,
      `rgba(180, 220, 255, ${peakIntensity * 0.4})`
    );
    coreGradient.addColorStop(
      0.7,
      `rgba(120, 200, 255, ${peakIntensity * 0.2})`
    );
    coreGradient.addColorStop(1, `rgba(100, 200, 255, 0)`);

    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, coreRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Glass caustic effect - subtle light patterns
    if (peakIntensity > 0.2) {
      const numCaustics = 3;
      for (let caustic = 0; caustic < numCaustics; caustic++) {
        const angle =
          (caustic / numCaustics) * 2 * Math.PI + rotationRef.current * 0.2;
        const causticRadius = radius * (0.6 + caustic * 0.1);
        const causticX = centerX + Math.cos(angle) * causticRadius * 0.3;
        const causticY = centerY + Math.sin(angle) * causticRadius * 0.3;

        const causticGradient = ctx.createRadialGradient(
          causticX,
          causticY,
          0,
          causticX,
          causticY,
          15
        );
        causticGradient.addColorStop(
          0,
          `rgba(255, 255, 255, ${peakIntensity * 0.1})`
        );
        causticGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

        ctx.fillStyle = causticGradient;
        ctx.beginPath();
        ctx.arc(causticX, causticY, 15, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  };

  // Helper function to draw electric field effects within sphere
  const drawElectricFieldInSphere = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    dataArray: Uint8Array
  ) => {
    // Calculate field strength
    const fieldStrength = Math.max.apply(null, Array.from(dataArray)) / 255;

    // Draw electric field particles within sphere
    const numParticles = Math.floor(fieldStrength * 40 + 15);

    for (let i = 0; i < numParticles; i++) {
      // Generate random point within sphere
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.sqrt(Math.random()) * radius * 0.9; // Stay within sphere
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      const size = Math.random() * 2 + 0.5;
      const alpha = fieldStrength * 0.4 + Math.random() * 0.3;

      // Electric spark color
      const sparkHue = 200 + Math.random() * 60; // Blue to cyan
      const sparkSat = 80 + Math.random() * 20;
      const sparkLight = 70 + Math.random() * 30;

      ctx.fillStyle = `hsla(${sparkHue}, ${sparkSat}%, ${sparkLight}%, ${alpha})`;
      ctx.shadowBlur = size * 4;
      ctx.shadowColor = `hsla(${sparkHue}, ${sparkSat}%, ${sparkLight}%, ${alpha})`;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Draw subtle electric field lines within sphere
    if (fieldStrength > 0.2) {
      const numLines = Math.floor(fieldStrength * 6);

      for (let i = 0; i < numLines; i++) {
        const angle = (i / numLines) * 2 * Math.PI;
        const startRadius = radius * 0.2;
        const endRadius = radius * 0.8;

        const startX = centerX + Math.cos(angle) * startRadius;
        const startY = centerY + Math.sin(angle) * startRadius;
        const endX = centerX + Math.cos(angle) * endRadius;
        const endY = centerY + Math.sin(angle) * endRadius;

        ctx.strokeStyle = `rgba(150, 200, 255, ${fieldStrength * 0.15})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 8]);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        ctx.setLineDash([]);
      }
    }
  };

  // Helper function to draw electric field effects (original)
  const drawElectricField = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    dataArray: Uint8Array
  ) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Calculate field strength
    const fieldStrength = Math.max.apply(null, Array.from(dataArray)) / 255;

    // Draw electric field particles
    const numParticles = Math.floor(fieldStrength * 50 + 20);

    for (let i = 0; i < numParticles; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 3 + 1;
      const alpha = fieldStrength * 0.3 + Math.random() * 0.2;

      // Electric spark color
      const sparkHue = 200 + Math.random() * 60; // Blue to cyan
      const sparkSat = 80 + Math.random() * 20;
      const sparkLight = 70 + Math.random() * 30;

      ctx.fillStyle = `hsla(${sparkHue}, ${sparkSat}%, ${sparkLight}%, ${alpha})`;
      ctx.shadowBlur = size * 3;
      ctx.shadowColor = `hsla(${sparkHue}, ${sparkSat}%, ${sparkLight}%, ${alpha})`;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Draw electric field lines (subtle)
    if (fieldStrength > 0.3) {
      const numLines = Math.floor(fieldStrength * 8);

      for (let i = 0; i < numLines; i++) {
        const angle = (i / numLines) * 2 * Math.PI;
        const startRadius = 50;
        const endRadius = Math.min(canvas.width, canvas.height) * 0.4;

        const startX = centerX + Math.cos(angle) * startRadius;
        const startY = centerY + Math.sin(angle) * startRadius;
        const endX = centerX + Math.cos(angle) * endRadius;
        const endY = centerY + Math.sin(angle) * endRadius;

        ctx.strokeStyle = `rgba(150, 200, 255, ${fieldStrength * 0.1})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 10]);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        ctx.setLineDash([]);
      }
    }
  };

  const draw = () => {
    try {
      console.log(
        "Draw function called, frame:",
        frameCountRef.current + 1,
        "isPlaying:",
        isPlaying
      );

      if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) {
        console.log("Draw function missing references");
        // Continue animation even if we're missing references temporarily
        if (isPlayingRef.current) {
          animationRef.current = requestAnimationFrame(draw);
        }
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        if (isPlayingRef.current) {
          animationRef.current = requestAnimationFrame(draw);
        }
        return;
      }

      // Get the frequency data
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      // Debug: Check if we're getting audio data
      const sum = dataArrayRef.current.reduce((acc, val) => acc + val, 0);
      const avgAmplitude = sum / dataArrayRef.current.length;
      frameCountRef.current++;

      // Clear canvas with dark background
      ctx.fillStyle = "rgb(15, 15, 35)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw based on selected visualization mode
      if (visualizationMode === "bars") {
        drawBars(ctx, canvas, dataArrayRef.current);
      } else if (visualizationMode === "sphere") {
        drawSphere(ctx, canvas, dataArrayRef.current);
      } else if (visualizationMode === "sphere3D") {
        drawSphere3D(ctx, canvas, dataArrayRef.current);
      } else if (visualizationMode === "sphere4D") {
        drawSphere4D(ctx, canvas, dataArrayRef.current);
      } else if (visualizationMode === "lightning") {
        drawLightning(ctx, canvas, dataArrayRef.current);
      } else if (visualizationMode === "plasma") {
        drawPlasma(ctx, canvas, dataArrayRef.current);
      } else if (visualizationMode === "electricOrb") {
        drawElectricOrb(ctx, canvas, dataArrayRef.current);
      }

      // Draw debug info
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.font = "10px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`Frame: ${frameCountRef.current}`, 10, 20);
      ctx.fillText(`Avg Amplitude: ${avgAmplitude.toFixed(2)}`, 10, 35);
      ctx.fillText(
        `Audio Context: ${audioContextRef.current?.state || "none"}`,
        10,
        50
      );
      ctx.fillText(`Mode: ${visualizationMode}`, 10, 65);

      // Draw a subtle border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
    } catch (error) {
      console.error("Error in draw function:", error);
    }

    // Continue animation if playing - this should ALWAYS happen at the end
    if (isPlayingRef.current) {
      console.log("Scheduling next frame");
      animationRef.current = requestAnimationFrame(draw);
    } else {
      console.log("Animation stopped, isPlayingRef:", isPlayingRef.current);
    }
  };

  return (
    <>
      <Head>
        <title>Sound Spectrum Visualizer</title>
        <meta
          name="description"
          content="Real-time audio frequency visualization"
        />
      </Head>

      <div className={styles.container}>
        <h1 className={styles.title}>Sound Spectrum Visualizer</h1>

        <div className={styles.controls}>
          <div className={styles.trackSelector}>
            <label htmlFor="track-select">Select Track:</label>
            <select
              id="track-select"
              value={currentTrack}
              onChange={(e) => changeTrack(e.target.value)}
              className={styles.select}
            >
              {tracks.map((track, index) => (
                <option key={index} value={track.url}>
                  {track.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.visualizationSelector}>
            <label htmlFor="visualization-select">Visualization:</label>
            <select
              id="visualization-select"
              value={visualizationMode}
              onChange={(e) =>
                setVisualizationMode(e.target.value as VisualizationMode)
              }
              className={styles.select}
            >
              <option value="bars">Frequency Bars</option>
              <option value="sphere">2D Sphere</option>
              <option value="sphere3D">3D Sphere</option>
              <option value="sphere4D">4D Hypersphere</option>
              <option value="lightning">Lightning Sphere</option>
              <option value="plasma">Plasma Flow</option>
              <option value="electricOrb">Electric Orb</option>
            </select>
          </div>

          <button onClick={togglePlayPause} className={styles.playButton}>
            {isPlaying ? "⏸️ Pause" : "▶️ Play"}
          </button>
        </div>

        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className={styles.canvas}
        />

        <audio
          ref={audioRef}
          src={currentTrack}
          crossOrigin="anonymous"
          onEnded={() => {
            setIsPlaying(false);
            isPlayingRef.current = false;
          }}
          onPlay={() => console.log("Audio started playing")}
          onPause={() => console.log("Audio paused")}
          onLoadedData={() => console.log("Audio loaded")}
          onError={(e) => console.error("Audio error:", e)}
          preload="auto"
        />

        <div className={styles.info}>
          <p>
            This visualizer shows the frequency spectrum of the audio in
            real-time using different visualization modes.
          </p>

          {visualizationMode === "bars" && (
            <>
              <p>
                Frequency Bars Mode - Different colors represent different
                intensity levels:
              </p>
              <ul>
                <li>
                  <span
                    className={styles.colorBox}
                    style={{ backgroundColor: "rgb(255, 20, 147)" }}
                  ></span>{" "}
                  Very High (Pink)
                </li>
                <li>
                  <span
                    className={styles.colorBox}
                    style={{ backgroundColor: "rgb(255, 69, 0)" }}
                  ></span>{" "}
                  High (Orange)
                </li>
                <li>
                  <span
                    className={styles.colorBox}
                    style={{ backgroundColor: "rgb(50, 205, 50)" }}
                  ></span>{" "}
                  Medium (Green)
                </li>
                <li>
                  <span
                    className={styles.colorBox}
                    style={{ backgroundColor: "rgb(30, 144, 255)" }}
                  ></span>{" "}
                  Low (Blue)
                </li>
                <li>
                  <span
                    className={styles.colorBox}
                    style={{ backgroundColor: "rgb(72, 61, 139)" }}
                  ></span>{" "}
                  Very Low (Purple)
                </li>
              </ul>
            </>
          )}

          {visualizationMode === "sphere" && (
            <>
              <p>
                2D Sphere Mode - Audio frequencies are represented as rotating
                particles:
              </p>
              <ul>
                <li>• Sphere size changes with overall volume</li>
                <li>• Particle size represents frequency intensity</li>
                <li>• Colors shift based on frequency range</li>
                <li>• Layers rotate at different speeds</li>
                <li>• Central core pulses with peak frequencies</li>
              </ul>
            </>
          )}

          {visualizationMode === "sphere3D" && (
            <>
              <p>
                3D Sphere Mode - Full 3D visualization with perspective and
                depth:
              </p>
              <ul>
                <li>• True 3D sphere with perspective projection</li>
                <li>• Points distributed using golden spiral algorithm</li>
                <li>• Depth-based size scaling and transparency</li>
                <li>• Multi-axis rotation (X, Y, Z)</li>
                <li>• Frequency-based radius variation</li>
                <li>• Realistic lighting and glow effects</li>
              </ul>
            </>
          )}

          {visualizationMode === "sphere4D" && (
            <>
              <p>
                4D Hypersphere Mode - Mind-bending 4th dimensional
                visualization:
              </p>
              <ul>
                <li>• True 4D hypersphere with double projection (4D→3D→2D)</li>
                <li>
                  • 6 planes of rotation in 4D space (XY, XZ, XW, YZ, YW, ZW)
                </li>
                <li>• Stereographic projection from 4D to 3D space</li>
                <li>• Combined depth from both 3D and 4D dimensions</li>
                <li>• Color modulation based on 4th dimensional position</li>
                <li>• Multiple cross-sectional rings suggest 4D structure</li>
                <li>• Hypersphere core with 4D-influenced color shifts</li>
              </ul>
            </>
          )}

          {visualizationMode === "lightning" && (
            <>
              <p>
                Lightning Sphere Mode - Contained electrical plasma
                visualization:
              </p>
              <ul>
                <li>
                  • Lightning bolts (4-16) contained within a dynamic sphere
                </li>
                <li>
                  • Bolts originate from sphere center and reach the boundary
                </li>
                <li>• Sphere size responds to overall audio energy levels</li>
                <li>
                  • Realistic jagged lightning paths with intelligent branching
                </li>
                <li>• All lightning effects clipped to sphere boundary</li>
                <li>• Multi-layer glow effects for electrical appearance</li>
                <li>• Electric field particles distributed within sphere</li>
                <li>
                  • Glowing sphere boundary with energy-responsive intensity
                </li>
                <li>• Central core that pulses with peak frequencies</li>
                <li>• Inner energy rings for depth and containment effect</li>
                <li>
                  • Dynamic animation creates Tesla coil / plasma ball effect
                </li>
                <li>
                  • Blue to cyan color spectrum for authentic electric look
                </li>
              </ul>
            </>
          )}

          {visualizationMode === "plasma" && (
            <>
              <p>
                Plasma Glow Mode - Atmospheric energy sphere with cloud
                background:
              </p>
              <ul>
                <li>
                  • Soft atmospheric cloud background with gentle movement
                </li>
                <li>
                  • Multi-layered energy waves forming organic sphere shape
                </li>
                <li>• Seamless loop animation with smooth wave patterns</li>
                <li>• Beautiful pink/purple/magenta plasma color palette</li>
                <li>• Audio-responsive wave modulation and sphere size</li>
                <li>• Multiple wave frequencies create organic appearance</li>
                <li>• Glowing plasma core with multiple depth layers</li>
                <li>• Atmospheric rim lighting and outer glow effects</li>
                <li>• Soft energy waves instead of harsh geometric shapes</li>
                <li>• Radial gradients create natural plasma luminosity</li>
                <li>• Dynamic intensity based on frequency spectrum</li>
                <li>• Inspired by real atmospheric plasma phenomena</li>
              </ul>
            </>
          )}

          {visualizationMode === "electricOrb" && (
            <>
              <p>
                Electric Orb Mode - Golden fractal lightning with neural
                branching:
              </p>
              <ul>
                <li>• Fractal lightning branches radiating from center core</li>
                <li>• Golden/yellow electric color palette for warm glow</li>
                <li>
                  • Multi-generational branching creates tree-like patterns
                </li>
                <li>• Dark atmospheric background enhances brightness</li>
                <li>
                  • Recursive fractal algorithm generates organic branches
                </li>
                <li>• Audio-responsive branch density and intensity</li>
                <li>• Bright golden orb boundary with atmospheric glow</li>
                <li>• Neural network-like branching structure</li>
                <li>• Electric particles scattered throughout the sphere</li>
                <li>• Variable branch thickness based on generation level</li>
                <li>• Realistic lightning with slight jagged randomness</li>
                <li>• Inspired by electric discharge and neural pathways</li>
              </ul>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SoundSpectrum;
