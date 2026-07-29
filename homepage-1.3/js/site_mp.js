// Mobile Navigation
$(function() {
	var pages = ['exnav01', 'exnav02', 'exnav03', 'exnav04', 'exnav05'];
	var currentMobileIndex = 0;
	var animating = false;
	var spring = 'transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)';

	function getDisplay(id) {
		return (id === 'exnav03' || id === 'exnav04') ? 'flex' : 'block';
	}

	// Direct page switch (no animation)
	function showPageDirect(index) {
		pages.forEach(function(id, i) {
			var $el = $('#' + id);
			if (i === index) {
				$el.css({ display: getDisplay(id), transform: '', transition: '', opacity: '' });
			} else {
				$el.hide().css({ transform: '', transition: '', opacity: '' });
			}
		});
		currentMobileIndex = index;
		$('#exnav li').removeClass('active').eq(index).addClass('active');
	}

	// Animated page switch with spring slide
	function switchMobilePage(index) {
		if (animating || index < 0 || index >= pages.length) return;
		if (index === currentMobileIndex) return;

		animating = true;
		var dir = index > currentMobileIndex ? 1 : -1;
		var $current = $('#' + pages[currentMobileIndex]);
		var $next = $('#' + pages[index]);

		// Show next page off-screen
		$next.css({
			display: getDisplay(pages[index]),
			transform: 'translateY(' + (dir * 100) + 'vh)',
			transition: 'none',
			opacity: 1
		});
		$next[0].offsetHeight;

		// Spring animate both
		$next.css({ transition: spring, transform: 'translateY(0)' });
		$current.css({ transition: spring, transform: 'translateY(' + (-dir * 35) + 'vh)', opacity: 0.2 });

		currentMobileIndex = index;
		$('#exnav li').removeClass('active').eq(index).addClass('active');

		setTimeout(function() {
			$current.hide().css({ transform: '', transition: '', opacity: '' });
			$next.css({ transform: '', transition: '' });
			animating = false;
		}, 700);
	}

	// Bottom nav clicks
	$('#exnav li').each(function(i) {
		$(this).click(function() { switchMobilePage(i); });
	});

	// Homepage menu card clicks
	$('#exn1_02').click(function() { switchMobilePage(1); });
	$('#exn1_03').click(function() { switchMobilePage(2); });
	$('#exn1_04').click(function() { switchMobilePage(3); });
	$('#exn1_05').click(function() { switchMobilePage(4); });

	// Set initial active state
	$('#exnav li').eq(0).addClass('active');

	// Touch swipe with drag preview
	var touchStartY = 0;
	var touching = false;
	var dragDelta = 0;
	var excontent = document.getElementById('excontent');

	if (excontent) {
		excontent.addEventListener('touchstart', function(e) {
			if (animating) return;
			touchStartY = e.touches[0].clientY;
			touching = true;
			dragDelta = 0;
		}, { passive: true });

		excontent.addEventListener('touchmove', function(e) {
			if (!touching || animating) return;
			var deltaY = touchStartY - e.touches[0].clientY;
			dragDelta = deltaY;

			// Check scrollable edges
			var pageEl = document.getElementById(pages[currentMobileIndex]);
			if (pageEl) {
				var isScrollable = pageEl.scrollHeight > pageEl.clientHeight + 1;
				if (isScrollable) {
					var atBottom = pageEl.scrollTop + pageEl.clientHeight >= pageEl.scrollHeight - 2;
					var atTop = pageEl.scrollTop <= 2;
					if (deltaY > 0 && !atBottom) return;
					if (deltaY < 0 && !atTop) return;
				}
			}

			// Drag with resistance
			var $page = $('#' + pages[currentMobileIndex]);
			$page.css({
				transition: 'none',
				transform: 'translateY(' + (-deltaY * 0.35) + 'px)'
			});
		}, { passive: true });

		excontent.addEventListener('touchend', function(e) {
			if (!touching || animating) return;
			touching = false;

			var deltaY = dragDelta;
			var $page = $('#' + pages[currentMobileIndex]);

			// Check scrollable edges
			var canNav = true;
			var pageEl = document.getElementById(pages[currentMobileIndex]);
			if (pageEl) {
				var isScrollable = pageEl.scrollHeight > pageEl.clientHeight + 1;
				if (isScrollable) {
					var atBottom = pageEl.scrollTop + pageEl.clientHeight >= pageEl.scrollHeight - 2;
					var atTop = pageEl.scrollTop <= 2;
					if (deltaY > 0 && !atBottom) canNav = false;
					if (deltaY < 0 && !atTop) canNav = false;
				}
			}

			if (canNav && Math.abs(deltaY) > 80) {
				var dir = deltaY > 0 ? 1 : -1;
				var nextIdx = currentMobileIndex + dir;
				if (nextIdx >= 0 && nextIdx < pages.length) {
					// Commit current drag position, then animate transition
					$page[0].offsetHeight;
					switchMobilePage(nextIdx);
					return;
				}
			}

			// Bounce back with spring
			$page.css({ transition: spring, transform: 'translateY(0)' });
			setTimeout(function() {
				$page.css({ transition: '', transform: '' });
			}, 700);
		}, { passive: true });
	}
});