# Mn Spark 🔥

情侣互动小游戏 - 抽卡、执行、升温


## Features

- 🎴 **Card-based gameplay** - Tap to reveal random challenges
- 🌡️ **4 intensity levels** - From gentle to extreme
- ⏱️ **Built-in timer** - Countdown for timed challenges
- 🎵 **Ambient audio** - Immersive background beats
- 📳 **Haptic feedback** - Vibration on supported devices
- 🔥 **Fire particles** - Dynamic visual effects
- 🎤 **Sound reactive** - Responds to ambient noise
- 📱 **Mobile-first** - Optimized for phones

## 运行-打包

在项目根目录执行以下命令。首次运行先安装依赖：

```powershell
npm ci
```

### 本地运行

```powershell
npm run dev:h5
```

H5 开发页面默认访问 `http://localhost:5173/`。需要从同一局域网的其他设备访问时，可用 `npm run dev:h5 -- --host 0.0.0.0`。

其他平台的开发编译命令：

```powershell
npm run dev:mp-weixin
npm run dev:app
```

### 编译

```powershell
npm run build:h5
npm run build:mp-weixin
npm run build:app
```

产物分别位于 `dist/build/h5`、`dist/build/mp-weixin` 和 `dist/build/app`。微信小程序产物可导入微信开发者工具；App 产物可导入 HBuilderX 继续运行或制作安装包。

### 压缩编译产物（PowerShell）

先执行上述编译命令，再运行：

```powershell
New-Item -ItemType Directory -Path dist/packages -Force | Out-Null
Compress-Archive -LiteralPath dist/build/h5 -DestinationPath dist/packages/midnight-spark-h5.zip -Force
Compress-Archive -LiteralPath dist/build/mp-weixin -DestinationPath dist/packages/midnight-spark-mp-weixin.zip -Force
Compress-Archive -LiteralPath dist/build/app -DestinationPath dist/packages/midnight-spark-app-source.zip -Force
```

`midnight-spark-app-source.zip` 只是 App 编译资源包，不是可安装的 APK。制作 APK 还需在 `src/manifest.json` 中配置有效 App ID，并使用 HBuilderX 打包。

