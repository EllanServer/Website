// Bookmark page
function AddFavorite(title, url) {
	try {
		window.external.addFavorite(url, title);
	} catch (e) {
		try {
			window.sidebar.addPanel(title, url, "");
		} catch (e) {
			alert("请使用 Ctrl+D (Mac: Cmd+D) 收藏本页面");
		}
	}
}

// Confetti animation
(function() {
	var container = document.getElementById("xuna");
	if (!container) return;

	var numConfettis = 50;
	var colors = ["#f2abe7", "#9fa3ec", "#86d2e1", "#fec31e"];

	function createConfetti() {
		var w = Math.floor(Math.random() * 10 + 5);
		var h = w;
		var x = Math.floor(Math.random() * 100);
		var y = Math.floor(Math.random() * 100);
		var c = colors[Math.floor(Math.random() * colors.length)];
		return '<div class="confetti" style="bottom:' + y + '%;left:' + x +
			'%;width:' + w + 'px;height:' + h + 'px;"><div class="rotate"><div class="askew" style="background-color:' +
			c + '"></div></div></div>';
	}

	var html = '';
	for (var i = 0; i < numConfettis; i++) {
		html += createConfetti();
	}
	container.innerHTML = html;

	var confettis = container.querySelectorAll('.confetti');
	for (var i = 0; i < confettis.length; i++) {
		var opacity = Math.random() + 0.1;
		confettis[i].animate([
			{ transform: 'translate3d(0,0,0)', opacity: opacity },
			{ transform: 'translate3d(20vw,100vh,0)', opacity: 1 }
		], {
			duration: Math.random() * 3000 + 3000,
			iterations: Infinity,
			delay: -(Math.random() * 5000)
		});
	}
})();