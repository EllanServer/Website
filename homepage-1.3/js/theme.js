(function () {
	var STORAGE_KEY = 'ellan-theme';
	var html = document.documentElement;

	function getPreferred() {
		var saved = localStorage.getItem(STORAGE_KEY);
		if (saved) return saved;
		return 'dark';
	}

	function applyTheme(theme) {
		html.setAttribute('data-theme', theme);
		localStorage.setItem(STORAGE_KEY, theme);
		updateButtons(theme);
	}

	function updateButtons(theme) {
		var btns = document.querySelectorAll('#theme-toggle, #theme-toggle-mp');
		btns.forEach(function (btn) {
			var label = btn.querySelector('span');
			if (label) label.textContent = theme === 'dark' ? '暗色模式' : '亮色模式';
		});
	}

	function toggle() {
		var current = html.getAttribute('data-theme') || 'dark';
		applyTheme(current === 'dark' ? 'light' : 'dark');
	}

	// Init
	applyTheme(getPreferred());

	// Bind both toggle buttons
	document.addEventListener('click', function (e) {
		var btn = e.target.closest('#theme-toggle, #theme-toggle-mp');
		if (btn) toggle();
	});
})();
