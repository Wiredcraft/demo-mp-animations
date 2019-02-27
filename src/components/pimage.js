// import store from '../../utils/configureStore';
// import { rpxStrToPx, getFullWidthImageURL } from '../../utils/image-helper';
// import { getSystemInfo } from '../../redux/app';
// import { sleep } from '../../utils/common';

const getSystemInfo  = require('../utils/getSystemInfo');
const patternRpxDimension = /^(\d+)(?:\s+)?rpx$/;

/**
 * @param {string} str - string like '670rpx'
 * @param {number} windowWidth - window width
 * @return {number?}
 */
export function rpxStrToPx(str, windowWidth) {
  const capture = patternRpxDimension.exec(str);
  if (capture && capture[1]) {
    const num = parseInt(capture[1], 10);
    return Math.ceil((num * windowWidth) / 750);
  }
  return undefined;
}

function getFullWidthImageURL(x) {
  return x;
}

function createAnimation() {
  return wx
    .createAnimation({
      duration: 500,
      timingFunction: 'ease-in-out'
    })
    .opacity(1)
    .step()
    .export();
}

const config = {
  properties: {
    // required
    src: {
      type: String
    },
    // required
    aspectRatio: {
      type: Number
    },
    key: {
      type: String
    },
    withLogo: {
      type: Boolean,
      value: true
    },
    placeholderBackground: {
      type: String,
      value: '#f7f7f7'
    },
    // this is not supported well ATM
    lazy: {
      type: Boolean,
      value: false
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    // only rpx is supported, e.g. 670rpx
    widthStr: {
      type: String
    },
    borderRadius: {
      type: String
    }
  },

  created() {
    const info = getSystemInfo();
    this.info = info;
    const { pixelRatio, windowWidth } = info;

    // image wrapper width
    this.ww = this.data.width ? this.data.width : windowWidth;
  },

  attached() {
    const {
      aspectRatio,
      height,
      width,
      widthStr,
      src,
      placeholderBackground,
      borderRadius,
      lazy
    } = this.data;
    const { pixelRatio, windowWidth } = this.info;

    // debug
    // console.log('progressive-image', JSON.stringify(this.data, null, 2));

    // eslint-disable-next-line prefer-destructuring
    let ww;

    if (width && width > 0) {
      ww = width;
    } else if (typeof widthStr === 'string' && widthStr !== '') {
      const num = rpxStrToPx(widthStr, this.ww);
      if (num) ww = num;
    }

    // eslint-disable-next-line prefer-destructuring
    if (!ww) ww = this.ww;
    this.iw = ww * pixelRatio;
    const iw = this.iw;

    let wh;
    if (height && height > 0) {
      wh = height;
    } else {
      wh = Math.ceil(ww / aspectRatio);
    }

    // let srcLo = getLowResImageURL(src);
    let srcHi = getFullWidthImageURL(src, iw);

    // if (process.env.NODE_ENV === 'development') {
    //   function cacheBuster(url) {
    //     const x = Math.random();
    //     return `${url}?t=${x}`;
    //   }
    //   srcHi = cacheBuster(srcHi);
    // }

    const srcLo = '';
    this.srcHi = srcHi;
    this.ww = ww;
    this.wh = wh;

    const imgStyle = `width: ${ww}px;height: ${wh}px;`;
    let containerStyle = `width: ${ww}px;height: ${wh}px;background: ${placeholderBackground};`;
    if (borderRadius) {
      containerStyle += `border-radius:${borderRadius};`;
    }
    const placeholderStyle = containerStyle;

    if (lazy) srcHi = '';

    this.setData({
      containerStyle,
      placeholderStyle,
      imgStyle,
      srcLo,
      srcHi
    });
  },

  ready() {
    if (this.data.lazy !== true) return;
    const io = this.createIntersectionObserver();
    io.relativeToViewport().observe('.container', () => {
      this.setData({ srcHi: this.srcHi });
    });
    this.io = io;
  },

  detached() {
    if (this.io) this.io.disconnect();
  },

  methods: {
    handleImageOnLoad(ev) {
      // if (process.env.NODE_ENV === 'development') {
        // block it
        // await sleep(2000000);
      // }

      const { width, height } = ev.detail;
      const { srcHi, key, src } = this.data;
      const imageAnimation = createAnimation();

      const { ww } = this;
      let { wh } = this;
      const aspectRatio = width / height;
      let imgStyle;
      if (Math.abs(aspectRatio - this.data.aspectRatio) > 0.1) {
        // mitigate gap beween real image aspectRatio and the one from CMS
        // the threshold is 0.1
        wh = Math.ceil(ww / aspectRatio);
        this.wh = wh;
        imgStyle = `width: ${ww}px;height: ${wh}px;`;
      }
      const containerStyle = `width: ${ww}px; height: ${wh}px;`;
      const placeholderStyle = 'display: none;';

      this.triggerEvent('load', { key, width, height, src });

      const data = {
        srcLo: srcHi,
        containerStyle
      };

      if (imgStyle) data.imgStyle = imgStyle;

      this.setData(data, () => {
        // sleep a frame of time
        // to avoid collision between imgStyle and imageAnimation
        setTimeout(() => {
          this.setData({ imageAnimation });
        }, 17);

        // defer hiding placeholder
        // because image rendering takes time in mini program
        setTimeout(() => {
          // hide placeholder
          this.setData({ placeholderStyle });
        }, 100);
      });
    },

    handleImageLoadError(ev) {
      // eslint-disable-next-line no-console
      console.log('image loading error', ev.detail);
    }
  }
};

Component(config);

// if (process.env.NODE_ENV === 'test') {
//   module.exports = {
//     rpxStrToPx,
//     getFullWidthImageURL,
//     config
//   };
// }
