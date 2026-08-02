# Design QA

## 2026-08-02 五周目主城素材精选与图鉴接入

- source visual truth:
  - `E:/Downloads/五周目主城.7z`（115 张原始实机截图）
  - `C:/Users/Elder/AppData/Local/Temp/codex-fifth-city-20260802-a/_contact/city-contact-01.jpg` 至 `city-contact-05.jpg`（完整素材总览）
  - 选中原图均来自 `C:/Users/Elder/AppData/Local/Temp/codex-fifth-city-20260802-a/五周目主城/`，原始尺寸为 2560×1494 或 2560×1600。
- implementation screenshots:
  - `E:/Documents/Website/homepage-1.3/design-qa-fifth-city-desktop.png`（大陆图鉴标题与主城全景封面）
  - `E:/Documents/Website/homepage-1.3/design-qa-fifth-city-cards-desktop.png`（桌面三分类卡片）
  - `E:/Documents/Website/homepage-1.3/design-qa-fifth-city-lightbox-desktop.png`（桌面大图浏览）
  - `E:/Documents/Website/homepage-1.3/design-qa-fifth-city-mobile.png`（495px 窄屏单列卡片）
  - `E:/Documents/Website/homepage-1.3/design-qa-fifth-city-lightbox-mobile.png`（495px 窄屏大图浏览）
- viewport and density:
  - 桌面：1280×720 CSS px，devicePixelRatio 1.25；常规页面捕获为 1270×714 px，弹窗捕获为 1280×720 px。
  - 窄屏：495×1158 CSS px，devicePixelRatio 1.25；常规页面捕获为 486×1137 px，弹窗捕获为 495×1158 px。
  - 原图及 WebP 保持 2560px 宽，通过 `object-fit: cover` 用于封面、`object-fit: contain` 用于大图浏览；视觉比较按相同 CSS 视口与页面状态判断，不把截图工具的边缘裁切误判为布局差异。
- state: 首页 `#intro`，大陆图鉴静态封面、五周目主城三分类卡片、主城全景翻页、城市地标弹窗和关闭状态。

### 全视图对照

- 115 张原图先以五张总览图筛选，只接入 12 张代表性画面，按主城全景、樱花街巷、城市地标各 4 张分类，避免长页面堆叠大量相似截图。
- 大陆图鉴原先的主城全景与街景封面替换为新素材；其余玩家合影、厨房与酒馆展示保持不变，页面信息层级没有被打乱。
- 桌面三列与窄屏单列均无横向溢出；分类卡沿用现有字体、圆角、遮罩、边线和交互样式。

### 聚焦区域对照

- 分类封面保留主体：全景卡保留城市轮廓与空中水母，街巷卡保留屋脊透视与樱花，地标卡完整呈现发光神树。
- 弹窗使用完整画幅显示，2560px 原图细节清楚；桌面和窄屏下标题、说明、计数与上一张/下一张控件均未遮挡画面。
- 同一对照输入中检查了素材总览、三分类成品与大图弹窗；没有发现拉伸、糊图、错误裁切或明显压缩伪影。

### 必查项

- 字体与排版：沿用现有像素标题与中文正文字体，标题层级、字重和换行在 1280px 与 495px 下均清晰。
- 间距与布局：桌面 3 列、窄屏 1 列；卡片比例、20px/16px 间距、圆角和分区留白与既有玩法图库一致。
- 色彩：保留实机截图原色，封面仅加既有底部暗色遮罩保证白字可读，未额外改变图片色调。
- 图片质量：12 张 WebP 保持原像素尺寸并以高质量参数转换；弹窗 `contain` 完整显示画面，封面 `cover` 裁切均保留关键主体。
- 文案：全部使用中文，分类、张数、替代文本和逐图说明与画面内容一致。

### Findings and comparison history

- 初次实现未发现 P0、P1 或 P2 问题，无需修复迭代。
- P3：未保留 115 张中的高度相似连拍；这是有意的首页性能与浏览节奏取舍，原始压缩包仍完整保留。
- 浏览器验证：三分类按钮均可识别；主城全景正确打开为 1 / 4，下一张切换为 2 / 4；关闭后页面滚动恢复；窄屏城市地标弹窗为 1 / 4；控制台无错误或警告。

### Implementation Checklist

