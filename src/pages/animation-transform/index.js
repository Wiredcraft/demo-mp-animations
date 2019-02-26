import { gestureTapByTouches, gestureMoveByTouches } from '../../utils/gesture';

const app = getApp();
Page({
  data:{
    unlocks:[0,1,2],
    cardIndex : 0,
    backgroundColorSet:["#2F64CE", "#D97B93", "#898CA5", "#439792"],
    imageSet: [
      '../../assets/photo1.jpg',
      '../../assets/photo2.jpg',
      '../../assets/photo3.jpg'
    ],
    titleSet: [
      'Epic React Flyknit',
      '加入12月31日NTC的',
      '登录会员',
      'Air Max 97 SK'
    ],
    subTitleSet: [
      '跑步鞋',
      '全方位锻炼直播',
      '参与测试更多 Nike 产品',
      'London x Marrakesh'
    ],
    numberDownAnimation: '',

    tabbar:{},

    bgOpacity: 0,
    isShowTitle: true,
    enable: true,
    arrowWithBorder: true,
    frontColor: 'dark',
    title:'会员福利',
    fontColor: 'white'
  },
  touchStart(e) {
    this.setData({ 
      touchStart: e.touches,
      numberDownAnimation: ''
    });
  },
  touchEnd(e) {
    const { touchStart, cardIndex, unlocks } = this.data;
    this.setData({ touchStart: [] });

    if(gestureTapByTouches(touchStart, e.changedTouches)) return

    const direction = gestureMoveByTouches(
      touchStart,
      e.changedTouches
    );
    if (direction === 'U') 
      this.setData({
        cardIndex: cardIndex + 1 < unlocks.length ? cardIndex + 1 : cardIndex,
        numberDownAnimation: 'slidedown'
      })
    else if ( direction === 'D') 
      this.setData({
        cardIndex: cardIndex - 1 >= 0 ? cardIndex - 1 : cardIndex,
        numberDownAnimation: 'slidedown'
      })
  }
})