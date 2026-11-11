<template>
  <view class="container">
    <!-- 背景热度 -->
    <view class="bg-heat"></view>
    <view class="bg-sparks">
      <view v-for="spark in 8" :key="spark" class="bg-spark"></view>
    </view>

    <!-- 边缘脉冲 -->
    <view class="pulse-border" :class="{ active: pulseActive, intense: pulseIntense }"></view>

    <!-- 闪屏 -->
    <view class="flash" :class="{ fire: flashActive }"></view>

    <!-- 主容器 -->
    <view class="game-container" :class="{ locked: !keyVerified }">
      <!-- 顶栏 -->
      <view class="status-bar">
        <text class="logo">MIDNIGHT SPARK</text>
        <view class="header-right">
          <view class="lang-btn" @tap="showLangPanel = true">{{ langIcon }} {{ t.langName }}</view>
          <view class="mode-badge" @tap="showSettings = true">{{ t['mode_' + gameMode] }}</view>
        </view>
      </view>

      <!-- 卡片区 -->
      <view class="card-area">
        <view class="card" :class="{ flipped: isFlipped }" @tap="flipCard">
          <!-- 卡背 -->
          <view class="card-face card-back">
            <view class="card-back-icon">
              <text class="heart-icon">&#10084;</text>
            </view>
            <text class="card-back-text">{{ t.tapToReveal }}</text>
          </view>
          <!-- 卡面 -->
          <view class="card-face card-front">
            <view class="intensity-strip" :style="{ background: `linear-gradient(90deg, ${levelColor}, transparent)` }"></view>
            <view class="command-content">
              <view class="command-level" :style="{ borderColor: levelColor, color: levelColor }">
                <text>{{ levelText }}</text>
              </view>

              <!-- 体位图标 -->
              <view class="position-icon" v-if="currentCommand && currentPoseSVG">
                <image class="pose-img" :src="currentPoseSVG" mode="aspectFit"></image>
              </view>

              <!-- 指令文本 -->
              <view class="command-text">
                <text class="command-p">{{ currentCommand ? currentCommand.cmd : '' }}</text>
              </view>

              <!-- 倒计时 -->
              <view class="countdown" v-if="countdown > 0">
                <text class="countdown-time" :class="{ urgent: countdown <= 5 }">{{ countdown }}</text>
                <text class="countdown-label">{{ t.seconds }}</text>
              </view>
              <view class="countdown" v-else-if="isFlipped">
                <text class="countdown-done">{{ t.done }}</text>
                <text class="countdown-label">{{ t.clickNext }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部按钮 -->
      <view class="action-bar">
        <button class="btn btn-skip" @tap="skipCard">{{ t.skip }}</button>
        <button class="btn btn-next" @tap="nextCard">{{ t.next }}</button>
      </view>
    </view>

    <!-- 设置面板 -->
    <view class="settings-panel" v-if="showSettings" @tap.self="showSettings = false">
      <view class="settings-content">
        <button class="settings-close" @tap="showSettings = false">x</button>
        <text class="settings-title">{{ t.settingsTitle }}</text>
        <view class="mode-cards">
          <view
            v-for="mode in modes"
            :key="mode"
            class="mode-card"
            :class="{ active: gameMode === mode }"
            @tap="selectMode(mode)"
          >
            <text class="mode-name">{{ t['mode_' + mode] }}</text>
            <text class="mode-desc">{{ t['mode_' + mode + '_desc'] }}</text>
          </view>
        </view>
        <text class="mode-warning">{{ t.modeWarning }}</text>
        <view class="legal-links">
          <text class="legal-link" @tap="goToPrivacy">{{ t.privacyPolicy }}</text>
          <text class="legal-divider">|</text>
          <text class="legal-link" @tap="goToTerms">{{ t.userAgreement }}</text>
        </view>
      </view>
    </view>

    <!-- 语言面板 -->
    <view class="lang-panel" v-if="showLangPanel" @tap.self="showLangPanel = false">
      <view class="lang-content">
        <text class="lang-title">Select Language</text>
        <view class="lang-options">
          <view
            v-for="lang in languages"
            :key="lang.code"
            class="lang-option"
            :class="{ active: currentLang === lang.code }"
            @tap="setLanguage(lang.code)"
          >
            <text class="flag">{{ lang.flag }}</text>
            <text>{{ lang.name }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- KEY 验证弹窗 -->
    <view class="key-modal" v-if="showKeyModal">
      <view class="key-content">
        <text class="key-title">{{ t.keyModalTitle }}</text>
        <text class="key-desc">{{ t.keyModalDesc }}</text>
        <input
          class="key-input"
          v-model="keyInput"
          :maxlength="32"
          :placeholder="t.keyPlaceholder"
          placeholder-class="key-input-placeholder"
          @confirm="confirmKey"
        />
        <text class="key-error" v-if="keyError">{{ keyError }}</text>
        <button class="key-confirm-btn" @tap="confirmKey">{{ t.keyConfirm }}</button>
      </view>
    </view>
  </view>
</template>

<script>
import { i18n, levelColors } from './i18n.js'
import commands from './commands.js'
import { getPoseSVG } from './poseSVGs.js'
import { ACCESS_KEY } from '../../config.js'

export default {
  data() {
    return {
      keyVerified: false,
      showKeyModal: false,
      keyInput: '',
      keyError: '',
      currentLang: 'zh',
      gameMode: 'wild',
      isFlipped: false,
      currentCommand: null,
      countdown: 0,
      timerInterval: null,
      showSettings: false,
      showLangPanel: false,
      pulseActive: false,
      pulseIntense: false,
      flashActive: false,
      usedIndices: [],
      modes: ['gentle', 'passionate', 'wild', 'extreme'],
      languages: [
        { code: 'zh', flag: '\uD83C\uDDE8\uD83C\uDDF3', name: '\u4E2D\u6587' },
        { code: 'en', flag: '\uD83C\uDDFA\uD83C\uDDF8', name: 'English' },
        { code: 'vi', flag: '\uD83C\uDDFB\uD83C\uDDF3', name: 'Ti\u1EBFng Vi\u1EC7t' }
      ]
    }
  },

  computed: {
    t() {
      return i18n[this.currentLang]
    },
    langIcon() {
      return '\uD83C\uDF10'
    },
    levelColor() {
      return this.currentCommand ? levelColors[this.currentCommand.level] : '#ff2d55'
    },
    levelText() {
      if (!this.currentCommand) return ''
      return this.t['level_' + this.currentCommand.level]
    },
    currentPoseSVG() {
      if (!this.currentCommand || !this.currentCommand.pose) return ''
      return getPoseSVG(this.currentCommand.pose)
    },
    currentModeCommands() {
      return commands[this.currentLang][this.gameMode] || []
    }
  },

  onLoad() {
    // 检查访问密钥（校验通过则不再弹窗）
    const savedKey = uni.getStorageSync('accessKey')
    if (savedKey === ACCESS_KEY) {
      this.keyVerified = true
    } else {
      this.showKeyModal = true
    }

    // 从本地存储读取语言设置
    const savedLang = uni.getStorageSync('lang')
    if (savedLang) {
      this.currentLang = savedLang
    }

    // 从本地存储读取模式设置
    const savedMode = uni.getStorageSync('gameMode')
    if (savedMode) {
      this.gameMode = savedMode
    }
  },

  methods: {
    confirmKey() {
      const key = (this.keyInput || '').trim()
      if (key === ACCESS_KEY) {
        this.keyVerified = true
        this.showKeyModal = false
        this.keyError = ''
        uni.setStorageSync('accessKey', key)
        this.vibrate()
      } else {
        this.keyError = this.t.keyError
        this.vibrate()
      }
    },

    flipCard() {
      if (!this.keyVerified) return
      if (this.isFlipped) return

      // 随机选择一个指令
      this.pickRandomCommand()

      // 翻转卡片
      this.isFlipped = true

      // 触发脉冲效果
      this.triggerPulse()

      // 如果有时长，启动倒计时
      if (this.currentCommand && this.currentCommand.duration) {
        this.startCountdown(this.currentCommand.duration)
      }

      // 震动反馈
      this.vibrate()
    },

    pickRandomCommand() {
      const cmds = this.currentModeCommands
      if (cmds.length === 0) return

      // 如果所有指令都用过了，重置
      if (this.usedIndices.length >= cmds.length) {
        this.usedIndices = []
      }

      // 找一个没用过的随机索引
      let idx
      do {
        idx = Math.floor(Math.random() * cmds.length)
      } while (this.usedIndices.includes(idx))

      this.usedIndices.push(idx)
      this.currentCommand = cmds[idx]
    },

    nextCard() {
      if (!this.keyVerified) return
      this.resetCard()
      // 短暂延迟后翻转新卡片
      setTimeout(() => {
        this.flipCard()
      }, 300)
    },

    skipCard() {
      if (!this.keyVerified) return
      this.resetCard()
    },

    resetCard() {
      this.isFlipped = false
      this.currentCommand = null
      this.stopCountdown()
    },

    startCountdown(seconds) {
      this.countdown = seconds
      this.stopCountdown()

      this.timerInterval = setInterval(() => {
        this.countdown--

        // 最后5秒震动提醒
        if (this.countdown <= 5 && this.countdown > 0) {
          this.vibrate()
        }

        if (this.countdown <= 0) {
          this.stopCountdown()
          this.triggerIntensePulse()
          this.vibratePattern()
        }
      }, 1000)
    },

    stopCountdown() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }
    },

    triggerPulse() {
      this.pulseActive = true
      setTimeout(() => {
        this.pulseActive = false
      }, 600)
    },

    triggerIntensePulse() {
      this.pulseIntense = true
      this.flashActive = true
      setTimeout(() => {
        this.pulseIntense = false
        this.flashActive = false
      }, 1000)
    },

    vibrate() {
      // #ifdef APP-PLUS || MP-WEIXIN
      uni.vibrateShort({
        type: 'medium'
      })
      // #endif
    },

    vibratePattern() {
      // #ifdef APP-PLUS || MP-WEIXIN
      uni.vibrateLong()
      // #endif
    },

    selectMode(mode) {
      if (!this.keyVerified) return
      this.gameMode = mode
      uni.setStorageSync('gameMode', mode)
      this.usedIndices = []
      this.showSettings = false
      this.resetCard()
    },

    setLanguage(lang) {
      if (!this.keyVerified) return
      this.currentLang = lang
      uni.setStorageSync('lang', lang)
      this.usedIndices = []
      this.showLangPanel = false
    },

    goToPrivacy() {
      if (!this.keyVerified) return
      uni.navigateTo({
        url: '/pages/privacy/index'
      })
    },

    goToTerms() {
      if (!this.keyVerified) return
      uni.navigateTo({
        url: '/pages/terms/index'
      })
    }
  },

  onUnload() {
    this.stopCountdown()
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
  background: #0a0a0a;
  position: relative;
  overflow: hidden;
}

/* 背景热度 */
.bg-heat {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at 50% 100%, rgba(255,20,20,0.2) 0%, transparent 60%);
  pointer-events: none;
  animation: heat-breathe 6s ease-in-out infinite;
}
@keyframes heat-breathe {
  0%, 100% { opacity: 0.55; }
  50% { opacity: 1; }
}

