import type { NextPage } from 'next';
import 'bootstrap/dist/css/bootstrap.min.css';
import RedCard from '../../component/RedCard';
import { useState } from 'react';
import styles from '../../styles/RedCard.module.css';

const RedCards: NextPage = () => {
  const [redCount, setRedCount] = useState<number>(0);
  const [chance, setChance] = useState<number>(50);
  return (
    <div className={styles.redCardsPage}>
      <div className={styles.redCards}>
        <RedCard
          redRate={0.8}
          total={20}
          setRedCount={setRedCount}
          setChance={setChance}
          disabled={chance === 0}
        />
        <RedCard
          redRate={0.8}
          total={30}
          setRedCount={setRedCount}
          setChance={setChance}
          disabled={chance === 0}
        />
        <RedCard
          redRate={0.5}
          total={50}
          setRedCount={setRedCount}
          setChance={setChance}
          disabled={chance === 0}
        />
        <RedCard
          redRate={0.5}
          total={20}
          setRedCount={setRedCount}
          setChance={setChance}
          disabled={chance === 0}
        />
        <RedCard
          redRate={0.2}
          total={20}
          setRedCount={setRedCount}
          setChance={setChance}
          disabled={chance === 0}
        />
      </div>
      <div className={styles.redCards}>
        <div className={styles.redCardsCount + ' ' + styles.redText}>
          Points: {redCount}
        </div>
        <div className={styles.redCardsCount}>Left: {chance}</div>
      </div>
    </div>
  );
};

export default RedCards;
