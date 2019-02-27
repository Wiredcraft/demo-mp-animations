const _images = [
  'https://img14.360buyimg.com/img/jfs/t1/16771/16/8423/180825/5c763946Ee0c50d3e/95968ce75a3ad45a.jpg',
  'https://img20.360buyimg.com/img/jfs/t1/22700/9/8428/227755/5c763e2aE7bf26546/0b3c714d9c385a00.jpg',
  'https://img11.360buyimg.com/img/jfs/t1/21785/21/8350/89923/5c763915E59529762/fd55496b9af73a74.jpg',
  'https://img11.360buyimg.com/img/jfs/t1/32635/10/3447/151344/5c763938Ec1fbeb80/9c4d83d697b6aa00.jpg',
  'https://img30.360buyimg.com/img/jfs/t1/14302/26/8422/168758/5c763e34E1e306376/0f805082f633ec4c.jpg',
  'https://img11.360buyimg.com/img/jfs/t1/15514/10/8499/168587/5c763e43E7cef5c04/25d91bafc492ec61.jpg'
];
const config = {
  data: {},
  onShow() {
    const now = Date.now();
    const images = [];
    for (let i = 0; i < _images.length; i++) {
      images.push(_images[i] + '?t=' + i + now + i);
    }
    this.setData({ images });
  }
};
Page(config);
