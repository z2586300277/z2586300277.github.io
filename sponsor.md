<script setup>
import { ref } from 'vue';

const list = [
    { name: 'Nico', amount:  50, date: '2025-08-22', message: '', link: 'https://nicowebgl.cn', linkName: '官网' },
  { name: 'giao66', amount:  20, date: '2025-08-31', message: '', link: 'https://github.com/giao66', linkName: 'github' },
  { name: '红叶舞秋山', amount:  100 + 200 + 20, date: '2025', message: '' },
  { name: '高登坤', amount:  50, date: '2025', message: '' },
  { name: '怎么了', amount:  100, date: '2025', message: '' },
  { name: '左手', amount:  88 + 66, date: '2025', message: '' },
  { name: '空id', amount:  20, date: '2025', message: '' },
  { name: '小白', amount:  10, date: '2025', message: '' },
  { name: 'wll', amount:  20, date: '2025', message: '' },
  { name: '好好吃饭', amount:  30, date: '2025', message: '' },
  { name: '天亮了', amount:  18.8, date: '2025', message: '' },
].sort((a, b) => a.amount - b.amount).reverse()
const donations = ref(list);
</script>
<div class="content-container">
  <table>
    <thead>
      <tr>
        <th>姓名</th>
        <th>金额(￥)</th>
        <th>留言</th>
        <th>链接(可选)</th>
        <th>日期</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(donation, index) in donations" :key="index">
        <td>{{ donation.name }}</td>
        <td>{{ donation.amount }}</td>
        <td>{{ donation.message }}</td>
        <td><a :href="donation.link" target="_blank">{{ donation.linkName }}</a></td>
        <td>{{ donation.date }}</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="fixed-qrcode">
  <img src="https://z2586300277.github.io/3d-file-server/images/wx_star.png" alt="赞赏">
  <img src="https://z2586300277.github.io/3d-file-server/images/alipay.png" alt="赞赏">
</div>

<style scoped>
.content {
    padding: 0 !important;
}
table {
  width: 200% !important; /* 强制增加表格宽度 */
  margin-left: -30% !important; /* 居中表格 */
}
.fixed-qrcode {
  position: fixed;
  top: 80px;
  right:15%;
  height: 540px;
  width: 260px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
