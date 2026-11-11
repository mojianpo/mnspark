<template>
  <view class="page">
    <view class="header">
      <view class="back-btn" @tap="goBack">← {{ t.back }}</view>
      <text class="title">{{ t.privacyTitle }}</text>
    </view>

    <scroll-view class="content" scroll-y>
      <view class="section">
        <text class="section-title">{{ t.privacySection1Title }}</text>
        <text class="section-text">{{ t.privacySection1Content }}</text>
      </view>

      <view class="section">
        <text class="section-title">{{ t.privacySection2Title }}</text>
        <text class="section-text">{{ t.privacySection2Content }}</text>
      </view>

      <view class="section">
        <text class="section-title">{{ t.privacySection3Title }}</text>
        <text class="section-text">{{ t.privacySection3Content }}</text>
      </view>

      <view class="section">
        <text class="section-title">{{ t.privacySection4Title }}</text>
        <text class="section-text">{{ t.privacySection4Content }}</text>
      </view>

      <view class="section">
        <text class="section-title">{{ t.privacySection5Title }}</text>
        <text class="section-text">{{ t.privacySection5Content }}</text>
      </view>

      <view class="footer-text">
        <text>{{ t.lastUpdated }}: 2026-02-06</text>
      </view>
    </scroll-view>
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
    const savedLang = uni.getStorageSync('lang')
    if (savedLang) {
      this.currentLang = savedLang
    }
  },

  methods: {
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style scoped>
.page {
  width: 100%;
  min-height: 100vh;
  background: #0a0a0a;
}

.header {
  padding: 30rpx 40rpx;
  padding-top: calc(30rpx + env(safe-area-inset-top));
  border-bottom: 2rpx solid rgba(255,255,255,0.1);
}

.back-btn {
  font-size: 28rpx;
  color: #ff2d55;
  margin-bottom: 20rpx;
}

.title {
  font-size: 44rpx;
  font-weight: 700;
  color: #fff;
}

.content {
  height: calc(100vh - 200rpx);
  padding: 40rpx;
}

.section {
  margin-bottom: 60rpx;
}

.section-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #ff2d55;
  margin-bottom: 20rpx;
}

.section-text {
  display: block;
  font-size: 28rpx;
  line-height: 1.8;
  color: rgba(255,255,255,0.7);
}

.footer-text {
  padding: 40rpx 0;
  text-align: center;
  font-size: 24rpx;
  color: rgba(255,255,255,0.4);
}
</style>
