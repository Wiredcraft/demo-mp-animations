Page({
    data:{
      selected: {},
      colors: ['CCCC99', 'FFCCCC', '99CCCC', 'FFCC33', '66CCCC', '339999', 'CCCCCC', 'CCCCFF']
    },
    handleItemClick(e) {
      const {color} = e.currentTarget.dataset;
      const {selected} = this.data;
      selected[color] = !this.data.selected[color];
      this.setData({selected});
    },
})