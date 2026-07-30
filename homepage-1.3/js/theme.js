// 明暗主题切换(localStorage 记忆,默认亮色经典新拟物)
(function () {
	'use strict';

	var STORAGE_KEY = 'ellan-theme';
	var html = document.documentElement;

	function getPreferred() {
		var saved = localStorage.getItem(STORAGE_KEY);
		if (saved === 'light' || saved === 'dark') return saved;
		return 'light';
	}

	function applyTheme(theme) {
		html.setAttribute('data-theme', theme);
		localStorage.setItem(STORAGE_KEY, theme);
		var btn = document.getElementById('theme-toggle');
		if (btn) {
			btn.setAttribute('aria-label', theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式');
			btn.setAttribute('title', theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式');
		}
	}

	// 初始化(与 <head> 内联脚本保持一致)
	applyTheme(getPreferred());

	// 绑定切换按钮
	document.addEventListener('click', function (e) {
		var btn = e.target.closest('#theme-toggle');
		if (!btn) return;
		var current = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
		applyTheme(current === 'dark' ? 'light' : 'dark');
	});
})();