- [x] 12 张精选素材转换为同尺寸高质量 WebP。
- [x] 大陆图鉴两张主城封面替换。
- [x] 三分类入口与共用大图浏览器接入。
- [x] 桌面和窄屏布局、图片切换、关闭、滚动锁定与控制台检查通过。

final result: passed

## 2026-08-02 玩法素材分类图库与动态经济高清替换

- source visual truth:
  - `E:/Downloads/玩法.7z`（26 张实机截图，农耕 4、厨房 6、地摊 3、家具 8、酒馆 4、酿酒 1）
  - `C:/Users/Elder/AppData/Local/Temp/codex-gameplay-assets-20260802/gameplay-assets-contact-sheet.jpg`（26 张素材总览）
  - `C:/Users/Elder/AppData/Local/Temp/codex-clipboard-c9ebc76d-9c5f-499e-aeb3-57504970b7d9.png`（用户标出的旧低清动态经济图）
- implementation screenshots:
  - `E:/Documents/Website/homepage-1.3/design-qa-gameplay-gallery.png`（1270×714，桌面分类封面）
  - `E:/Documents/Website/homepage-1.3/design-qa-gameplay-gallery-mobile.png`（486×1137，手机单列分类封面）
  - `E:/Documents/Website/homepage-1.3/design-qa-gameplay-lightbox-mobile.png`（495×1158，手机图库弹窗）
  - `E:/Documents/Website/homepage-1.3/design-qa-dynamic-economy-mobile.png`（486×1137，动态经济高清替换）
- viewport and density:
  - 桌面：1280×720 CSS px，devicePixelRatio 1.25；三列卡片约 393×246 CSS px。
  - 手机：495×1158 CSS px，devicePixelRatio 1.25；单列卡片约 454×284 CSS px。
- state: 首页 `#intro` 玩法实景分类封面、农耕图库打开态、酿酒单图态、核心玩法动态经济卡；玩法百科 `#world` 区域背景资源。
- density normalization: 原图保持 2560×1494 或 2560×1600，网页 WebP 保持同尺寸；对照时以完整素材总览、分类封面和 `object-fit: contain` 弹窗大图共同判断裁切与清晰度。

### 全视图对照

- 26 张素材按原压缩包的六个分类进入图库；厨房-01、农耕-02 与此前两张展示图哈希完全相同，复用现有高清 WebP，没有重复文件。
- 桌面使用 3×2 分类封面，手机折为单列；两种宽度横向溢出均为 0。
- 首页只渲染六张分类封面；弹窗切换当前分类图片，避免一次性将 26 张全部压到页面布局中。

### 聚焦区域对照

- 弹窗大图使用 `object-fit: contain`，原始画面完整可见；农耕 4 张的上一张、下一张循环正常。
- 酿酒分类为 1 张时，翻页按钮正确禁用；Esc 关闭后焦点返回触发卡片，页面滚动恢复。
- 动态经济卡由旧低清图换为 2560×1494 的地摊实景，市场主体更清楚，文字遮罩仍可读；玩法百科残留引用同步替换。

### 必查项

- 字体与排版：分类标题、编号与说明沿用现有像素字体和文楷体系；桌面与手机均无截断。
- 间距与布局：分类卡片沿用现有圆角、边线与 16:10 影像比例；桌面 20px 网格间距，手机 16px。
- 色彩：保留服务器实机截图原色，仅使用既有暗色遮罩保障白字对比度。
- 图片质量：26 张均保留原始像素尺寸并转为高质量 WebP，总体积约 8.7 MiB；可视图片全部完成加载，无拉伸、破图或明显压缩伪影。
- 文案：分类、数量和逐图说明与压缩包目录和画面内容一致，不使用中英混排。

### Findings and comparison history

- [P1，已修复] 首次交互测试中图库不打开。原因是图片节点变量遮蔽了全局 `Image` 构造器，预加载时报错并中断打开流程；改为 `document.createElement('img')` 后复测通过。
- [P2，已修复] 用户标出的动态经济卡仍引用旧低清 JPG；已换成高清地摊 WebP，并删除无引用的旧文件。
- 修复后无剩余 P0、P1 或 P2 问题。

### Primary interactions tested

