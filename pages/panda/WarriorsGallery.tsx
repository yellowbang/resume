import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import type { NextPage } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../styles/WarriorsGallery.module.css";
import { texts } from "../../constants/panda";

// Museum layout configuration
const MUSEUM_WIDTH = 800;
const MUSEUM_HEIGHT = 600;
const PLAYER_SIZE = 20;
const TEXT_POINT_SIZE = 25;
const PHOTO_POINT_SIZE = 30;
const DEFENDANT_SIZE = 18;
const CLOUD_SIZE = 180; // Made 3 times larger (was 60)

// Create maze-like walls
const walls = [
  // Outer walls
  { x: 0, y: 0, width: MUSEUM_WIDTH, height: 20 }, // Top wall
  { x: 0, y: MUSEUM_HEIGHT - 20, width: MUSEUM_WIDTH, height: 20 }, // Bottom wall
  { x: 0, y: 0, width: 20, height: MUSEUM_HEIGHT }, // Left wall
  { x: MUSEUM_WIDTH - 20, y: 0, width: 20, height: MUSEUM_HEIGHT }, // Right wall

  // Maze walls
  { x: 80, y: 60, width: 20, height: 120 }, // Vertical wall 1
  { x: 160, y: 40, width: 100, height: 20 }, // Horizontal wall 1
  { x: 240, y: 60, width: 20, height: 80 }, // Vertical wall 2
  { x: 320, y: 100, width: 80, height: 20 }, // Horizontal wall 2
  { x: 420, y: 60, width: 20, height: 100 }, // Vertical wall 3
  { x: 480, y: 140, width: 120, height: 20 }, // Horizontal wall 3
  { x: 600, y: 100, width: 20, height: 80 }, // Vertical wall 4
  { x: 680, y: 180, width: 80, height: 20 }, // Horizontal wall 4

  // Middle maze section
  { x: 120, y: 220, width: 60, height: 20 }, // Horizontal wall 5
  { x: 200, y: 240, width: 20, height: 60 }, // Vertical wall 5
  { x: 280, y: 200, width: 20, height: 100 }, // Vertical wall 6
  { x: 360, y: 260, width: 80, height: 20 }, // Horizontal wall 6
  { x: 500, y: 220, width: 20, height: 80 }, // Vertical wall 7
  { x: 580, y: 300, width: 100, height: 20 }, // Horizontal wall 7

  // Bottom maze section
  { x: 60, y: 360, width: 80, height: 20 }, // Horizontal wall 8
  { x: 180, y: 380, width: 20, height: 60 }, // Vertical wall 8
  { x: 260, y: 420, width: 100, height: 20 }, // Horizontal wall 9
  { x: 400, y: 360, width: 20, height: 80 }, // Vertical wall 9
  { x: 480, y: 400, width: 80, height: 20 }, // Horizontal wall 10
  { x: 600, y: 360, width: 20, height: 100 }, // Vertical wall 10

  // Additional maze complexity
  { x: 140, y: 480, width: 60, height: 20 }, // Horizontal wall 11
  { x: 300, y: 500, width: 20, height: 60 }, // Vertical wall 11
  { x: 460, y: 480, width: 80, height: 20 }, // Horizontal wall 12
  { x: 680, y: 440, width: 20, height: 100 }, // Vertical wall 12
];

// Original photo points positioned around the museum
const photoPoints = [
  {
    id: 1,
    x: 120,
    y: 100,
    src: "/images/panda/p1.jpeg",
    title: "Chase Center Arena",
    description: "The magnificent home of the Golden State Warriors",
    category: "Arena",
  },
  {
    id: 2,
    x: 300,
    y: 80,
    src: "/images/panda/p2.jpeg",
    title: "Championship Glory",
    description: "Celebrating Warriors excellence and victory",
    category: "Championships",
  },
  {
    id: 3,
    x: 500,
    y: 120,
    src: "/images/panda/p3.jpeg",
    title: "Team Spirit",
    description: "The heart and soul of Warriors nation",
    category: "Team",
  },
  {
    id: 4,
    x: 680,
    y: 150,
    src: "/images/panda/p4.jpeg",
    title: "Victory Celebration",
    description: "Moments of triumph and pure joy",
    category: "Championships",
  },
  {
    id: 5,
    x: 150,
    y: 250,
    src: "/images/panda/p5.jpeg",
    title: "Legendary Players",
    description: "Icons who defined the Warriors franchise",
    category: "Players",
  },
  {
    id: 6,
    x: 350,
    y: 280,
    src: "/images/panda/p6.jpeg",
    title: "Historic Moments",
    description: "Unforgettable games and incredible plays",
    category: "Historic",
  },
  {
    id: 7,
    x: 600,
    y: 260,
    src: "/images/panda/p7.jpeg",
    title: "Team Chemistry",
    description: "The bond that creates championship teams",
    category: "Team",
  },
  {
    id: 8,
    x: 100,
    y: 400,
    src: "/images/panda/p8.jpeg",
    title: "Fan Culture",
    description: "The passionate energy of Warriors faithful",
    category: "Fans",
  },
  {
    id: 9,
    x: 180,
    y: 525,
    src: "/images/panda/p9.jpeg",
    title: "Fan Culture",
    description: "The passionate energy of Warriors faithful",
    category: "Fans",
  },
  {
    id: 10,
    x: 430,
    y: 285,
    src: "/images/panda/p10.jpeg",
    title: "Fan Culture",
    description: "The passionate energy of Warriors faithful",
    category: "Fans",
  },
  {
    id: 11,
    x: 630,
    y: 215,
    src: "/images/panda/p11.jpeg",
    title: "Fan Culture",
    description: "The passionate energy of Warriors faithful",
    category: "Fans",
  },
  {
    id: 12,
    x: 530,
    y: 415,
    src: "/images/panda/v1.gif",
    title: "Fan Culture",
    description: "The passionate energy of Warriors faithful",
    category: "Fans",
  },
  {
    id: 13,
    x: 630,
    y: 35,
    src: "/images/panda/p13.jpeg",
    title: "Fan Culture",
    description: "The passionate energy of Warriors faithful",
    category: "Fans",
  },
  // {
  //   id: 14,
  //   x: 630,
  //   y: 515,
  //   src: "/images/panda/p14.jpeg",
  //   title: "Fan Culture",
  //   description: "The passionate energy of Warriors faithful",
  //   category: "Fans",
  // },
];

