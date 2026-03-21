<script setup lang="ts">
import { AlipayCircleOutlined, GithubOutlined, TeamOutlined, UserOutlined, WechatOutlined } from '@antdv-next/icons'
import dayjs from 'dayjs'
import { computed, onMounted, onUnmounted, reactive, ref, shallowRef, watch } from 'vue'

// Tab
const activeTab = shallowRef('org')

// Team members
const teamMembers = [
  {
    github: 'aibayanyu20',
    name: 'aibayanyu20',
    avatar: 'https://avatars.githubusercontent.com/u/45655660?v=4',
    wxCode: 'wxp://f2f0CAPw6HcV3Vm85wFYpEJZHONHoQklOWd6vXe4Z0udKvA',
    alipayCode: 'https://qr.alipay.com/2m614380prbpz28lwb4t863',
  },
  {
    github: 'selicens',
    name: 'selicens',
    avatar: 'https://avatars.githubusercontent.com/u/69418751?v=4',
    wxCode: '',
    alipayCode: '',
  },
  {
    github: 'cc-hearts',
    name: 'cc-hearts',
    avatar: 'https://avatars.githubusercontent.com/u/71313168?v=4',
    wxCode: '',
    alipayCode: '',
  },
  {
    github: 'ffgenius',
    name: 'ffgenius',
    avatar: 'https://avatars.githubusercontent.com/u/106022674?v=4',
    wxCode: 'wxp://f2f0WLYuzNeJ37fJ8ggT1-a3KwOGGIm4kM3mQ7Ti6dhEvuw',
    alipayCode: 'https://qr.alipay.com/fkx16048xvbk55pvxz8ev6b',
  },
  {
    github: 'Darkingtail',
    name: 'darkingtail',
    avatar: 'https://avatars.githubusercontent.com/u/51188676?v=4',
    wxCode: 'wxp://f2f0x9VQ7XaFm__iV8Vu9Apg1KCD6f6DY9UWCacpoCaTKYYa1absGX_lf933xeCmhd-c',
    alipayCode: 'https://qr.alipay.com/fkx11381rbbef2e82zl106a',
  },
  {
    github: 'shiqkuangsan',
    name: 'shiqkuangsan',
    avatar: 'https://avatars.githubusercontent.com/u/18481623?v=4',
    wxCode: 'wxp://f2f0D7y2n_8NxFIDidgAElzg901GrmtaCaGPELRzYx_EkA8',
    alipayCode: 'https://qr.alipay.com/fkx16811xjmckbz86jyoa62',
  },
]

interface SponsorForm {
  amount: number | string
  subject: string
  payType: 'alipay' | 'wechat'
  sponsorName?: string
  sponsorEmail?: string
  sponsorMessage?: string
  invoiceRequired?: boolean
  invoiceCompany?: string
  invoiceTaxNo?: string
  invoiceEmail?: string
}

const orgSponsorForm = reactive<SponsorForm>({
  amount: 20,
  subject: 'Antdv Next 项目赞助',
  payType: 'alipay',
  sponsorName: '',
  sponsorEmail: '',
  sponsorMessage: '',
  invoiceRequired: false,
  invoiceCompany: '',
  invoiceTaxNo: '',
  invoiceEmail: '',
})

const customInputStyles = {
  input: {
    textAlign: 'center',
    fontWeight: 700,
    fontSize: '16px',
  },
}

const amountOptions = [
  { label: '¥10', value: 10 },
  { label: '¥20', value: 20 },
  { label: '¥30', value: 30 },
  { label: '¥50', value: 50 },
  { label: '¥100', value: 100 },
]

// Sponsor list - infinite scroll
const allSponsors = shallowRef<any[]>([])
const rawSponsors = shallowRef<any[]>([])
const sortBy = shallowRef<'amount' | 'time'>('amount')
const sponsorTotal = shallowRef(0)
const sponsorLoading = shallowRef(false)
const displayedCount = shallowRef(0)
const BATCH = 20
const allLoaded = computed(() => displayedCount.value >= allSponsors.value.length && allSponsors.value.length > 0)

const displayedSponsors = computed(() => allSponsors.value.slice(0, displayedCount.value))

const submitUrl = 'https://test-pay.lingyu.org.cn'

