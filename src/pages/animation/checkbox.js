Page({
    data:{
      selected: false
    },
    handleItemClick() {
      this.setData({selected: !this.data.selected});
    },
})