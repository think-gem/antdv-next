<script setup lang="ts">
import { LoadingOutlined } from '@antdv-next/icons'
import dayjs from 'dayjs'
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const orderNo = computed(() => route.query.out_trade_no as string || '')
const pageStatus = shallowRef<'loading' | 'success' | 'pending' | 'fail'>('loading')
const orderInfo = shallowRef<{
  orderNo: string
  amount: string
  subject: string
  status: string
  paidAt: string | null
  createdAt: string
}>()

const submitUrl = 'https://test-pay.lingyu.org.cn'
let pollTimer: ReturnType<typeof setTimeout> | null = null
let pollCount = 0
const MAX_POLL = 10

async function queryOrder() {
  if (!orderNo.value) {
    pageStatus.value = 'fail'
    return
  }
  try {
    const res = await fetch(`${submitUrl}/pay/alipay/query?orderNo=${orderNo.value}`)
    const { code, data } = await res.json()
    if (code === 0 && data) {
      orderInfo.value = data
      if (data.status === 'paid') {
        pageStatus.value = 'success'
        stopPoll()
      }
      else if (data.status === 'pending') {
        pageStatus.value = 'pending'
        startPoll()
      }
      else {
        pageStatus.value = 'fail'
        stopPoll()
      }
    }
    else {
      pageStatus.value = 'fail'
    }
  }
  catch {
    pageStatus.value = 'fail'
  }
}

function startPoll() {
  if (pollCount >= MAX_POLL)
    return
  pollTimer = setTimeout(async () => {
    pollCount++
    await queryOrder()
  }, 3000)
}

function stopPoll() {
  if (pollTimer) {
    clearTimeout(pollTimer)
    pollTimer = null
  }
}

function goBack() {
  router.push('/sponsor')
}

// ===== Confetti Engine =====
const canvasRef = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null
const particles: any[] = []
let animating = false

const confettiColors = [
  '#1677ff',
  '#52c41a',
  '#faad14',
  '#ff4d4f',
  '#722ed1',
  '#13c2c2',
  '#eb2f96',
  '#fa8c16',
  '#2f54eb',
  '#a0d911',
]

function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function createParticle(x: number, y: number) {
  return {
    x,
    y,
    vx: randomRange(-12, 12),
    vy: randomRange(-18, -6),
    w: randomRange(4, 10),
    h: randomRange(6, 14),
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    shape: Math.random() > 0.5 ? 'rect' : 'circle',
    rotation: randomRange(0, 360),
    rotationSpeed: randomRange(-8, 8),
    gravity: 0.25,
    drag: 0.98,
    opacity: 1,
    fadeSpeed: randomRange(0.005, 0.015),
  }
}

function resizeCanvas() {
  if (!canvasRef.value)
    return
  canvasRef.value.width = window.innerWidth
  canvasRef.value.height = window.innerHeight
}

function fireConfetti() {
  if (!canvasRef.value)
    return
  const canvas = canvasRef.value
  const cx = canvas.width / 2
  const cy = canvas.height * 0.35

  // Center burst
  for (let i = 0; i < 120; i++) {
    particles.push(createParticle(cx + randomRange(-60, 60), cy + randomRange(-20, 20)))
  }
  // Side bursts
  for (let j = 0; j < 40; j++) {
    const p1 = createParticle(canvas.width * 0.15, canvas.height * 0.5)
    p1.vx = randomRange(4, 14)
    p1.vy = randomRange(-16, -4)
    particles.push(p1)

    const p2 = createParticle(canvas.width * 0.85, canvas.height * 0.5)
    p2.vx = randomRange(-14, -4)
    p2.vy = randomRange(-16, -4)
    particles.push(p2)
  }

  if (!animating) {
    animating = true
    animateConfetti()
  }
}