- 分类卡打开图库。
- 上一张、下一张切换并更新标题、说明和计数。
- 单图分类禁用翻页。
- Esc 关闭、恢复页面滚动并将焦点交还分类卡。
- 桌面三列与手机单列布局均无横向溢出。

final result: passed

## 2026-08-01 森罗厨房与酒馆展示图

- source visual truth:
  - `C:/Users/Elder/AppData/Local/Temp/codex-clipboard-d060e8ec-81df-45d3-9f90-c253d1ef7bf6.png`（森罗厨房，2560×1494）
  - `C:/Users/Elder/AppData/Local/Temp/codex-clipboard-da9ec7b0-6def-43df-880e-94b7a34183e0.png`（森罗酒馆，2560×1494）
- implementation screenshot: `E:/Documents/Website/homepage-1.3/design-qa-showcase.png`（1270×714）
- viewport: 1280×720 CSS px，devicePixelRatio 1.25；两张卡片均为 597×348 CSS px。
- state: 首页 `#intro` 大陆图鉴，桌面双列展示，导航固定在顶部。
- density normalization: 原图与实现截图在同一对照输入中按可视区域比较；卡片比例设为 `1280 / 747`，与 2560×1494 原图一致，没有由比例差异造成的裁切。

### 全视图对照

- 两张新图位于既有主城照片之后并保持同一网格、圆角、间距与字幕样式；厨房和酒馆成对排列。
- 页面横向溢出为 0；五张展示图全部完成加载。

### 聚焦区域对照

- 厨房卡保留左侧炉灶、中央工作区、右侧储物与整排火炉。
- 酒馆卡保留左侧红色作物、中央建筑与右侧葡萄架；主体位置与原图一致。
- 单卡 597×348，已足够判断主体、锐度与字幕遮挡，因此无需额外局部裁切截图。

### 必查项

- 字体与排版：沿用现有图鉴字幕字体、字重和字号，没有新增字体漂移。
- 间距与布局：双列间距 26px，卡片尺寸一致；新增一整行，没有孤立卡片。
- 色彩：保留原始暖色厨房与高饱和庄园画面，未增加滤镜或改色。
- 图片质量：两张素材保留 2560×1494 尺寸并转为高质量 WebP；浏览器显示自然尺寸正确，无拉伸、破图或明显压缩伪影。
- 文案：字幕分别为“森罗厨房 · 厨具工序”和“森罗酒馆 · 酿造原料”，与图片内容相符。

### Findings

- 无 P0、P1 或 P2 问题。

### Comparison history

- 首次实现对照即通过；未发现需要返修的 P0/P1/P2 差异。

final result: passed

## 当前视觉方向(2026-07-31 电影化 + MC 配色,结构参考 GTA VI 官网)

- 主系统:微绿调黑底 `#0b0d09` + 米白文字 `#f4f2e6`;彩色用 MC 三原色令牌——金 `#f5be4f`(小麦/火把)、草绿 `#8fdd55`(草地)、钻石青 `#5ed6c4`(钻石/水),渐变 `linear-gradient(100deg, gold, leaf 48%, aqua)` 只用于巨标、在线状态、主动作按钮与重点数据;红石红 `#e05a4d` 仅作离线语义。
- 结构对照 GTA VI:100svh 全幅主视觉(封面图 + 巨大像素渐变 "ELLAN")→ 巨标宣言 "2020 — 2026" → 引文 → 全幅玩法艺术卡(经济/日常/生活三张大图,文字压图上)→ 大陆图鉴混排 → 团队 → 指南行 → 加入区。
- 排版:像素字体为开源 **Fusion Pixel 缝合像素 12px 比例版**(OFL-1.1,`font/fusion-pixel-12px-proportional.woff2`,许可证 `font/OFL-fusion-pixel.txt`,含简中),只用于 logo、巨标与 kicker;正文、标题与引文用开源 **霞鹜文楷 GB**(OFL-1.1,`font/lxgw-wenkai-gb-regular.woff2` 约 8MB,由官方 TTF 转 woff2——许可证明确允许 webfont 格式转换,许可文件 `font/OFL-lxgw-wenkai-gb.txt`),全 GB 字形覆盖所以动态 MOTD 也能一致渲染;字号大量用 `clamp()` 流式缩放。旧 `site.ttf` 已不再被引用。
- 动效:hero 视差(图片 translateY 0.32 + scale,zoom 动画在容器上避免变换冲突)、`.reveal` IntersectionObserver 渐入、scrollspy、页头滚动态 + 常驻渐变 scrim 保证可读性。
- 护眼:全程无高饱和荧光色,黑底 + 暖白文字 + 低亮度大图。
- 二维码:不再是页面末尾的常驻块,收进加入区状态卡下方的「扫码加群」按钮(`#qr-toggle`),点击展开向上浮层(`#qr-popover`),外部点击 / Esc 关闭;QA 钩子 `?qr=1` 强制展开。
- 已废弃:平面几何暖纸体系(2026-07-31 早轮)、木纹/锻铁体系(更早前),两轮的 CSS/JS 均已移除。

