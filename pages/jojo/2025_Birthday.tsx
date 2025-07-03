import React, { useState, useEffect, useRef, useCallback } from "react";
import type { NextPage } from "next";
import Script from "next/script";
import styles from "../../styles/Maze.module.css";

interface Wall {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Treasure {
  id: number;
  x: number;
  y: number;
  photo: string;
  icon: string;
}

// --- Maze Configuration ---
// This is where you can define the layout of your floor plan.
// The `walls` array contains a list of all the walls in the maze.
// Each wall is an object with x, y, width, and height properties.
//
// - x: The horizontal position from the left edge of the maze.
// - y: The vertical position from the top edge of the maze.
// - width: The horizontal length of the wall.
// - height: The vertical thickness of the wall.
//
// You can add, remove, or modify walls in this array to build your floor plan.

const WALL_THICKNESS = 10;
const MAZE_WIDTH = 850;
const MAZE_HEIGHT = 980;
const PLAYER_SIZE = 20;
const TREASURE_SIZE = 15;
const RESIZE_HANDLE_SIZE = 8;
const MIN_WALL_LENGTH = 10;

const initialWalls: Wall[] = [
  // Vertical walls
  { x: 0, y: 192, width: 5, height: 767 },
  { x: 606, y: 347, width: 5, height: 612 },
  { x: 827, y: 0, width: 5, height: 954 },
  { x: 604, y: 2, width: 5, height: 273 },
  { x: 671, y: 197, width: 5, height: 83 },
  { x: 221, y: 189, width: 5, height: 213 },
  { x: 395, y: 275, width: 5, height: 168 },
  { x: 219, y: 468, width: 5, height: 15 },
  { x: 219, y: 529, width: 5, height: 182 },
  { x: 97, y: 706, width: 5, height: 50 },
  { x: 219, y: 825, width: 5, height: 134 },
  { x: 221, y: 759, width: 5, height: 15 },
  { x: 282, y: 500, width: 5, height: 256 },
  { x: 282, y: 380, width: 5, height: 68 },

  // Horizontal walls (rotated)
  { x: 0, y: 187, width: 226, height: 5 },
  { x: 611, y: 528, width: 90, height: 5 },
  { x: 750, y: 530, width: 82, height: 5 },
  { x: 604, y: 0, width: 223, height: 5 },
  { x: 226, y: 275, width: 383, height: 5 },
  { x: 674, y: 275, width: 156, height: 5 },
  { x: 607, y: 952, width: 223, height: 5 },
  { x: 672, y: 153, width: 156, height: 5 },
  { x: 671, y: 197, width: 156, height: 5 },
  { x: 276, y: 870, width: 333, height: 5 },
  { x: 285, y: 380, width: 112, height: 5 },
  { x: 287, y: 443, width: 112, height: 5 },
  { x: 282, y: 495, width: 118, height: 5 },
  { x: 224, y: 380, width: 14, height: 5 },
  { x: 2, y: 468, width: 219, height: 5 },
  { x: 2, y: 478, width: 219, height: 5 },
  { x: 0, y: 706, width: 219, height: 5 },
  { x: 0, y: 954, width: 219, height: 5 },
  { x: 49, y: 754, width: 128, height: 5 },
  { x: 218, y: 756, width: 69, height: 5 },
  { x: 68, y: 663, width: 154, height: 5 },
  { x: 219, y: 663, width: 66, height: 5 },
  { x: 267, y: 608, width: 17, height: 5 },
  { x: 221, y: 607, width: 13, height: 5 },
  { x: 219, y: 870, width: 13, height: 5 },
];

const treasureIcons = [
  "💎",
  "🌟",
  "🏆",
  "🎂",
  "🎈",
  "💝",
  "🎊",
  "🎀",
  "💐",
  "🌺",
  "🔮",
  "🎁",
];

const treasureData = [
  {
    id: 1,
    x: 100,
    y: 260,
    photo: "/images/Jojo/2025_Birthday/p1.jpg",
    text: "谢谢你买新衫給我,会继续努力，希望将来买一个属于你的 closet 比你。可以放好多好多的靓衫。",
  },
  {
    id: 2,
    x: 655,
    y: 234,
    photo: "/images/Jojo/2025_Birthday/p2.jpg",
    text: "谢谢你准备一堆零食比 Nova，比大家。虽然唔健康，但给生活增加多些乐趣",
  },
  {
    id: 3,
    x: 640,
    y: 400,
    photo: "/images/Jojo/2025_Birthday/p3.jpg",
    text: "谢谢你煮靓面比我地做早餐，便靓正的最佳典范。同时辛苦你朝朝都要准备lunch 比Nova，辛苦你。",
  },
  {
    id: 4,
    x: 350,
    y: 600,
    photo: "/images/Jojo/2025_Birthday/p4.jpg",
    text: "谢谢你经常带Nova去图书馆，周期性甘更新d 书，Nova 智力靠晒你的付出",
  },
  {
    id: 5,
    x: 100,
    y: 400,
    photo: "/images/Jojo/2025_Birthday/p5.jpg",
    text: "谢谢你的靓被，靓床褥，甘先会有靓的运动",
  },
  {
    id: 6,
    x: 750,
    y: 40,
    photo: "/images/Jojo/2025_Birthday/p6.jpg",
    text: "谢谢你去 Oakland 冒住危险甘买送。好多时候都你都要拿一大箱食物，辛苦你。我地餐餐都有餐正野吃全靠你啊。",
  },
  {
    id: 7,
    x: 770,
    y: 190,
    photo: "/images/Jojo/2025_Birthday/p7.jpg",
    text: "谢谢你坚持做运动。等我都有积极的影响。好喜欢这种互相进步的感觉",
  },
  {
    id: 8,
    x: 100,
    y: 600,
    photo: "/images/Jojo/2025_Birthday/p8.jpg",
    text: "谢谢你教识 Nova 自己着衫，刷牙，冲凉。睇住 Nova 成长，都系你的功劳",
  },
  {
    id: 9,
    x: 300,
    y: 350,
    photo: "/images/Jojo/2025_Birthday/p9.jpg",
    text: "谢谢你好积极甘带 Nova 学游水。仲同佢冲埋凉。还有个厕所，几乎日日擦地，同清洗个隔漏， keep 得个厕所好干净。",
  },
  {
    id: 10,
    x: 80,
    y: 900,
    photo: "/images/Jojo/2025_Birthday/p10.jpg",
    text: "谢谢你会take care 四大长老，芳华全娟，你带佢地睇医生，买药，频频噗噗。见到你甘有孝心令我地感到好温暖，安心。",
  },
];

const otherPics = [
  "/images/Jojo/2025_Birthday/others/o1.jpg",
  "/images/Jojo/2025_Birthday/others/o2.jpg",
  "/images/Jojo/2025_Birthday/others/o3.jpg",
  "/images/Jojo/2025_Birthday/others/o4.jpg",
  "/images/Jojo/2025_Birthday/others/o5.jpg",
  "/images/Jojo/2025_Birthday/others/o6.jpg",
  "/images/Jojo/2025_Birthday/others/o7.jpg",
  "/images/Jojo/2025_Birthday/others/o8.jpg",
  "/images/Jojo/2025_Birthday/others/o9.jpg",
  "/images/Jojo/2025_Birthday/others/o10.jpg",
  "/images/Jojo/2025_Birthday/others/o11.jpg",
  "/images/Jojo/2025_Birthday/others/o12.jpg",
  "/images/Jojo/2025_Birthday/others/o13.jpg",
  "/images/Jojo/2025_Birthday/others/o14.jpg",
];

const initialTreasures: Treasure[] = treasureData.map((treasure, index) => ({
  ...treasure,
  icon: treasureIcons[index % treasureIcons.length],
}));

const MazePage: NextPage = () => {
  const musicButtonRef = useRef<HTMLButtonElement>(null);
  const [playerPosition, setPlayerPosition] = useState({ x: 245, y: 856 });
  const [walls, setWalls] = useState<Wall[]>(initialWalls);
  const [treasures, setTreasures] = useState<Treasure[]>(initialTreasures);
  const [collectedTreasures, setCollectedTreasures] = useState<Treasure[]>([]);
  const [discoveredTreasures, setDiscoveredTreasures] = useState<Set<number>>(
    new Set()
  );
  const [nearbyTreasure, setNearbyTreasure] = useState<Treasure | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [newWall, setNewWall] = useState<Wall | null>(null);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [draggingWall, setDraggingWall] = useState<{
    index: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [resizingWall, setResizingWall] = useState<{
    index: number;
    handle: "start" | "end";
  } | null>(null);
  const [deleteMode, setDeleteMode] = useState(true);
  const [draggingTreasure, setDraggingTreasure] = useState<{
    id: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [playerIsFlashing, setPlayerIsFlashing] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const keysPressed = useRef<Set<string>>(new Set());
  const gameLoopRef = useRef<number>();
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem("mazeWalls", JSON.stringify(walls));
    } catch (error) {
      console.error("Failed to save walls to local storage", error);
    }
  }, [walls]);

