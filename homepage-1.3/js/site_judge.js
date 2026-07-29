// Device detection using media queries (reliable method)
$(document).ready(function(){
	function applyLayout() {
		if (window.matchMedia("(min-width: 769px)").matches) {
			$("#pc").show();
			$("#mp").hide();
		} else {
			$("#pc").hide();
			$("#mp").show();
		}
	}
	applyLayout();
	// Re-check on resize for orientation changes
	window.matchMedia("(min-width: 769px)").addEventListener("change", applyLayout);
})