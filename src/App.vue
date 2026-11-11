<template>
  <view class="app">
    <slot />
  </view>
</template>

<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  }
}
</script>

<style>
/* 全局样式重置 */
page {
  background-color: #0a0a0a;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  height: 100%;
  overflow: hidden;
}

view, text {
  box-sizing: border-box;
}

/* 禁用点击高亮 */
view, button, image {
  -webkit-tap-highlight-color: transparent;
}

button {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
}

button::after {
  border: none;
}

/* 响应式适配 - 桌面端居中显示 */
@media screen and (min-width: 768px) {
  page {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #1a1a1a;
  }

  .app {
    max-width: 480px;
    width: 100%;
    height: 100vh;
    max-height: 900px;
    background: #0a0a0a;
    box-shadow: 0 0 60px rgba(0,0,0,0.8);
    position: relative;
    overflow: hidden;
  }
}

@media screen and (max-width: 767px) {
  .app {
    width: 100%;
    height: 100%;
  }
}
</style>