  const allTreasuresFound =
    treasures.length > 0 && discoveredTreasures.size === treasures.length;

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const showNextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === otherPics.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  const showPrevImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? otherPics.length - 1 : prevIndex - 1
    );
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;

    const handleModalKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        showNextImage();
      } else if (event.key === "ArrowLeft") {
        showPrevImage();
      } else if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleModalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleModalKeyDown);
    };
  }, [isModalOpen, showNextImage, showPrevImage, closeModal]);

  const checkCollision = useCallback(
    (x: number, y: number) => {
      const circle = {
        x: x + PLAYER_SIZE / 2,
        y: y + PLAYER_SIZE / 2,
        r: PLAYER_SIZE / 2,
      };

      for (const wall of walls) {
        const closestX = Math.max(
          wall.x,
          Math.min(circle.x, wall.x + wall.width)
        );
        const closestY = Math.max(
          wall.y,
          Math.min(circle.y, wall.y + wall.height)
        );

        const distanceX = circle.x - closestX;
        const distanceY = circle.y - closestY;
        const distanceSquared = distanceX * distanceX + distanceY * distanceY;

        if (distanceSquared < circle.r * circle.r) {
          return true; // Collision detected
        }
      }
      return false; // No collision
    },
    [walls]
  );

  const checkTreasureCollision = useCallback(() => {
    const playerCenterX = playerPosition.x + PLAYER_SIZE / 2;
    const playerCenterY = playerPosition.y + PLAYER_SIZE / 2;

    const newlyCollectedTreasures: Treasure[] = [];
    const newlyDiscoveredTreasures: number[] = [];
    let closestTreasure: Treasure | null = null;
    let closestDistance = Infinity;

    for (const treasure of treasures) {
      const distance = Math.sqrt(
        Math.pow(playerCenterX - treasure.x, 2) +
          Math.pow(playerCenterY - treasure.y, 2)
      );

      // Check if player is near the treasure (for discovery and photo preview)
      const discoveryRadius = 20; // Radius for discovering hidden treasures
      const nearbyRadius = 20; // Radius for photo preview

      // Mark treasure as discovered if player gets close enough
      if (distance < discoveryRadius && !discoveredTreasures.has(treasure.id)) {
        newlyDiscoveredTreasures.push(treasure.id);
      }

      if (
        distance < nearbyRadius &&
        distance < closestDistance &&
        discoveredTreasures.has(treasure.id)
      ) {
        closestTreasure = treasure;
        closestDistance = distance;
      }

      // Check if player is touching the treasure (for collection)
      if (
        distance < PLAYER_SIZE / 2 + TREASURE_SIZE &&
        discoveredTreasures.has(treasure.id)
      ) {
        // Check if this treasure is already collected
        const isAlreadyCollected = collectedTreasures.some(
          (collected) => collected.id === treasure.id
        );

        if (!isAlreadyCollected) {
          newlyCollectedTreasures.push(treasure);
        }
      }
    }

    // Update discovered treasures
    if (newlyDiscoveredTreasures.length > 0) {
      setDiscoveredTreasures(
        (prev) => new Set([...Array.from(prev), ...newlyDiscoveredTreasures])
      );
    }

    // Update nearby treasure
    setNearbyTreasure(closestTreasure);

    if (newlyCollectedTreasures.length > 0) {
      setCollectedTreasures((prev) => [...prev, ...newlyCollectedTreasures]);
      setPlayerIsFlashing(true);
    } else {
      setPlayerIsFlashing(false);
    }
  }, [
    playerPosition.x,
    playerPosition.y,
    treasures,
    collectedTreasures,
    discoveredTreasures,
  ]);

  const gameLoop = useCallback(() => {
    setPlayerPosition((prevPos) => {
      const speed = 2;
      let newPos = { ...prevPos };

      if (
        keysPressed.current.has("ArrowUp") ||
        keysPressed.current.has("KeyW")
      ) {
        newPos.y -= speed;
      }
      if (
        keysPressed.current.has("ArrowDown") ||
        keysPressed.current.has("KeyS")
      ) {
        newPos.y += speed;
      }
      if (
        keysPressed.current.has("ArrowLeft") ||
        keysPressed.current.has("KeyA")
      ) {
        newPos.x -= speed;
      }
      if (
        keysPressed.current.has("ArrowRight") ||
        keysPressed.current.has("KeyD")
      ) {
        newPos.x += speed;
      }

      if (newPos.x === prevPos.x && newPos.y === prevPos.y) {
        return prevPos;
      }

      if (!checkCollision(newPos.x, newPos.y)) {
        return newPos;
      }

      if (!checkCollision(newPos.x, prevPos.y)) {
        return { x: newPos.x, y: prevPos.y };
      }

      if (!checkCollision(prevPos.x, newPos.y)) {
        return { x: prevPos.x, y: newPos.y };
      }

      return prevPos;
    });
  }, [checkCollision]);

  const getMousePos = (e: React.MouseEvent): { x: number; y: number } => {
    if (svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      return {
        x: e.clientX - svgRect.left,
        y: e.clientY - svgRect.top,
      };
    }
    return { x: 0, y: 0 };
  };

  const handleResizeMouseDown = (
    e: React.MouseEvent,
    index: number,
    handle: "start" | "end"
  ) => {
    if (deleteMode) return;
    e.stopPropagation();
    setResizingWall({ index, handle });
  };

  const handleTreasureMouseDown = (e: React.MouseEvent, id: number) => {
    if (deleteMode) return;
    e.stopPropagation();
    const mousePos = getMousePos(e);
    const treasure = treasures.find((t) => t.id === id);
    if (treasure) {
      setDraggingTreasure({
        id,
        offsetX: mousePos.x - treasure.x,
        offsetY: mousePos.y - treasure.y,
      });
    }
  };

  const handleWallMouseDown = (e: React.MouseEvent, index: number) => {
    if (deleteMode) {
      setWalls((currentWalls) => currentWalls.filter((_, i) => i !== index));
      return;
    }
    if (isDrawing || draggingWall || resizingWall) return;
    e.stopPropagation();

    const mousePos = getMousePos(e);
    const wall = walls[index];

    setDraggingWall({
      index,
      offsetX: mousePos.x - wall.x,
      offsetY: mousePos.y - wall.y,
    });
  };

  const handleMazeMouseDown = (e: React.MouseEvent) => {
    if (draggingWall || deleteMode || resizingWall || draggingTreasure) {
      return;
    }

    const mousePos = getMousePos(e);
    setStartPos(mousePos);
    setIsDrawing(true);
    setNewWall({ ...mousePos, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const mousePos = getMousePos(e);

    if (draggingTreasure) {
      setTreasures((prev) =>
        prev.map((t) =>
          t.id === draggingTreasure.id
            ? {
                ...t,
                x: mousePos.x - draggingTreasure.offsetX,
                y: mousePos.y - draggingTreasure.offsetY,
              }
            : t
        )
      );
      return;
    }

    if (draggingWall) {
      setDraggingWall((prev) => {
        if (!prev) return prev;
        const newX = mousePos.x - prev.offsetX;
        const newY = mousePos.y - prev.offsetY;
        setWalls((currentWalls) =>
          currentWalls.map((wall, index) =>
            index === prev.index ? { ...wall, x: newX, y: newY } : wall
          )
        );
        return prev;
      });
      return;
    }
    if (isDrawing && newWall && startPos) {
      const isHorizontal =
        Math.abs(mousePos.x - startPos.x) > Math.abs(mousePos.y - startPos.y);

      setNewWall({
        x: startPos.x,
        y: startPos.y,
        width: isHorizontal ? mousePos.x - startPos.x : WALL_THICKNESS,
        height: isHorizontal ? WALL_THICKNESS : mousePos.y - startPos.y,
      });
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && newWall) {
      if (
        Math.abs(newWall.width) > MIN_WALL_LENGTH ||
        Math.abs(newWall.height) > MIN_WALL_LENGTH
      ) {
        setWalls((prev) => [
          ...prev,
          {
            ...newWall,
            x: newWall.width < 0 ? newWall.x + newWall.width : newWall.x,
            y: newWall.height < 0 ? newWall.y + newWall.height : newWall.y,
            width: Math.abs(newWall.width),
            height: Math.abs(newWall.height),
          },
        ]);
      }
    }
    setIsDrawing(false);
    setNewWall(null);
    setStartPos(null);
    setDraggingWall(null);
    setResizingWall(null);
    setDraggingTreasure(null);
  };

  const handleReset = () => {
    setWalls(initialWalls);
    setTreasures(initialTreasures);
    setCollectedTreasures([]);
    setDiscoveredTreasures(new Set());
    setPlayerPosition({ x: 245, y: 856 });
    setNearbyTreasure(null);
  };

  // Start music with user interaction
  const startMusic = useCallback(() => {
    setMusicStarted(true);
    setMusicEnabled(true);
  }, []);

  // Toggle music on/off
  const toggleMusic = useCallback(() => {
    if (!musicStarted) {
      startMusic();
    } else {
      setMusicEnabled(!musicEnabled);
    }
  }, [musicEnabled, musicStarted, startMusic]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keysPressed.current.add(event.code);
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current.delete(event.code);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const animate = () => {
      gameLoop();
      checkTreasureCollision();
      gameLoopRef.current = requestAnimationFrame(animate);
    };
    gameLoopRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop, checkTreasureCollision]);

  return (
    <div className={styles.container}>
      {/* YouTube Background Music */}
      {musicEnabled && musicStarted && (
        <div style={{ position: "fixed", top: "-1000px", left: "-1000px" }}>
          <iframe
            key={musicStarted ? "music-on" : "music-off"}
            width="0"
            height="0"
            src="https://www.youtube.com/embed/zrs5UftPa4E?autoplay=1&loop=1&playlist=zrs5UftPa4E&controls=0&muted=0&enablejsapi=1&rel=0&modestbranding=1"
            title="Background Music"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ display: "none" }}
          />
        </div>
      )}

      <h1 className={styles.title}>
        🎉 Happy Birthday, Jojo! 🎂
        <span className={styles.sparkle}>✨</span>
      </h1>

      {/* Music control button */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={toggleMusic}
          ref={musicButtonRef}
          style={{
            width: "120px",
            height: "60px",
            borderRadius: "30px",
            backgroundColor: !musicStarted
              ? "#FF69B4"
              : musicEnabled
              ? "#FF1493"
              : "#FF69B4",
            border: "none",
            color: "white",
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontWeight: "bold",
            opacity: 0.1,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
          }}
        >
          <span style={{ fontSize: "20px" }}>
            {!musicStarted ? "🎵" : musicEnabled ? "🔇" : "🎵"}
          </span>
          <span>
            {!musicStarted ? "Play Music" : musicEnabled ? "Mute" : "Unmute"}
          </span>
        </button>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.mazeContainer}>
          <svg
            ref={svgRef}
            width={MAZE_WIDTH}
            height={MAZE_HEIGHT}
            onMouseDown={handleMazeMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Background pattern */}
            <defs>
              <pattern
                id="confetti"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="10" cy="10" r="2" fill="#FF69B4" opacity="0.3" />
                <circle cx="30" cy="40" r="2" fill="#FFD700" opacity="0.3" />
                <circle cx="60" cy="20" r="2" fill="#00CED1" opacity="0.3" />
                <circle cx="80" cy="60" r="2" fill="#FF6347" opacity="0.3" />
                <circle cx="20" cy="80" r="2" fill="#9370DB" opacity="0.3" />
                <circle cx="90" cy="90" r="2" fill="#32CD32" opacity="0.3" />
              </pattern>
              <linearGradient
                id="wallGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#FF1493" />
                <stop offset="100%" stopColor="#FF69B4" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect width={MAZE_WIDTH} height={MAZE_HEIGHT} fill="#FFF0F5" />
            <rect
              width={MAZE_WIDTH}
              height={MAZE_HEIGHT}
              fill="url(#confetti)"
            />

            {/* Decorative balloons */}
            <g className={styles.floatingBalloon}>
              <ellipse
                cx="150"
                cy="300"
                rx="25"
                ry="30"
                fill="#32CD32"
                opacity="0.7"
              />
              <line
                x1="150"
                y1="330"
                x2="150"
                y2="370"
                stroke="#333"
                strokeWidth="1"
              />
            </g>
            <g className={styles.floatingBalloon2}>
              <ellipse
                cx="600"
                cy="700"
                rx="25"
                ry="30"
                fill="#FF6347"
                opacity="0.7"
              />
              <line
                x1="600"
                y1="730"
                x2="600"
                y2="770"
                stroke="#333"
                strokeWidth="1"
              />
            </g>
            <g className={styles.floatingBalloon3}>
              <ellipse
                cx="800"
                cy="500"
                rx="25"
                ry="30"
                fill="#9370DB"
                opacity="0.7"
              />
              <line
                x1="800"
                y1="530"
                x2="800"
                y2="570"
                stroke="#333"
                strokeWidth="1"
              />
            </g>
            <g className={styles.floatingBalloon4}>
              <ellipse
                cx="400"
                cy="930"
                rx="25"
                ry="30"
                fill="#32CD32"
                opacity="0.7"
              />
              <line
                x1="400"
                y1="930"
                x2="400"
                y2="970"
                stroke="#333"
                strokeWidth="1"
              />
            </g>

            {/* Render Walls */}
            {walls.map((wall, index) => (
              <g key={index}>
                <rect
                  x={wall.x}
                  y={wall.y}
                  width={wall.width}
                  height={wall.height}
                  fill="url(#wallGradient)"
                  rx="3"
                  ry="3"
                  filter="url(#glow)"
                  onMouseDown={(e) => handleWallMouseDown(e, index)}
                  style={{
                    cursor: deleteMode ? "crosshair" : "move",
                  }}
                />
                {!deleteMode && (
                  <>
                    <rect
                      x={wall.x - RESIZE_HANDLE_SIZE / 2}
                      y={wall.y - RESIZE_HANDLE_SIZE / 2}
                      width={RESIZE_HANDLE_SIZE}
                      height={RESIZE_HANDLE_SIZE}
                      fill="orange"
                      cursor="nwse-resize"
                      onMouseDown={(e) =>
                        handleResizeMouseDown(e, index, "start")
                      }
                    />
                    <rect
                      x={
                        wall.x +
                        wall.width -
                        (wall.width > wall.height
                          ? 0
                          : RESIZE_HANDLE_SIZE / 2) -
                        (wall.width < wall.height ? 0 : RESIZE_HANDLE_SIZE / 2)
                      }
                      y={
                        wall.y +
                        wall.height -
                        (wall.height > wall.width
                          ? 0
                          : RESIZE_HANDLE_SIZE / 2) -
                        (wall.height < wall.width ? 0 : RESIZE_HANDLE_SIZE / 2)
                      }
                      width={RESIZE_HANDLE_SIZE}
                      height={RESIZE_HANDLE_SIZE}
                      fill="orange"
                      cursor="nwse-resize"
                      onMouseDown={(e) =>
                        handleResizeMouseDown(e, index, "end")
                      }
                    />
                  </>
                )}
              </g>
            ))}

            {/* Render Treasures with various icons (only if discovered) */}
            {treasures.map((treasure) => {
              const isDiscovered = discoveredTreasures.has(treasure.id);
              return (
                <g key={treasure.id}>
                  {isDiscovered ? (
                    <text
                      x={treasure.x}
                      y={treasure.y + 5}
                      fontSize="24"
                      textAnchor="middle"
                      className={styles.bouncing}
                      onMouseDown={(e) =>
                        handleTreasureMouseDown(e, treasure.id)
                      }
                      style={{ cursor: "grab", userSelect: "none" }}
                    >
                      {treasure.icon}
                    </text>
                  ) : (
                    // Show a subtle hint that something is here (optional)
                    <circle
                      cx={treasure.x}
                      cy={treasure.y}
                      r="3"
                      fill="#FFB6C1"
                      opacity="0.3"
                      className={styles.pulsingHint}
                    />
                  )}
                </g>
              );
            })}

            {newWall && (
              <rect
                x={newWall.width < 0 ? newWall.x + newWall.width : newWall.x}
                y={newWall.height < 0 ? newWall.y + newWall.height : newWall.y}
                width={Math.abs(newWall.width)}
                height={Math.abs(newWall.height)}
                fill="rgba(255, 20, 147, 0.3)"
                stroke="#FF1493"
                strokeWidth="2"
                strokeDasharray="5,5"
                rx="3"
                ry="3"
              />
            )}

            {/* Render Player as party emoji */}
            <text
              x={playerPosition.x + PLAYER_SIZE / 2}
              y={playerPosition.y + PLAYER_SIZE / 2 + 7}
              fontSize="20"
              textAnchor="middle"
              className={
                playerIsFlashing ? styles.flashingPlayer : styles.player
              }
            >
              🥳
            </text>
          </svg>
        </div>

        <div className={styles.rightPanel}>
          <>
            {/* <div className={styles.controls}>
            <button onClick={handleReset} className={styles.resetButton}>
              🔄 Reset Game
            </button>
            <button
              onClick={() => setDeleteMode(!deleteMode)}
              className={
                deleteMode ? styles.deleteButtonActive : styles.deleteButton
              }
            >
              {deleteMode ? "Edit Mode: ON" : "Edit Mode: OFF"}
            </button>
          </div> */}
            <div className={styles.photoContainer}>
              <div className={styles.photoFrame}>
                {nearbyTreasure ? (
                  <>
                    <img
                      src={nearbyTreasure.photo}
                      alt="Birthday Memory"
                      className={styles.treasureImage}
                    />
                    {collectedTreasures.some(
                      (t) => t.id === nearbyTreasure.id
                    ) && (
                      <div
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          background: "rgba(255, 255, 255, 0.9)",
                          borderRadius: "50%",
                          width: "40px",
                          height: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "24px",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </>
                ) : (
                  <div className={styles.photoPlaceholder}>
                    <span className={styles.placeholderEmoji}>📸</span>
                    <p>Get close to a treasure to preview memories!</p>
                  </div>
                )}
              </div>
              {nearbyTreasure && (
                <div
                  style={{
                    marginTop: "15px",
                    padding: "10px",
                    backgroundColor: "#FFF0F5",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "24px",
                      color: "#FF1493",
                      fontWeight: "500",
                      lineHeight: 1.5,
                    }}
                  >
                    {(
                      treasureData.find(
                        (t) => t.id === nearbyTreasure.id
                      ) as any
                    )?.text || ""}
                  </p>
                </div>
              )}
              <div className={styles.collectionCounter}>
                <span className={styles.counterEmoji}>🎁</span>
                {discoveredTreasures.size} / {treasures.length} discovered
              </div>
              {allTreasuresFound && (
                <div
                  onClick={openModal}
                  className={styles.treasureBoxContainer}
                >
                  <span
                    className={`${styles.bouncing} ${styles.treasureBoxEmoji}`}
                  >
                    🎁
                  </span>
                  <p className={styles.treasureBoxText}>
                    Click me for 回顾 more funny memories!
                  </p>
                </div>
              )}
            </div>
            {/* <div className={styles.instructions}>
            Use <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> or{" "}
            <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> to move
          </div> */}
          </>
        </div>
      </div>
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={closeModal}>
              &times;
            </button>
            <button
              className={styles.prevButton}
              onClick={showPrevImage}
              aria-label="Previous image"
            >
              &#10094;
            </button>
            <img
              src={otherPics[currentImageIndex]}
              alt={`Surprise image ${currentImageIndex + 1}`}
              className={styles.modalImage}
            />
            <button
              className={styles.nextButton}
              onClick={showNextImage}
              aria-label="Next image"
            >
              &#10095;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MazePage;
