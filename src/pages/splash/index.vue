<template>
  <view class="splash-container">
    <!-- 背景渐变 -->
    <view class="bg-gradient"></view>

    <!-- 粒子效果 -->
    <view class="particles">
      <view
        v-for="i in 20"
        :key="i"
        class="particle"
        :style="getParticleStyle(i)"
      ></view>
    </view>

    <!-- Logo 和标题 -->
    <view class="content" :class="{ show: contentVisible }">
      <!-- Logo 图标 -->
      <view class="logo-wrapper">
        <view class="logo-glow"></view>
        <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
      </view>

      <!-- 应用名称 -->
      <view class="app-name">
        <text class="name-text">MIDNIGHT</text>
        <text class="name-text spark">SPARK</text>
      </view>

      <!-- 标语 -->
      <text class="tagline">{{ t.splashTagline }}</text>
    </view>

    <!-- 加载指示器 -->
    <view class="loading-indicator" :class="{ show: contentVisible }">
      <view class="dot"></view>
      <view class="dot"></view>
      <view class="dot"></view>
    </view>
  </view>
</template>

<script>
import { i18n } from '../index/i18n.js'

export default {
  data() {
    return {
      currentLang: 'zh',
      contentVisible: false
    }
  },

  computed: {
    t() {
      return i18n[this.currentLang]
    }
  },

  onLoad() {
    // 从本地存储读取语言设置
    const savedLang = uni.getStorageSync('lang')
    if (savedLang) {
      this.currentLang = savedLang
    }

    // 延迟显示内容（淡入效果）
    setTimeout(() => {
      this.contentVisible = true
    }, 300)

    // 2.5秒后跳转到主页
    setTimeout(() => {
      uni.reLaunch({
        url: '/pages/index/index'
      })
    }, 2500)
  },

  methods: {
    getParticleStyle(index) {
      // 随机生成粒子位置和动画延迟
      const left = Math.random() * 100
      const top = Math.random() * 100
      const delay = Math.random() * 2
      const duration = 2 + Math.random() * 2

      return {
        left: `${left}%`,
        top: `${top}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }
    }
  }
}
</script>

<style scoped>
.splash-container {
  width: 100%;
  height: 100vh;
  background: #0a0a0a;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 背景渐变 */
.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at center, rgba(255,20,20,0.15) 0%, transparent 70%);
  animation: pulse-bg 3s ease-in-out infinite;
}

@keyframes pulse-bg {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* 粒子效果 */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4rpx;
  height: 4rpx;
  background: #ff6b8a;
  border-radius: 50%;
  opacity: 0;
  animation: particle-float 4s ease-in-out infinite;
}

@keyframes particle-float {
  0%, 100% {
    opacity: 0;
    transform: translateY(0) scale(0);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-100rpx) scale(1);
  }
}

/* 内容区域 */
.content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.content.show {
  opacity: 1;
  transform: scale(1);
}

/* Logo */
.logo-wrapper {
  position: relative;
  width: 280rpx;
  height: 280rpx;
  margin-bottom: 60rpx;
}

/* 响应式适配 */
@media screen and (max-height: 600px) {
  .logo-wrapper {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 40rpx;
  }

  .name-text {
    font-size: 44rpx;
  }

  .tagline {
    font-size: 24rpx;
  }
}

.logo-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(255,45,85,0.4) 0%, transparent 70%);
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 1;
  }
}

.logo {
  width: 100%;
  height: 100%;
  animation: logo-rotate 3s ease-in-out infinite;
}

@keyframes logo-rotate {
  0%, 100% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(5deg) scale(1.05); }
}

/* 应用名称 */
.app-name {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30rpx;
}

.name-text {
  font-size: 56rpx;
  font-weight: 700;
  letter-spacing: 12rpx;
  color: #fff;
  text-shadow: 0 0 40rpx rgba(255,45,85,0.5);
}

.name-text.spark {
  color: #ff2d55;
  margin-top: -10rpx;
  animation: spark-glow 2s ease-in-out infinite;
}

@keyframes spark-glow {
  0%, 100% {
    text-shadow: 0 0 40rpx rgba(255,45,85,0.5);
  }
  50% {
    text-shadow: 0 0 60rpx rgba(255,45,85,1);
  }
}

/* 标语 */
.tagline {
  font-size: 28rpx;
  color: rgba(255,255,255,0.6);
  letter-spacing: 4rpx;
}

/* 加载指示器 */
.loading-indicator {
  position: absolute;
  bottom: 120rpx;
  display: flex;
  gap: 16rpx;
  opacity: 0;
  transition: opacity 0.5s ease 0.5s;
}

.loading-indicator.show {
  opacity: 1;
}

.dot {
  width: 12rpx;
  height: 12rpx;
  background: #ff2d55;
  border-radius: 50%;
  animation: dot-bounce 1.4s ease-in-out infinite;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dot-bounce {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}
</style>
