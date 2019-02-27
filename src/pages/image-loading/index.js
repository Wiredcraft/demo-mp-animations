Page({
  navigateToPage(e) {
    const { src } = e.currentTarget.dataset;
    wx.navigateTo({ url: src });
  },
});
