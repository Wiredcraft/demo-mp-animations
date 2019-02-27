import { gestureTapByTouches, gestureMoveByTouches } from '../../utils/gesture';

Page({
  data: {
    isPassVisible: false,
    loggedIn: false,
    // Custom nav bar style
    title: '我的账户',
    bgOpacity: 0,
    isShowTitle: true,
    enable: false,
    withBg: true,
  },

  /**
   * Touch event handlers.
   *
   * onTouchStart() and onTouchEnd() are considered global handlers.
   *
   * Movement is handled with touchMove, and touchEnd would only handle tap.
   */
  onTouchStart(e) {
    this.setData({ touchStart: e.touches, touchMoving: null });
  },
  onTouchMove(e) {
    const { touchStart, touchMoving, isPassVisible } = this.data;
    const direction = gestureMoveByTouches(
      touchMoving || touchStart,
      e.changedTouches,
    );
    if (
      (isPassVisible && direction === 'U')
      || (!isPassVisible && direction === 'D')
    ) {
      this.togglePass();
    }
    // Start a new calculation, once we got one done.
    if (direction) {
      this.setData({ touchMoving: e.changedTouches });
    }
    return direction;
  },
  onTouchEnd(e) {
    const { touchStart } = this.data;
    const tapping = gestureTapByTouches(touchStart, e.changedTouches);
    if (tapping) {
      this.togglePass();
    }
    // Cleanup.
    this.setData({ touchStart: [], touchMoving: null });
    return tapping;
  },
  onProfileTouchEnd(e) {
    const { touchStart, isPassVisible } = this.data;
    const { url } = e.currentTarget.dataset;
    if (
      !isPassVisible
      && url
      && gestureTapByTouches(touchStart, e.changedTouches)
    ) {
      this.queueAction(() => wx.navigateTo({ url }));
    }
  },

  /* Helpers */
  togglePass() {
    this.setData({
      isPassVisible: !this.data.isPassVisible,
    });
  },
});
