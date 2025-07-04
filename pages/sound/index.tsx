import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";
import styles from "../../styles/SoundSpectrum.module.css";

interface SoundSpectrumProps {}

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

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState("/sounds/xiaoxingxing.mp3");

  const tracks = [
    { name: "Little Star", url: "/sounds/xiaoxingxing.mp3" },
    { name: "Piano Melody", url: "/sounds/marry_me_piano.mp3" },
    { name: "Xiaojiuwo", url: "/sounds/xiaojiuwo.mp3" },
  ];

  useEffect(() => {
    // Draw initial canvas
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

      // Calculate bar dimensions
      const barWidth = canvas.width / dataArrayRef.current.length;
      const barSpacing = 2;
      const actualBarWidth = barWidth - barSpacing;

      // Draw frequency bars
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const frequency = dataArrayRef.current[i];
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
            real-time.
          </p>
          <p>Different colors represent different intensity levels:</p>
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
        </div>
      </div>
    </>
  );
};

export default SoundSpectrum;
