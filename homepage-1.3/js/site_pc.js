// PC Navigation & Intro Animation
window.onload = function() {
	// Typing animation
	var divTyping = document.getElementById('etext');
	var i = 0, timer = 0;
	var str = '探索的终点将是开始时的起点 | The end of exploration will be the point where it began';

	function typing() {
		if (i <= str.length) {
			divTyping.innerHTML = str.slice(0, i++) + '_';
			timer = setTimeout(typing, 40);
		} else {
			divTyping.innerHTML = str;
			clearTimeout(timer);
			$("#ebga").animate({width: '100%', height: '100%'}, 800);
			setTimeout(function() {
				// PC: animate content to full screen
				$("#content").animate({height: '100%'}, 800);
				// Fade out intro overlay (works for both PC and mobile)
				setTimeout(function() {
					$("#etext").fadeOut(600);
					$("#ebg").fadeOut(600);
					$("#ebga").fadeOut(600);
				}, 800);
			}, 300);
		}
	}
	typing();

	// Show confetti after a delay
	setTimeout(function() { $("#xuna").show(); }, 8000);

	// Navigation map: li id -> pages to slide left
	var navMap = {
		'cleft_li01': [],
		'cleft_li02': ['nav01'],
		'cleft_li03': ['nav01', 'nav02'],
		'cleft_li04': ['nav01', 'nav02', 'nav03'],
		'cleft_li05': ['nav01', 'nav02', 'nav03', 'nav04']
	};
	var allPages = ['nav01', 'nav02', 'nav03', 'nav04', 'nav05'];
	var allLis = ['cleft_li01', 'cleft_li02', 'cleft_li03', 'cleft_li04', 'cleft_li05', 'cleft_li06', 'cleft_li07'];

	function switchPage(activeId) {
		$(".cleft_nav li").removeClass("active");
		$("#" + activeId).addClass("active");

		var slideLeft = navMap[activeId] || [];
		allPages.forEach(function(pageId) {
			var el = document.getElementById(pageId);
			var target = slideLeft.indexOf(pageId) !== -1 ? "-100%" : "0%";
			el.style.transition = 'left 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)';
			el.style.left = target;
		});
		setTimeout(function() {
			allPages.forEach(function(pageId) {
				document.getElementById(pageId).style.transition = '';
			});
		}, 700);
	}

	// Bind sidebar clicks
	Object.keys(navMap).forEach(function(liId) {
		$("#" + liId).click(function() { switchPage(liId); });
	});

	// "加入游戏" button -> open in new tab
	$("#cleft_li07").click(function() {
		window.open('links/index.html', '_blank');
	});

	// "收藏页面" button
	$("#cleft_li06").click(function() {
		AddFavorite('艾尔岚', location.href);
	});

	// Homepage CTA buttons
	$(".nav01_but01").click(function() { switchPage('cleft_li02'); });
	$(".nav01_but02").click(function() { switchPage('cleft_li04'); });

	// Wheel navigation with elastic drag
	var pageOrder = ['cleft_li01', 'cleft_li02', 'cleft_li03', 'cleft_li04', 'cleft_li05'];
	var currentPageIndex = 0;
	var wheelLocked = false;
	var wheelAccum = 0;
	var wheelTimer = null;

	var origSwitch = switchPage;
	switchPage = function(activeId) {
		var idx = pageOrder.indexOf(activeId);
		if (idx !== -1) currentPageIndex = idx;
		origSwitch(activeId);
	};

	var crightEl = document.getElementById('cright');
	crightEl.addEventListener('wheel', function(e) {
		if (wheelLocked) return;

		var pageEl = document.getElementById(allPages[currentPageIndex]);
		if (pageEl) {
			var isScrollable = pageEl.scrollHeight > pageEl.clientHeight + 1;
			if (isScrollable) {
				var atBottom = pageEl.scrollTop + pageEl.clientHeight >= pageEl.scrollHeight - 2;
				var atTop = pageEl.scrollTop <= 2;
				if (e.deltaY > 0 && !atBottom) return;
				if (e.deltaY < 0 && !atTop) return;
			}
		}

		e.preventDefault();
		wheelAccum += e.deltaY;

		var maxDrag = crightEl.clientWidth * 0.4;
		wheelAccum = Math.max(-maxDrag, Math.min(maxDrag, wheelAccum));

		// Drag preview: page follows scroll instantly
		if (wheelAccum > 5 && currentPageIndex < pageOrder.length - 1) {
			var el = document.getElementById(allPages[currentPageIndex]);
			el.style.transition = 'none';
			el.style.left = -(Math.abs(wheelAccum) / maxDrag * 100) + '%';
		} else if (wheelAccum < -5 && currentPageIndex > 0) {
			var el = document.getElementById(allPages[currentPageIndex - 1]);
			el.style.transition = 'none';
			el.style.left = (-100 + Math.abs(wheelAccum) / maxDrag * 100) + '%';
		}

		// After scroll stops, decide: snap or bounce back
		clearTimeout(wheelTimer);
		wheelTimer = setTimeout(function() {
			var threshold = crightEl.clientWidth * 0.12;
			var spring = 'left 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)';

			if (wheelAccum > threshold && currentPageIndex < pageOrder.length - 1) {
				var dragEl = document.getElementById(allPages[currentPageIndex]);
				dragEl.offsetHeight;
				wheelLocked = true;
				switchPage(pageOrder[currentPageIndex + 1]);
				setTimeout(function() { wheelLocked = false; }, 800);
			} else if (wheelAccum < -threshold && currentPageIndex > 0) {
				var dragEl = document.getElementById(allPages[currentPageIndex - 1]);
				dragEl.offsetHeight;
				wheelLocked = true;
				switchPage(pageOrder[currentPageIndex - 1]);
				setTimeout(function() { wheelLocked = false; }, 800);
			} else {
				// Bounce back with spring
				if (wheelAccum > 5) {
					var el = document.getElementById(allPages[currentPageIndex]);
					el.offsetHeight;
					el.style.transition = spring;
					el.style.left = '0%';
					setTimeout(function() { el.style.transition = ''; }, 600);
				} else if (wheelAccum < -5 && currentPageIndex > 0) {
					var el = document.getElementById(allPages[currentPageIndex - 1]);
					el.offsetHeight;
					el.style.transition = spring;
					el.style.left = '-100%';
					setTimeout(function() { el.style.transition = ''; }, 600);
				}
			}
			wheelAccum = 0;
		}, 150);
	}, { passive: false });
};