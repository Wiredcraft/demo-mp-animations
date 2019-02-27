'use strict';

let info;
function getSystemInfo() {
  if (info) return info;
  return wx.getSystemInfoSync();
}

module.exports = getSystemInfo;
