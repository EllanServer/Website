// 服务器状态查询(mcsrvstat.us API)
async function fetchServerStatus() {
	var icon = document.getElementById('server-icon');
	var motd = document.getElementById('server-motd');
	var version = document.getElementById('server-version');
	var players = document.getElementById('server-players');
	var ping = document.getElementById('server-ping');
	if (!icon || !motd) return;

	try {
		var res = await fetch('https://api.mcsrvstat.us/2/ellan.top');
		var data = await res.json();

		if (data.online) {
			motd.textContent = data.motd && data.motd.clean ? data.motd.clean.join('\n') : '(无 MOTD)';
			version.textContent = '版本:' + (data.version || '未知');
			players.textContent = '在线:' + data.players.online + ' / ' + data.players.max;
			ping.textContent = data.debug && data.debug.ping ? '延迟:' + Math.round(data.debug.ping) + 'ms' : '';
			if (data.icon) icon.src = data.icon;
		} else {
			motd.textContent = '服务器离线';
			version.textContent = '';
			players.textContent = '';
			ping.textContent = '';
			icon.src = 'img/icon.png';
		}
	} catch (err) {
		motd.textContent = '状态获取失败,稍后自动重试';
		version.textContent = '';
		players.textContent = '';
		ping.textContent = '';
		icon.src = 'img/icon.png';
	}
}

fetchServerStatus();
setInterval(fetchServerStatus, 60000); // 60s 刷新