## 运行与结构检查

- `node --check js/main.js` 与 `node --check js/server-status.js` 通过。
- `index.html` 无重复 ID;所有本地 `src` / `href` 资源存在(css/js 引用带 `?v=20260731-mc-v4` 缓存戳)。
- `server-status.js`:mcsrvstat v2 API;MOTD 用 `motd.html` 白名单消毒渲染(仅文本/br/span 颜色加粗);RTT 延迟;minotar 玩家头像;人数 tween;nav-live 与 hero 在线 chip(`#hero-online`)同步;离线降级为"状态获取失败"。
- 桌面端各区块(hero / 巨标 / 玩法卡 / 图鉴 / 团队 / 加入 + QR 浮层展开态)均经 Edge 无头截图逐块目验;实时数据(在线人数、彩色 MOTD、版本徽章)截图确认真实渲染。
- 移动端按 `clamp()` 与媒体查询逻辑复核;**未做真机截图**——Edge 无头布局视口最小约 486px,390 截图是左切假象,不能作为依据。真机需用户过目。
- QA 截图钩子:`?shot=1` 强制 reveal 可见 + 固定 hero 940px + `scroll-behavior:auto` + `html.qa-shot`;100svh 的 hero 不能用高视口整页截图,必须带钩子。人数 tween 在 `qa-shot` 下直接落终值。

## 历史记录

### 2026-08-01 新增《玩法百科》电影化长页(本轮)

- 起因:`index.html` 导航与首页 CTA 都指向 `gameplay.html`,但该文件不存在,两处均为死链。本轮补齐,并把用户提供的完整玩法文档(七章)落地。
- 新增三个文件,**首页样式表与脚本零改动**:
  - `gameplay.html`(约 24KB):八章结构 = 序章 / NPC 教学 / 四大区域 / 玩法系统 / 经济 / 任务订单 / 玩家交易 / 玩法闭环 + 收束 CTA。
  - `css/gameplay.css`(约 31KB):在 `main.css` 之后加载的增量样式,颜色全部走现有 `--gold/--leaf/--aqua/--line` 令牌,断点沿用 1120/860/600 三档。
  - `js/gameplay.js`(约 3.6KB):阅读进度条、章节 scrollspy、数字滚动(`data-count`),IIFE + 存在性守卫,风格与既有脚本一致。
- 信息密度取「精选主线 + 可展开细节」:长清单(30 余种作物、鱼竿鱼饵、200+ 菜品、29 款酒水、巨龙掉落池)收进 5 个原生 `<details>`,零 JS 依赖、键盘可达。
- **电影化手段**(全部纯 CSS/原生 JS,不新增图片):
  1. 无照片开场——双层径向光晕 + CSS 像素网格 + 旋转光环,像素巨标 `GAMEPLAY` 配 `grad-anim`
  2. 顶部胶片式阅读进度条(`transform: scaleX`,rAF 节流)
  3. `position: sticky` 章节标尺(八章,横向可滚,移动端隐藏滚动条)
  4. 幕间黑场 `.reel-break` + 像素幕号 `CHAPTER 0X`
  5. 章节背景巨大半透明像素数字(`opacity: .034`)随滚动视差位移
  6. NPC 台词卡(渐变竖引号条 + 文楷台词 + 角色名牌),保留原话「农作物无法在它们不适应的季节存活」
  7. 四个原创 CSS 构件:四季轮盘(`conic-gradient`)、钓鱼收杆条(色块 + 扫动指针)、食谱谜语翻转卡(`:hover`/`:focus-within`)、酿造五星研究条
  8. 附魔八级稀有度色阶用原文中国传统色(汉白玉/毛绿/霁青/夹竹桃红/淡橘橙/油菜花黄/鹤顶红/粉团花红);动态定价用带 7.2~9.2 上下限虚线带的 `clip-path` 折线图;闭环图与成长时间轴用 CSS grid 重画(替代原文 ASCII)
