function copyServerIP() {
  navigator.clipboard.writeText("ellan.top").then(function() {
    alert("服务器IP已复制！");
  }).catch(function() {
    alert("复制失败，请手动输入: ellan.top");
  });
}

async function fetchServerStatus() {
  try {
    var res = await fetch("https://api.mcsrvstat.us/2/ellan.top");
    var data = await res.json();

    var icon = document.getElementById("server-icon");
    var motd = document.getElementById("server-motd");
    var version = document.getElementById("server-version");
    var players = document.getElementById("server-players");
    var ping = document.getElementById("server-ping");

    if (!icon || !motd) return;

    if (data.online) {
      motd.innerText = data.motd && data.motd.clean ? data.motd.clean.join('\n') : "（无MOTD）";
      version.innerText = "版本：" + (data.version || '未知');
      players.innerText = "人数：" + data.players.online + " / " + data.players.max;
      ping.innerText = data.debug && data.debug.ping ? "延迟：" + Math.round(data.debug.ping) + "ms" : '';
      icon.src = data.icon || "https://mc-heads.net/avatar/Notch";
    } else {
      motd.innerText = "服务器离线";
      version.innerText = "";
      players.innerText = "";
      ping.innerText = "";
      icon.src = "https://mc-heads.net/avatar/Sad";
    }
  } catch (err) {
    var el = document.getElementById("server-motd");
    if (el) el.innerText = "状态获取失败";
  }
}

function showDownloadOptions() {
  document.getElementById("client-download-popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("client-download-popup").style.display = "none";
}

fetchServerStatus();
setInterval(fetchServerStatus, 60000); // 60s refresh
