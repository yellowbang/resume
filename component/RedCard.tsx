import React, { Dispatch, SetStateAction } from 'react';
import styles from '../styles/RedCard.module.css';

interface Props {
  redRate: number;
  total: number;
  setRedCount: Dispatch<SetStateAction<number>>;
  setChance: Dispatch<SetStateAction<number>>;
}

export default function RedCard({
  redRate,
  total,
  setRedCount,
  setChance,
}: Props) {
  const [isRed, setIsRed] = React.useState(false);
  const [count, setCount] = React.useState(0);

  const onClick = () => {
    const newIsRed = Math.random() < redRate;
    setIsRed(newIsRed);
    setCount(count + 1);
    setChance((prev) => prev - 1);
    setRedCount((prev) => {
      return prev + (newIsRed ? 1 : 0);
    });
  };

  let className = styles.redCard + ' ' + styles.leftCount;
  if (isRed) {
    className += ' ' + styles.red;
  }

  return (
    <div className={styles.redCardContainer}>
      <div onClick={onClick} className={className}>
        Left: {total - count}
      </div>
    </div>
  );
}
