import React, { useState, useEffect, useRef, useCallback } from "react";
import type { NextPage } from "next";
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
  { x: 219, y: 509, width: 5, height: 202 },
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

const initialTreasures: Treasure[] = [
  { id: 1, x: 100, y: 260, photo: "/images/Jojo/2025_Birthday/p1.jpg" },
  { id: 2, x: 655, y: 234, photo: "/images/Jojo/2025_Birthday/p2.jpg" },
  { id: 3, x: 640, y: 400, photo: "/images/Jojo/2025_Birthday/p3.jpg" },
  { id: 4, x: 450, y: 800, photo: "/images/Jojo/2025_Birthday/p4.jpg" },
  { id: 5, x: 100, y: 400, photo: "/images/Jojo/2025_Birthday/p5.jpg" },
  { id: 6, x: 750, y: 40, photo: "/images/Jojo/2025_Birthday/p6.jpg" },
];

const MazePage: NextPage = () => {
  const [playerPosition, setPlayerPosition] = useState({ x: 245, y: 856 });
  const [walls, setWalls] = useState<Wall[]>(initialWalls);
  const [treasures, setTreasures] = useState<Treasure[]>(initialTreasures);
  const [collectedTreasures, setCollectedTreasures] = useState<Treasure[]>([]);
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
    let closestTreasure: Treasure | null = null;
    let closestDistance = Infinity;

    for (const treasure of treasures) {
      const distance = Math.sqrt(
        Math.pow(playerCenterX - treasure.x, 2) +
          Math.pow(playerCenterY - treasure.y, 2)
      );

      // Check if player is near the treasure (for photo preview)
      const nearbyRadius = 80; // Larger radius for photo preview
      if (distance < nearbyRadius && distance < closestDistance) {
        closestTreasure = treasure;
        closestDistance = distance;
      }

      // Check if player is touching the treasure (for collection)
      if (distance < PLAYER_SIZE / 2 + TREASURE_SIZE) {
        // Check if this treasure is already collected
        const isAlreadyCollected = collectedTreasures.some(
          (collected) => collected.id === treasure.id
        );

        if (!isAlreadyCollected) {
          newlyCollectedTreasures.push(treasure);
        }
      }
    }

    // Update nearby treasure
    setNearbyTreasure(closestTreasure);

    if (newlyCollectedTreasures.length > 0) {
      setCollectedTreasures((prev) => [...prev, ...newlyCollectedTreasures]);
      setPlayerIsFlashing(true);
    } else {
      setPlayerIsFlashing(false);
    }
  }, [playerPosition.x, playerPosition.y, treasures, collectedTreasures]);

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
    setPlayerPosition({ x: 245, y: 856 });
    setNearbyTreasure(null);
  };

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
      <h1 className={styles.title}>
        🎉 Happy Birthday, Jojo! 🎂
        <span className={styles.sparkle}>✨</span>
      </h1>
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
                cx="50"
                cy="50"
                rx="25"
                ry="30"
                fill="#FF69B4"
                opacity="0.7"
              />
              <line
                x1="50"
                y1="80"
                x2="50"
                y2="120"
                stroke="#333"
                strokeWidth="1"
              />
            </g>
            <g className={styles.floatingBalloon2}>
              <ellipse
                cx="780"
                cy="80"
                rx="25"
                ry="30"
                fill="#FFD700"
                opacity="0.7"
              />
              <line
                x1="780"
                y1="110"
                x2="780"
                y2="150"
                stroke="#333"
                strokeWidth="1"
              />
            </g>
            <g className={styles.floatingBalloon3}>
              <ellipse
                cx="400"
                cy="900"
                rx="25"
                ry="30"
                fill="#00CED1"
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

            {/* Render Treasures as birthday cakes */}
            {treasures.map((treasure) => (
              <g key={treasure.id}>
                <text
                  x={treasure.x}
                  y={treasure.y + 5}
                  fontSize="24"
                  textAnchor="middle"
                  className={styles.bouncing}
                  onMouseDown={(e) => handleTreasureMouseDown(e, treasure.id)}
                  style={{ cursor: "grab", userSelect: "none" }}
                >
                  🎂
                </text>
              </g>
            ))}

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
          <div className={styles.controls}>
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
          </div>

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
                  <p>Get close to a cake to preview memories!</p>
                </div>
              )}
            </div>
            <div className={styles.collectionCounter}>
              <span className={styles.counterEmoji}>🎁</span>
              {collectedTreasures.length} / {treasures.length} memories
              collected
            </div>
          </div>

          <div className={styles.instructions}>
            Use <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> or{" "}
            <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> to move
          </div>
        </div>
      </div>
    </div>
  );
};

export default MazePage;
