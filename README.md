# 🌀 Skill Pulse
_Your XP, your goals — visualized._

Skill Pulse is a web-based XP tracker for **RuneScape 3**, designed to help you stay on target as you work toward 200M XP (or any goal) in all skills.

## 🚀 Features
- ✅ Real-time skill levels and XP via **official RS3 Hiscores API**
- 📈 **Today’s XP gains** fetched from RunePixels
- 🎯 Global XP goal input (e.g. 200M across all skills)
- 🗓 **Target date tracking** with XP/day required
- 🌙 Clean dark-mode layout, responsive for mobile
- 💾 Auto-saves your name, goal, and date in localStorage

## 🧠 How It Works
1. Enter your **RuneScape username**
2. Enter a **goal XP** (e.g. `200000000`)
3. Pick a **target date**
4. Skill Pulse calculates:
   - XP remaining per skill
   - XP/day needed to hit your goal on time
   - Today’s gains (via RunePixels)

## 📦 Tech Stack
- HTML, CSS, JavaScript
- [RS3 Hiscores API](https://secure.runescape.com/m=hiscore/index_lite.ws?player=)
- RunePixels HTML scraper via Vercel serverless function

## 🛡 Disclaimer
Skill Pulse is an unofficial RuneScape tool. RuneScape and Jagex are trademarks of Jagex Ltd.  
This project is open-source and intended for personal use only.