- 原文 emoji(🌾🎣🍳🍺⚔️🛋️🐉🎯🎰✨)**未采用**——与像素字体 + 传统色体系冲突且跨平台渲染不一致,改用像素编号 `01`–`10` + 中文短标签。
- **素材决策**:只复用首页已在用的 4 张实机图作区域卡背景(`world-street` / `gameplay-daily` / `gameplay-economy` / `world-night`),**零新增图片、零体积增长**。明确排除:
  - `img1~img6`(2000×1600、3.4–5.3MB)、`banner2.png`(4.19MB)——体积过大
  - `start.jpg`(太空渲染)、`zhandian.jpg`(星空插画)——**经目验非 MC 实机截图**,与页脚「本站画面均为本服务器实机截图」声明冲突
- **不引入 `server-status.js`**:该脚本开头 `if (!icon || !motd) return`,新页无状态卡会直接退出并把 `nav-live` 永久卡在「连接中」。故新页导航右侧改为「复制 IP」+「在线游玩」两个按钮。
- 首页最小改动(仅入口,内容与配图未动):导航第 38 行 `#features/核心玩法` → `gameplay.html/玩法百科`;核心玩法段末尾新增百科 CTA。
  - **踩坑**:初版 CTA 用了 `.playbook-cta` 类,Edge 截图发现是裸元素——当前磁盘上的 `main.css` **并没有**这个类的样式定义。为守住「不改 main.css」约束,改为复用现成 `.section-heading` + `.section-lead` + `.btn-ghost`,零新增 CSS,重新截图确认渲染正常。
- 校验证据:
  - `node --check js/gameplay.js` / `js/main.js` / `js/server-status.js` 全部通过
  - `gameplay.html`:26 个 ID 无重复、`h1` 唯一、10 个 section、本地资源全部存在
  - Playwright 1440×900:八章 scrollspy 全部正确命中 00–07;8 个关键构件(四季轮盘 340×340、收杆条 78×300、谜语卡 360×300、酿造条、稀有度色阶 1130×86、价格图 566×260、闭环图 1220×180、时间轴 820×495)均可见且尺寸有效;5 个 `<details>` 可展开;控制台零错误;无横向溢出
  - Playwright 390×844:`hero-stat-row` / `manifesto-grid` / `focus-system` / `currency-grid` 全部折为单列,各章节无横向溢出,控制台零错误
  - Microsoft Edge 无头:`gameplay.html` 首屏 + 390px 首屏 + 1440×16000 全页(裁切 systems/economy/loop 三章)+ 首页首屏 / 玩法卡区 / CTA 区,均落盘并逐张 Read 目验
  - 首页两个入口点击实测跳通(`navCount=1`、`ctaCount=1`,均落到 `gameplay.html` / 标题「玩法百科 · Ellan 艾尔岚」/ `h1=GAMEPLAY`)
- 注意:Edge 用 `--screenshot` 直接带锚点(如 `#systems`)启动会截到黑底(锚点布局稳定前就截图),逐章视觉证据应改用全页截图 + Pillow 裁切。
- 移动端仍**未做真机截图**,390px 结论来自 Playwright 视口 + 媒体查询复核,真机需用户过目。

### 2026-07-31 合规处理(网易/Mojang)

- 页脚新增双语免责声明:非官方社区、与 Mojang Studios/Microsoft/网易无隶属授权关系、商标归属声明、画面为自服实机截图,英文用 Mojang 品牌准则标准句式 "NOT AN OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT."。
- 「官方 QQ 群」措辞改为「玩家 QQ 群」(3 处),避免"官方"歧义;标题/描述中的 "Minecraft 服务器" 为描述性使用,保留。
- 下载弹窗:原 Windows 按钮指向不存在的 exe(死链),按 `files/manifest.json` 的 mrpack_url 改为 `files/ellan.mrpack`(Modrinth 整合包,不含游戏本体),文案补充"仅含模组与配置、需正版账号与支持 .mrpack 的启动器"。
- **遗留风险(未动,待用户决定)**:`links/` 目录为 Eaglercraft 1.12(JS/WASM 版 Minecraft 反编译移植),是本站最大的法律暴露点——Microsoft 长期对 Eaglercraft 发 DMCA,国内网易对私服/盗版客户端诉讼更激进。免责声明无法覆盖此类分发,建议下线该目录及首页"启动在线客户端"入口。
- 校验:`node --check` 通过;页脚免责渲染截图确认;缓存戳升至 `mc-v5`。

