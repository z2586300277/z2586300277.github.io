<script setup>
import { ref } from 'vue';

const list = [
  { name: '示例', amount:  0, date: '2025-05-06', message: '为爱发电', link: 'https://github.com/z2586300277', linkName: '官网' }
].sort((a, b) => a.amount - b.amount).reverse();
const donations = ref(list);
</script>
<div class="content-container">
  <table>
    <thead>
      <tr>
        <th>姓名</th>
        <th>链接(留言备注)</th>
        <th>金额(￥)</th>
        <th>留言</th>
        <th>日期</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(donation, index) in donations" :key="index">
        <td>{{ donation.name }}</td>
        <td><a :href="donation.link" target="_blank">{{ donation.linkName }}</a></td>
        <td>{{ donation.amount }}</td>
        <td>{{ donation.message }}</td>
        <td>{{ donation.date }}</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="fixed-qrcode">
  <img src="https://z2586300277.github.io/3d-file-server/images/wx_star.png" alt="赞赏">
</div>

<style>
.content {
    padding: 0 !important;
}
table {
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eaecef;
}

th {
  background-color: var(--vp-c-brand-light, #3eaf7c);
  color: white;
  font-weight: 500;
}

tr:last-child td {
  border-bottom: none;
}

tr:nth-child(even) {
  background-color: var(--vp-c-bg-soft, #f9f9f9);
}

tr:hover {
  background-color: var(--vp-c-bg-mute, #f3f4f5);
}

a {
  color: var(--vp-c-brand, #3eaf7c);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

table {
  width: 200% !important; /* 强制增加表格宽度 */
  margin-left: -25% !important; /* 居中表格 */
}

.fixed-qrcode {
  position: fixed;
  top: 30%;
  right:15%;
  transform: translateY(-50%);
  width: 280px;
}

</style>
