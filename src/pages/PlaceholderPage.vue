<template>
  <div class="content-area">
    <div class="placeholder-page">
      <div class="placeholder-icon" style="color:#409eff">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M9 12h6m-6 4h6m2-10H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2z"/>
        </svg>
      </div>
      <p class="placeholder-text">功能开发中</p>
    </div>
  </div>
</template>

<style scoped>
.placeholder-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #aaa;
}
.placeholder-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  opacity: 0.4;
}
.placeholder-text {
  font-size: 15px;
}
</style>