async function fetchSponsors() {
  sponsorLoading.value = true
  try {
    const res = await fetch(`${submitUrl}/sponsor/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 1, pageSize: 100 }),
    })
    const { data } = await res.json()
    if (data) {
      const items = data.items || []
      rawSponsors.value = items
      sponsorTotal.value = data.total || items.length
      applySorting()
    }
  }
  catch (e) {
    console.error('获取赞助列表失败', e)
  }
  finally {
    sponsorLoading.value = false
  }
}

function applySorting() {
  const items = [...rawSponsors.value]
  if (sortBy.value === 'amount') {
    items.sort((a: any, b: any) => (b.amount || 0) - (a.amount || 0))
  }
  else {
    items.sort((a: any, b: any) => new Date(b.paidAt || 0).getTime() - new Date(a.paidAt || 0).getTime())
  }
  allSponsors.value = items
  displayedCount.value = Math.min(BATCH, items.length)
}

function switchSort(type: 'amount' | 'time') {
  if (sortBy.value === type)
    return
  sortBy.value = type
  applySorting()
}

function loadMore() {
  if (allLoaded.value || sponsorLoading.value)
    return
  displayedCount.value = Math.min(displayedCount.value + BATCH, allSponsors.value.length)
}

const scrollContainerRef = ref<HTMLElement>()

function onSponsorScroll(e: Event) {
  const el = e.target as HTMLElement
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 80) {
    loadMore()
  }
}

// Glow effect
const sponsorGridRef = ref<HTMLElement>()

function onGlowMove(e: MouseEvent) {
  const card = (e.target as HTMLElement).closest('.sponsor-card') as HTMLElement | null
  if (!card)
    return
  const glow = card.querySelector('.card-glow') as HTMLElement | null
  if (!glow)
    return
  const rect = card.getBoundingClientRect()
  glow.style.left = `${e.clientX - rect.left}px`
  glow.style.top = `${e.clientY - rect.top}px`
}

function onMemberGlowMove(e: MouseEvent) {
  const card = (e.target as HTMLElement).closest('.member-card') as HTMLElement | null
  if (!card)
    return
  const glow = card.querySelector('.card-glow') as HTMLElement | null
  if (!glow)
    return
  const rect = card.getBoundingClientRect()
  glow.style.left = `${e.clientX - rect.left}px`
  glow.style.top = `${e.clientY - rect.top}px`
}

// Rank helpers
function getRankClass(rank: number) {
  if (rank === 1)
    return 'rank-gold'
  if (rank === 2)
    return 'rank-silver'
  if (rank === 3)
    return 'rank-bronze'
  return 'rank-normal'
}

function getAmountClass(rank: number) {
  if (rank === 1)
    return 'amount-gold'
  if (rank === 2)
    return 'amount-silver'
  if (rank === 3)
    return 'amount-bronze'
  return 'amount-normal'
}

// WeChat payment modal
const wechatPayVisible = shallowRef(false)
const wechatPayCodeUrl = shallowRef('')
const wechatPayOrderNo = shallowRef('')
const wechatPayStatus = shallowRef<'idle' | 'pending' | 'timeout' | 'error'>('idle')
const wechatPayQuerying = shallowRef(false)
const wechatPayError = shallowRef('')
const WECHAT_POLL_INTERVAL = 5000
const WECHAT_MAX_POLL_COUNT = 120
let wechatPollTimer: ReturnType<typeof setTimeout> | null = null
let wechatPollCount = 0

function getSuccessPath(orderNo: string) {
  const path = window.location.pathname.includes('/sponsor-cn') ? '/sponsor/success-cn' : '/sponsor/success'
  return `${path}?out_trade_no=${encodeURIComponent(orderNo)}`
}

function stopWechatPayPoll() {
  if (wechatPollTimer) {
    clearTimeout(wechatPollTimer)
    wechatPollTimer = null
  }
}

function closeWechatPayModal() {
  wechatPayVisible.value = false
  stopWechatPayPoll()
  wechatPayCodeUrl.value = ''
  wechatPayOrderNo.value = ''
  wechatPayStatus.value = 'idle'
  wechatPayQuerying.value = false
  wechatPayError.value = ''
}

async function queryWechatPayment() {
  if (!wechatPayOrderNo.value || wechatPayQuerying.value)
    return false
  wechatPayQuerying.value = true
  try {
    const res = await fetch(`${submitUrl}/pay/query?orderNo=${encodeURIComponent(wechatPayOrderNo.value)}`)
    const { code, data } = await res.json()
    if (code === 0 && data) {
      if (data.paid || data.status === 'paid') {
        stopWechatPayPoll()
        window.location.href = getSuccessPath(wechatPayOrderNo.value)
        return true
      }
      if (data.status === 'pending') {
        wechatPayStatus.value = 'pending'
        wechatPayError.value = ''
        return false
      }
    }
    wechatPayStatus.value = 'error'
    wechatPayError.value = '支付状态异常，请稍后重新查询'
    stopWechatPayPoll()
    return true
  }
  catch (error) {
    console.error('查询微信支付状态失败', error)
    wechatPayStatus.value = 'error'
    wechatPayError.value = '支付状态查询失败，请稍后重试'
    stopWechatPayPoll()
    return true
  }
  finally {
    wechatPayQuerying.value = false
  }
}

function scheduleWechatPayPoll() {
  stopWechatPayPoll()
  if (!wechatPayVisible.value || !wechatPayOrderNo.value)
    return
  if (wechatPollCount >= WECHAT_MAX_POLL_COUNT) {
    wechatPayStatus.value = 'timeout'
    wechatPayError.value = '等待支付确认超时，您可以完成支付后手动刷新状态'
    return
  }
  wechatPollTimer = setTimeout(async () => {
    wechatPollCount += 1
    const finished = await queryWechatPayment()
    if (!finished)
      scheduleWechatPayPoll()
  }, WECHAT_POLL_INTERVAL)
}

function startWechatPayPoll(orderNo: string) {
  wechatPayOrderNo.value = orderNo
  wechatPayStatus.value = 'pending'
  wechatPayError.value = ''
  wechatPollCount = 0
  scheduleWechatPayPoll()
}

async function refreshWechatPayment() {
  const finished = await queryWechatPayment()
  if (!finished && wechatPayVisible.value && !wechatPollTimer)
    scheduleWechatPayPoll()
}

function getSubmitRequest() {
  return fetch(`${submitUrl}/pay/page`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: orgSponsorForm.amount,
      subject: orgSponsorForm.subject,
      payType: orgSponsorForm.payType,
      ...(orgSponsorForm.payType === 'wechat' ? { tradeType: 'native' } : {}),
      sponsorName: orgSponsorForm.sponsorName,
      sponsorEmail: orgSponsorForm.sponsorEmail,
      sponsorMessage: orgSponsorForm.sponsorMessage,
      invoiceRequired: orgSponsorForm.invoiceRequired,
      invoiceCompany: orgSponsorForm.invoiceCompany,
      invoiceTaxNo: orgSponsorForm.invoiceTaxNo,
      invoiceEmail: orgSponsorForm.invoiceEmail,
    }),
  })
}

const submitting = shallowRef(false)

async function handleOrgSponsorSubmit() {
  if (submitting.value)
    return
  submitting.value = true
  try {
    const res = await getSubmitRequest()
    const { code, data } = await res.json()
    if (code !== 0 || !data)
      return
    if (orgSponsorForm.payType === 'alipay' && data.url) {
      window.open(data.url, '_blank')
      return
    }
    if (orgSponsorForm.payType === 'wechat' && data.codeUrl && data.orderNo) {
      wechatPayCodeUrl.value = data.codeUrl
      wechatPayVisible.value = true
      startWechatPayPoll(data.orderNo)
    }
  }
  finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchSponsors()
})

onUnmounted(() => {
  stopWechatPayPoll()
})

watch(wechatPayVisible, (visible) => {
  if (!visible)
    stopWechatPayPoll()
})
</script>

<template>
  <div class="sponsor-page">
    <!-- HERO -->
    <section class="hero-mesh flex items-center justify-center px-6 pt-20 pb-12">
      <div class="max-w-3xl mx-auto text-center fade-in">
        <div class="hero-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          Open Source Sponsor
        </div>
        <h1 class="hero-title">
          支持我们的创作与发展
        </h1>
        <p class="hero-desc">
          您的每一份支持，都是 Antdv Next 持续输出高质量内容的动力
        </p>
      </div>
    </section>

    <!-- MAIN -->
    <main class="main-content">
      <!-- Background blobs -->
      <div class="bg-blobs" aria-hidden="true">
        <div class="blob blob-1" />
        <div class="blob blob-2" />
        <div class="blob blob-3" />
      </div>

      <!-- Tabs -->
      <div class="flex justify-center mb-8 fade-in fade-in-d1">
        <div class="tab-bar">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'org' }"
            @click="activeTab = 'org'"
          >
            <TeamOutlined />
            赞助团队
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'personal' }"
            @click="activeTab = 'personal'"
          >
            <UserOutlined />
            赞助个人
          </button>
        </div>
      </div>

      <!-- ORG TAB -->
      <div v-show="activeTab === 'org'" class="fade-in fade-in-d2">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <!-- LEFT: Form -->
          <div class="lg:col-span-2">
            <div class="glass-card rounded-2xl p-6 sticky top-6">
              <!-- Info -->
              <div class="info-banner mb-6">
                <svg class="w-5 h-5 shrink-0 mt-0.5" style="color: var(--ant-color-primary)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                <p class="text-xs leading-relaxed" style="color: var(--ant-color-text-secondary)">
                  所有赞助资金将优先投入服务器等运营成本，结余部分将以公开透明的方式用于团队支持及社区贡献激励。
                </p>
              </div>

              <!-- Amount -->
              <div class="mb-5">
                <label class="form-label">赞助金额</label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="opt in amountOptions"
                    :key="opt.value"
                    class="amount-chip"
                    :class="{ active: orgSponsorForm.amount === opt.value }"
                    @click="orgSponsorForm.amount = opt.value"
                  >
                    {{ opt.label }}
                  </button>
                  <a-input-number
                    v-model:value="orgSponsorForm.amount"
                    :min="1"
                    :step="1"
                    :controls="false"
                    prefix="¥"
                    suffix="元"
                    :styles="customInputStyles"
                    class="custom-amount-input"
                    placeholder="自定义"
                  />
                </div>
              </div>

              <!-- Name -->
              <div class="mb-4">
                <label class="form-label">赞助人</label>
                <a-input v-model:value="orgSponsorForm.sponsorName" placeholder="留个称呼让我们感谢您~" />
              </div>

              <!-- Message -->
              <div class="mb-4">
                <label class="form-label">留言</label>
                <a-textarea
                  v-model:value="orgSponsorForm.sponsorMessage"
                  placeholder="您的每一句话都是我们前进的动力~"
                  :auto-size="{ minRows: 2, maxRows: 4 }"
                />
              </div>

              <!-- Payment -->
              <div class="mb-5">
                <label class="form-label">支付方式</label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    class="pay-radio"
                    :class="{ active: orgSponsorForm.payType === 'alipay' }"
                    @click="orgSponsorForm.payType = 'alipay'"
                  >
                    <AlipayCircleOutlined style="color: #1677ff; font-size: 18px" />
                    支付宝
                  </button>
                  <button
                    class="pay-radio"
                    :class="{ active: orgSponsorForm.payType === 'wechat' }"
                    @click="orgSponsorForm.payType = 'wechat'"
                  >
                    <WechatOutlined style="color: #07c160; font-size: 18px" />
                    微信支付
                  </button>
                </div>
              </div>

              <!-- Invoice -->
              <div class="mb-4">
                <a-checkbox v-model:checked="orgSponsorForm.invoiceRequired">
                  需要开具发票
                </a-checkbox>
              </div>
              <template v-if="orgSponsorForm.invoiceRequired">
                <div class="invoice-section">
                  <div class="flex items-center justify-between mb-4">
                    <span class="text-sm font-600" style="color: var(--ant-color-text)">发票信息</span>
                    <a-tag color="green">
                      支持电子普票
                    </a-tag>
                  </div>
                  <a-input v-model:value="orgSponsorForm.invoiceCompany" placeholder="公司全称" class="mb-3" />
                  <a-input v-model:value="orgSponsorForm.invoiceTaxNo" placeholder="统一社会信用代码" class="mb-3" />
                  <a-input v-model:value="orgSponsorForm.invoiceEmail" placeholder="接收邮箱" />
                </div>
              </template>

              <!-- Submit -->
              <a-button type="primary" size="large" block class="submit-btn" :loading="submitting" @click="handleOrgSponsorSubmit">
                立即赞助
              </a-button>
            </div>
          </div>

          <!-- RIGHT: Sponsor Wall -->
          <div class="lg:col-span-3">
            <div class="glass-card rounded-2xl p-6">
              <div class="flex items-center justify-between mb-5">
                <div>
                  <h2 class="text-lg font-700" style="color: var(--ant-color-text)">
                    感谢以下赞助者的支持
                  </h2>
                  <p class="text-xs mt-1" style="color: var(--ant-color-text-secondary)">
                    共 {{ sponsorTotal }} 位赞助者
                  </p>
                </div>
                <div class="flex items-center gap-3">
                  <div class="sort-bar">
                    <button class="sort-btn" :class="{ active: sortBy === 'amount' }" @click="switchSort('amount')">
                      按金额
                    </button>
                    <button class="sort-btn" :class="{ active: sortBy === 'time' }" @click="switchSort('time')">
                      按时间
                    </button>
                  </div>
                  <div class="flex items-center gap-1.5 text-xs" style="color: var(--ant-color-text-quaternary)">
                    <span class="live-dot" />
                    实时更新
                  </div>
                </div>
              </div>

              <!-- Scroll container -->
              <div ref="scrollContainerRef" class="scroll-container" @scroll="onSponsorScroll">
                <div ref="sponsorGridRef" class="grid grid-cols-1 sm:grid-cols-2 gap-3" @mousemove="onGlowMove">
                  <div
                    v-for="(item, index) in displayedSponsors"
                    :key="item.orderNo || index"
                    class="sponsor-card"
                    :class="{ 'has-glow': index < 3 }"
                  >
                    <div class="card-glow" />
                    <div v-if="index < 3" class="corner-glow" :class="`corner-${index + 1}`" />
                    <div class="card-content flex items-start gap-3">
                      <div class="rank-badge" :class="getRankClass(index + 1)">
                        {{ index + 1 }}
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-600 truncate" style="color: var(--ant-color-text)">{{ item.sponsorName || '匿名好心人' }}</span>
                          <span class="amount-badge" :class="getAmountClass(index + 1)">¥{{ item.amount }}</span>
                        </div>
                        <p class="text-xs mt-1 truncate" style="color: var(--ant-color-text-secondary)">
                          {{ item.sponsorMessage || '-' }}
                        </p>
                        <p class="text-11px mt-1.5" style="color: var(--ant-color-text-quaternary)">
                          {{ item.paidAt ? dayjs(item.paidAt).format('YYYY-MM-DD') : '-' }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Loading -->
                <div v-if="sponsorLoading" class="flex items-center justify-center gap-2 py-4 text-xs" style="color: var(--ant-color-text-quaternary)">
                  <a-spin size="small" />
                  加载中...
                </div>
                <div v-else-if="!allLoaded && allSponsors.length > 0" class="flex items-center justify-center gap-2 py-4 text-xs" style="color: var(--ant-color-text-quaternary)">
                  <a-spin size="small" />
                  加载更多...
                </div>
                <div v-else-if="allLoaded" class="text-center py-4 text-xs" style="color: var(--ant-color-text-quaternary)">
                  已加载全部赞助者
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- PERSONAL TAB -->
      <div v-show="activeTab === 'personal'" class="fade-in">
        <div class="glass-card rounded-2xl p-6 max-w-4xl mx-auto">
          <div class="info-banner mb-6">
            <svg class="w-5 h-5 shrink-0 mt-0.5" style="color: var(--ant-color-primary)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
            <p class="text-xs leading-relaxed" style="color: var(--ant-color-text-secondary)">
              个人赞助将直接归属于被赞助者本人，组织仅提供平台支持，不参与任何个人赞助资金的管理与分配。
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" @mousemove="onMemberGlowMove">
            <div v-for="member in teamMembers" :key="member.github" class="member-card">
              <div class="card-glow" />
              <div class="card-content text-center">
                <a-avatar :src="member.avatar" :size="80" class="mb-3" />
                <h3 class="text-sm font-700 mb-1" style="color: var(--ant-color-text)">
                  {{ member.name }}
                </h3>
                <a
                  :href="`https://github.com/${member.github}`"
                  target="_blank"
                  rel="noreferrer"
                  class="member-github"
                >
                  <GithubOutlined />
                  @{{ member.github }}
                </a>
                <div class="flex items-center justify-center gap-2 mt-3">
                  <a-popover trigger="hover" placement="bottom">
                    <template #content>
                      <a-qrcode
                        :value="member.alipayCode || 'not-available'"
                        :status="member.alipayCode ? 'active' : 'loading'"
                        :bordered="false"
                        :size="140"
                      />
                      <p class="text-xs text-center mt-2" style="color: var(--ant-color-text-secondary)">
                        支付宝扫码赞助
                      </p>
                    </template>
                    <button class="qr-btn qr-btn-alipay" :disabled="!member.alipayCode">
                      <AlipayCircleOutlined />
                      支付宝
                    </button>
                  </a-popover>
                  <a-popover trigger="hover" placement="bottom">
                    <template #content>
                      <a-qrcode
                        :value="member.wxCode || 'not-available'"
                        :status="member.wxCode ? 'active' : 'loading'"
                        :bordered="false"
                        :size="140"
                      />
                      <p class="text-xs text-center mt-2" style="color: var(--ant-color-text-secondary)">
                        微信扫码赞助
                      </p>
                    </template>
                    <button class="qr-btn qr-btn-wechat" :disabled="!member.wxCode">
                      <WechatOutlined />
                      微信
                    </button>
                  </a-popover>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-16 text-xs" style="color: var(--ant-color-text-quaternary)">
        <p>Antdv Next · 全面保障支付安全及财务合规性</p>
      </div>
    </main>

    <!-- WeChat Pay Modal -->
    <a-modal
      v-model:open="wechatPayVisible"
      :footer="null"
      :width="420"
      centered
      title="微信支付"
      @cancel="closeWechatPayModal"
    >
      <div class="wechat-pay-sheet">
        <div class="wechat-pay-badge">
          <WechatOutlined />
        </div>
        <h3 class="text-xl font-700 m-0" style="color: var(--ant-color-text)">
          请使用微信扫一扫完成支付
        </h3>
        <p class="text-sm m-0 text-center leading-relaxed" style="color: var(--ant-color-text-secondary)">
          完成扫码后页面会自动确认支付状态，并在成功后跳转到结果页。
        </p>
        <div class="wechat-pay-qrcode">
          <a-qrcode :value="wechatPayCodeUrl" :size="220" :bordered="false" />
        </div>
        <div class="wechat-pay-meta">
          <div class="wechat-pay-row">
            <span>订单号</span>
            <strong>{{ wechatPayOrderNo }}</strong>
          </div>
          <div class="wechat-pay-row">
            <span>支付金额</span>
            <strong>¥{{ orgSponsorForm.amount }}</strong>
          </div>
        </div>
        <a-alert
          v-if="wechatPayStatus === 'timeout'"
          type="warning"
          show-icon
          :message="wechatPayError"
          class="w-full"
        />
        <a-alert
          v-else-if="wechatPayStatus === 'error'"
          type="error"
          show-icon
          :message="wechatPayError"
          class="w-full"
        />
        <a-alert
          v-else
          type="info"
          show-icon
          message="支付结果确认中，请保持此窗口打开。"
          class="w-full"
        />
        <a-space class="w-full justify-center">
          <a-button type="primary" :loading="wechatPayQuerying" @click="refreshWechatPayment">
            我已支付，刷新状态
          </a-button>
          <a-button @click="closeWechatPayModal">
            稍后再说
          </a-button>
        </a-space>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
.sponsor-page {
  min-height: calc(100vh - var(--ant-doc-header-height, 64px));
  background: var(--ant-color-bg-layout);
}

/* Hero */
.hero-mesh {
  min-height: 340px;
  background:
    radial-gradient(ellipse 80% 60% at 20% 40%, rgba(22, 119, 255, 0.08) 0%, transparent 70%),
    radial-gradient(ellipse 60% 50% at 80% 30%, rgba(99, 102, 241, 0.06) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 50% 80%, rgba(22, 119, 255, 0.04) 0%, transparent 70%);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 9999px;
  background: var(--ant-color-primary-bg);
  border: 1px solid var(--ant-color-primary-border);
  color: var(--ant-color-primary);
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 24px;
}

.hero-title {
  font-size: 40px;
  font-weight: 800;
  color: var(--ant-color-text);
  letter-spacing: -0.5px;
  line-height: 1.2;
  margin: 0 0 12px;
}

.hero-desc {
  font-size: 18px;
  color: var(--ant-color-text-secondary);
  margin: 0;
  max-width: 520px;
  margin-inline: auto;
  line-height: 1.6;
}

/* Main */
.main-content {
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 16px 80px;
  margin-top: -16px;
  position: relative;
}

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
  top: -80px;
  left: -128px;
  width: 384px;
  height: 384px;
  background: rgba(22, 119, 255, 0.06);
}
.blob-2 {
  top: 33%;
  right: -96px;
  width: 320px;
  height: 320px;
  background: rgba(99, 102, 241, 0.05);
}
.blob-3 {
  bottom: 25%;
  left: 25%;
  width: 288px;
  height: 288px;
  background: rgba(139, 92, 246, 0.04);
}

/* Tabs */
.tab-bar {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: 12px;
  background: var(--ant-color-bg-container);
  border: 1px solid var(--ant-color-border-secondary);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--ant-color-text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn.active {
  color: var(--ant-color-primary);
  background: var(--ant-color-primary-bg);
}

/* Glass card */
.glass-card {
  background: color-mix(in srgb, var(--ant-color-bg-container) 72%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid color-mix(in srgb, var(--ant-color-bg-container) 80%, transparent);
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 8px 32px rgba(0, 0, 0, 0.04);
}

/* Info banner */
.info-banner {
  display: flex;
  gap: 12px;
  padding: 14px;
  border-radius: 12px;
  background: var(--ant-color-primary-bg);
  border: 1px solid var(--ant-color-primary-border);
}

/* Form */
.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--ant-color-text);
  margin-bottom: 8px;
}

/* Amount chips */
.amount-chip {
  padding: 10px 8px;
  border: 2px solid var(--ant-color-border);
  border-radius: 12px;
  background: transparent;
  font-size: 14px;
  font-weight: 700;
  color: var(--ant-color-text);
  cursor: pointer;
  transition: all 0.18s ease;
}

.amount-chip:hover {
  border-color: var(--ant-color-primary);
  color: var(--ant-color-primary);
}

.amount-chip.active {
  border-color: var(--ant-color-primary);
  background: var(--ant-color-primary-bg);
  color: var(--ant-color-primary);
  box-shadow: 0 0 0 3px rgba(22, 119, 255, 0.08);
}

.custom-amount-input {
  width: 100%;
  border-radius: 12px;
}

/* Pay radio */
.pay-radio {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: 2px solid var(--ant-color-border);
  border-radius: 12px;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: var(--ant-color-text);
  cursor: pointer;
  transition: all 0.18s ease;
}

.pay-radio:hover {
  border-color: var(--ant-color-primary);
}

.pay-radio.active {
  border-color: var(--ant-color-primary);
  background: var(--ant-color-primary-bg);
  box-shadow: 0 0 0 3px rgba(22, 119, 255, 0.08);
}

/* Invoice */
.invoice-section {
  background: var(--ant-color-fill-quaternary);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
}

/* Submit */
.submit-btn {
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.25);
}

/* Sort bar */
.sort-bar {
  display: inline-flex;
  gap: 2px;
  padding: 2px;
  border-radius: 8px;
  background: var(--ant-color-fill-quaternary);
}

.sort-btn {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--ant-color-text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.18s ease;
}

.sort-btn:hover {
  color: var(--ant-color-text);
}

.sort-btn.active {
  color: var(--ant-color-primary);
  background: var(--ant-color-bg-container);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

/* Live dot */
.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #52c41a;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

/* Scroll container */
.scroll-container {
  max-height: 640px;
  overflow-y: auto;
  padding: 8px;
  margin: -8px;
  scrollbar-width: thin;
  scrollbar-color: var(--ant-color-border) transparent;
}

.scroll-container::-webkit-scrollbar {
  width: 4px;
}
.scroll-container::-webkit-scrollbar-track {
  background: transparent;
}
.scroll-container::-webkit-scrollbar-thumb {
  background: var(--ant-color-border);
  border-radius: 2px;
}

/* Sponsor card */
.sponsor-card {
  position: relative;
  overflow: clip;
  padding: 16px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--ant-color-bg-container) 55%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid color-mix(in srgb, var(--ant-color-bg-container) 60%, transparent);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.03),
    0 4px 16px rgba(0, 0, 0, 0.03);
  cursor: pointer;
  transition:
    transform 0.22s cubic-bezier(0.22, 0.61, 0.36, 1),
    box-shadow 0.22s ease,
    border-color 0.22s ease;
}

