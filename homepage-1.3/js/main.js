// Ellan 艾尔岚 · 主交互脚本(原生 JS,无依赖)
(function () {
	'use strict';

	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	/* ===== 铁砧锻造开场 ===== */
	var forgeIntro = document.getElementById('forge-intro');
	var forgeSkip = document.getElementById('forge-skip');
	var shouldPlayForgeIntro = document.documentElement.classList.contains('forge-enabled') && !reduceMotion;
	var forgeFinished = false;
	var introTimers = [];

	function setIntroInert(enabled) {
		var pageHeader = document.getElementById('site-header');
		var pageMain = document.getElementById('main');
		if (pageHeader) pageHeader.inert = enabled;
		if (pageMain) pageMain.inert = enabled;
		document.body.setAttribute('aria-busy', enabled ? 'true' : 'false');
	}

	function rememberForgeIntro() {
		try { sessionStorage.setItem('ellan-forge-intro-seen', '1'); } catch (e) {}
	}

	function teardownForgeIntro() {
		if (!forgeIntro) return;
		forgeIntro.hidden = true;
		document.body.classList.remove('intro-running');
		document.body.classList.add('site-ready');
		setIntroInert(false);
		rememberForgeIntro();
	}

	function finishForgeIntro(skipped) {
		if (forgeFinished) return;
		forgeFinished = true;
		introTimers.forEach(function (timer) { clearTimeout(timer); });
		document.body.classList.add('site-dropping');
		forgeIntro.classList.add('is-revealing', 'is-leaving');
		if (skipped) launchMotdPhysics(0.92);
		introTimers.push(setTimeout(teardownForgeIntro, skipped ? 260 : 620));
	}

	if (forgeIntro && shouldPlayForgeIntro) {
		document.body.classList.add('intro-running');
		setIntroInert(true);
		if (forgeSkip) forgeSkip.addEventListener('click', function () { finishForgeIntro(true); });
		introTimers.push(setTimeout(function () {
			forgeIntro.classList.add('is-struck');
		}, 1220));
		introTimers.push(setTimeout(function () {
			document.body.classList.add('site-dropping');
			forgeIntro.classList.add('is-revealing');
		}, 1300));
		introTimers.push(setTimeout(function () { launchMotdPhysics(1.42); }, 2860));
		introTimers.push(setTimeout(function () { finishForgeIntro(false); }, 3600));
	} else if (forgeIntro) {
		forgeIntro.hidden = true;
		document.body.classList.add('site-ready');
	}

	/* 将实时服务器 MOTD 同步到悬挂牌。 */
	var serverMotd = document.getElementById('server-motd');
	var introMotd = document.getElementById('intro-motd');
	if (serverMotd && introMotd) {
		var syncMotd = function () {
			var nextMotd = serverMotd.textContent.replace(/\s*\n\s*/g, ' · ').trim();
			if (nextMotd && nextMotd !== 'MOTD 加载中…') introMotd.textContent = nextMotd;
		};
		syncMotd();
		new MutationObserver(syncMotd).observe(serverMotd, { childList: true, characterData: true, subtree: true });
	}

	/* ===== MOTD 木牌：阻尼摆锤 + 双链条柔性跟随 ===== */
	var motdSignRig = document.getElementById('motd-sign-rig');
	var motdSignButton = document.getElementById('motd-sign');
	var motdLeftLinks = Array.prototype.slice.call(document.querySelectorAll('.motd-chain-left .motd-chain-link'));
	var motdRightLinks = Array.prototype.slice.call(document.querySelectorAll('.motd-chain-right .motd-chain-link'));
	var motdPhysics = null;
	var motdLastFrame = 0;
	var motdAccumulator = 0;
	var motdPhysicsRunning = false;
	var motdResizeTimer = 0;
	var MOTD_FIXED_STEP = 1000 / 60;

	function createMotdNode(x, y, inverseMass) {
		return { x: x, y: y, previousX: x, previousY: y, inverseMass: inverseMass };
	}

	function createMotdChain(anchorX, anchorY, segmentLength, segmentCount) {
		var nodes = [];
		for (var i = 0; i <= segmentCount; i += 1) {
			nodes.push(createMotdNode(anchorX, anchorY + segmentLength * i, i === 0 ? 0 : (i === segmentCount ? 0.22 : 1)));
		}
		return nodes;
	}

	function buildMotdPhysics() {
		if (!motdSignRig || !motdSignRig.clientWidth) return;
		var width = motdSignRig.clientWidth;
		var segmentCount = Math.min(motdLeftLinks.length, motdRightLinks.length);
		var chainLength = Math.max(66, width * 0.19);
		var segmentLength = chainLength / segmentCount;
		var leftMountX = width * 0.158;
		var rightMountX = width * 0.842;

		motdPhysics = {
			width: width,
			segmentCount: segmentCount,
			segmentLength: segmentLength,
			boardDistance: rightMountX - leftMountX,
			boardMountLeftX: leftMountX,
			boardMountRightX: rightMountX,
			boardMountY: 3,
			left: createMotdChain(leftMountX, 0, segmentLength, segmentCount),
			right: createMotdChain(rightMountX, 0, segmentLength, segmentCount)
		};
		motdAccumulator = 0;
		motdLastFrame = 0;
		renderMotdRig();
	}

	function constrainMotdDistance(a, b, targetDistance) {
		var dx = b.x - a.x;
		var dy = b.y - a.y;
		var distance = Math.sqrt(dx * dx + dy * dy) || 0.0001;
		var totalMass = a.inverseMass + b.inverseMass;
		if (!totalMass) return;
		var correction = (distance - targetDistance) / distance;
		var correctionX = dx * correction;
		var correctionY = dy * correction;
		if (a.inverseMass) {
			a.x += correctionX * (a.inverseMass / totalMass);
			a.y += correctionY * (a.inverseMass / totalMass);
		}
		if (b.inverseMass) {
			b.x -= correctionX * (b.inverseMass / totalMass);
			b.y -= correctionY * (b.inverseMass / totalMass);
		}
	}

	function integrateMotdChain(nodes, windForce) {
		for (var i = 1; i < nodes.length; i += 1) {
			var node = nodes[i];
			var depth = i / (nodes.length - 1);
			var velocityX = (node.x - node.previousX) * 0.992;
			var velocityY = (node.y - node.previousY) * 0.992;
			node.previousX = node.x;
			node.previousY = node.y;
			node.x += velocityX + windForce * depth * depth;
			node.y += velocityY + 0.34;
		}
	}

	function solveMotdConstraints() {
		var left = motdPhysics.left;
		var right = motdPhysics.right;
		var lastIndex = motdPhysics.segmentCount;
		for (var iteration = 0; iteration < 12; iteration += 1) {
			left[0].x = motdPhysics.boardMountLeftX;
			left[0].y = 0;
			right[0].x = motdPhysics.boardMountRightX;
			right[0].y = 0;

			for (var i = 0; i < lastIndex; i += 1) {
				constrainMotdDistance(left[i], left[i + 1], motdPhysics.segmentLength);
				constrainMotdDistance(right[i], right[i + 1], motdPhysics.segmentLength);
			}

			constrainMotdDistance(left[lastIndex], right[lastIndex], motdPhysics.boardDistance);

			// 木牌重心位于悬挂点下方，会产生恢复到水平的扭矩。
			var heightDifference = right[lastIndex].y - left[lastIndex].y;
			left[lastIndex].y += heightDifference * 0.018;
			right[lastIndex].y -= heightDifference * 0.018;
		}
	}

	function simulateMotdPhysics(now) {
		var windForce = Math.sin(now * 0.00108) * 0.0028;
		integrateMotdChain(motdPhysics.left, windForce);
		integrateMotdChain(motdPhysics.right, windForce * 0.96);
		solveMotdConstraints();
	}

	function renderMotdChain(nodes, elements) {
		for (var i = 0; i < elements.length; i += 1) {
			var a = nodes[i];
			var b = nodes[i + 1];
			var midpointX = (a.x + b.x) * 0.5;
			var midpointY = (a.y + b.y) * 0.5;
			var angle = Math.atan2(b.y - a.y, b.x - a.x) - Math.PI * 0.5;
			var squash = elements[i].classList.contains('motd-chain-link-side') ? 0.72 : 1;
			elements[i].style.transform = 'translate3d(' + midpointX.toFixed(3) + 'px,' + midpointY.toFixed(3) + 'px,0) translate(-50%,-50%) rotate(' + angle.toFixed(5) + 'rad) scaleX(' + squash + ')';
		}
	}

	function renderMotdRig() {
		if (!motdPhysics || !motdSignButton) return;
		var leftBottom = motdPhysics.left[motdPhysics.segmentCount];
		var rightBottom = motdPhysics.right[motdPhysics.segmentCount];
		var boardAngle = Math.atan2(rightBottom.y - leftBottom.y, rightBottom.x - leftBottom.x);
		var cos = Math.cos(boardAngle);
		var sin = Math.sin(boardAngle);
		var boardX = leftBottom.x - (cos * motdPhysics.boardMountLeftX - sin * motdPhysics.boardMountY);
		var boardY = leftBottom.y - (sin * motdPhysics.boardMountLeftX + cos * motdPhysics.boardMountY);

		renderMotdChain(motdPhysics.left, motdLeftLinks);
		renderMotdChain(motdPhysics.right, motdRightLinks);
		motdSignButton.style.transform = 'translate3d(' + boardX.toFixed(3) + 'px,' + boardY.toFixed(3) + 'px,0) rotate(' + boardAngle.toFixed(5) + 'rad)';

		var expectedRightX = boardX + cos * motdPhysics.boardMountRightX - sin * motdPhysics.boardMountY;
		var expectedRightY = boardY + sin * motdPhysics.boardMountRightX + cos * motdPhysics.boardMountY;
		var attachmentError = Math.hypot(expectedRightX - rightBottom.x, expectedRightY - rightBottom.y);
		var maxChainError = 0;
		[motdPhysics.left, motdPhysics.right].forEach(function (nodes) {
			for (var i = 0; i < motdPhysics.segmentCount; i += 1) {
				var dx = nodes[i + 1].x - nodes[i].x;
				var dy = nodes[i + 1].y - nodes[i].y;
				maxChainError = Math.max(maxChainError, Math.abs(Math.hypot(dx, dy) - motdPhysics.segmentLength));
			}
		});
		motdSignRig.dataset.attachmentError = attachmentError.toFixed(3);
		motdSignRig.dataset.chainError = maxChainError.toFixed(3);
		motdSignRig.classList.add('physics-ready');
	}

	function renderMotdPhysics(now) {
		if (!motdPhysicsRunning || !motdPhysics || !motdSignRig || !motdSignRig.isConnected) return;
		if (!motdLastFrame) motdLastFrame = now;
		motdAccumulator += Math.min(now - motdLastFrame, 48);
		motdLastFrame = now;
		while (motdAccumulator >= MOTD_FIXED_STEP) {
			simulateMotdPhysics(now);
			motdAccumulator -= MOTD_FIXED_STEP;
		}
		renderMotdRig();
		requestAnimationFrame(renderMotdPhysics);
	}

	function applyMotdImpulse(strength) {
		if (!motdPhysics) return;
		[motdPhysics.left, motdPhysics.right].forEach(function (nodes, chainIndex) {
			for (var i = 1; i < nodes.length; i += 1) {
				var depth = i / (nodes.length - 1);
				nodes[i].previousX = nodes[i].x - strength * 1.85 * depth;
				nodes[i].previousY = nodes[i].y + (chainIndex ? -0.025 : 0.025) * strength * depth;
			}
		});
	}

	function launchMotdPhysics(impulse) {
		if (!motdSignRig || reduceMotion) return;
		if (!motdPhysics) buildMotdPhysics();
		applyMotdImpulse(typeof impulse === 'number' ? impulse : 0.72);
		if (!motdPhysicsRunning) {
			motdPhysicsRunning = true;
			motdLastFrame = 0;
			motdAccumulator = 0;
			requestAnimationFrame(renderMotdPhysics);
		}
	}

	window.nudgeMotdSign = function () {
		if (!motdPhysics || reduceMotion) return;
		var leftBottom = motdPhysics.left[motdPhysics.segmentCount];
		var horizontalVelocity = leftBottom.x - leftBottom.previousX;
		if (!motdPhysicsRunning) launchMotdPhysics(0.68);
		applyMotdImpulse(horizontalVelocity >= 0 ? -1.08 : 1.08);
	};

	buildMotdPhysics();
	if (motdSignRig && !reduceMotion && !shouldPlayForgeIntro) {
		setTimeout(function () { launchMotdPhysics(0.52); }, 180);
	}
	window.addEventListener('resize', function () {
		clearTimeout(motdResizeTimer);
		motdResizeTimer = setTimeout(function () {
			buildMotdPhysics();
			if (motdPhysicsRunning) applyMotdImpulse(0.18);
		}, 120);
	}, { passive: true });
	if (motdSignButton) {
		motdSignButton.addEventListener('click', window.nudgeMotdSign);
	}

	/* ===== 导航栏滚动阴影 ===== */
	var header = document.getElementById('site-header');
	function onScroll() {
		header.classList.toggle('scrolled', window.scrollY > 12);
	}
	onScroll();
	window.addEventListener('scroll', onScroll, { passive: true });

	/* ===== 滚动渐入动画 ===== */
	var revealEls = document.querySelectorAll('.reveal');
	if (reduceMotion || !('IntersectionObserver' in window)) {
		revealEls.forEach(function (el) { el.classList.add('visible'); });
	} else {
		var revealIo = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible');
					revealIo.unobserve(entry.target);
				}
			});
		}, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
		revealEls.forEach(function (el) { revealIo.observe(el); });
	}

	/* ===== 导航当前区块高亮 ===== */
	var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
	function setActiveLink(id) {
		navLinks.forEach(function (link) {
			link.classList.toggle('active', link.getAttribute('href') === '#' + id);
		});
	}
	var scrollSpyTicking = false;
	function updateActiveFromScroll() {
		var marker = window.scrollY + header.offsetHeight + window.innerHeight * 0.22;
		var activeId = 'top';
		navLinks.forEach(function (link) {
			var id = link.getAttribute('href').slice(1);
			var section = document.getElementById(id);
			if (section && section.offsetTop <= marker) activeId = id;
		});
		setActiveLink(activeId);
		scrollSpyTicking = false;
	}
	function requestScrollSpyUpdate() {
		if (scrollSpyTicking) return;
		scrollSpyTicking = true;
		requestAnimationFrame(updateActiveFromScroll);
	}
	updateActiveFromScroll();
	window.addEventListener('scroll', requestScrollSpyUpdate, { passive: true });
	window.addEventListener('resize', requestScrollSpyUpdate);

	/* ===== 核心玩法控制台 ===== */
	var gameplayTabs = Array.prototype.slice.call(document.querySelectorAll('[data-gameplay-tab]'));
	var gameplayPanels = Array.prototype.slice.call(document.querySelectorAll('[data-gameplay-panel]'));

	function activateGameplayTab(nextTab, moveFocus) {
		var key = nextTab.getAttribute('data-gameplay-tab');

		gameplayTabs.forEach(function (tab) {
			var isActive = tab === nextTab;
			tab.classList.toggle('active', isActive);
			tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
			tab.setAttribute('tabindex', isActive ? '0' : '-1');
		});

		gameplayPanels.forEach(function (panel) {
			var isActive = panel.getAttribute('data-gameplay-panel') === key;
			panel.hidden = !isActive;
			panel.classList.toggle('active', isActive);
		});

		if (moveFocus) nextTab.focus();
	}

	gameplayTabs.forEach(function (tab, index) {
		tab.addEventListener('click', function () {
			activateGameplayTab(tab, false);
		});
		tab.addEventListener('keydown', function (event) {
			var nextIndex = index;
			if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % gameplayTabs.length;
			else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + gameplayTabs.length) % gameplayTabs.length;
			else if (event.key === 'Home') nextIndex = 0;
			else if (event.key === 'End') nextIndex = gameplayTabs.length - 1;
			else return;

			event.preventDefault();
			activateGameplayTab(gameplayTabs[nextIndex], true);
		});
	});

	/* 首屏玩法入口会定位到对应的详细面板。 */
	Array.prototype.slice.call(document.querySelectorAll('[data-gameplay-link]')).forEach(function (link) {
		link.addEventListener('click', function () {
			var key = link.getAttribute('data-gameplay-link');
			var targetTab = gameplayTabs.find(function (tab) {
				return tab.getAttribute('data-gameplay-tab') === key;
			});
			if (targetTab) activateGameplayTab(targetTab, false);
		});
	});

	/* ===== Toast 轻提示 ===== */
	window.showToast = function (message) {
		var root = document.getElementById('toast-root');
		if (!root) return;
		var toast = document.createElement('div');
		toast.className = 'toast';
		toast.textContent = message;
		root.appendChild(toast);
		requestAnimationFrame(function () {
			requestAnimationFrame(function () { toast.classList.add('show'); });
		});
		setTimeout(function () {
			toast.classList.remove('show');
			setTimeout(function () { toast.remove(); }, 350);
		}, 2600);
	};

	/* ===== 复制服务器 IP ===== */
	window.copyServerIP = function () {
		var ip = 'ellan.top';
		function ok() { window.showToast('服务器 IP 已复制:' + ip); }
		function fail() { window.showToast('复制失败,请手动输入:' + ip); }
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(ip).then(ok, fail);
		} else {
			// 老浏览器降级方案
			var ta = document.createElement('textarea');
			ta.value = ip;
			ta.style.position = 'fixed';
			ta.style.opacity = '0';
			document.body.appendChild(ta);
			ta.select();
			try {
				document.execCommand('copy') ? ok() : fail();
			} catch (e) {
				fail();
			}
			ta.remove();
			var selection = window.getSelection && window.getSelection();
			if (selection) selection.removeAllRanges();
			if (motdSignButton) motdSignButton.focus({ preventScroll: true });
		}
	};

	/* ===== 下载客户端模态框 ===== */
	/* ===== 复制服务器官网链接 ===== */
	window.copyWebsiteLink = function () {
		var websiteUrl = 'https://ellan.site/';
		function ok() { window.showToast('官网链接已复制：' + websiteUrl); }
		function fail() { window.showToast('复制失败，请手动访问：' + websiteUrl); }
		function fallbackCopy() {
			var ta = document.createElement('textarea');
			ta.value = websiteUrl;
			ta.style.position = 'fixed';
			ta.style.opacity = '0';
			ta.setAttribute('readonly', '');
			document.body.appendChild(ta);
			ta.focus();
			ta.select();
			try {
				document.execCommand('copy') ? ok() : fail();
			} catch (e) {
				fail();
			}
			ta.remove();
			var selection = window.getSelection && window.getSelection();
			if (selection) selection.removeAllRanges();
			if (motdSignButton) motdSignButton.focus({ preventScroll: true });
		}
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(websiteUrl).then(ok, fallbackCopy);
		} else {
			fallbackCopy();
		}
	};

	var modal = document.getElementById('client-download-popup');
	window.showDownloadOptions = function () {
		modal.hidden = false;
		document.body.style.overflow = 'hidden';
	};
	window.closePopup = function () {
		modal.hidden = true;
		document.body.style.overflow = '';
	};
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && !modal.hidden) window.closePopup();
	});

	/* ===== 收藏本站提示 ===== */
	var bookmarkBtn = document.getElementById('bookmark-btn');
	if (bookmarkBtn) {
		bookmarkBtn.addEventListener('click', function () {
			window.showToast('按 Ctrl+D (Mac: Cmd+D) 收藏本站');
		});
	}
})();
