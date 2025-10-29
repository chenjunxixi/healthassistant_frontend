<template>
  <div class="card sidebar-card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <span><i class="fas fa-history me-2"></i><strong>最近记录</strong></span>
      <small class="text-muted">最近5次</small>
    </div>
    <div class="card-body p-0">
      <div class="history-section">
        <div class="history-item">
          <div class="history-date">今天 12:30</div>
          <div class="history-food">红烧肉</div>
          <div class="history-details">
            <span class="badge bg-danger me-1">380大卡</span>
            <span class="text-muted">蛋白15g 脂肪25g</span>
          </div>
        </div>
        <div class="history-item">
          <div class="history-date">今天 08:20</div>
          <div class="history-food">燕麦粥</div>
          <div class="history-details">
            <span class="badge bg-success me-1">180大卡</span>
            <span class="text-muted">蛋白6g 碳水35g</span>
          </div>
        </div>
      </div>
      <div class="p-3 text-center border-top">
        <button class="btn btn-outline-primary btn-sm w-100">
          <i class="fas fa-list me-1"></i>查看完整记录
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 只属于这个组件的样式 */
.history-section {
  max-height: 250px;
  overflow-y: auto;
}
.history-item {
  padding: 12px 15px;
  border-bottom: 1px solid #f8f9fa;
}
.history-item:last-child {
  border-bottom: none;
}
.history-date {
  font-size: 0.85rem;
  color: #6c757d;
}
.history-food {
  font-weight: 600;
}
.history-details {
  font-size: 0.8rem;
  color: #6c757d;
}
</style>