.bg-sparks {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}
.bg-spark {
  position: absolute;
  width: 6rpx;
  height: 6rpx;
  border-radius: 50%;
  background: #ff6b8a;
  box-shadow: 0 0 18rpx 6rpx rgba(255,45,85,0.55);
  opacity: 0;
  animation: spark-twinkle 4s ease-in-out infinite;
}
.bg-spark:nth-child(1) { top: 12%; left: 12%; animation-delay: 0s; }
.bg-spark:nth-child(2) { top: 22%; left: 78%; animation-delay: 1.7s; }
.bg-spark:nth-child(3) { top: 38%; left: 7%; animation-delay: 2.8s; }
.bg-spark:nth-child(4) { top: 45%; left: 91%; animation-delay: 0.9s; }
.bg-spark:nth-child(5) { top: 68%; left: 15%; animation-delay: 3.1s; }
.bg-spark:nth-child(6) { top: 76%; left: 86%; animation-delay: 2.2s; }
.bg-spark:nth-child(7) { top: 88%; left: 35%; animation-delay: 1.2s; }
.bg-spark:nth-child(8) { top: 8%; left: 57%; animation-delay: 3.6s; }
@keyframes spark-twinkle {
  0%, 30%, 70%, 100% { opacity: 0; transform: scale(0.5); }
  45%, 55% { opacity: 0.8; transform: scale(1); }
}

