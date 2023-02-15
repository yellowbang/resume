import type { NextPage } from 'next';
import useSound from 'use-sound';
import 'bootstrap/dist/css/bootstrap.min.css';
import Ferris from '../../component/Ferris';
import { useEffect } from 'react';

const photos = [
  {
    src: '/images/Jojo/2023_Valentine/twoOfUs.png',
    descr:
      '衣两年可以二人世界的时间变得好少。好想同悠闲你行街，睇戏，吃饭，撑台脚。随着 Boyeer 慢慢长大，我地可以一齐的时间会慢慢增多。2023 年继续和你有个约会。',
  },
  {
    src: '/images/Jojo/2023_Valentine/momsmom.png',
    descr: '妈妈的妈妈叫“低低”。衣两张相太有衣种感觉了。你觉得呢？',
  },
  {
    src: '/images/Jojo/2023_Valentine/funny.png',
    descr:
      '衣d系你最靓 moment 的合集。可惜今年抓拍得少，依然超越唔到你几年前的果长张。',
  },
  {
    src: '/images/Jojo/2023_Valentine/cruise.jpg',
    descr:
      '我地人生的第一次的 Cruise。谢谢你不懈地努力，积极甘稳Cruise。除了Cruise 之外，依次的旅程还有创造左好多的第一次。第一次去 Mexico；第一次同 Boyeer 出国；第一次饮 Margarita 等等。一个好有意义的旅程。',
  },
  {
    src: '/images/Jojo/2023_Valentine/jjConcert.jpg',
    descr:
      '几年无睇 Concert 了。我地都无以前甘 high 爆的感觉。但都系放松的，除左阿 Joe 好大力甘打鼓。多谢你买票的时候预埋我。',
  },
  {
    src: '/images/Jojo/2023_Valentine/londonAirPlane.jpg',
    descr:
      '可以去旅行真系好好玩。虽然有时坐飞机辛苦。今次的2次飞机，总结系夜晚坐比较好，因为 Boyeer 会训觉。',
  },
  {
    src: '/images/Jojo/2023_Valentine/primeMeridian.jpg',
    descr:
      '本初子午线，每日的第一个 moment 都从这条线开始。正如每日一开眼第一个就见到你。',
  },
  {
    src: '/images/Jojo/2023_Valentine/sleepInTrain.jpg',
    descr:
      '有时天气不似预，间中会做错野。不过如果可以换换心态，就当用乐观的角度去接受不一样的Adventure。好似今次甘，虽然坐错车，但就可以比 Boyeer 充分甘训个靓觉。而且我地可以拖着手甘系暖粒粒的火车静静地无压力甘坐住。仿如七八十岁的老人家一样安逸。',
  },
  {
    src: '/images/Jojo/2023_Valentine/londonKiss.jpg',
    descr:
      '好似除左 papapa 之外都好少 kiss 了。睇黎要加多d physical touch。就好似以前甘。你要做好防守准备啦。可惜今次 London Eye close，所以今次的web page就用模拟 London Eye 黎祢补个遗憾。',
  },
  {
    src: '/images/Jojo/2023_Valentine/londonFirstMeal.jpg',
    descr: '有惊喜的一餐，而且之后充满对London旅游的期待。',
  },
  {
    src: '/images/Jojo/2023_Valentine/vr.jpg',
    descr:
      '终于可以玩到 VR 啦。人生第一次同你一齐玩 VR。一直期待已久，但买部 xbox or PS5 又太贵，而且又唔一定可以同你一齐玩。衣次game好正，可惜30分钟短左少少。',
  },
  {
    src: '/images/Jojo/2023_Valentine/hiking.jpg',
    descr:
      '虽然撮合人地失败，但可以趁机一齐甘做d有益身心的活动都好唔错。而且可以一家三口甘着一套衫。唔知 Boyeer 果件仲着唔着得落呢。',
  },
  {
    src: '/images/Jojo/2023_Valentine/renoHouse.jpg',
    descr:
      '虽然无得去睇 concert，但可以同 friend 一起住AirBnb 都已经好好玩。而其中一晚仲可以放肆甘打麻将同吹水。以后个仔大少少后可以更容易甘去衣d短途旅行。期待啊。',
  },
  {
    src: '/images/Jojo/2023_Valentine/oaklandZoo.jpg',
    descr:
      '又好玩又抵玩的 Oakland Zoo。希望 Boyeer 会记的长颈鹿BB。就算对于我黎讲都系开心的体验。可以一家人甘行公园真系好幸福。',
  },
];

const Jojo_2023_Valentine: NextPage = () => {
  const [play] = useSound('/sounds/xiaojiuwo.mp3', {
    onend: () => {
      play();
    },
  });

  useEffect(() => {
    play && play();
  }, [play]);

  if (typeof document !== 'undefined') {
    const body = document.getElementsByTagName('body')[0];
    body.className = 'overflowHidden';
  }
  return <Ferris photos={photos} />;
};

export default Jojo_2023_Valentine;
