// Ellan 艾尔岚 · 玩法百科交互（原生 JS，无依赖）
(function () {
	'use strict';

	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var forceReveal = new URLSearchParams(window.location.search).get('shot') === '1';
	var progressBar = document.querySelector('.reading-progress > i');
	var chapterLinks = Array.prototype.slice.call(document.querySelectorAll('.chapter-link'));
	var chapters = chapterLinks.map(function (link) {
		var id = (link.getAttribute('href') || '').replace('#', '');
		return document.getElementById(id);
	}).filter(Boolean);
	var ticking = false;

	function updateScrollEffects() {
		ticking = false;
		var doc = document.documentElement;
		var max = Math.max(doc.scrollHeight - window.innerHeight, 1);
		var ratio = Math.min(Math.max(window.scrollY / max, 0), 1);
		if (progressBar) progressBar.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';

		var marker = window.scrollY + 180;
		var activeId = chapters.length ? chapters[0].id : '';
		chapters.forEach(function (section) {
			if (section.offsetTop <= marker) activeId = section.id;
		});
		chapterLinks.forEach(function (link) {
			var active = link.getAttribute('href') === '#' + activeId;
			link.classList.toggle('active', active);
			if (active) link.setAttribute('aria-current', 'true');
			else link.removeAttribute('aria-current');
		});

		if (!reduceMotion) {
			document.querySelectorAll('.chapter-number').forEach(function (number) {
				var section = number.closest('.game-chapter');
				if (!section) return;
				var rect = section.getBoundingClientRect();
				if (rect.bottom < 0 || rect.top > window.innerHeight) return;
				var offset = (window.innerHeight * .5 - rect.top) * .065;
				number.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
			});
		}
	}

	function requestUpdate() {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(updateScrollEffects);
	}

	updateScrollEffects();
	window.addEventListener('scroll', requestUpdate, { passive: true });
	window.addEventListener('resize', requestUpdate);

	chapterLinks.forEach(function (link) {
		link.addEventListener('click', function () {
			var rail = document.querySelector('.chapter-rail');
			if (!rail) return;
			setTimeout(function () {
				link.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
			}, 80);
		});
	});

	function setCounter(el, value) {
		var suffix = el.getAttribute('data-suffix') || '';
		el.textContent = value + suffix;
	}

	function animateCounter(el) {
		if (el.getAttribute('data-counted') === 'true') return;
		el.setAttribute('data-counted', 'true');
		var target = parseInt(el.getAttribute('data-count') || '0', 10);
		if (!target) return;
		if (reduceMotion || forceReveal) {
			setCounter(el, target);
			return;
		}
		var start = null;
		var duration = 1150;
		function step(now) {
			if (!start) start = now;
			var p = Math.min((now - start) / duration, 1);
			var eased = 1 - Math.pow(1 - p, 4);
			setCounter(el, Math.round(target * eased));
			if (p < 1) requestAnimationFrame(step);
		}
		requestAnimationFrame(step);
	}

	var counters = document.querySelectorAll('[data-count]');
	if (forceReveal || reduceMotion || !('IntersectionObserver' in window)) {
		counters.forEach(animateCounter);
	} else {
		var counterIo = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				animateCounter(entry.target);
				counterIo.unobserve(entry.target);
			});
		}, { threshold: .45 });
		counters.forEach(function (counter) { counterIo.observe(counter); });
	}
})();