// Fixed text points positioned around the museum (same approach as photo points)
const textPoints = [
  {
    id: 1,
    x: 50,
    y: 180,
    text: Object.values(texts)[0],
  },
  {
    id: 2,
    x: 220,
    y: 50,
    text: Object.values(texts)[1 % Object.values(texts).length],
  },
  {
    id: 3,
    x: 380,
    y: 160,
    text: Object.values(texts)[2 % Object.values(texts).length],
  },
  {
    id: 4,
    x: 550,
    y: 50,
    text: Object.values(texts)[3 % Object.values(texts).length],
  },
  {
    id: 5,
    x: 720,
    y: 220,
    text: Object.values(texts)[4 % Object.values(texts).length],
  },
  {
    id: 6,
    x: 50,
    y: 340,
    text: Object.values(texts)[5 % Object.values(texts).length],
  },
  {
    id: 7,
    x: 380,
    y: 480,
    text: Object.values(texts)[6 % Object.values(texts).length],
  },
  {
    id: 8,
    x: 720,
    y: 380,
    text: Object.values(texts)[7 % Object.values(texts).length],
  },
];

// Warriors players data
const warriorsPlayers = [
  { name: "CURRY", number: "30", emoji: "🏀" },
  { name: "KLAY", number: "11", emoji: "💧" },
  { name: "DRAY", number: "23", emoji: "🛡️" },
  { name: "WIGGS", number: "22", emoji: "⚡" },
  { name: "JK", number: "00", emoji: "🚀" },
  { name: "CP3", number: "3", emoji: "🎯" },
  { name: "LOONEY", number: "5", emoji: "🏋️" },
  { name: "MOODY", number: "4", emoji: "🔥" },
  { name: "POOLE", number: "3", emoji: "💫" },
  { name: "KERR", number: "C", emoji: "👔" },
];

// Generate defendant positions
const generateDefendants = (count: number) => {
  const defendants: Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    player: (typeof warriorsPlayers)[0];
  }> = [];

  for (let i = 0; i < count; i++) {
    let x: number, y: number;
    let attempts = 0;

    // Find a position that doesn't collide with walls
    do {
      x = Math.random() * (MUSEUM_WIDTH - 100) + 50;
      y = Math.random() * (MUSEUM_HEIGHT - 100) + 50;
      attempts++;
    } while (
      attempts < 50 &&
      walls.some(
        (wall) =>
          x < wall.x + wall.width + 30 &&
          x + 30 > wall.x &&
          y < wall.y + wall.height + 30 &&
          y + 30 > wall.y
      )
    );

    defendants.push({
      id: i + 1,
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 2, // Random velocity x
      vy: (Math.random() - 0.5) * 2, // Random velocity y
      player: warriorsPlayers[i % warriorsPlayers.length],
    });
  }

  return defendants;
};

