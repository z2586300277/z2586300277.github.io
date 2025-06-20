<script setup>
import { ref } from 'vue';

const list = [
  { name: '示例名称 - 优雅永不过时', amount:  0, date: '2025-05-06', message: '开源分享--------------------为爱发电', link: 'https://github.com/z2586300277', linkName: '示例名 - 博客' },
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
