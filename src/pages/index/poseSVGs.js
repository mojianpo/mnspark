// SVG转base64 data URL
function svgToDataURL(svg) {
  // 添加 xmlns 属性
  const svgWithNS = svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')
  return 'data:image/svg+xml;base64,' + uni.base64Encode(svgWithNS)
}

// SVG原始数据
const svgRaw = {
  kiss: `<svg viewBox="0 0 100 80" fill="none" stroke="#ff6b8a" stroke-width="2" stroke-linecap="round"><ellipse cx="30" cy="28" rx="12" ry="14"/><ellipse cx="70" cy="28" rx="12" ry="14"/><path d="M42 28c4 3 12 3 16 0"/><path d="M30 42v20M70 42v20"/><path d="M25 35c-8 3-12 10-8 18M75 35c8 3 12 10 8 18"/></svg>`,
  hug: `<svg viewBox="0 0 100 80" fill="none" stroke="#ff6b8a" stroke-width="2" stroke-linecap="round"><ellipse cx="35" cy="22" rx="10" ry="12"/><ellipse cx="65" cy="22" rx="10" ry="12"/><path d="M35 34v25M65 34v25"/><path d="M25 40c-8 5-8 18 0 22l10 3"/><path d="M75 40c8 5 8 18 0 22l-10 3"/><path d="M40 48h20"/></svg>`,
  touch: `<svg viewBox="0 0 100 80" fill="none" stroke="#ff6b8a" stroke-width="2" stroke-linecap="round"><ellipse cx="65" cy="25" rx="12" ry="14"/><path d="M65 39v22"/><path d="M20 55c12-18 28-28 45-32"/><path d="M20 55l-5 8M20 55l8 2"/><circle cx="30" cy="45" r="2" fill="#ff6b8a"/><circle cx="42" cy="38" r="2" fill="#ff6b8a"/><circle cx="54" cy="32" r="2" fill="#ff6b8a"/></svg>`,
  lying: `<svg viewBox="0 0 100 80" fill="none" stroke="#ff6b8a" stroke-width="2" stroke-linecap="round"><ellipse cx="20" cy="40" rx="10" ry="8"/><path d="M30 40h50"/><path d="M80 40c5 0 8 5 8 10"/><path d="M80 55l8 12M30 42c8 6 18 8 28 5"/><ellipse cx="55" cy="38" rx="6" ry="4"/></svg>`,
  doggy: `<svg viewBox="0 0 100 80" fill="none" stroke="#ff6b8a" stroke-width="2" stroke-linecap="round"><ellipse cx="25" cy="45" rx="9" ry="7"/><path d="M34 45l22-8"/><path d="M56 37l12 22M56 37l10-18"/><path d="M17 48l-8 18M17 42l-12-8"/><ellipse cx="72" cy="28" rx="9" ry="11"/><path d="M72 39v22M64 61h16"/><path d="M28 42c6-3 14-3 20 0"/></svg>`,
  cowgirl: `<svg viewBox="0 0 100 80" fill="none" stroke="#ff6b8a" stroke-width="2" stroke-linecap="round"><ellipse cx="50" cy="18" rx="9" ry="11"/><path d="M50 29v18"/><path d="M35 55c0-5 7-10 15-10s15 5 15 10"/><ellipse cx="50" cy="58" rx="18" ry="8"/><path d="M32 58l-8 12M68 58l8 12"/><path d="M42 40c5-3 11-3 16 0"/></svg>`,
  legs_up: `<svg viewBox="0 0 100 80" fill="none" stroke="#ff6b8a" stroke-width="2" stroke-linecap="round"><ellipse cx="30" cy="50" rx="10" ry="8"/><path d="M30 42l18-28M30 42l-18-22"/><path d="M40 50h22"/><ellipse cx="72" cy="38" rx="9" ry="11"/><path d="M72 49v15M64 64h16"/><circle cx="48" cy="14" r="3" fill="#ff6b8a"/><circle cx="12" cy="20" r="3" fill="#ff6b8a"/></svg>`,
  oral: `<svg viewBox="0 0 100 80" fill="none" stroke="#ff6b8a" stroke-width="2" stroke-linecap="round"><ellipse cx="50" cy="20" rx="9" ry="11"/><path d="M50 31v12"/><ellipse cx="50" cy="52" rx="15" ry="10"/><path d="M35 52l-10 18M65 52l10 18"/><path d="M45 45c3-2 7-2 10 0"/></svg>`,
  wall: `<svg viewBox="0 0 100 80" fill="none" stroke="#ff6b8a" stroke-width="2" stroke-linecap="round"><path d="M15 5v70" stroke-width="3"/><ellipse cx="30" cy="22" rx="8" ry="10"/><path d="M30 32v22M22 54l-7 18M38 54l8 12"/><ellipse cx="55" cy="28" rx="8" ry="10"/><path d="M55 38v18M47 56l-5 16M63 56l5 16"/><path d="M35 45c5-5 12-5 17 0"/></svg>`,
  sixtynine: `<svg viewBox="0 0 100 80" fill="none" stroke="#ff6b8a" stroke-width="2" stroke-linecap="round"><ellipse cx="22" cy="28" rx="9" ry="7"/><path d="M31 28h40"/><path d="M22 35l-10 20M22 21l-8-15"/><ellipse cx="78" cy="52" rx="9" ry="7"/><path d="M78 45l10-20M78 59l8 15"/></svg>`,
  carry: `<svg viewBox="0 0 100 80" fill="none" stroke="#ff6b8a" stroke-width="2" stroke-linecap="round"><ellipse cx="50" cy="12" rx="8" ry="10"/><ellipse cx="50" cy="35" rx="7" ry="9"/><path d="M50 22v6"/><path d="M43 44l-10 22M57 44l10 22"/><path d="M33 30c-10 5-12 18-5 25"/><path d="M67 30c10 5 12 18 5 25"/><path d="M42 50c5 4 11 4 16 0"/></svg>`,
  blindfold: `<svg viewBox="0 0 100 80" fill="none" stroke="#ff6b8a" stroke-width="2" stroke-linecap="round"><ellipse cx="50" cy="25" rx="12" ry="15"/><path d="M30 20h40" stroke-width="4"/><path d="M50 40v18"/><path d="M35 58h30"/><path d="M38 58l-8 16M62 58l8 16"/></svg>`,
  spank: `<svg viewBox="0 0 100 80" fill="none" stroke="#ff6b8a" stroke-width="2" stroke-linecap="round"><ellipse cx="35" cy="48" rx="16" ry="12"/><path d="M19 48l-10 22M51 48l10 16"/><ellipse cx="25" cy="35" rx="8" ry="6"/><path d="M72 20l-18 22" stroke-width="3"/><path d="M58 28l6-12M58 28l12 2"/><path d="M54 42l-4 6M58 38l6 4"/></svg>`,
  hairpull: `<svg viewBox="0 0 100 80" fill="none" stroke="#ff6b8a" stroke-width="2" stroke-linecap="round"><ellipse cx="30" cy="32" rx="11" ry="13"/><path d="M25 19c-6-12 2-18 12-16s14 10 8 20"/><path d="M42 22l28-10"/><path d="M70 12l6-6M70 12l6 4"/><path d="M30 45v20M20 65h20"/></svg>`,
  tied: `<svg viewBox="0 0 100 80" fill="none" stroke="#ff6b8a" stroke-width="2" stroke-linecap="round"><ellipse cx="50" cy="18" rx="9" ry="11"/><path d="M50 29v25"/><path d="M30 38h40"/><path d="M30 38l-12-25M70 38l12-25"/><rect x="15" y="10" width="8" height="6" rx="1"/><rect x="77" y="10" width="8" height="6" rx="1"/><path d="M40 54l-8 18M60 54l8 18"/></svg>`,
  kneel: `<svg viewBox="0 0 100 80" fill="none" stroke="#ff6b8a" stroke-width="2" stroke-linecap="round"><ellipse cx="50" cy="18" rx="9" ry="11"/><path d="M50 29v22"/><path d="M35 51c0 12 7 20 15 20s15-8 15-20"/><path d="M38 55l-15 8M62 55l15 8"/><path d="M45 38c3-3 7-3 10 0"/></svg>`,
  collar: `<svg viewBox="0 0 100 80" fill="none" stroke="#ff6b8a" stroke-width="2" stroke-linecap="round"><ellipse cx="30" cy="22" rx="9" ry="11"/><ellipse cx="30" cy="36" rx="7" ry="4" stroke-width="3"/><path d="M37 36l45 25"/><circle cx="82" cy="61" r="4"/><path d="M30 40v25"/><path d="M20 65l-8 10M40 65l8 10"/></svg>`,
  xpose: `<svg viewBox="0 0 100 80" fill="none" stroke="#ff6b8a" stroke-width="2" stroke-linecap="round"><ellipse cx="50" cy="18" rx="9" ry="11"/><path d="M50 29v25"/><path d="M18 30l32 8M82 30l-32 8"/><path d="M32 54l-18 20M68 54l18 20"/><circle cx="18" cy="30" r="4" fill="#ff6b8a"/><circle cx="82" cy="30" r="4" fill="#ff6b8a"/><circle cx="14" cy="74" r="4" fill="#ff6b8a"/><circle cx="86" cy="74" r="4" fill="#ff6b8a"/></svg>`,
  candle: `<svg viewBox="0 0 100 80" fill="none" stroke="#ff6b8a" stroke-width="2" stroke-linecap="round"><path d="M50 8c-4 6-4 12 0 18s4 10 0 16"/><rect x="44" y="24" width="12" height="32" rx="2"/><ellipse cx="50" cy="65" rx="20" ry="8"/><circle cx="50" cy="45" r="2" fill="#ff6b8a"/><circle cx="50" cy="52" r="2" fill="#ff6b8a"/><path d="M35 62c-5 4-5 10 0 13M65 62c5 4 5 10 0 13"/></svg>`,
  obey: `<svg viewBox="0 0 100 80" fill="none" stroke="#ff6b8a" stroke-width="2" stroke-linecap="round"><ellipse cx="50" cy="48" rx="9" ry="11"/><path d="M50 59v12"/><path d="M35 71c0 4 7 7 15 7s15-3 15-7"/><path d="M41 37l-18-25M59 37l18-25"/><path d="M23 12l-6-6M23 12l6-2"/><path d="M77 12l6-6M77 12l-6-2"/></svg>`,
}

// 使用函数动态生成，避免在模块加载时就调用 uni.base64Encode
export function getPoseSVG(pose) {
  if (!pose || !svgRaw[pose]) return ''
  const svg = svgRaw[pose]
  const svgWithNS = svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')
  // 使用 encodeURIComponent 更可靠
  return 'data:image/svg+xml,' + encodeURIComponent(svgWithNS)
}

export default svgRaw