/* 边缘脉冲 */
.pulse-border {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 100;
  box-shadow: inset 0 0 150rpx rgba(255,0,50,0);
  transition: box-shadow 0.3s;
}
.pulse-border.active {
  animation: pulse 0.6s ease-out;
}
.pulse-border.intense {
  animation: pulse-intense 1s ease-out;
}
@keyframes pulse {
  0% { box-shadow: inset 0 0 400rpx rgba(255,0,50,1); }
  100% { box-shadow: inset 0 0 160rpx rgba(255,0,50,0); }
}
@keyframes pulse-intense {
  0% { box-shadow: inset 0 0 600rpx rgba(255,0,0,1); }
  50% { box-shadow: inset 0 0 300rpx rgba(255,50,0,0.8); }
  100% { box-shadow: inset 0 0 100rpx rgba(255,0,50,0); }
}

/* 闪屏 */
.flash {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ff0000;
  pointer-events: none;
  z-index: 200;
  opacity: 0;
}
.flash.fire {
  animation: flash-fire 0.3s ease-out;
}
@keyframes flash-fire {
  0% { opacity: 0.8; }
  30% { opacity: 0.5; }
  100% { opacity: 0; }
}

/* 主容器 */
.game-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}
.game-container.locked {
  pointer-events: none;
  opacity: 0.4;
}