.sponsor-card:hover {
  transform: translateY(-2px);
  border-color: var(--ant-color-primary-border);
  box-shadow:
    0 8px 32px rgba(22, 119, 255, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.06);
}

.sponsor-card .card-glow {
  position: absolute;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(22, 119, 255, 0.15) 0%, rgba(99, 102, 241, 0.08) 40%, transparent 70%);
  pointer-events: none;
  opacity: 0;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease;
  z-index: 0;
}

.sponsor-card:hover .card-glow {
  opacity: 1;
}
.sponsor-card .card-content {
  position: relative;
  z-index: 1;
}

/* Corner glow for top 3 */
.corner-glow {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.corner-1 {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.12) 0%, rgba(251, 191, 36, 0.04) 40%, transparent 70%);
}
.corner-2 {
  background: linear-gradient(135deg, rgba(148, 163, 184, 0.1) 0%, rgba(148, 163, 184, 0.03) 40%, transparent 70%);
}
.corner-3 {
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.1) 0%, rgba(217, 119, 6, 0.03) 40%, transparent 70%);
}

/* Rank badges */
.rank-badge {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.rank-gold {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #fff;
  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
}
.rank-silver {
  background: linear-gradient(135deg, #94a3b8, #64748b);
  color: #fff;
  box-shadow: 0 2px 4px rgba(100, 116, 139, 0.3);
}
.rank-bronze {
  background: linear-gradient(135deg, #d97706, #b45309);
  color: #fff;
  box-shadow: 0 2px 4px rgba(180, 83, 9, 0.3);
}
.rank-normal {
  background: var(--ant-color-fill-secondary);
  color: var(--ant-color-text-secondary);
}

/* Amount badges */
.amount-badge {
  font-size: 12px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 6px;
  flex-shrink: 0;
}

.amount-gold {
  color: #b45309;
  background: rgba(251, 191, 36, 0.15);
}
.amount-silver {
  color: #475569;
  background: rgba(148, 163, 184, 0.15);
}
.amount-bronze {
  color: #9a3412;
  background: rgba(217, 119, 6, 0.12);
}
.amount-normal {
  color: #16a34a;
  background: rgba(22, 163, 74, 0.08);
}

/* Member card */
.member-card {
  position: relative;
  overflow: hidden;
  padding: 24px;
  border-radius: 16px;
  background: color-mix(in srgb, var(--ant-color-bg-container) 55%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid color-mix(in srgb, var(--ant-color-bg-container) 60%, transparent);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.03),
    0 4px 16px rgba(0, 0, 0, 0.03);
  cursor: pointer;
  transition:
    transform 0.22s cubic-bezier(0.22, 0.61, 0.36, 1),
    box-shadow 0.22s ease,
    border-color 0.22s ease;
}

.member-card:hover {
  transform: translateY(-3px);
  border-color: var(--ant-color-primary-border);
  box-shadow:
    0 12px 40px rgba(22, 119, 255, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.05);
}

.member-card .card-glow {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(22, 119, 255, 0.12) 0%, rgba(139, 92, 246, 0.06) 40%, transparent 70%);
  pointer-events: none;
  opacity: 0;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease;
  z-index: 0;
}

.member-card:hover .card-glow {
  opacity: 1;
}
.member-card .card-content {
  position: relative;
  z-index: 1;
}

.member-github {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--ant-color-text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}

.member-github:hover {
  color: var(--ant-color-primary);
}

/* QR buttons */
.qr-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.18s ease;
}

.qr-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.qr-btn-alipay {
  border: 1px solid var(--ant-color-primary-border);
  background: var(--ant-color-primary-bg);
  color: var(--ant-color-primary);
}

.qr-btn-alipay:not(:disabled):hover {
  background: rgba(22, 119, 255, 0.12);
}

.qr-btn-wechat {
  border: 1px solid #b7eb8f;
  background: #f6ffed;
  color: #52c41a;
}

.qr-btn-wechat:not(:disabled):hover {
  background: rgba(82, 196, 26, 0.12);
}

/* WeChat pay modal */
.wechat-pay-sheet {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding-top: 8px;
}

.wechat-pay-badge {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(7, 193, 96, 0.12);
  color: #07c160;
  font-size: 28px;
}

.wechat-pay-qrcode {
  padding: 18px;
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(7, 193, 96, 0.08), rgba(7, 193, 96, 0.02));
}

