# Design QA

## 当前视觉方向

- 主系统：深色矿石底、深木材内容面、锻铁结构面、荧光绿状态/主动作、暖象牙文字。
- 字体分工：衬线体只承担大标题；像素字体只用于编号、英文标签和服务器标识；正文保持无衬线体。
- 形态规则：硬朗 1–2 px 圆角、同方向投影、同厚度金属描边；不再使用横梁贴图铺满按钮、通知或开场背景。

## 参考与问题证据

- 牌子材质目标：`C:\Users\Elder\AppData\Local\Temp\codex-clipboard-8a6b22ce-51b3-4127-b92e-640ba799bd69.png`
- 廉价复用的三块玩法牌：`C:\Users\Elder\AppData\Local\Temp\codex-clipboard-027a85be-1b8c-4d96-bcda-ab098b6cb9bc.png`
- 开场背景错误平铺：`C:\Users\Elder\AppData\Local\Temp\codex-clipboard-9107444e-3869-463b-8936-06e4f1366e8a.png`
- 新手入口品牌色混杂：`C:\Users\Elder\AppData\Local\Temp\codex-clipboard-729354a0-5d12-446b-88ed-d403390dd18e.png`

## 最新实现截图

- 桌面首屏：`C:\Users\Elder\.codex\visualizations\2026\07\29\019facdd-d817-7791-919b-ec4ed05e60a9\homepage-redesign-qa\09-style-unified-desktop-top.png`
- 核心玩法工作台：`C:\Users\Elder\.codex\visualizations\2026\07\29\019facdd-d817-7791-919b-ec4ed05e60a9\homepage-redesign-qa\10-style-unified-gameplay.png`
- 单色新手入口图标：`C:\Users\Elder\.codex\visualizations\2026\07\29\019facdd-d817-7791-919b-ec4ed05e60a9\homepage-redesign-qa\11-guide-icons-monochrome.png`
- 手机首屏：`C:\Users\Elder\.codex\visualizations\2026\07\29\019facdd-d817-7791-919b-ec4ed05e60a9\homepage-redesign-qa\12-style-unified-mobile-top.png`
- 手机单色入口图标：`C:\Users\Elder\.codex\visualizations\2026\07\29\019facdd-d817-7791-919b-ec4ed05e60a9\homepage-redesign-qa\13-guide-icons-mobile-monochrome.png`
- 清理后的锻造开场：`C:\Users\Elder\.codex\visualizations\2026\07\29\019facdd-d817-7791-919b-ec4ed05e60a9\homepage-redesign-qa\14-intro-forge-clean.png`
- 531 px 完整图标组：`C:\Users\Elder\.codex\visualizations\2026\07\29\019facdd-d817-7791-919b-ec4ed05e60a9\homepage-redesign-qa\15-guide-icons-531px.png`

## 同屏对照

- 品牌色混搭 → 统一荧光绿轮廓：`C:\Users\Elder\.codex\visualizations\2026\07\29\019facdd-d817-7791-919b-ec4ed05e60a9\homepage-redesign-qa\comparison-guide-icons-monochrome.png`

## 已完成的统一项

1. 三条核心玩法各自使用独立生成的木牌资产，不再复制同一块牌子换文字；经济、任务、生活的装饰语义仍可区分。
2. 页头、页脚、按钮、通知、标签栏统一为同一套锻铁渐变与描边，删除 `iron-texture.jpg` 的页面级平铺使用。
3. 木质内容面统一边框、内凹阴影和纹理密度；玩法工作台的激活标签改为木材嵌入状态。
4. 语雀、在线客户端和 QQ 图标保留对应轮廓，但全部使用 `#87d84d` 单色并进入相同的锻铁图标槽。
5. 主色、正文色、弱化色和分隔线已令牌化；绿色不再承担大面积背景，只用于主动作、状态和索引。
6. 开场改为纯暗色锻造空间，去除抽屉/横梁纹理的满屏平铺；锤子和铁砧保持中心舞台。
7. MOTD 牌和三块玩法牌的键盘焦点改为轮廓发光，不再出现与物体外形无关的矩形框。

## 运行与结构检查

- `node --check js/main.js` 与 `node --check js/server-status.js` 通过。
- `index.html` 可解析，无重复 ID，所有本地 `src` / `href` 资源均存在。
- 桌面与 390×844 手机宽度均已在应用内浏览器复核；未看到横向溢出、图片破框或字体遮挡。
- MOTD 复制按钮可触发锻铁通知；玩法标签仍保留 tab 语义与键盘状态。
- 本轮是视觉与主路径检查，不等同于完整 WCAG 合规审计。

当前状态：无已知阻断级布局问题，等待最终视觉确认。