/* 顶栏 */
.status-bar {
  padding: 30rpx 40rpx;
  padding-top: calc(30rpx + env(safe-area-inset-top));
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  font-size: 28rpx;
  font-weight: 600;
  letter-spacing: 4rpx;
  color: #ff2d55;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 20rpx;
}
.lang-btn {
  padding: 12rpx 20rpx;
  background: rgba(255,255,255,0.1);
  border: 2rpx solid rgba(255,255,255,0.2);
  border-radius: 30rpx;
  font-size: 24rpx;
  color: rgba(255,255,255,0.7);
}
.mode-badge {
  padding: 12rpx 24rpx;
  background: rgba(255,45,85,0.2);
  border: 2rpx solid rgba(255,45,85,0.4);
  border-radius: 40rpx;
  font-size: 26rpx;
  color: #ff2d55;
}

/* 卡片区 */
.card-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}
.card {
  width: 100%;
  max-width: 680rpx;
  height: 70vh;
  max-height: 1040rpx;
  min-height: 500rpx;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
}
.card.flipped {
  transform: rotateY(180deg);
}
.card-face {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backface-visibility: hidden;
  border-radius: 48rpx;
  overflow: hidden;
}

/* 卡背 */
.card-back {
  background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
  border: 4rpx solid rgba(255,45,85,0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 40rpx 120rpx rgba(0,0,0,0.8);
}
.card-back-icon {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: glow 2s ease-in-out infinite;
}
.heart-icon {
  font-size: 120rpx;
  color: #ff6b8a;
}
@keyframes glow {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}
.card-back-text {
  font-size: 32rpx;
  color: rgba(255,255,255,0.6);
  letter-spacing: 8rpx;
}

/* 卡面 */
.card-front {
  background: linear-gradient(180deg, #1a0a10 0%, #0a0a0a 100%);
  border: 4rpx solid rgba(255,45,85,0.4);
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  box-shadow: 0 50rpx 160rpx rgba(0,0,0,0.9);
}
.intensity-strip {
  height: 12rpx;
}
.command-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 50rpx 40rpx;
}
.command-level {
  display: inline-flex;
  align-items: center;
  padding: 12rpx 28rpx;
  background: rgba(255,45,85,0.15);
  border: 2rpx solid rgba(255,45,85,0.3);
  border-radius: 40rpx;
  font-size: 26rpx;
  font-weight: 600;
  align-self: flex-start;
}

/* 体位示意图 */
.position-icon {
  width: 280rpx;
  height: 220rpx;
  margin: 30rpx auto;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: icon-pulse 2s ease-in-out infinite;
}
.pose-img {
  width: 100%;
  height: 100%;
}
@keyframes icon-pulse {
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.05); opacity: 1; }
}

.command-text {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
}
.command-p {
  font-size: 40rpx;
  font-weight: 500;
  line-height: 1.8;
  text-align: center;
  color: #fff;
}

/* 倒计时 */
.countdown {
  padding: 36rpx;
  text-align: center;
  border-top: 2rpx solid rgba(255,255,255,0.1);
}
.countdown-time {
  font-size: 64rpx;
  font-weight: 700;
  color: #ff2d55;
  transition: all 0.3s;
}
.countdown-time.urgent {
  color: #ff0000;
  animation: countdown-pulse 0.5s ease-in-out infinite;
}
@keyframes countdown-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}
.countdown-done {
  font-size: 48rpx;
  font-weight: 700;
  color: #00ff00;
}
.countdown-label {
  display: block;
  font-size: 24rpx;
  color: rgba(255,255,255,0.4);
  margin-top: 10rpx;
}

/* 底部按钮 */
.action-bar {
  padding: 40rpx;
  padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
  display: flex;
  gap: 30rpx;
}
.btn {
  flex: 1;
  padding: 32rpx;
  border: none;
  border-radius: 32rpx;
  font-size: 32rpx;
  font-weight: 600;
}
.btn-next {
  background: linear-gradient(135deg, #ff2d55, #c41e3a);
  color: #fff;
  box-shadow: 0 16rpx 60rpx rgba(255,45,85,0.4);
}
.btn-skip {
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.5);
  border: 2rpx solid rgba(255,255,255,0.1);
  flex: 0 0 160rpx;
}