const WarriorsGallery: NextPage = () => {
  // Player 1 (Panda) state
  const [player1Position, setPlayer1Position] = useState({ x: 50, y: 50 });
  // Player 2 (Pikachu) state
  const [player2Position, setPlayer2Position] = useState({ x: 100, y: 50 });

  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  // Nearby states for both players
  const [nearbyText1, setNearbyText1] = useState<number | null>(null);
  const [nearbyPhoto1, setNearbyPhoto1] = useState<number | null>(null);
  const [nearbyText2, setNearbyText2] = useState<number | null>(null);
  const [nearbyPhoto2, setNearbyPhoto2] = useState<number | null>(null);

  const [collectedTexts, setCollectedTexts] = useState<Set<number>>(new Set());
  const [collectedPhotos, setCollectedPhotos] = useState<Set<number>>(
    new Set()
  );
  const [gameOver, setGameOver] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [defendantsEnabled, setDefendantsEnabled] = useState(true);
  const [defendantCount, setDefendantCount] = useState(5);
  const [defendants, setDefendants] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      player: (typeof warriorsPlayers)[0];
    }>
  >([]);
  const [isClient, setIsClient] = useState(false);

  // Cloud event states
  const [cloudEnabled, setCloudEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [musicStarted, setMusicStarted] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Array of video IDs and their durations in seconds
  const videoIds = ["vmmRFJcDJJw", "kntvYI2xneQ"];
  const videoDurations = [313, 200]; // Song 1: 200s, Song 2: 350s
  const [cloud, setCloud] = useState<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    active: boolean;
    spawnTimer: number;
  }>({
    x: -CLOUD_SIZE,
    y: 0,
    vx: 0,
    vy: 0,
    active: false,
    spawnTimer: 0,
  });

  const keysPressed = useRef<Set<string>>(new Set());
  const gameLoopRef = useRef<number>();
  const frameCounterRef = useRef<number>(0);
  const gamePausedRef = useRef<boolean>(false);

  // Initialize defendants only on client side to prevent SSR hydration mismatch
  useEffect(() => {
    setIsClient(true);
    setDefendants(generateDefendants(5));
  }, []);

  // Check collision with walls
  const checkCollision = useCallback((newX: number, newY: number) => {
    const playerRect = {
      x: newX,
      y: newY,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
    };

    return walls.some(
      (wall) =>
        playerRect.x < wall.x + wall.width &&
        playerRect.x + playerRect.width > wall.x &&
        playerRect.y < wall.y + wall.height &&
        playerRect.y + playerRect.height > wall.y
    );
  }, []);

  // Check collision with defendants
  const checkDefendantCollision = useCallback(
    (playerX: number, playerY: number) => {
      if (!defendantsEnabled) return false;

      return defendants.some((defendant) => {
        const distance = Math.sqrt(
          Math.pow(
            playerX + PLAYER_SIZE / 2 - (defendant.x + DEFENDANT_SIZE / 2),
            2
          ) +
            Math.pow(
              playerY + PLAYER_SIZE / 2 - (defendant.y + DEFENDANT_SIZE / 2),
              2
            )
        );
        return distance < (PLAYER_SIZE + DEFENDANT_SIZE) / 2;
      });
    },
    [defendantsEnabled, defendants]
  );

  // Check if player is near a text point
  const checkNearbyText = useCallback((playerX: number, playerY: number) => {
    const threshold = 30; // Increased threshold for better detection
    return textPoints.find((point) => {
      const distance = Math.sqrt(
        Math.pow(
          playerX + PLAYER_SIZE / 2 - (point.x + TEXT_POINT_SIZE / 2),
          2
        ) +
          Math.pow(
            playerY + PLAYER_SIZE / 2 - (point.y + TEXT_POINT_SIZE / 2),
            2
          )
      );
      return distance < threshold;
    });
  }, []);

  // Check if player is near a photo point
  const checkNearbyPhoto = useCallback((playerX: number, playerY: number) => {
    const threshold = 50; // Increased threshold for better detection
    return photoPoints.find((point) => {
      const distance = Math.sqrt(
        Math.pow(
          playerX + PLAYER_SIZE / 2 - (point.x + PHOTO_POINT_SIZE / 2),
          2
        ) +
          Math.pow(
            playerY + PLAYER_SIZE / 2 - (point.y + PHOTO_POINT_SIZE / 2),
            2
          )
      );
      return distance < threshold;
    });
  }, []);

  // Move defendants randomly (throttled for performance)
  const moveDefendants = useCallback(() => {
    if (!defendantsEnabled || gamePausedRef.current) return;

    setDefendants((prevDefendants) =>
      prevDefendants.map((defendant) => {
        let newX = defendant.x + defendant.vx;
        let newY = defendant.y + defendant.vy;
        let newVx = defendant.vx;
        let newVy = defendant.vy;

        // Check wall collisions and bounce
        if (newX <= 20 || newX >= MUSEUM_WIDTH - 20 - DEFENDANT_SIZE) {
          newVx = -newVx;
          newX = Math.max(
            20,
            Math.min(MUSEUM_WIDTH - 20 - DEFENDANT_SIZE, newX)
          );
        }
        if (newY <= 20 || newY >= MUSEUM_HEIGHT - 20 - DEFENDANT_SIZE) {
          newVy = -newVy;
          newY = Math.max(
            20,
            Math.min(MUSEUM_HEIGHT - 20 - DEFENDANT_SIZE, newY)
          );
        }

        // Check collision with interior walls
        const defendantRect = {
          x: newX,
          y: newY,
          width: DEFENDANT_SIZE,
          height: DEFENDANT_SIZE,
        };

        const hitWall = walls.some(
          (wall) =>
            defendantRect.x < wall.x + wall.width &&
            defendantRect.x + defendantRect.width > wall.x &&
            defendantRect.y < wall.y + wall.height &&
            defendantRect.y + defendantRect.height > wall.y
        );

        if (hitWall) {
          newVx = -newVx;
          newVy = -newVy;
          newX = defendant.x;
          newY = defendant.y;
        }

        // Occasionally change direction randomly
        if (Math.random() < 0.01) {
          newVx = (Math.random() - 0.5) * 2;
          newVy = (Math.random() - 0.5) * 2;
        }

        return {
          ...defendant,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
        };
      })
    );
  }, [defendantsEnabled]);

  // Manage cloud movement and spawning
  const manageCloud = useCallback(() => {
    if (!cloudEnabled || gamePausedRef.current) return;

    setCloud((prevCloud) => {
      let newCloud = { ...prevCloud };

      if (!newCloud.active) {
        // Increment spawn timer
        newCloud.spawnTimer += 1;

        // Random chance to spawn cloud (roughly every 5-10 seconds at 60fps)
        if (newCloud.spawnTimer > 300 && Math.random() < 0.01) {
          // Spawn cloud from random edge
          const spawnSide = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left

          switch (spawnSide) {
            case 0: // Top
              newCloud.x = Math.random() * (MUSEUM_WIDTH - CLOUD_SIZE);
              newCloud.y = -CLOUD_SIZE;
              newCloud.vx = (Math.random() - 0.5) * 2;
              newCloud.vy = Math.random() * 2 + 1;
              break;
            case 1: // Right
              newCloud.x = MUSEUM_WIDTH;
              newCloud.y = Math.random() * (MUSEUM_HEIGHT - CLOUD_SIZE);
              newCloud.vx = -(Math.random() * 2 + 1);
              newCloud.vy = (Math.random() - 0.5) * 2;
              break;
            case 2: // Bottom
              newCloud.x = Math.random() * (MUSEUM_WIDTH - CLOUD_SIZE);
              newCloud.y = MUSEUM_HEIGHT;
              newCloud.vx = (Math.random() - 0.5) * 2;
              newCloud.vy = -(Math.random() * 2 + 1);
              break;
            case 3: // Left
              newCloud.x = -CLOUD_SIZE;
              newCloud.y = Math.random() * (MUSEUM_HEIGHT - CLOUD_SIZE);
              newCloud.vx = Math.random() * 2 + 1;
              newCloud.vy = (Math.random() - 0.5) * 2;
              break;
          }

          newCloud.active = true;
          newCloud.spawnTimer = 0;
        }
      } else {
        // Move cloud
        newCloud.x += newCloud.vx;
        newCloud.y += newCloud.vy;

        // Check if cloud is off screen
        if (
          newCloud.x < -CLOUD_SIZE ||
          newCloud.x > MUSEUM_WIDTH ||
          newCloud.y < -CLOUD_SIZE ||
          newCloud.y > MUSEUM_HEIGHT
        ) {
          newCloud.active = false;
          newCloud.spawnTimer = 0;
        }
      }

      return newCloud;
    });
  }, [cloudEnabled]);

  // Game loop for smooth movement
  const gameLoop = useCallback(() => {
    if (gameOver || gamePausedRef.current) return;

    frameCounterRef.current++;
    const speed = 1;

    setPlayer1Position((prevPos) => {
      let newX1 = prevPos.x;
      let newY1 = prevPos.y;

      // Player 1 controls (Arrow Keys)
      if (keysPressed.current.has("ArrowUp")) {
        newY1 = Math.max(20, newY1 - speed);
      }
      if (keysPressed.current.has("ArrowDown")) {
        newY1 = Math.min(MUSEUM_HEIGHT - PLAYER_SIZE - 20, newY1 + speed);
      }
      if (keysPressed.current.has("ArrowLeft")) {
        newX1 = Math.max(20, newX1 - speed);
      }
      if (keysPressed.current.has("ArrowRight")) {
        newX1 = Math.min(MUSEUM_WIDTH - PLAYER_SIZE - 20, newX1 + speed);
      }

      // Check for wall collisions and defendant collisions for Player 1
      if (!checkCollision(newX1, newY1)) {
        if (checkDefendantCollision(newX1, newY1)) {
          setGameOver(true);
          return prevPos;
        }
        return { x: newX1, y: newY1 };
      }
      return prevPos;
    });

    setPlayer2Position((prevPos) => {
      let newX2 = prevPos.x;
      let newY2 = prevPos.y;

      // Player 2 controls (WSAD)
      if (keysPressed.current.has("KeyW")) {
        newY2 = Math.max(20, newY2 - speed);
      }
      if (keysPressed.current.has("KeyS")) {
        newY2 = Math.min(MUSEUM_HEIGHT - PLAYER_SIZE - 20, newY2 + speed);
      }
      if (keysPressed.current.has("KeyA")) {
        newX2 = Math.max(20, newX2 - speed);
      }
      if (keysPressed.current.has("KeyD")) {
        newX2 = Math.min(MUSEUM_WIDTH - PLAYER_SIZE - 20, newX2 + speed);
      }

      // Check for wall collisions and defendant collisions for Player 2
      if (!checkCollision(newX2, newY2)) {
        if (checkDefendantCollision(newX2, newY2)) {
          setGameOver(true);
          return prevPos;
        }
        return { x: newX2, y: newY2 };
      }
      return prevPos;
    });

    // Move defendants and manage cloud less frequently for performance
    if (frameCounterRef.current % 2 === 0) {
      // Check pause state directly before calling movement functions
      if (!gamePausedRef.current) {
        moveDefendants();
        manageCloud();
      }
    }
  }, [
    gameOver,
    checkCollision,
    checkDefendantCollision,
    moveDefendants,
    manageCloud,
  ]);

  // Update nearby items immediately when player positions change
  useEffect(() => {
    const nearbyTextPoint1 = checkNearbyText(
      player1Position.x,
      player1Position.y
    );
    const nearbyPhotoPoint1 = checkNearbyPhoto(
      player1Position.x,
      player1Position.y
    );
    const nearbyTextPoint2 = checkNearbyText(
      player2Position.x,
      player2Position.y
    );
    const nearbyPhotoPoint2 = checkNearbyPhoto(
      player2Position.x,
      player2Position.y
    );

    setNearbyText1(nearbyTextPoint1 ? nearbyTextPoint1.id : null);
    setNearbyPhoto1(nearbyPhotoPoint1 ? nearbyPhotoPoint1.id : null);
    setNearbyText2(nearbyTextPoint2 ? nearbyTextPoint2.id : null);
    setNearbyPhoto2(nearbyPhotoPoint2 ? nearbyPhotoPoint2.id : null);
  }, [player1Position, player2Position, checkNearbyText, checkNearbyPhoto]);

  // Update defendant count
  const updateDefendantCount = useCallback(
    (newCount: number) => {
      const count = Math.max(0, Math.min(10, newCount));
      setDefendantCount(count);
      if (isClient) {
        setDefendants(generateDefendants(count));
      }
    },
    [isClient]
  );

  // Reset game
  const resetGame = useCallback(() => {
    setGameOver(false);
    setGameCompleted(false);
    setGamePaused(false);
    gamePausedRef.current = false; // Keep ref in sync
    setPlayer1Position({ x: 50, y: 50 });
    setPlayer2Position({ x: 100, y: 50 });
    setCollectedTexts(new Set());
    setCollectedPhotos(new Set());
    if (isClient) {
      setDefendants(generateDefendants(defendantCount));
    }
    setSelectedText(null);
    setSelectedPhoto(null);
    setCloud({
      x: -CLOUD_SIZE,
      y: 0,
      vx: 0,
      vy: 0,
      active: false,
      spawnTimer: 0,
    });
  }, [defendantCount, isClient]);

  // Check for game completion
  useEffect(() => {
    const totalCollectibles = textPoints.length + photoPoints.length;
    const totalCollected = collectedTexts.size + collectedPhotos.size;

    if (
      totalCollected === totalCollectibles &&
      totalCollectibles > 0 &&
      !gameCompleted
    ) {
      setGameCompleted(true);
      setGamePaused(true);
      gamePausedRef.current = true; // Keep ref in sync
    }
  }, [collectedTexts.size, collectedPhotos.size, gameCompleted]);

  // Handle modal open/close and pause game
  useEffect(() => {
    const isModalOpen =
      selectedText !== null || selectedPhoto !== null || gameCompleted;
    setGamePaused(isModalOpen);
    gamePausedRef.current = isModalOpen; // Keep ref in sync
  }, [selectedText, selectedPhoto, gameCompleted]);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keysPressed.current.add(event.code);

      // Space or Enter to view text or photo for either player
      if (event.code === "Space" || event.code === "Enter") {
        event.preventDefault();

        // Check Player 1 nearby items
        if (nearbyText1) {
          const textPoint = textPoints.find((p) => p.id === nearbyText1);
          if (textPoint) {
            setSelectedText(textPoint.text);
            setCollectedTexts(
              (prev) => new Set([...Array.from(prev), nearbyText1])
            );
          }
        } else if (nearbyPhoto1) {
          setSelectedPhoto(nearbyPhoto1);
          setCollectedPhotos(
            (prev) => new Set([...Array.from(prev), nearbyPhoto1])
          );
        }
        // Check Player 2 nearby items
        else if (nearbyText2) {
          const textPoint = textPoints.find((p) => p.id === nearbyText2);
          if (textPoint) {
            setSelectedText(textPoint.text);
            setCollectedTexts(
              (prev) => new Set([...Array.from(prev), nearbyText2])
            );
          }
        } else if (nearbyPhoto2) {
          setSelectedPhoto(nearbyPhoto2);
          setCollectedPhotos(
            (prev) => new Set([...Array.from(prev), nearbyPhoto2])
          );
        }
      }

      // Escape to close modal
      if (event.code === "Escape") {
        setSelectedText(null);
        setSelectedPhoto(null);
      }

      // R to reset game
      if (event.code === "KeyR" && gameOver) {
        resetGame();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current.delete(event.code);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    nearbyText1,
    nearbyPhoto1,
    nearbyText2,
    nearbyPhoto2,
    gameOver,
    textPoints,
    resetGame,
  ]);

  // Start music with user interaction
  const startMusic = useCallback(() => {
    setMusicStarted(true);
    setMusicEnabled(true);
  }, []);

  // Music rotation useEffect - Switch videos based on their actual durations
  useEffect(() => {
    if (!musicEnabled || !musicStarted) return;

    const currentDuration = videoDurations[currentVideoIndex] * 1000; // Convert to milliseconds

    const timeout = setTimeout(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoIds.length);
    }, currentDuration);

    return () => clearTimeout(timeout);
  }, [
    musicEnabled,
    musicStarted,
    currentVideoIndex,
    videoIds.length,
    videoDurations,
  ]);

  // Game loop useEffect
  useEffect(() => {
    const animate = () => {
      gameLoop();
      gameLoopRef.current = requestAnimationFrame(animate);
    };

    if (!gameOver && !gamePausedRef.current) {
      gameLoopRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop, gameOver]);

  // Calculate totals for display
  const totalCollectibles = textPoints.length + photoPoints.length;
  const totalCollected = collectedTexts.size + collectedPhotos.size;

  return (
    <div className={styles.museumContainer}>
      {/* Background Music - YouTube Video */}
      {musicEnabled && musicStarted && (
        <div className={styles.backgroundMusic}>
          <iframe
            key={currentVideoIndex}
            width="0"
            height="0"
            src={`https://www.youtube.com/embed/${videoIds[currentVideoIndex]}?autoplay=1&controls=0&muted=0&enablejsapi=1&rel=0&modestbranding=1`}
            title="Background Music"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ display: "none" }}
          />
        </div>
      )}

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>🐼⚡ 愛情當入迦南地</h1>
        </div>
      </header>

      {/* Game Controls */}
      <div className={styles.gameControls}>
        <div className={styles.controlGroup}>
          <label>
            <input
              type="checkbox"
              checked={defendantsEnabled}
              onChange={(e) => setDefendantsEnabled(e.target.checked)}
            />
            Enable Warriors Players
          </label>
        </div>
        <div className={styles.controlGroup}>
          <label>
            <input
              type="checkbox"
              checked={cloudEnabled}
              onChange={(e) => setCloudEnabled(e.target.checked)}
            />
            Enable Vision-Blocking Cloud ⛈️
          </label>
        </div>
        <div className={styles.controlGroup}>
          {!musicStarted ? (
            <button onClick={startMusic} className={styles.startMusicButton}>
              🎵 Start Background Music
            </button>
          ) : (
            <label>
              <input
                type="checkbox"
                checked={musicEnabled}
                onChange={(e) => setMusicEnabled(e.target.checked)}
              />
              Enable Background Music 🎵
            </label>
          )}
        </div>
        {musicStarted && (
          <div className={styles.controlGroup}>
            <span>
              Current Song: {currentVideoIndex + 1}/{videoIds.length} (
              {videoDurations[currentVideoIndex]}s)
            </span>
            <button
              onClick={() =>
                setCurrentVideoIndex(
                  (prevIndex) => (prevIndex + 1) % videoIds.length
                )
              }
              disabled={!musicEnabled}
            >
              ⏭️ Next Song
            </button>
          </div>
        )}
        <div className={styles.controlGroup}>
          <span>Warriors Players: {defendantCount}</span>
          <button
            onClick={() => updateDefendantCount(defendantCount - 1)}
            disabled={defendantCount <= 0}
          >
            -
          </button>
          <button
            onClick={() => updateDefendantCount(defendantCount + 1)}
            disabled={defendantCount >= 10}
          >
            +
          </button>
        </div>
        <div className={styles.controlGroup}>
          <button onClick={resetGame}>Reset Game</button>
        </div>
        <div className={styles.controlGroup}>
          <span>
            Total Progress: {totalCollected}/{totalCollectibles}
          </span>
        </div>
      </div>

      {/* Museum Floor */}
      <div className={styles.museumFloor}>
        <svg
          width={MUSEUM_WIDTH}
          height={MUSEUM_HEIGHT}
          className={styles.museumSvg}
          style={{ opacity: gameOver ? 0.5 : 1 }}
        >
          {/* Chase Center Court Pattern */}
          <defs>
            <pattern
              id="courtPattern"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              {/* Basketball court wood background */}
              <rect width="60" height="60" fill="#CD853F" />
              {/* Court lines */}
              <rect width="60" height="2" y="29" fill="#FFD700" opacity="0.8" />
              <rect width="2" height="60" x="29" fill="#FFD700" opacity="0.8" />
              {/* Warriors blue accent */}
              <rect
                width="58"
                height="58"
                x="1"
                y="1"
                fill="#1D428A"
                opacity="0.1"
              />
            </pattern>

            {/* Center court circle */}
            <pattern
              id="centerCourt"
              x="0"
              y="0"
              width="120"
              height="120"
              patternUnits="userSpaceOnUse"
            >
              <rect width="120" height="120" fill="#CD853F" />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#FFD700"
                strokeWidth="3"
                opacity="0.6"
              />
              <circle cx="60" cy="60" r="20" fill="#1D428A" opacity="0.2" />
            </pattern>
          </defs>

          {/* Base court floor */}
          <rect
            width={MUSEUM_WIDTH}
            height={MUSEUM_HEIGHT}
            fill="url(#courtPattern)"
          />

          {/* Center court area */}
          <circle
            cx={MUSEUM_WIDTH / 2}
            cy={MUSEUM_HEIGHT / 2}
            r="80"
            fill="none"
            stroke="#FFD700"
            strokeWidth="4"
            opacity="0.7"
          />

          {/* Warriors logo area */}
          <circle
            cx={MUSEUM_WIDTH / 2}
            cy={MUSEUM_HEIGHT / 2}
            r="30"
            fill="#1D428A"
            opacity="0.3"
          />

          {/* Center court text */}
          <text
            x={MUSEUM_WIDTH / 2}
            y={MUSEUM_HEIGHT / 2}
            textAnchor="middle"
            fontSize="12"
            fill="#FFD700"
            fontWeight="bold"
            opacity="0.8"
          >
            CHASE CENTER
          </text>

          {/* Walls */}
          {walls.map((wall, index) => (
            <rect
              key={index}
              x={wall.x}
              y={wall.y}
              width={wall.width}
              height={wall.height}
              fill="#654321"
              stroke="#4a2c17"
              strokeWidth="2"
            />
          ))}

          {/* Photo points */}
          {photoPoints.map((point) => (
            <g key={`photo-${point.id}`}>
              <circle
                cx={point.x + PHOTO_POINT_SIZE / 2}
                cy={point.y + PHOTO_POINT_SIZE / 2}
                r={PHOTO_POINT_SIZE / 2}
                fill={collectedPhotos.has(point.id) ? "#4CAF50" : "#FFC107"}
                stroke={
                  nearbyPhoto1 === point.id || nearbyPhoto2 === point.id
                    ? "#FF5722"
                    : "#333"
                }
                strokeWidth={
                  nearbyPhoto1 === point.id || nearbyPhoto2 === point.id
                    ? "3"
                    : "2"
                }
                className={styles.photoPoint}
              />
              <text
                x={point.x + PHOTO_POINT_SIZE / 2}
                y={point.y + PHOTO_POINT_SIZE / 2 + 6}
                textAnchor="middle"
                fontSize="18"
                fill="#333"
              >
                🏀
              </text>
              {collectedPhotos.has(point.id) && (
                <text
                  x={point.x + PHOTO_POINT_SIZE / 2}
                  y={point.y - 5}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#4CAF50"
                  fontWeight="bold"
                >
                  ✓
                </text>
              )}
            </g>
          ))}

          {/* Text points */}
          {textPoints.map((point) => (
            <g key={`text-${point.id}`}>
              <circle
                cx={point.x + TEXT_POINT_SIZE / 2}
                cy={point.y + TEXT_POINT_SIZE / 2}
                r={TEXT_POINT_SIZE / 2}
                fill={collectedTexts.has(point.id) ? "#4CAF50" : "#FF69B4"}
                stroke={
                  nearbyText1 === point.id || nearbyText2 === point.id
                    ? "#FF1493"
                    : "#333"
                }
                strokeWidth={
                  nearbyText1 === point.id || nearbyText2 === point.id
                    ? "3"
                    : "2"
                }
                className={styles.textPoint}
              />
              <text
                x={point.x + TEXT_POINT_SIZE / 2}
                y={point.y + TEXT_POINT_SIZE / 2 + 6}
                textAnchor="middle"
                fontSize="16"
                fill="white"
              >
                💝
              </text>
              {collectedTexts.has(point.id) && (
                <text
                  x={point.x + TEXT_POINT_SIZE / 2}
                  y={point.y - 5}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#4CAF50"
                  fontWeight="bold"
                >
                  ✓
                </text>
              )}
            </g>
          ))}

          {/* Warriors Players (Defendants) */}
          {isClient &&
            defendantsEnabled &&
            defendants.map((defendant) => (
              <g key={defendant.id}>
                <circle
                  cx={defendant.x + DEFENDANT_SIZE / 2}
                  cy={defendant.y + DEFENDANT_SIZE / 2}
                  r={DEFENDANT_SIZE / 2}
                  fill="#1D428A"
                  stroke="#FFD700"
                  strokeWidth="2"
                />
                <text
                  x={defendant.x + DEFENDANT_SIZE / 2}
                  y={defendant.y + DEFENDANT_SIZE / 2 + 4}
                  textAnchor="middle"
                  fontSize="8"
                  fill="#FFD700"
                  fontWeight="bold"
                >
                  {defendant.player.number}
                </text>
                <text
                  x={defendant.x + DEFENDANT_SIZE / 2}
                  y={defendant.y - 8}
                  textAnchor="middle"
                  fontSize="8"
                  fill="#1D428A"
                  fontWeight="bold"
                >
                  {defendant.player.name}
                </text>
              </g>
            ))}

          {/* Player 1 */}
          <g>
            <circle
              cx={player1Position.x + PLAYER_SIZE / 2}
              cy={player1Position.y + PLAYER_SIZE / 2}
              r={PLAYER_SIZE / 2}
              fill="#000000"
              stroke="#333333"
              strokeWidth="2"
            />
            <text
              x={player1Position.x + PLAYER_SIZE / 2}
              y={player1Position.y + PLAYER_SIZE / 2 + 6}
              textAnchor="middle"
              fontSize="14"
              fill="white"
            >
              🐼
            </text>
          </g>

          {/* Player 2 */}
          <g>
            <circle
              cx={player2Position.x + PLAYER_SIZE / 2}
              cy={player2Position.y + PLAYER_SIZE / 2}
              r={PLAYER_SIZE / 2}
              fill="#000000"
              stroke="#333333"
              strokeWidth="2"
            />
            <text
              x={player2Position.x + PLAYER_SIZE / 2}
              y={player2Position.y + PLAYER_SIZE / 2 + 6}
              textAnchor="middle"
              fontSize="14"
              fill="white"
            >
              ⚡
            </text>
          </g>

          {/* Storm Cloud */}
          {isClient && cloudEnabled && cloud.active && (
            <g>
              <ellipse
                cx={cloud.x + CLOUD_SIZE / 2}
                cy={cloud.y + CLOUD_SIZE / 2}
                rx={CLOUD_SIZE / 2}
                ry={CLOUD_SIZE / 3}
                fill="white"
                opacity="0.9"
                stroke="#e0e0e0"
                strokeWidth="2"
              />
              <ellipse
                cx={cloud.x + CLOUD_SIZE / 2 - 45}
                cy={cloud.y + CLOUD_SIZE / 2 - 24}
                rx={CLOUD_SIZE / 3}
                ry={CLOUD_SIZE / 4}
                fill="white"
                opacity="0.9"
              />
              <ellipse
                cx={cloud.x + CLOUD_SIZE / 2 + 45}
                cy={cloud.y + CLOUD_SIZE / 2 - 15}
                rx={CLOUD_SIZE / 3}
                ry={CLOUD_SIZE / 4}
                fill="white"
                opacity="0.9"
              />
              <text
                x={cloud.x + CLOUD_SIZE / 2}
                y={cloud.y + CLOUD_SIZE / 2 + 5}
                textAnchor="middle"
                fontSize="40"
                fill="#666"
                opacity="0.9"
              >
                ⛈️
              </text>
            </g>
          )}

          {/* Interaction indicator for Player 1 */}
          {(nearbyText1 || nearbyPhoto1) && !gameOver && (
            <g>
              <circle
                cx={player1Position.x + PLAYER_SIZE / 2}
                cy={player1Position.y - 20}
                r="15"
                fill={nearbyText1 ? "#FF1493" : "#FF5722"}
                opacity="0.9"
              />
              <text
                x={player1Position.x + PLAYER_SIZE / 2}
                y={player1Position.y - 15}
                textAnchor="middle"
                fontSize="8"
                fill="white"
                fontWeight="bold"
              >
                SPACE
              </text>
            </g>
          )}

          {/* Interaction indicator for Player 2 */}
          {(nearbyText2 || nearbyPhoto2) && !gameOver && (
            <g>
              <circle
                cx={player2Position.x + PLAYER_SIZE / 2}
                cy={player2Position.y - 20}
                r="15"
                fill={nearbyText2 ? "#FF1493" : "#FF5722"}
                opacity="0.9"
              />
              <text
                x={player2Position.x + PLAYER_SIZE / 2}
                y={player2Position.y - 15}
                textAnchor="middle"
                fontSize="8"
                fill="white"
                fontWeight="bold"
              >
                SPACE
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Text Modal */}
      {selectedText && (
        <div className={styles.textModal} onClick={() => setSelectedText(null)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeButton}
              onClick={() => setSelectedText(null)}
            >
              ×
            </button>
            <div className={styles.modalInfo}>
              <h2>💝 Love Message</h2>
              <p className={styles.loveMessage}>{selectedText}</p>
            </div>
          </div>
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className={styles.photoModal}
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeButton}
              onClick={() => setSelectedPhoto(null)}
            >
              ×
            </button>
            {(() => {
              const photo = photoPoints.find((p) => p.id === selectedPhoto);
              return photo ? (
                <>
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className={styles.modalImage}
                  />
                  <div className={styles.modalInfo}>
                    {/* <h2>{photo.title}</h2>
                    <span className={styles.modalCategory}>
                      {photo.category}
                    </span>
                    <p>{photo.description}</p> */}
                  </div>
                </>
              ) : null;
            })()}
          </div>
        </div>
      )}

      {/* Game Completion Modal */}
      {gameCompleted && (
        <div className={styles.gameCompletionModal}>
          <div className={styles.gameCompletionContent}>
            <button
              className={styles.closeButton}
              onClick={() => setGameCompleted(false)}
            >
              ×
            </button>
            <h2>🎉 Congratulations! 🎉</h2>
            <p>You&apos;ve collected all the love messages and photos!</p>
            <div className={styles.finalImageContainer}>
              <img
                src="/images/panda/final.jpeg"
                alt="Game Completion"
                className={styles.finalImage}
              />
            </div>
            <p>
              Messages collected: {collectedTexts.size}/{textPoints.length} ✓
            </p>
            <p>
              Photos collected: {collectedPhotos.size}/{photoPoints.length} ✓
            </p>
            <p style={{ fontWeight: "bold", color: "#4CAF50" }}>
              Perfect completion: {totalCollected}/{totalCollectibles}! 🏆
            </p>
            <button onClick={resetGame} className={styles.restartButton}>
              🔄 Play Again
            </button>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {gameOver && (
        <div className={styles.gameOverModal}>
          <div className={styles.gameOverContent}>
            <h2>🏀 Caught by Warriors!</h2>
            <p>
              You got caught by a Warriors player! Try to avoid them next time.
            </p>
            <p>
              Messages collected: {collectedTexts.size}/{textPoints.length}
            </p>
            <p>
              Photos collected: {collectedPhotos.size}/{photoPoints.length}
            </p>
            <p>
              Total progress: {totalCollected}/{totalCollectibles}
            </p>
            <button onClick={resetGame} className={styles.restartButton}>
              🔄 Restart Game
            </button>
          </div>
        </div>
      )}

      {/* Mini Map */}
      <div className={styles.miniMap}>
        <h4>Maze Map</h4>
        <svg width="160" height="120" className={styles.miniMapSvg}>
          <rect width="160" height="120" fill="#f0f0f0" stroke="#ccc" />

          {/* Mini walls */}
          {walls.map((wall, index) => (
            <rect
              key={index}
              x={wall.x * 0.2}
              y={wall.y * 0.2}
              width={wall.width * 0.2}
              height={wall.height * 0.2}
              fill="#654321"
            />
          ))}

          {/* Mini photo points */}
          {photoPoints.map((point) => (
            <circle
              key={`mini-photo-${point.id}`}
              cx={point.x * 0.2}
              cy={point.y * 0.2}
              r="2"
              fill={collectedPhotos.has(point.id) ? "#4CAF50" : "#FFC107"}
            />
          ))}

          {/* Mini text points */}
          {textPoints.map((point) => (
            <circle
              key={`mini-text-${point.id}`}
              cx={point.x * 0.2}
              cy={point.y * 0.2}
              r="2"
              fill={collectedTexts.has(point.id) ? "#4CAF50" : "#FF69B4"}
            />
          ))}

          {/* Mini Warriors players */}
          {isClient &&
            defendantsEnabled &&
            defendants.map((defendant) => (
              <circle
                key={defendant.id}
                cx={defendant.x * 0.2}
                cy={defendant.y * 0.2}
                r="2"
                fill="#1D428A"
                stroke="#FFD700"
                strokeWidth="0.5"
              />
            ))}

          {/* Mini Storm Cloud */}
          {isClient && cloudEnabled && cloud.active && (
            <ellipse
              cx={(cloud.x + CLOUD_SIZE / 2) * 0.2}
              cy={(cloud.y + CLOUD_SIZE / 2) * 0.2}
              rx={CLOUD_SIZE * 0.1}
              ry={CLOUD_SIZE * 0.07}
              fill="white"
              opacity="0.9"
              stroke="#e0e0e0"
              strokeWidth="0.5"
            />
          )}

          {/* Mini player 1 */}
          <circle
            cx={player1Position.x * 0.2}
            cy={player1Position.y * 0.2}
            r="3"
            fill="#000000"
            stroke="#333"
            strokeWidth="1"
          />

          {/* Mini player 2 */}
          <circle
            cx={player2Position.x * 0.2}
            cy={player2Position.y * 0.2}
            r="3"
            fill="#000000"
            stroke="#333"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
};

export default WarriorsGallery;