### 2026-07-31 霞鹜文楷 GB 正文

- 用户指定 https://github.com/lxgw/LxgwWenkaiGB 作为文本字体。
- 官方仅发布 TTF(约 25MB/字重);用 fonttools+brotli(临时 venv,已清理)把 Regular 转成 woff2 自托管,约 8MB。OFL 附加条款明确允许为 webfont 交付做格式转换。
- `--font-body` 与 `--font-serif` 首选改为 "LXGW WenKai GB";粗重由浏览器合成(仅引入 Regular 一字重)。选全量字形而非子集,是因为状态卡 MOTD 是动态中文,子集会缺字。
- 缓存戳升至 `mc-v3`;Edge 截图确认正文/引文/标题/按钮/状态卡均已 Kai 体渲染,像素巨标不受影响。

### 2026-07-31 MC 配色 + 开源字体 + 二维码收纳(本轮)

- 用户反馈:字体换开源像素、配色贴近 MC 而非 GTA、页末二维码头重脚轻。
- 字体:引入 TakWolf/fusion-pixel-font 2026.07.20(OFL-1.1),`@font-face` 换为 woff2,`--font-display` 栈更新;旧 `site.ttf` 保留在磁盘但不再引用。
- 配色:`--salmon/--orchid` 令牌更名为 `--leaf/--aqua` 并换 MC 值,`--gold` 微调;新增 `--danger`;滚动条、选区、焦点框、按钮投影、版本徽章描边全部换成同色系;`btn-rune` 文字由白改深绿 `#16240e` 保证在新渐变上的对比度。
- 二维码:`.join-qr` 常驻块删除,改为「扫码加群」按钮 + 上弹浮层(main.js 开关,含 aria-expanded、外部点击/Esc 关闭、`?qr=1` QA 钩子)。
- 校验:`node --check` 通过;Edge 截图确认新像素字体、金→绿→青渐变、QR 浮层展开态、状态卡真实数据均正常。

### 2026-07-31 电影化重构

- 用户判定平面几何稿"像玩具、不好看",指定参考 https://www.rockstargames.com/VI 重写。
- `index.html` / `css/main.css`(约 800 行)/ `js/main.js` / `js/server-status.js` 全部重写,结构见上方"当前视觉方向"。
- 审查修复:页头加常驻渐变 scrim + 文字阴影;移动端 hero-logo/statement-big/blockquote 字号缩小;statement/story/join 间距收紧;play-card 底部渐变加深保证文字可读。
- 校验:双 JS `node --check` 通过;无重复 ID;本地资源全存在;Edge 无头截图逐区块目验通过。
- QA 残留(temp/eq*、edgeqa、shots)已清理。

### 2026-07-31 平面几何重构(已废弃)

- 旧暗色木纹/锻铁体系被判定"AI 味重、荧光绿刺眼",改为暖纸底 `#f1ede2` + 赤陶/赭黄/苔绿三主色平面几何体系;圆盘截图、虚线环、接缝齿轮、90° 步进表盘。
- 移除锻造开场与 MOTD 悬挂木牌及 verlet 链条物理;`main.js` 由 557 行精简至约 260 行。
- `server-status.js` 重写:MOTD 白名单消毒、RTT 延迟、minotar 头像、人数 tween(此套数据逻辑沿用至电影化版本)。
- 该方向后被用户否掉("像玩具"),全面被电影化重构取代。

### 2026-07-29 开屏性能修复(已随旧设计移除)

- 旧锻造开场:锤击 80ms 后舞台与双门同时淡出导致全黑中间帧;透明图解码 12.00 MiB 降为 3.34 MiB;主时间轴 4.22s 缩至 1.56s;MOTD 物理动画 3.6s 后 sleep。
- 锻造开场已在平面几何重构中整体移除,此记录仅留档。
