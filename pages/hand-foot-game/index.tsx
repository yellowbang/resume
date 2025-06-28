import React, { useState, useEffect } from "react";
import styles from "../../styles/HandFootGame.module.css";

interface GameState {
  nouns: string[];
  currentVerb: string;
  currentNoun: string;
  showModal: boolean;
  editableNouns: string[];
}

const HandFootGame: React.FC = () => {
  const verbs = ["举起", "放低", "摆动"];
  const defaultNouns = ["左手", "右手", "左脚", "右脚"];

  const [gameState, setGameState] = useState<GameState>({
    nouns: [...defaultNouns],
    currentVerb: "",
    currentNoun: "",
    showModal: false,
    editableNouns: [...defaultNouns],
  });

  // 随机选择动词和名词
  const generateRandomAction = () => {
    const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
    const randomNoun =
      gameState.nouns[Math.floor(Math.random() * gameState.nouns.length)];

    setGameState((prev) => ({
      ...prev,
      currentVerb: randomVerb,
      currentNoun: randomNoun,
    }));
  };

  // 初始化时生成第一个动作
  useEffect(() => {
    if (gameState.nouns.length > 0) {
      const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
      const randomNoun =
        gameState.nouns[Math.floor(Math.random() * gameState.nouns.length)];

      setGameState((prev) => ({
        ...prev,
        currentVerb: randomVerb,
        currentNoun: randomNoun,
      }));
    }
  }, [gameState.nouns]);

  // 更新可编辑名词的状态
  const handleNounChange = (index: number, value: string) => {
    const newEditableNouns = [...gameState.editableNouns];
    newEditableNouns[index] = value;
    setGameState((prev) => ({
      ...prev,
      editableNouns: newEditableNouns,
    }));
  };

  // 保存修改的名词
  const saveNouns = () => {
    setGameState((prev) => ({
      ...prev,
      nouns: [...prev.editableNouns],
      showModal: false,
    }));
    // 由于useEffect会监听nouns的变化，这里不需要手动触发
  };

  // 取消修改
  const cancelEdit = () => {
    setGameState((prev) => ({
      ...prev,
      editableNouns: [...prev.nouns],
      showModal: false,
    }));
  };

  // 重置为默认名词
  const resetToDefault = () => {
    setGameState((prev) => ({
      ...prev,
      editableNouns: [...defaultNouns],
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.gameArea}>
        <h1 className={styles.title}>手足游戏</h1>

        <div className={styles.actionDisplay}>
          <div className={styles.verbDisplay}>{gameState.currentVerb}</div>
          <div className={styles.nounDisplay}>{gameState.currentNoun}</div>
        </div>

        <div className={styles.controls}>
          <button
            className={styles.generateButton}
            onClick={generateRandomAction}
          >
            生成新动作
          </button>
          <button
            className={styles.settingsButton}
            onClick={() =>
              setGameState((prev) => ({ ...prev, showModal: true }))
            }
          >
            设置
          </button>
        </div>
      </div>

      {/* Modal */}
      {gameState.showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>编辑名词</h2>

            <div className={styles.nounInputs}>
              {gameState.editableNouns.map((noun, index) => (
                <div key={index} className={styles.inputGroup}>
                  <label className={styles.inputLabel}>名词 {index + 1}:</label>
                  <input
                    type="text"
                    value={noun}
                    onChange={(e) => handleNounChange(index, e.target.value)}
                    className={styles.nounInput}
                  />
                </div>
              ))}
            </div>

            <div className={styles.modalControls}>
              <button className={styles.resetButton} onClick={saveNouns}>
                Save
              </button>
              <div className={styles.modalButtons}>
                <button className={styles.cancelButton} onClick={cancelEdit}>
                  取消
                </button>
                <button className={styles.submitButton} onClick={saveNouns}>
                  提交
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HandFootGame;
