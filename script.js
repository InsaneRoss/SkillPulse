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

  const hiscoreUrl = `https://skillpulse-three.vercel.app/api/hiscores?username=${encodeURIComponent(username)}`;
  const runepixelsProxy = `https://skillpulse-three.vercel.app/api/runepixels?username=${encodeURIComponent(username)}`;
  const statsTable = document.querySelector("#statsTable tbody");
  const tableHeader = document.querySelector("#tableHeader");
  statsTable.innerHTML = "";

  let xpTodayMap = {};
  let showTodayColumn = false;

  try {
    const res = await fetch(runepixelsProxy);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const rows = doc.querySelectorAll("table tr");
    rows.forEach(row => {
      const cells = row.querySelectorAll("td");
      if (cells.length === 5) {
        const skill = cells[0].innerText.trim();
        const todayXP = cells[4].innerText.trim();
        if (todayXP && todayXP !== "0") showTodayColumn = true;
        xpTodayMap[skill] = todayXP;
      }
    });
  } catch {
    console.warn("RunePixels data failed to load.");
  }

  if (!showTodayColumn) {
    document.querySelectorAll(".todayXP").forEach(el => el.style.display = "none");
  } else {
    document.querySelectorAll(".todayXP").forEach(el => el.style.display = "");
  }

  try {
    const res = await fetch(hiscoreUrl);
    const text = await res.text();
    const lines = text.trim().split("\n");

    skillNames.forEach((skill, i) => {
      if (i >= lines.length) return;
      const [rank, level, xp] = lines[i].split(",");
      const parsedXP = parseInt(xp);
      if (isNaN(parsedXP)) return;

      const todayXP = parseInt((xpTodayMap[skill] || "0").replace(/,/g, "")) || 0;
      let xpLeft;
      if (skill === "Overall") {
        const totalGoalXP = goalXP * (skillNames.length - 1);
        xpLeft = Math.max(0, totalGoalXP - parsedXP);
      } else {
        xpLeft = Math.max(0, goalXP - parsedXP);
      }

      const xpPerDay = Math.ceil(xpLeft / daysLeft);
      const xpColor = showTodayColumn
        ? (todayXP >= xpPerDay ? 'style="background:#304d30"' : 'style="background:#4d3030"')
        : "";

      statsTable.innerHTML += \`
        <tr>
          <td data-label="Skill">\${skill}</td>
          <td data-label="Level">\${level}</td>
          <td data-label="Total XP">\${parsedXP.toLocaleString()}</td>
          \${showTodayColumn ? `<td data-label="Today XP">\${todayXP.toLocaleString()}</td>` : ""}
          <td data-label="XP Left">\${xpLeft.toLocaleString()}</td>
          <td data-label="XP/Day Required" \${xpColor}>\${xpPerDay.toLocaleString()}</td>
        </tr>\`;
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