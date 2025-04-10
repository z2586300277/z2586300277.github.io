---
layout: doc
outline: [2, 3]
title: 前端导航
---

<script setup>
// 定义导航数据
/* 🌹🍀🍎💰📱🌙🍁🍂🍃🌷💎🔪🔫🏀⚽⚡👄👍🔥 😀😁😂😃😄😅😆😉😊😋😎😍😘😗😙😚☺😇😐😑 😶😏😣😥😮😯😪😫😴😌😛😜😝😒😓😔😕😲😷😖😞 😟😤😢😭😦😧😨😬😰😱😳😵😡😠😈👿👹👺💀👻 👽👦👧👨👩👴👵👶👱👮👲👳👷👸💂🎅👰👼 💆💇🙍🙎🙅🙆💁🙋🙇🙌🙏👤👥🚶🏃👯💃👫👬👭💏💑 👪💪👈👉☝👆👇✌✋👌👍👎✊👊👋👏👐✍👣👀👂👃👅👄💋 👓👔👕👖👗👘👙👚👛👜👝🎒💼👞👟👠👡👢👑👒🎩🎓💄💅💍🌂 🙈🙉🙊🐵🐒🐶🐕🐩🐺🐱😺😸😹😻😼😽🙀😿😾🐈 🐯🐅🐆🐴🐎🐮🐂🐃🐄🐷🐖🐗🐽🐏🐑🐐🐪🐫🐘🐭 🐁🐀🐹🐰🐇🐻🐨🐼🐾🐔🐓🐣🐤🐥🐦🐧🐸🐊🐢🐍🐲🐉🐳 🐋🐬🐟🐠🐡🐙🐚🐌🐛🐜🐝🐞🦋💐🌸💮🌹🌺🌻🌼🌷🌱🌲 🌳🌴🌵🌾🌿🍀🍁🍂🍃🌍🌎🌏🌐🌑🌒🌓🌔🌕🌖🌗🌘🌙🌚 🌛🌜☀🌝🌞⭐🌟🌠☁⛅☔⚡❄🔥💧🌊💩🍇🍈🍉🍊🍋🍌🍍🍎🍏 🍐🍑🍒🍓🍅🍆🌽🍄🌰🍞🍖🍗🍔🍟🍕🍳🍲🍱🍘🍙🍚🍛🍜 🍝🍠🍢🍣🍤🍥🍡🍦🍧🍨🍩🍪🎂🍰🍫🍬🍭🍮🍯🍼☕🍵🍶🍷🍸🍹🍺🍻🍴 🎪🎭🎨🎰🚣🛀🎫🏆⚽⚾🏀🏈🏉🎾🎱🎳⛳🎣🎽🎿🏂🏄🏇🏊🚴🚵 🎯🎮🎲🎷🎸🎺🎻🎬👾🌋🗻🏠🏡🏢🏣🏤🏥🏦🏨🏩🏪🏫🏬🏭🏯 🏰💒🗼🗽⛪⛲🌁🌃🌆🌇🌉🌌🎠🎡🎢🚂🚃🚄🚅🚆🚇🚈🚉🚊🚝🚞🚋🚌 🚍🚎🚏🚐🚑🚒🚓🚔🚕🚖🚗🚘🚚🚛🚜🚲⛽🚨🚥🚦🚧⚓⛵🚤🚢✈💺🚁 🚟🚠🚡🚀🎑🗿🛂🛃🛄🛅💌💎🔪💈🚪🚽🚿🛁⌛⏳⌚⏰🎈🎉🎊🎎🎏🎐🎀 🎁📯📻📱📲☎📞📟📠🔋🔌💻💽💾💿📀🎥📺📷📹📼🔍🔎🔬🔭📡💡🔦 🏮📔📕📖📗📘📙📚📓📃📜📄📰📑🔖💰💴💵💶💷💸💳✉📧📨📩 📤📥📦📫📪📬📭📮✏✒📝📁📂📅📆📇📈📉📊📋📌📍📎📏📐✂ 🔒🔓🔏🔐 */
const navData = [
  {
    title: "3D可视化开发",
    items: [
      {
        title: "开源案例",
        details: "Three.js Cesium.js 开源案例",
        url: "https://z2586300277.github.io/three-cesium-examples/#/example"
      },
      {
        title: "编辑器",
        details: "快速定制 Three.js 低代码编辑器",
        url: "https://z2586300277.github.io/three-editor/docs/dist/"
      },
      {
        title: "组织",
        details: "专注于三维可视化的开源组织",
        url: "https://openthree.github.io/three-cesium-links/index.html"
      }
    ]
  },
  {
    title: "内容创作",
    items: [
      {
        title: "博客",
        details: "Hexo 个人博客",
        url: "https://z2586300277.github.io/blog/"
      },
    ]
  }

];

// 打开链接函数
function openUrl(url) {
  window.open(url, '_blank');
}
</script>

<style>
.section-container {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.1rem;
  margin-bottom: 0.8rem;
  padding-bottom: 0.4rem;
  border-bottom: 2px solid #42b883;
  display: inline-block;
  font-weight: 600;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.8rem;
}

.card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 0.8rem 1rem;
  transition: all 0.2s ease;
  background-color: var(--vp-c-bg-soft);
  height: 100%;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  border-color: #42b883;
}

.card-title {
  font-weight: 600;
  margin-bottom: 0.4rem;
  font-size: 1rem;
  color: var(--vp-c-text-1);
}

.card-details {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

@media (max-width: 840px) {
  .cards-container {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
  .card {
    padding: 0.6rem 0.8rem;
  }
}
</style>

## 3D可视化开发

<div class="cards-container">
  <div 
    v-for="item in navData[0].items" 
    :key="item.title"
    class="card"
    @click="openUrl(item.url)"
  >
    <div class="card-title">{{ item.title }}</div>
    <div class="card-details">{{ item.details }}</div>
  </div>
</div>

## 内容创作

<div class="cards-container">
  <div 
    v-for="item in navData[1].items" 
    :key="item.title"
    class="card"
    @click="openUrl(item.url)"
  >
    <div class="card-title">{{ item.title }}</div>
    <div class="card-details">{{ item.details }}</div>
  </div>
</div>