.wechat-pay-meta {
  width: 100%;
  padding: 16px;
  border-radius: 16px;
  background: var(--ant-color-fill-quaternary);
}

.wechat-pay-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  color: var(--ant-color-text-secondary);
}

.wechat-pay-row + .wechat-pay-row {
  margin-top: 10px;
}

.wechat-pay-row strong {
  color: var(--ant-color-text);
  text-align: right;
  word-break: break-all;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
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
  animation-delay: 0.05s;
  opacity: 0;
}
.fade-in-d2 {
  animation-delay: 0.1s;
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-mesh {
    min-height: 280px;
    padding-top: 48px;
  }
  .hero-title {
    font-size: 28px;
  }
  .hero-desc {
    font-size: 15px;
  }
  .main-content {
    padding: 0 12px 48px;
  }
  .glass-card {
    padding: 16px;
  }
  .scroll-container {
    max-height: 480px;
  }
  .member-card {
    padding: 16px;
  }
  .submit-btn {
    height: 44px;
    font-size: 15px;
  }
}

@media (max-width: 375px) {
  .hero-title {
    font-size: 22px;
  }
  .amount-chip {
    padding: 8px 4px;
    font-size: 13px;
    border-radius: 10px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fade-in,
  .fade-in-d1,
  .fade-in-d2 {
    animation: none;
    opacity: 1;
  }
  .sponsor-card,
  .member-card {
    transition: none;
  }
  .live-dot {
    animation: none;
    opacity: 1;
  }
}
</style>
