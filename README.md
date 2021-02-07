# FundHoldings

由于支付宝基金买入时按金额买入，卖出时按份数卖出。所以开发了基金持仓管理工具。

买入时需要手动录入买入的份额和日期，可以自动计算每笔订单买入的天数，方便卖出已经买入7天或30天以上的份额。

### 基金名称添加

第一行是用来向下拉菜单添加基金名称的

### 基金订单生成

第二行先选基金名称，再输入买入基金份额，日期需要手动改一下，是基金份额确认的前一天，这样才能准确判断买入了多少天。

基金名称下拉菜单有不再想要购买的基金选中后点删除即可删除

### 筛选功能

订单表头可以按基金名称和买入天数筛选

买入天数的筛选是筛选出买入天数大于等于输入框的订单。

筛选后的总份额在下方，可以直接在支付宝一次卖掉，然后把筛选出来的订单全部点击卖出即可。

![alt 界面图片](/app/sample.png)