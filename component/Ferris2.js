import { Component } from 'react';
import styles from '../styles/Ferris2.module.css';
import Image from 'next/image';

const PHOTO_SWITCH_DELAY = 10000;

class Ferris2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPhotoIndex: 0,
    };
    this.timeoutFn = null;
  }

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
    const { photos } = this.props;
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
              <circle
                cx={circlePosition}
                cy={circlePosition}
                r={circlePosition}
                className={styles.SvgStroke}
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
        <div className={styles.background} />
        <div className={styles.picsContainer}>{pics}</div>
        <div className={styles.selectedImageContainer}>
          <Image
            className={styles.selectedImage}
            src={selectedPhoto.src}
            alt={'pic'}
            width={520}
            height={420}
          />
        </div>
      </div>
    );
  }
}

export default Ferris2;
