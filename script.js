async function fetchData() {
  const username = document.getElementById("username").value.trim();
  const goalXP = parseInt(document.getElementById("goalXP").value.trim()) || 200000000;
  const targetDate = new Date(document.getElementById("targetDate").value);
  const today = new Date();
  const daysLeft = Math.max(1, Math.floor((targetDate - today) / (1000 * 60 * 60 * 24)));

  if (!username) return alert("Enter a username.");

  localStorage.setItem("rs3_username", username);
  localStorage.setItem("rs3_goalXP", goalXP);
  localStorage.setItem("rs3_targetDate", document.getElementById("targetDate").value);

  const skillNames = [
    "Overall", "Attack", "Defence", "Strength", "Constitution", "Ranged", "Prayer", "Magic", "Cooking",
    "Woodcutting", "Fletching", "Fishing", "Firemaking", "Crafting", "Smithing", "Mining", "Herblore",
    "Agility", "Thieving", "Slayer", "Farming", "Runecrafting", "Hunter", "Construction", "Summoning",
    "Dungeoneering", "Divination", "Invention", "Archaeology", "Necromancy"
  ];

  const hiscoreUrl = `https://secure.runescape.com/m=hiscore/index_lite.ws?player=${encodeURIComponent(username)}`;
  const runepixelsProxy = `https://runepixels-proxy.vercel.app/api/runepixels?username=${encodeURIComponent(username)}`;
  const statsTable = document.querySelector("#statsTable tbody");
  statsTable.innerHTML = "";

  let xpTodayMap = {};
  try {
    const res = await fetch(runepixelsProxy);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const rows = doc.querySelectorAll("table tr");
    rows.forEach(row => {
      const cells = row.querySelectorAll("td");
      if (cells.length === 5) {
        xpTodayMap[cells[0].innerText.trim()] = cells[4].innerText.trim();
      }
    });
  } catch {
    alert("RunePixels data failed to load.");
  }

  try {
    const res = await fetch(hiscoreUrl);
    const text = await res.text();
    const lines = text.trim().split("\n");

    skillNames.forEach((skill, i) => {
      if (i >= lines.length) return; // Skip if not available
      const [rank, level, xp] = lines[i].split(",");
      const todayXP = xpTodayMap[skill] || "0";
      const xpLeft = Math.max(0, goalXP - parseInt(xp));
      const xpPerDay = Math.ceil(xpLeft / daysLeft);

      statsTable.innerHTML += `
        <tr>
          <td>${skill}</td>
          <td>${level}</td>
          <td>${parseInt(xp).toLocaleString()}</td>
          <td>${todayXP}</td>
          <td>${xpLeft.toLocaleString()}</td>
          <td>${xpPerDay.toLocaleString()}</td>
        </tr>`;
    });
  } catch {
    alert("Hiscore data failed to load.");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("username").value = localStorage.getItem("rs3_username") || "";
  document.getElementById("goalXP").value = localStorage.getItem("rs3_goalXP") || "200000000";
  document.getElementById("targetDate").value = localStorage.getItem("rs3_targetDate") || "";
});