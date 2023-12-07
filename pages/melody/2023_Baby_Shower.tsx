import type { NextPage } from 'next';
import 'bootstrap/dist/css/bootstrap.min.css';
import Ferris2 from '../../component/Ferris2';
import useSound from 'use-sound';
import { useEffect } from 'react';

const photos = [
  {
    src: '/images/Melody/2023_Baby_Shower/1.jpg',
    descr: '',
  },
  {
    src: '/images/Melody/2023_Baby_Shower/2.jpg',
    descr: '',
  },
  {
    src: '/images/Melody/2023_Baby_Shower/3.jpg',
    descr: '',
  },
  {
    src: '/images/Melody/2023_Baby_Shower/4.jpg',
    descr: '',
  },
  {
    src: '/images/Melody/2023_Baby_Shower/5.jpg',
    descr: '',
  },
  {
    src: '/images/Melody/2023_Baby_Shower/6.jpg',
    descr: '',
  },
  {
    src: '/images/Melody/2023_Baby_Shower/7.jpg',
    descr: '',
  },
  {
    src: '/images/Melody/2023_Baby_Shower/8.jpg',
    descr: '',
  },
  {
    src: '/images/Melody/2023_Baby_Shower/9.jpg',
    descr: '',
  },
  {
    src: '/images/Melody/2023_Baby_Shower/10.jpg',
    descr: '',
  },
  {
    src: '/images/Melody/2023_Baby_Shower/11.jpg',
    descr: '',
  },
  {
    src: '/images/Melody/2023_Baby_Shower/12.jpg',
    descr: '',
  },
  {
    src: '/images/Melody/2023_Baby_Shower/13.jpg',
    descr: '',
  },
];

const Melody_2023_Baby_Shower: NextPage = () => {
  const [play] = useSound('/sounds/marry_me_piano.mp3', {
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
  return <Ferris2 photos={photos} />;
};

export default Melody_2023_Baby_Shower;