function animateConfetti() {
  if (!ctx || !canvasRef.value)
    return
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.vy += p.gravity
    p.vx *= p.drag
    p.x += p.vx
    p.y += p.vy
    p.rotation += p.rotationSpeed
    p.opacity -= p.fadeSpeed

    if (p.opacity <= 0 || p.y > canvasRef.value.height + 20) {
      particles.splice(i, 1)
      continue
    }

    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.rotate(p.rotation * Math.PI / 180)
    ctx.globalAlpha = p.opacity
    ctx.fillStyle = p.color

    if (p.shape === 'rect') {
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
    }
    else {
      ctx.beginPath()
      ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }

  if (particles.length > 0) {
    requestAnimationFrame(animateConfetti)
  }
  else {
    animating = false
    ctx?.clearRect(0, 0, canvasRef.value!.width, canvasRef.value!.height)
  }
}

// Watch for success to trigger confetti
watch(pageStatus, (status) => {
  if (status === 'success') {
    setTimeout(fireConfetti, 400)
  }
})

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
    resizeCanvas()
  }
  window.addEventListener('resize', resizeCanvas)
  queryOrder()
})

onUnmounted(() => {
  stopPoll()
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<template>
  <div class="success-page">
    <!-- Confetti Canvas -->
    <canvas ref="canvasRef" class="confetti-canvas" />

    <div class="hero-mesh min-h-screen flex items-center justify-center px-4 py-12 relative">
      <!-- Background blobs -->
      <div class="bg-blobs" aria-hidden="true">
        <div class="blob blob-1" />
        <div class="blob blob-2" />
        <div class="blob blob-3" />
      </div>

      <div class="w-full max-w-lg">
        <!-- SUCCESS STATE -->
        <template v-if="pageStatus === 'success'">
          <div class="text-center">
            <div class="glass-card rounded-3xl p-10 md:p-12 relative overflow-hidden">
              <div class="top-bar top-bar-success" />

              <!-- Icon -->
              <div class="relative inline-flex items-center justify-center mb-6">
                <div class="pulse-ring pulse-ring-success" />
                <div class="icon-circle icon-success pop-in">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
              </div>

              <h1 class="result-title fade-in fade-in-d1">
                感谢您的赞助！
              </h1>
              <p class="result-desc fade-in fade-in-d2">
                您的支持是我们前进的最大动力，每一份心意我们都铭记于心
              </p>

              <!-- Order Info -->
              <div v-if="orderInfo" class="order-card fade-in fade-in-d3">
                <div class="order-row">
                  <span class="order-label">订单编号</span>
                  <span class="order-value font-mono">{{ orderInfo.orderNo }}</span>
                </div>
                <div class="order-divider" />
                <div class="order-row">
                  <span class="order-label">赞助金额</span>
                  <span class="order-amount">¥{{ orderInfo.amount }}</span>
                </div>
                <template v-if="orderInfo.paidAt">
                  <div class="order-divider" />
                  <div class="order-row">
                    <span class="order-label">支付时间</span>
                    <span class="order-value">{{ dayjs(orderInfo.paidAt).format('YYYY-MM-DD HH:mm:ss') }}</span>
                  </div>
                </template>
              </div>

              <!-- Actions -->
              <div class="flex flex-col sm:flex-row items-center justify-center gap-3 fade-in fade-in-d4">
                <a-button type="primary" size="large" class="action-btn" @click="goBack">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                  返回赞助页
                </a-button>
                <a-button size="large" class="action-btn" @click="fireConfetti">
                  再来一次撒花
                </a-button>
              </div>
            </div>

            <div class="footer-text fade-in fade-in-d4">
              <p>Antdv Next · 全面保障支付安全及财务合规性</p>
            </div>
          </div>
        </template>

        <!-- LOADING / PENDING STATE -->
        <template v-if="pageStatus === 'loading' || pageStatus === 'pending'">
          <div class="text-center">
            <div class="glass-card rounded-3xl p-10 md:p-12 relative overflow-hidden">
              <div class="top-bar top-bar-loading" />

              <div class="relative inline-flex items-center justify-center mb-6">
                <div class="icon-circle icon-loading">
                  <LoadingOutlined class="text-white text-4xl spinner" />
                </div>
              </div>

              <h1 class="result-title">
                {{ pageStatus === 'loading' ? '正在查询支付结果...' : '等待支付确认中...' }}
              </h1>
              <p class="result-desc">
                {{ pageStatus === 'loading' ? '请稍候，我们正在确认您的支付状态' : '支付结果还在路上，正在自动刷新~' }}
              </p>

              <!-- Order info or shimmer -->
              <div v-if="orderInfo" class="order-card">
                <div class="order-row">
                  <span class="order-label">订单编号</span>
                  <span class="order-value font-mono">{{ orderInfo.orderNo }}</span>
                </div>
                <div class="order-divider" />
                <div class="order-row">
                  <span class="order-label">赞助金额</span>
                  <span class="order-value">¥{{ orderInfo.amount }}</span>
                </div>
                <div class="order-divider" />
                <div class="order-row">
                  <span class="order-label">订单状态</span>
                  <a-tag color="processing">
                    待支付
                  </a-tag>
                </div>
              </div>
              <div v-else class="order-card">
                <div class="order-row">
                  <div class="shimmer w-16 h-4" />
                  <div class="shimmer w-32 h-4" />
                </div>
                <div class="order-divider" />
                <div class="order-row">
                  <div class="shimmer w-16 h-4" />
                  <div class="shimmer w-20 h-6" />
                </div>
                <div class="order-divider" />
                <div class="order-row">
                  <div class="shimmer w-16 h-4" />
                  <div class="shimmer w-28 h-4" />
                </div>
              </div>

              <div v-if="pageStatus === 'pending'" class="flex justify-center">
                <a-button type="primary" size="large" class="action-btn" @click="goBack">
                  返回赞助页
                </a-button>
              </div>
            </div>
          </div>
        </template>

        <!-- FAIL STATE -->
        <template v-if="pageStatus === 'fail'">
          <div class="text-center">
            <div class="glass-card rounded-3xl p-10 md:p-12 relative overflow-hidden">
              <div class="top-bar top-bar-fail" />

              <div class="relative inline-flex items-center justify-center mb-6">
                <div class="icon-circle icon-fail pop-in">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                </div>
              </div>

              <h1 class="result-title">
                支付结果确认中
              </h1>
              <p class="result-desc">
                暂未查询到支付结果，可能存在网络延迟，请稍后再试
              </p>

              <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a-button size="large" class="action-btn" @click="queryOrder">
                  重新查询
                </a-button>
                <a-button type="primary" size="large" class="action-btn" @click="goBack">
                  返回赞助页
                </a-button>
              </div>
            </div>

            <div class="footer-text">
              <p>Antdv Next · 全面保障支付安全及财务合规性</p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.success-page {
  min-height: calc(100vh - var(--ant-doc-header-height, 64px));
  background: var(--ant-color-bg-layout);
}

/* Confetti */
.confetti-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999;
}

/* Hero mesh */
.hero-mesh {
  background:
    radial-gradient(ellipse 80% 60% at 20% 40%, rgba(22, 119, 255, 0.08) 0%, transparent 70%),
    radial-gradient(ellipse 60% 50% at 80% 30%, rgba(99, 102, 241, 0.06) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 50% 80%, rgba(22, 119, 255, 0.04) 0%, transparent 70%);
}

/* Background blobs */
.bg-blobs {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(48px);
}

.blob-1 {
  top: 25%;
  left: -80px;
  width: 320px;
  height: 320px;
  background: rgba(22, 119, 255, 0.06);
}
.blob-2 {
  bottom: 25%;
  right: -64px;
  width: 288px;
  height: 288px;
  background: rgba(99, 102, 241, 0.05);
}
.blob-3 {
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  width: 384px;
  height: 384px;
  background: rgba(52, 211, 153, 0.04);
}

/* Glass card */
.glass-card {
  background: color-mix(in srgb, var(--ant-color-bg-container) 65%, transparent);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid color-mix(in srgb, var(--ant-color-bg-container) 70%, transparent);
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 12px 40px rgba(0, 0, 0, 0.05);
}

/* Top gradient bar */
.top-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.top-bar-success {
  background: linear-gradient(to right, #52c41a, var(--ant-color-primary), #6366f1);
}
.top-bar-loading {
  background: linear-gradient(to right, #60a5fa, var(--ant-color-primary), #818cf8);
}
.top-bar-fail {
  background: linear-gradient(to right, #fb923c, #f59e0b, #fbbf24);
}

/* Icon circles */
.icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-success {
  background: linear-gradient(135deg, #52c41a, #389e0d);
  box-shadow: 0 8px 24px rgba(82, 196, 26, 0.25);
}

.icon-loading {
  background: linear-gradient(135deg, var(--ant-color-primary), #4096ff);
  box-shadow: 0 8px 24px rgba(22, 119, 255, 0.25);
}

.icon-fail {
  background: linear-gradient(135deg, #faad14, #d48806);
  box-shadow: 0 8px 24px rgba(250, 173, 20, 0.25);
}

/* Pulse ring */
.pulse-ring {
  position: absolute;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  animation: pulseRing 2s cubic-bezier(0.22, 0.61, 0.36, 1) infinite;
}

.pulse-ring-success {
  background: rgba(82, 196, 26, 0.15);
}

@keyframes pulseRing {
  0% {
    transform: scale(0.8);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.15);
    opacity: 0;
  }
  100% {
    transform: scale(0.8);
    opacity: 0;
  }
}

/* Pop-in */
@keyframes popIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.pop-in {
  animation: popIn 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}

/* Spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.spinner {
  animation: spin 1s linear infinite;
}

/* Fade in */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeInUp 0.5s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}
.fade-in-d1 {
  animation-delay: 0.15s;
  opacity: 0;
}
.fade-in-d2 {
  animation-delay: 0.3s;
  opacity: 0;
}
.fade-in-d3 {
  animation-delay: 0.45s;
  opacity: 0;
}
.fade-in-d4 {
  animation-delay: 0.6s;
  opacity: 0;
}

/* Result text */
.result-title {
  font-size: 32px;
  font-weight: 800;
  color: var(--ant-color-text);
  letter-spacing: -0.5px;
  margin: 0 0 12px;
}

.result-desc {
  font-size: 16px;
  color: var(--ant-color-text-secondary);
  margin: 0 0 32px;
  line-height: 1.6;
}

/* Order card */
.order-card {
  border-radius: 16px;
  background: color-mix(in srgb, var(--ant-color-bg-container) 60%, transparent);
  backdrop-filter: blur(8px);
  border: 1px solid var(--ant-color-border-secondary);
  padding: 20px;
  margin-bottom: 32px;
  text-align: left;
}

.order-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
}

.order-divider {
  border-top: 1px solid var(--ant-color-border-secondary);
}

.order-label {
  font-size: 14px;
  color: var(--ant-color-text-secondary);
}

.order-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--ant-color-text);
}

.order-amount {
  font-size: 22px;
  font-weight: 800;
  color: #52c41a;
}

/* Action button */
.action-btn {
  height: 44px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 12px;
  min-width: 140px;
}

/* Shimmer */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.shimmer {
  background: linear-gradient(
    90deg,
    var(--ant-color-fill-secondary) 25%,
    var(--ant-color-fill-quaternary) 50%,
    var(--ant-color-fill-secondary) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 6px;
}

/* Footer */
.footer-text {
  text-align: center;
  margin-top: 32px;
  font-size: 12px;
  color: var(--ant-color-text-quaternary);
}

.footer-text p {
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .glass-card {
    padding: 32px 20px;
  }
  .result-title {
    font-size: 24px;
  }
  .result-desc {
    font-size: 14px;
    margin-bottom: 24px;
  }
  .order-card {
    padding: 14px 16px;
    border-radius: 12px;
  }
  .order-amount {
    font-size: 18px;
  }
  .action-btn {
    min-width: 120px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fade-in,
  .fade-in-d1,
  .fade-in-d2,
  .fade-in-d3,
  .fade-in-d4 {
    animation: none;
    opacity: 1;
  }
  .pop-in {
    animation: none;
    opacity: 1;
    transform: scale(1);
  }
  .pulse-ring {
    animation: none;
    opacity: 0;
  }
  .spinner {
    animation: none;
  }
  .shimmer {
    animation: none;
  }
}
</style>
