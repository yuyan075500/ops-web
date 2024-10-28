<template>
  <div>
    <h3>计划任务表达式规则</h3>
    <p>Cron 表达式包含五个字段：分钟、小时、日期、月份和星期，每个字段可以使用以下格式：</p>
    <ul>
      <li><strong>分钟</strong>：0-59之间的数字</li>
      <li><strong>小时</strong>：0-23之间的数字</li>
      <li><strong>日</strong>：1-31之间的数字</li>
      <li><strong>月</strong>：1-12之间的数字或名称（如：jan, feb等）</li>
      <li><strong>周</strong>：0-6之间的数字（0表示周日）或名称（如：sun, mon等）</li>
    </ul>
    <h4>字段的特殊字符：</h4>
    <ul>
      <li><strong>*</strong>：表示该字段的每个可能值</li>
      <li><strong>,</strong>：用来分隔多个值（例如：1,2,3表示在1、2、3分钟执行）</li>
      <li><strong>-</strong>：表示范围（例如：1-5表示1到5分钟）</li>
      <li><strong>/</strong>：表示增量（例如：*/5表示每5分钟）</li>
    </ul>
    <h4>示例：</h4>
    <p>每分钟执行一次：<code>* * * * *</code></p>
    <p>每天凌晨1点执行：<code>0 1 * * *</code></p>
    <p>每周一至五的上午10点执行：<code>0 10 * * 1-5</code></p>
    <p>每月1号的凌晨0点执行：<code>0 0 1 * *</code></p>
    <p>每小时的第15分钟执行：<code>15 * * * *</code></p>
  </div>
</template>

<script>
export default {
  name: 'CronDescribe'
}
