import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import 'bootstrap/dist/css/bootstrap.min.css';
import { set, ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import Images from '../component/Images';
import RentalAgreement from './RentalAgreement';

const Home: NextPage = () => {
  const [page, setPage] = useState('');
  const starCountRef = ref(db);
  onValue(starCountRef, (snapshot: any) => {
    const data = snapshot.val();
    const newPage = data.page;
    if (newPage !== page) {
      setPage(data.page);
    }
  });

  useEffect(() => {
    const queryString = window.location.search;
    if (queryString.indexOf('bon') === -1) {
      return;
    }
    document.addEventListener(
      'keyup',
      (event) => {
        const keyName = event.key;
        set(ref(db, 'page'), keyName);
      },
      false
    );

    return () => {
      set(ref(db, 'page'), '0');
    };
  }, []);

  switch (page) {
    case '1':
    case 'checkphish': {
      return (
        <Images
          images={['../images/checkphish1.png', '../images/checkphish2.png']}
        ></Images>
      );
    }
    case '2':
    case 'bolster': {
      return (
        <Images
          images={['../images/platform1.png', '../images/platform2.png']}
        ></Images>
      );
    }
    case '3':
    case 'takedown': {
      return <Images images={['../images/takedown.png']}></Images>;
    }
    case '4':
    case 'cisco': {
      return <Images images={['../images/cisco.webp']}></Images>;
    }
    default: {
      return <RentalAgreement />;
    }
  }
};

export default Home;
