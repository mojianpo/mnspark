<template>
  <view class="age-gate-container">
    <!-- 背景效果 -->
    <view class="bg-gradient"></view>

    <!-- 内容区域 -->
    <view class="content">
      <!-- 警告图标 -->
      <view class="warning-icon">
        <text class="icon-text">18+</text>
      </view>

      <!-- 标题 -->
      <text class="title">{{ t.ageGateTitle }}</text>

      <!-- 说明文本 -->
      <view class="description">
        <text class="desc-text">{{ t.ageGateDesc1 }}</text>
        <text class="desc-text">{{ t.ageGateDesc2 }}</text>
        <text class="desc-text">{{ t.ageGateDesc3 }}</text>
      </view>

      <!-- 年龄确认问题 -->
      <text class="question">{{ t.ageGateQuestion }}</text>

      <!-- 按钮组 -->
      <view class="button-group">
        <button class="btn btn-confirm" @tap="confirmAge">
          {{ t.ageGateConfirm }}
        </button>
        <button class="btn btn-decline" @tap="declineAge">
          {{ t.ageGateDecline }}
        </button>
      </view>

      <!-- 底部提示 -->
      <text class="footer-note">{{ t.ageGateFooter }}</text>
    </view>
  </view>
</template>

<script>
import { i18n } from '../index/i18n.js'

export default {
  data() {
    return {
      currentLang: 'zh'
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

    // 检查是否已经确认过年龄
    const ageConfirmed = uni.getStorageSync('ageConfirmed')
    if (ageConfirmed === 'true') {
      // 已确认，直接跳转到启动页
      this.goToSplash()
    }
  },

  methods: {
    confirmAge() {
      // 保存年龄确认状态
      uni.setStorageSync('ageConfirmed', 'true')

      // 震动反馈
      uni.vibrateShort({
        type: 'light'
      })

      // 跳转到启动页
      this.goToSplash()
    },

    declineAge() {
      // 显示提示
      uni.showModal({
        title: this.t.ageGateDeclineTitle || '提示',
        content: this.t.ageGateDeclineContent || '您必须年满18岁才能使用本应用',
        showCancel: false,
        success: () => {
          // 在 H5 环境下关闭页面
          // #ifdef H5
          window.close()
          // #endif

          // 在 App 环境下退出应用
          // #ifdef APP-PLUS
          plus.runtime.quit()
          // #endif
        }
      })
    },

    goToSplash() {
      uni.reLaunch({
        url: '/pages/splash/index'
      })
    }
  }
}
</script>

<style scoped>
.age-gate-container {
  width: 100%;
  height: 100vh;
  background: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* 背景渐变 */
.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at center, rgba(255,100,0,0.1) 0%, transparent 70%);
}

/* 内容区域 */
.content {
  position: relative;
  z-index: 10;
  width: 90%;
  max-width: 600rpx;
  padding: 80rpx 60rpx;
  background: rgba(20,20,20,0.8);
  border: 2rpx solid rgba(255,100,0,0.3);
  border-radius: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  backdrop-filter: blur(20rpx);
}

/* 警告图标 */
.warning-icon {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b00, #ff2d00);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40rpx;
  box-shadow: 0 0 60rpx rgba(255,100,0,0.4);
  animation: pulse-warning 2s ease-in-out infinite;
}

@keyframes pulse-warning {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 60rpx rgba(255,100,0,0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 80rpx rgba(255,100,0,0.6);
  }
}

.icon-text {
  font-size: 64rpx;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 4rpx 8rpx rgba(0,0,0,0.3);
}

/* 标题 */
.title {
  font-size: 48rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 40rpx;
  text-align: center;
}

/* 说明文本 */
.description {
  margin-bottom: 50rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.desc-text {
  font-size: 28rpx;
  line-height: 1.8;
  color: rgba(255,255,255,0.7);
  text-align: center;
}

/* 问题 */
.question {
  font-size: 32rpx;
  font-weight: 600;
  color: #ff6b00;
  margin-bottom: 50rpx;
  text-align: center;
}

/* 按钮组 */
.button-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-bottom: 40rpx;
}

.btn {
  width: 100%;
  padding: 32rpx;
  border-radius: 32rpx;
  font-size: 32rpx;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-confirm {
  background: linear-gradient(135deg, #00ff88, #00cc66);
  color: #000;
  box-shadow: 0 16rpx 40rpx rgba(0,255,136,0.3);
}

.btn-confirm:active {
  transform: scale(0.98);
  box-shadow: 0 8rpx 20rpx rgba(0,255,136,0.2);
}

.btn-decline {
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.6);
  border: 2rpx solid rgba(255,255,255,0.1);
}

.btn-decline:active {
  transform: scale(0.98);
  background: rgba(255,255,255,0.03);
}

/* 底部提示 */
.footer-note {
  font-size: 24rpx;
  color: rgba(255,255,255,0.4);
  text-align: center;
  line-height: 1.6;
}
</style>
