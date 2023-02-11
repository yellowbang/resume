import Image from 'next/image';
import React, { Component } from 'react';
import styles from '../styles/Ferris.module.css';

const PHOTO_SWITCH_DELAY = 10000;

class Ferris extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundMusicIndex: 0,
      selectedPhotoIndex: 0,
    };
    this.timeoutFn = null;
  }

  nextSong = () => {
    this.setState({
      backgroundMusicIndex: this.state.backgroundMusicIndex + 1,
    });
  };

  selectPhoto = (index) => {
    const me = this;
    this.setState(
      {
        selectedPhotoIndex: index,
      },
      function () {
        if (me.timeoutFn) {
          clearTimeout(me.timeoutFn);
        }
        me.timeoutFn = setTimeout(
          me.selectPhoto.bind(me, index + 1),
          PHOTO_SWITCH_DELAY
        );
      }
    );
  };

  componentDidMount() {
    this.selectPhoto(0);
  }

  render() {
    const { photos, music } = this.props;
    const TOTAL_CIRCLE = photos.length;
    let pics = [];
    let svgSize = 50;
    let svgPosition = 21;
    let circlePosition = 13;
    let strokeWidth = 2;
    let circleSize = 0;
    svgSize = svgSize + 'vmin';
    svgPosition = svgPosition + 'vmin';
    circleSize = circleSize + 'vmin';
    circlePosition = circlePosition + 'vmin';
    strokeWidth = strokeWidth + 'vmin';

    for (let i = 0; i < TOTAL_CIRCLE; i++) {
      let deg = (360 / TOTAL_CIRCLE) * i;
      let picDeg = -deg;
      pics.push(
        <div
          className={styles.orbitContainer}
          key={'pic' + i}
          style={{ transform: 'rotate(' + deg + 'deg)' }}
        >
          <div className={styles.orbit}>
            <svg
              width={svgSize}
              height={svgSize}
              style={{ position: 'absolute' }}
            >
              <line
                x1={svgPosition}
                y1={svgPosition}
                x2={svgSize}
                y2={svgSize}
                strokeWidth={strokeWidth}
                style={{ stroke: '#cecece' }}
                fill="blue"
                width="30px"
              />
              <circle
                cx={circlePosition}
                cy={circlePosition}
                r={circlePosition}
                fill="#dedede"
              />
            </svg>
            <div className={styles.picContainer}>
              <div
                style={{ transform: 'rotate(' + picDeg + 'deg)' }}
                className={styles.ImageContainer}
              >
                <img
                  src={photos[i].src}
                  alt="logo"
                  className={styles.pic}
                  layout="fill"
                />
              </div>
            </div>
            <svg
              width={svgSize}
              height={svgSize}
              style={{ position: 'absolute' }}
            >
              <circle
                className={styles.donutSegment}
                cx={circlePosition}
                cy={circlePosition}
                r={circleSize}
                fill="transparent"
                stroke="#cfcf55"
                strokeWidth={strokeWidth}
                onClick={() => {
                  this.selectPhoto(i);
                }}
              />
            </svg>
          </div>
        </div>
      );
    }

    const reversePhotos = [...photos].reverse();
    const selectedPhoto =
      reversePhotos[this.state.selectedPhotoIndex % TOTAL_CIRCLE];
    return (
      <div className={styles.ferris}>
        <div className={styles.stars} />
        <div className={styles.twinkling} />
        <div className={styles.picsContainer}>{pics}</div>
        <div className={styles.viewPicContainer}>
          <img className={styles.viewPic} src={selectedPhoto.src} alt={'pic'} />
          <div className={styles.viewPicDescr}>{selectedPhoto.descr}</div>
        </div>
        <img
          className={styles.bigben}
          src={'/images/Amit/big-ben.webp'}
          alt={'pic'}
        />
      </div>
    );
  }
}

export default Ferris;
