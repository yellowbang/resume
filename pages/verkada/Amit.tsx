import type { NextPage } from 'next';
import 'bootstrap/dist/css/bootstrap.min.css';
import Ferris from '../../component/Ferris';

const photos = [
  {
    src: '/images/Amit/p1.png',
    descr:
      'p1 jfioaw iowa fjoiaw fjiowa jfaoi wfjwaioe fjwoijwaio jwaio jwioa ioweffiw weoi oiwae',
  },
  { src: '/images/Amit/p2.png', descr: 'p2' },
  { src: '/images/Amit/p3.png', descr: 'p3' },
  { src: '/images/Amit/p4.png', descr: 'p4' },
  { src: '/images/Amit/p5.png', descr: 'p5' },
  { src: '/images/Amit/p6.png', descr: 'p6' },
  { src: '/images/Amit/p7.png', descr: 'p7' },
  { src: '/images/Amit/p8.png', descr: 'p8' },
  { src: '/images/Amit/p9.png', descr: 'p9' },
  { src: '/images/Amit/p10.png', descr: 'p10' },
  { src: '/images/Amit/p11.png', descr: 'p11' },
];
const Amit: NextPage = () => {
  if (typeof document !== 'undefined') {
    const body = document.getElementsByTagName('body')[0];
    body.className = 'overflowHidden';
  }
  return <Ferris photos={photos} music={[]} />;
};

export default Amit;