/* 设置面板 */
.settings-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.95);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
}
.settings-content {
  width: 90%;
  max-width: 680rpx;
  padding: 60rpx 40rpx;
  position: relative;
}
.settings-close {
  position: absolute;
  top: 0;
  right: 0;
  width: 80rpx;
  height: 80rpx;
  background: none;
  color: rgba(255,255,255,0.5);
  font-size: 48rpx;
}
.settings-title {
  font-size: 44rpx;
  font-weight: 700;
  margin-bottom: 60rpx;
  text-align: center;
  color: #ff2d55;
}
.mode-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 30rpx;
}
.mode-card {
  width: calc(50% - 15rpx);
  padding: 50rpx 30rpx;
  border-radius: 40rpx;
  background: rgba(255,255,255,0.03);
  border: 4rpx solid rgba(255,255,255,0.1);
  text-align: center;
}
.mode-card.active {
  background: rgba(255,45,85,0.15);
  border-color: #ff2d55;
  box-shadow: 0 0 80rpx rgba(255,45,85,0.3);
}
.mode-name {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16rpx;
}
.mode-card.active .mode-name {
  color: #ff2d55;
}
.mode-desc {
  display: block;
  font-size: 24rpx;
  color: rgba(255,255,255,0.5);
  line-height: 1.6;
  white-space: pre-line;
}
.mode-warning {
  display: block;
  margin-top: 50rpx;
  text-align: center;
  font-size: 26rpx;
  color: rgba(255,200,100,0.8);
  padding: 30rpx;
  background: rgba(255,150,0,0.1);
  border-radius: 24rpx;
}

.legal-links {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40rpx;
  gap: 20rpx;
}

.legal-link {
  font-size: 24rpx;
  color: rgba(255,255,255,0.5);
  text-decoration: underline;
}

.legal-divider {
  font-size: 24rpx;
  color: rgba(255,255,255,0.3);
}

/* 语言面板 */
.lang-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.95);
  z-index: 350;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lang-content {
  padding: 60rpx 40rpx;
}
.lang-title {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  margin-bottom: 60rpx;
  text-align: center;
  color: #ff2d55;
}
.lang-options {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
  width: 560rpx;
}
.lang-option {
  padding: 36rpx 50rpx;
  background: rgba(255,255,255,0.05);
  border: 4rpx solid rgba(255,255,255,0.1);
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  color: #fff;
}
.lang-option.active {
  background: rgba(255,45,85,0.15);
  border-color: #ff2d55;
}
.flag {
  font-size: 48rpx;
  margin-right: 20rpx;
}

/* KEY 验证弹窗 */
.key-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.85);
  z-index: 400;
  display: flex;
  align-items: center;
  justify-content: center;
}
.key-content {
  width: 90%;
  max-width: 620rpx;
  padding: 60rpx 50rpx;
  background: rgba(20,20,20,0.95);
  border: 2rpx solid rgba(255,45,85,0.3);
  border-radius: 40rpx;
  position: relative;
}
.key-title {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  text-align: center;
  color: #ff2d55;
  margin-bottom: 20rpx;
}
.key-desc {
  display: block;
  font-size: 26rpx;
  color: rgba(255,255,255,0.6);
  text-align: center;
  line-height: 1.6;
  margin-bottom: 50rpx;
}
.key-input {
  width: 100%;
  height: 96rpx;
  padding: 0 30rpx;
  box-sizing: border-box;
  background: rgba(255,255,255,0.05);
  border: 2rpx solid rgba(255,255,255,0.15);
  border-radius: 24rpx;
  color: #fff;
  font-size: 32rpx;
  margin-bottom: 20rpx;
}
.key-input-placeholder {
  color: rgba(255,255,255,0.3);
}
.key-error {
  display: block;
  font-size: 26rpx;
  color: #ff4757;
  text-align: center;
  margin-bottom: 20rpx;
}
.key-confirm-btn {
  width: 100%;
  padding: 32rpx;
  border: none;
  border-radius: 32rpx;
  font-size: 32rpx;
  font-weight: 600;
  background: linear-gradient(135deg, #ff2d55, #c41e3a);
  color: #fff;
  box-shadow: 0 16rpx 60rpx rgba(255,45,85,0.4);
}
</style>
