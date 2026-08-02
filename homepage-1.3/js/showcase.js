// 艾尔岚玩法实景图库
(function () {
	'use strict';

	var lightbox = document.getElementById('showcase-lightbox');
	var image = document.getElementById('showcase-lightbox-image');
	var figure = lightbox && lightbox.querySelector('.showcase-lightbox-figure');
	var title = document.getElementById('showcase-lightbox-title');
	var caption = document.getElementById('showcase-lightbox-caption');
	var counter = document.getElementById('showcase-counter');
	var previousButton = document.getElementById('showcase-prev');
	var nextButton = document.getElementById('showcase-next');
	var closeButton = document.getElementById('showcase-close');
	var categoryButtons = document.querySelectorAll('[data-showcase-category]');

	if (!lightbox || !image || !figure || !title || !caption || !counter || !previousButton || !nextButton || !closeButton || !categoryButtons.length) return;
	lightbox.dataset.ready = 'true';

	var gallery = {
		'city-overview': {
			label: '主城全景',
			images: [
				{ src: 'img/city-fifth-overview-day-hd.webp', alt: '五周目主城白昼全貌与樱花港湾', caption: '白昼全景 · 城市与港湾' },
				{ src: 'img/city-fifth-overview-night-hd.webp', alt: '灯火点亮的五周目主城夜景', caption: '主城夜景 · 万家灯火' },
				{ src: 'img/city-fifth-overview-bluehour-hd.webp', alt: '蓝调时刻的五周目主城水岸', caption: '蓝调水岸 · 城市剪影' },
				{ src: 'img/city-fifth-overview-waterfront-hd.webp', alt: '从水岸远眺五周目主城', caption: '水岸远眺 · 樱花城郭' }
			]
		},
		'city-streets': {
			label: '樱花街巷',
			images: [
				{ src: 'img/city-fifth-street-cherry-hd.webp', alt: '樱花屋脊延伸向主城中心', caption: '樱花屋脊 · 城中远望' },
				{ src: 'img/city-fifth-street-lantern-hd.webp', alt: '花箱与灯笼装点的主城街巷', caption: '灯笼花街 · 日常一隅' },
				{ src: 'img/city-fifth-street-market-hd.webp', alt: '樱花树下的主城步行街', caption: '樱花步行街 · 商铺沿线' },
				{ src: 'img/city-fifth-street-canal-hd.webp', alt: '沿河而建的主城住宅街', caption: '水岸街区 · 河道与民居' }
			]
		},
		'city-landmarks': {
			label: '城市地标',
			images: [
				{ src: 'img/city-fifth-landmark-cathedral-hd.webp', alt: '五周目主城大教堂内部长廊', caption: '主城大教堂 · 穹顶长廊' },
				{ src: 'img/city-fifth-landmark-tree-hd.webp', alt: '光点环绕的五周目主城神树', caption: '主城神树 · 昼间浮光' },
				{ src: 'img/city-fifth-landmark-harbor-hd.webp', alt: '五周目主城港口的白帆船队', caption: '主城港口 · 白帆船队' },
				{ src: 'img/city-fifth-landmark-facade-hd.webp', alt: '五周目主城白石地标建筑立面', caption: '白石地标 · 建筑细部' }
			]
		},
		farming: {
			label: '农耕',
			images: [
				{ src: 'img/showcase-farming-01-hd.webp', alt: '玻璃温室内生长的森罗农作物', caption: '温室农场 · 四季作物' },
				{ src: 'img/showcase-senluo-tavern-hd.webp', alt: '种植火焰果与葡萄的酿造作物园', caption: '酿造作物园 · 火焰果与葡萄' },
				{ src: 'img/showcase-farming-04-hd.webp', alt: '森罗农耕温室中的成熟作物', caption: '温室田垄 · 成熟作物' },
				{ src: 'img/showcase-farming-06-hd.webp', alt: '森罗农场中的瓜果与菜畦', caption: '四季田园 · 瓜果与菜畦' }
			]
		},
		kitchen: {
			label: '厨房',
			images: [
				{ src: 'img/showcase-senluo-kitchen-hd.webp', alt: '森罗厨房中的炉灶与厨具', caption: '森罗厨房 · 厨具工序' },
				{ src: 'img/showcase-kitchen-02-hd.webp', alt: '森罗厨房的肉食备料区', caption: '肉食料理台 · 备料工序' },
				{ src: 'img/showcase-kitchen-03-hd.webp', alt: '樱花街边的森罗餐档', caption: '街边餐档 · 玩家点单' },
				{ src: 'img/showcase-kitchen-05-hd.webp', alt: '摆满厨具与食材的森罗料理工坊', caption: '料理工坊 · 厨具陈列' },
				{ src: 'img/showcase-kitchen-07-hd.webp', alt: '樱花装饰的森罗餐厅', caption: '樱花餐厅 · 成品上桌' },
				{ src: 'img/showcase-kitchen-08-hd.webp', alt: '森罗厨房的完整炉灶区域', caption: '森罗厨房 · 炉灶全景' }
			]
		},
		stall: {
			label: '地摊',
			images: [
				{ src: 'img/showcase-stall-01-hd.webp', alt: '艾尔岚玩家在主城摆设的商品地摊', caption: '玩家地摊 · 商品展示' },
				{ src: 'img/showcase-stall-02-hd.webp', alt: '主城道路旁的多个玩家摊位', caption: '街边摊位 · 自由交易' },
				{ src: 'img/showcase-stall-03-hd.webp', alt: '玩家站在商品展示摊位之后', caption: '摊主经营 · 挂牌售卖' }
			]
		},
		furniture: {
			label: '家具',
			images: [
				{ src: 'img/showcase-furniture-01-hd.webp', alt: '摆有餐桌与绿植的温馨室内空间', caption: '温馨餐厅 · 餐桌陈设' },
				{ src: 'img/showcase-furniture-02-hd.webp', alt: '面向街道的咖啡馆室内空间', caption: '街角咖啡馆 · 室内布置' },
				{ src: 'img/showcase-furniture-03-hd.webp', alt: '木质酒馆内的桌椅与装饰', caption: '木质酒馆 · 包厢陈设' },
				{ src: 'img/showcase-furniture-04-hd.webp', alt: '摆放餐点与生活摆件的木质房间', caption: '生活空间 · 餐桌与摆件' },
				{ src: 'img/showcase-furniture-05-hd.webp', alt: '带有沙发和前台的现代会客室', caption: '现代会客室 · 沙发布置' },
				{ src: 'img/showcase-furniture-06-hd.webp', alt: '配有桌椅和投影板的会议室', caption: '会议室 · 办公家具' },
				{ src: 'img/showcase-furniture-07-hd.webp', alt: '配有办公桌与文件柜的办公室', caption: '办公室 · 文件收纳' },
				{ src: 'img/showcase-furniture-08-hd.webp', alt: '放置电脑与工作设备的工作室', caption: '工作室 · 桌面设备' }
			]
		},
		tavern: {
			label: '酒馆',
			images: [
				{ src: 'img/showcase-tavern-01-hd.webp', alt: '陈列大量酒瓶的森罗酒馆大厅', caption: '酒柜大厅 · 酒品陈列' },
				{ src: 'img/showcase-tavern-02-hd.webp', alt: '摆放酒桶与酿造器具的森罗酒馆', caption: '酿造工坊 · 酒桶与器具' },
				{ src: 'img/showcase-tavern-03-hd.webp', alt: '木结构森罗酒馆的吧台内景', caption: '酒馆内景 · 木质吧台' },
				{ src: 'img/showcase-tavern-04-hd.webp', alt: '放满酒瓶与调饮器具的酒馆吧台', caption: '吧台陈列 · 调饮器具' }
			]
		},
		brewing: {
			label: '酿酒',
			images: [
				{ src: 'img/showcase-brewing-01-hd.webp', alt: '夜晚灯火下的酿酒葡萄园', caption: '葡萄园夜景 · 原料种植' }
			]
		}
	};

	var currentCategory = 'city-overview';
	var currentIndex = 0;
	var returnFocus = null;
	var closeTimer = 0;
	var previousBodyOverflow = '';

	function currentImages() {
		return gallery[currentCategory].images;
	}

	function preloadAdjacent() {
		var items = currentImages();
		if (items.length < 2) return;
		[currentIndex - 1, currentIndex + 1].forEach(function (index) {
			var wrapped = (index + items.length) % items.length;
			var preload = document.createElement('img');
			preload.src = items[wrapped].src;
		});
	}

	function renderImage() {
		var category = gallery[currentCategory];
		var items = category.images;
		var item = items[currentIndex];

		figure.classList.add('is-loading');
		image.onload = function () { figure.classList.remove('is-loading'); };
		image.onerror = function () { figure.classList.remove('is-loading'); };
		image.src = item.src;
		image.alt = item.alt;
		if (image.complete) figure.classList.remove('is-loading');

		title.textContent = category.label;
		caption.textContent = item.caption;
		counter.textContent = (currentIndex + 1) + ' / ' + items.length;
		previousButton.disabled = items.length < 2;
		nextButton.disabled = items.length < 2;
		preloadAdjacent();
	}

	function openCategory(categoryName, trigger) {
		if (!gallery[categoryName]) return;
		window.clearTimeout(closeTimer);
		currentCategory = categoryName;
		currentIndex = 0;
		returnFocus = trigger;
		previousBodyOverflow = document.body.style.overflow;
		renderImage();
		lightbox.hidden = false;
		document.body.style.overflow = 'hidden';
		requestAnimationFrame(function () {
			requestAnimationFrame(function () {
				lightbox.classList.add('is-open');
				closeButton.focus();
			});
		});
	}

	function closeLightbox() {
		if (lightbox.hidden) return;
		lightbox.classList.remove('is-open');
		document.body.style.overflow = previousBodyOverflow;
		closeTimer = window.setTimeout(function () {
			lightbox.hidden = true;
			if (returnFocus) returnFocus.focus();
		}, 240);
	}

	function move(step) {
		var items = currentImages();
		if (items.length < 2) return;
		currentIndex = (currentIndex + step + items.length) % items.length;
		renderImage();
	}

	categoryButtons.forEach(function (button) {
		button.addEventListener('click', function () {
			openCategory(button.getAttribute('data-showcase-category'), button);
		});
	});

	lightbox.querySelectorAll('[data-showcase-close]').forEach(function (element) {
		element.addEventListener('click', closeLightbox);
	});
	previousButton.addEventListener('click', function () { move(-1); });
	nextButton.addEventListener('click', function () { move(1); });

	document.addEventListener('keydown', function (event) {
		if (lightbox.hidden) return;
		if (event.key === 'Escape') {
			event.preventDefault();
			closeLightbox();
			return;
		}
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			move(-1);
			return;
		}
		if (event.key === 'ArrowRight') {
			event.preventDefault();
			move(1);
			return;
		}
		if (event.key === 'Tab') {
			var focusable = [closeButton, previousButton, nextButton].filter(function (button) { return !button.disabled; });
			var first = focusable[0];
			var last = focusable[focusable.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		}
	});
})();
