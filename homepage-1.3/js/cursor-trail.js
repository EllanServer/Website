(function () {
	var canvas = document.getElementById('cursor-trail');
	if (!canvas) return;
	var ctx = canvas.getContext('2d');
	var particles = [];
	var mouse = { x: -100, y: -100 };
	var raf;

	function resize() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
	resize();
	window.addEventListener('resize', resize);

	document.addEventListener('mousemove', function (e) {
		mouse.x = e.clientX;
		mouse.y = e.clientY;
		for (var i = 0; i < 2; i++) {
			particles.push({
				x: mouse.x,
				y: mouse.y,
				vx: (Math.random() - 0.5) * 1.5,
				vy: (Math.random() - 0.5) * 1.5,
				life: 1,
				size: Math.random() * 3 + 1.5,
				hue: 210 + Math.random() * 40
			});
		}
	});

	function animate() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (var i = particles.length - 1; i >= 0; i--) {
			var p = particles[i];
			p.x += p.vx;
			p.y += p.vy;
			p.life -= 0.02;
			if (p.life <= 0) {
				particles.splice(i, 1);
				continue;
			}
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
			ctx.fillStyle = 'hsla(' + p.hue + ', 80%, 70%, ' + p.life * 0.6 + ')';
			ctx.fill();
		}
		raf = requestAnimationFrame(animate);
	}
	animate();

	// Pause when tab hidden
	document.addEventListener('visibilitychange', function () {
		if (document.hidden) {
			cancelAnimationFrame(raf);
		} else {
			raf = requestAnimationFrame(animate);
		}
	});
})();
