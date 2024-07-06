import type { NextPage } from 'next';
import useSound from 'use-sound';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';

import styles from '../../styles/TextMoveUp.module.css';

const Jojo_2024_Birthday: NextPage = () => {
  const [started, setStarted] = useState<boolean>(false);
  const [play] = useSound('/sounds/xiaoxingxing.mp3', {
    onend: () => {
      play();
    },
  });

  useEffect(() => {
    play && play();
  }, [play]);

  useEffect(() => {
    document.addEventListener('keydown', () => {
      if (!started) {
        setStarted(true);
      }
    });
  }, []);

  return (
    <div className={styles.birthdayPageContainer}>
      <div className={styles.stars} />
      <div className={styles.twinkling} />
      <img
        src="/images/Jojo/2024_Birthday/pinkHeart.png"
        alt="heart"
        // layout="fill"
        // objectFit="contain"
        // quality={100}
        style={{
          backgroundColor: 'black',
          zIndex: 1,
        }}
      />
      <div className={styles.moveUpTextContainer}>
        <text className={started ? styles.moveUpText : styles.staticText}>
          My lovely 卑鄙 Jojo,
          <br />
          <br />
          感谢37年前有你的诞生。你的到来不仅让这个世界变得更加美好，也让我在未来的岁月中有了一个共同前行的伴侣。感谢你30年的努力和付出，成就了一个有趣而幽默的灵魂，最关进的系成功吸引了我，并让我时深时浅地爱上了你。
          <br />
          <br />
          在这7年的婚姻生活中，你会为我准备早餐，你做的面条总是那么爽口弹牙，入味，味道特别好，简直是平靓正的最佳典范。你的甜品也是那么适中，不太甜，正合我的口味。喜欢你为食个性格，充分利用网上资源寻找各种美食，比如汕头牛肉火锅、千层蛋糕和中式烧烤等等。形形色色的食物丰富了我的味蕾，也让我变得像10%的北方人。
          <br />
          <br />
          你的行动力和积极性是我最值得学习的地方。你总是充满活力，在你的影响下，我也开始积极运动，享受健康生活的乐趣。
          <br />
          <br />
          还有每次的旅行，都让我们的生活变得更加精彩和丰富。每一次的旅游都玩得好开心，都唔想比佢停。墨西哥的海豚，夏威夷的火舞晚宴，这些都成为了我们美好的回忆。你的冲动神经质的旅行提议，总能让我们的旅程带来surprise，让每一次出行都变得难忘而有意义。
          <br />
          <br />
          你对家庭的付出更是无以言表。辛苦你每天照顾Nova
          boyeer，刷牙，查Lotion，做各种琐碎又麻烦的事情。每当Nova顽皮的时候，你总是耐心而严肃地教导他，让他知道自己的错误，从而成长为一个更好的人。
          <br />
          <br />
          由衷地感谢你对这个家庭的奉献和爱。你的存在让我的生活充满了温暖和幸福（偶尔还有激气同无语）。过山车式的跌跌宕宕，起起伏伏。希望在未来的日子里，我们能够继续享受这趟过山车的旅程（一定要带好安全带，以免飞出）。共同创造更多傻傻地的回忆。
          <br />
          <br />
          祝你生日快乐，愿你每天肥肥白白。谢谢你，我最亲爱的老婆！
          <br />
          <br />
          Bon
        </text>
      </div>
    </div>
  );
};

export default Jojo_2024_Birthday;
