/*
 * Liquid Glass controls
 *
 * Refraction and specular-map implementation adapted directly from
 * https://github.com/archisvaze/liquid-glass with the author's permission,
 * as confirmed by the site owner. The rendering chain and default material
 * values are unchanged; physical dimensions are scaled from the reference
 * 300 x 200 panel to each control's actual height.
 */
(function () {
	'use strict';

	var GLASS_SELECTOR = [
		'.btn',
		'.playbook-entry-action',
		'.guide-arrow'
	].join(',');

	var isChromium = /\b(?:Chrome|Chromium|Edg|OPR)\//.test(navigator.userAgent);
	var svgNS = 'http://www.w3.org/2000/svg';
	var defs;
	var resizeObserver;
	var filterCache = Object.create(null);

	var SURFACE_FNS = {
		convex_squircle: function (x) {
			return Math.pow(1 - Math.pow(1 - x, 4), 0.25);
		}
	};

	function createSvgDefs() {
		if (defs) return defs;
		var svg = document.createElementNS(svgNS, 'svg');
		svg.setAttribute('xmlns', svgNS);
		svg.setAttribute('width', '0');
		svg.setAttribute('height', '0');
		svg.setAttribute('aria-hidden', 'true');
		svg.setAttribute('color-interpolation-filters', 'sRGB');
		svg.style.position = 'absolute';
		svg.style.overflow = 'hidden';
		svg.style.pointerEvents = 'none';
		defs = document.createElementNS(svgNS, 'defs');
		svg.appendChild(defs);
		document.body.appendChild(svg);
		return defs;
	}

	/* Copied from the reference SVG implementation. */
	function calculateRefractionProfile(glassThickness, bezelWidth, heightFn, ior, samples) {
		samples = samples || 128;
		var eta = 1 / ior;

		function refract(nx, ny) {
			var dot = ny;
			var k = 1 - eta * eta * (1 - dot * dot);
			if (k < 0) return null;
			var sq = Math.sqrt(k);
			return [-(eta * dot + sq) * nx, eta - (eta * dot + sq) * ny];
		}

		var profile = new Float64Array(samples);
		for (var i = 0; i < samples; i += 1) {
			var x = i / samples;
			var y = heightFn(x);
			var dx = x < 1 ? 0.0001 : -0.0001;
			var y2 = heightFn(x + dx);
			var deriv = (y2 - y) / dx;
			var mag = Math.sqrt(deriv * deriv + 1);
			var ref = refract(-deriv / mag, -1 / mag);
			if (!ref) {
				profile[i] = 0;
				continue;
			}
			profile[i] = ref[0] * ((y * bezelWidth + glassThickness) / ref[1]);
		}
		return profile;
	}

	/* Copied from the reference SVG implementation. */
	function generateDisplacementMap(width, height, radius, bezelWidth, profile, maxDisplacement) {
		var canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		var context = canvas.getContext('2d');
		var image = context.createImageData(width, height);
		var pixels = image.data;

		for (var index = 0; index < pixels.length; index += 4) {
			pixels[index] = 128;
			pixels[index + 1] = 128;
			pixels[index + 2] = 0;
			pixels[index + 3] = 255;
		}

		var radiusSquared = radius * radius;
		var outerRadiusSquared = Math.pow(radius + 1, 2);
		var innerRadiusSquared = Math.pow(Math.max(radius - bezelWidth, 0), 2);
		var straightWidth = width - radius * 2;
		var straightHeight = height - radius * 2;
		var sampleCount = profile.length;

		for (var y1 = 0; y1 < height; y1 += 1) {
			for (var x1 = 0; x1 < width; x1 += 1) {
				var x = x1 < radius ? x1 - radius : x1 >= width - radius ? x1 - radius - straightWidth : 0;
				var y = y1 < radius ? y1 - radius : y1 >= height - radius ? y1 - radius - straightHeight : 0;
				var distanceSquared = x * x + y * y;
				if (distanceSquared > outerRadiusSquared || distanceSquared < innerRadiusSquared) continue;
				var distance = Math.sqrt(distanceSquared);
				var fromSide = radius - distance;
				var opacity = distanceSquared < radiusSquared
					? 1
					: 1 - (distance - Math.sqrt(radiusSquared)) / (Math.sqrt(outerRadiusSquared) - Math.sqrt(radiusSquared));
				if (opacity <= 0 || distance === 0) continue;
				var cos = x / distance;
				var sin = y / distance;
				var profileIndex = Math.min(((fromSide / bezelWidth) * sampleCount) | 0, sampleCount - 1);
				var displacement = profile[profileIndex] || 0;
				var displacementX = (-cos * displacement) / maxDisplacement;
				var displacementY = (-sin * displacement) / maxDisplacement;
				var pixelIndex = (y1 * width + x1) * 4;
				pixels[pixelIndex] = (128 + displacementX * 127 * opacity + 0.5) | 0;
				pixels[pixelIndex + 1] = (128 + displacementY * 127 * opacity + 0.5) | 0;
			}
		}

		context.putImageData(image, 0, 0);
		return canvas.toDataURL();
	}

	/* Copied from the reference SVG implementation. */
	function generateSpecularMap(width, height, radius, bezelWidth, angle) {
		angle = angle != null ? angle : Math.PI / 3;
		var canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		var context = canvas.getContext('2d');
		var image = context.createImageData(width, height);
		var pixels = image.data;
		pixels.fill(0);

		var radiusSquared = radius * radius;
		var outerRadiusSquared = Math.pow(radius + 1, 2);
		var innerRadiusSquared = Math.pow(Math.max(radius - bezelWidth, 0), 2);
		var straightWidth = width - radius * 2;
		var straightHeight = height - radius * 2;
		var light = [Math.cos(angle), Math.sin(angle)];

		for (var y1 = 0; y1 < height; y1 += 1) {
			for (var x1 = 0; x1 < width; x1 += 1) {
				var x = x1 < radius ? x1 - radius : x1 >= width - radius ? x1 - radius - straightWidth : 0;
				var y = y1 < radius ? y1 - radius : y1 >= height - radius ? y1 - radius - straightHeight : 0;
				var distanceSquared = x * x + y * y;
				if (distanceSquared > outerRadiusSquared || distanceSquared < innerRadiusSquared) continue;
				var distance = Math.sqrt(distanceSquared);
				var fromSide = radius - distance;
				var opacity = distanceSquared < radiusSquared
					? 1
					: 1 - (distance - Math.sqrt(radiusSquared)) / (Math.sqrt(outerRadiusSquared) - Math.sqrt(radiusSquared));
				if (opacity <= 0 || distance === 0) continue;
				var cos = x / distance;
				var sin = -y / distance;
				var dot = Math.abs(cos * light[0] + sin * light[1]);
				var edge = Math.sqrt(Math.max(0, 1 - Math.pow(1 - fromSide, 2)));
				var coefficient = dot * edge;
				var color = (255 * coefficient) | 0;
				var alpha = (color * coefficient * opacity) | 0;
				var pixelIndex = (y1 * width + x1) * 4;
				pixels[pixelIndex] = color;
				pixels[pixelIndex + 1] = color;
				pixels[pixelIndex + 2] = color;
				pixels[pixelIndex + 3] = alpha;
			}
		}

		context.putImageData(image, 0, 0);
		return canvas.toDataURL();
	}

	function appendFilter(filterId, width, height, radius, bezelWidth, profile, maxDisplacement) {
		var filter = document.createElementNS(svgNS, 'filter');
		filter.setAttribute('id', filterId);
		filter.setAttribute('x', '0%');
		filter.setAttribute('y', '0%');
		filter.setAttribute('width', '100%');
		filter.setAttribute('height', '100%');
		filter.setAttribute('color-interpolation-filters', 'sRGB');

		var blurredSource = document.createElementNS(svgNS, 'feGaussianBlur');
		blurredSource.setAttribute('in', 'SourceGraphic');
		blurredSource.setAttribute('stdDeviation', '0.3');
		blurredSource.setAttribute('result', 'blurred_source');

		var displacementImage = document.createElementNS(svgNS, 'feImage');
		displacementImage.setAttribute('href', generateDisplacementMap(width, height, radius, bezelWidth, profile, maxDisplacement));
		displacementImage.setAttribute('x', '0');
		displacementImage.setAttribute('y', '0');
		displacementImage.setAttribute('width', String(width));
		displacementImage.setAttribute('height', String(height));
		displacementImage.setAttribute('result', 'disp_map');

		var displacement = document.createElementNS(svgNS, 'feDisplacementMap');
		displacement.setAttribute('in', 'blurred_source');
		displacement.setAttribute('in2', 'disp_map');
		displacement.setAttribute('scale', String(maxDisplacement));
		displacement.setAttribute('xChannelSelector', 'R');
		displacement.setAttribute('yChannelSelector', 'G');
		displacement.setAttribute('result', 'displaced');

		var saturated = document.createElementNS(svgNS, 'feColorMatrix');
		saturated.setAttribute('in', 'displaced');
		saturated.setAttribute('type', 'saturate');
		saturated.setAttribute('values', '4');
		saturated.setAttribute('result', 'displaced_sat');

		var specularImage = document.createElementNS(svgNS, 'feImage');
		specularImage.setAttribute('href', generateSpecularMap(width, height, radius, bezelWidth * 2.5));
		specularImage.setAttribute('x', '0');
		specularImage.setAttribute('y', '0');
		specularImage.setAttribute('width', String(width));
		specularImage.setAttribute('height', String(height));
		specularImage.setAttribute('result', 'spec_layer');

		var saturatedEdge = document.createElementNS(svgNS, 'feComposite');
		saturatedEdge.setAttribute('in', 'displaced_sat');
		saturatedEdge.setAttribute('in2', 'spec_layer');
		saturatedEdge.setAttribute('operator', 'in');
		saturatedEdge.setAttribute('result', 'spec_masked');

		var fadedSpecular = document.createElementNS(svgNS, 'feComponentTransfer');
		fadedSpecular.setAttribute('in', 'spec_layer');
		fadedSpecular.setAttribute('result', 'spec_faded');
		var alpha = document.createElementNS(svgNS, 'feFuncA');
		alpha.setAttribute('type', 'linear');
		alpha.setAttribute('slope', '0.5');
		fadedSpecular.appendChild(alpha);

		var coloredGlass = document.createElementNS(svgNS, 'feBlend');
		coloredGlass.setAttribute('in', 'spec_masked');
		coloredGlass.setAttribute('in2', 'displaced');
		coloredGlass.setAttribute('mode', 'normal');
		coloredGlass.setAttribute('result', 'with_sat');

		var finalGlass = document.createElementNS(svgNS, 'feBlend');
		finalGlass.setAttribute('in', 'spec_faded');
		finalGlass.setAttribute('in2', 'with_sat');
		finalGlass.setAttribute('mode', 'normal');

		filter.appendChild(blurredSource);
		filter.appendChild(displacementImage);
		filter.appendChild(displacement);
		filter.appendChild(saturated);
		filter.appendChild(specularImage);
		filter.appendChild(saturatedEdge);
		filter.appendChild(fadedSpecular);
		filter.appendChild(coloredGlass);
		filter.appendChild(finalGlass);
		createSvgDefs().appendChild(filter);
	}

	function getRadius(element, width, height) {
		var computedRadius = parseFloat(getComputedStyle(element).borderTopLeftRadius) || Math.min(width, height) / 2;
		return Math.max(2, Math.min(computedRadius, width / 2, height / 2));
	}

	function bindFilter(element) {
		if (!isChromium) return;
		var rect = element.getBoundingClientRect();
		var width = Math.max(0, Math.round(rect.width));
		var height = Math.max(0, Math.round(rect.height));
		if (width < 2 || height < 2) return;

		var radius = getRadius(element, width, height);
		/* Reference values: 80px thickness and 60px bezel on a 200px-high panel. */
		var scale = height / 200;
		var glassThickness = 80 * scale;
		var bezelWidth = 60 * scale;
		var clampedBezel = Math.max(0.75, Math.min(bezelWidth, radius - 1, Math.min(width, height) / 2 - 1));
		var cacheKey = [width, height, Math.round(radius * 10), Math.round(clampedBezel * 10)].join('-');
		var filterId = filterCache[cacheKey];

		if (!filterId) {
			var profile = calculateRefractionProfile(glassThickness, clampedBezel, SURFACE_FNS.convex_squircle, 3, 128);
			var maxDisplacement = Math.max.apply(null, Array.from(profile).map(Math.abs)) || 1;
			filterId = 'ellan-liquid-glass-' + cacheKey;
			appendFilter(filterId, width, height, radius, clampedBezel, profile, maxDisplacement);
			filterCache[cacheKey] = filterId;
		}

		element.style.setProperty('--liquid-glass-filter', 'url(#' + filterId + ')');
		element.dataset.liquidGlassSize = cacheKey;
	}

	function prepareElement(element) {
		if (element.classList.contains('liquid-glass')) return;
		element.classList.add('liquid-glass');
		if (resizeObserver) resizeObserver.observe(element);
		requestAnimationFrame(function () { bindFilter(element); });
	}

	function start() {
		createSvgDefs();
		if ('ResizeObserver' in window) {
			resizeObserver = new ResizeObserver(function (entries) {
				entries.forEach(function (entry) {
					var element = entry.target;
					var rect = entry.contentRect;
					var nextSize = Math.round(rect.width) + 'x' + Math.round(rect.height);
					if (element.dataset.liquidGlassObservedSize === nextSize) return;
					element.dataset.liquidGlassObservedSize = nextSize;
					requestAnimationFrame(function () { bindFilter(element); });
				});
			});
		}

		document.querySelectorAll(GLASS_SELECTOR).forEach(prepareElement);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', start, { once: true });
	} else {
		start();
	}
})();
