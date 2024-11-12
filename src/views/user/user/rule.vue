<template>
  <div class="rule-describe">
    <table>
      <thead>
        <tr>
          <th>判断条件</th>
          <th>本地用户操作</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>源用户存在，本地用户存在</td>
          <td>更新本地用户信息（仅更新手机号、邮箱、激活状态）</td>
        </tr>
        <tr>
          <td>源用户存在，本地用户不存在</td>
          <td>创建本地用户，设置用户来源设置为<code>LDAP</code></td>
        </tr>
        <tr>
          <td>源用户不存在，本地用户存在</td>
          <td>不进行任何操作</td>
        </tr>
      </tbody>
    </table>
    <div class="note">
      <p><strong>注意：</strong></p>
      <ul>
        <li>源用户不管是<code>Windows AD</code>或<code>OpenLDAP</code>，在本地创建将设置统一来源为<code>LDAP</code>。</li>
        <li>判断本地用户是否存在的依据是：<code>username</code>相等，且来源为<code>LDAP</code>。</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RuleDescribe'
}
</script>

<style scoped>
.rule-describe {
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  color: #333;
  font-weight: bold;
}

.note {
  margin-top: 20px;
  padding: 10px;
  border-left: 4px solid #3498db;
  background-color: #f0f9ff;
}

.note strong {
  color: #3498db;
}

code {
  font-family: monospace;
  background-color: #f4f4f4;
  padding: 2px 4px;
  border-radius: 4px;
}
</style>
