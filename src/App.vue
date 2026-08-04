<script setup>
import { ref } from 'vue'
import { useNameStore } from './stores/nameStore'
import { generateNames } from './composables/useNameGenerator'
import NameInput from './components/NameInput.vue'
import NameCard from './components/NameCard.vue'
import DetailModal from './components/DetailModal.vue'
import Favoritelist from './components/Favoritelist.vue'

const store = useNameStore()
const detailNameItem = ref(null)
const showFavorites = ref(false)

function handleGenerate(params) {
  store.setLoading(true)

  setTimeout(() => {
    try {
      const results = generateNames({
        surname: params.surname,
        gender: params.gender,
        zodiacName: params.zodiac,
        length: params.length,
        style: params.style,
        count: 12
      })

      store.setResults(results)
    } catch (e) {
      console.error('起名失败:', e)
      store.setResults([])
    } finally {
      store.setLoading(false)
    }
  }, 500)
}

function handleFavorite(nameItem) {
  if (store.isFavorited(nameItem.fullName)) {
    store.removeFavorite(nameItem.fullName)
  } else {
    store.addFavorite(nameItem)
  }
}

function handleDetail(nameItem) {
  detailNameItem.value = nameItem
}

function closeDetail() {
  detailNameItem.value = null
}

function toggleFavorites() {
  showFavorites.value = !showFavorites.value
}

function handleCloseFavorites() {
  showFavorites.value = false
}
</script>

<template>
  <div id="app">
    <!-- 收藏页面 -->
    <Favoritelist
      v-if="showFavorites"
      @close="handleCloseFavorites"
      @detail="handleDetail"
    />

    <!-- 主页面 -->
    <div v-else>
      <NameInput
        @generate="handleGenerate"
        @show-favorites="toggleFavorites"
      />

      <!-- 加载中 -->
      <div v-if="store.isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <div class="loading-text">正在为宝宝挑选好名字...</div>
      </div>

      <!-- 结果区 -->
      <div v-else-if="store.results.length > 0" class="results-section">
        <div class="results-header">
          <h2>
            <span class="emoji">✨</span>为你推荐
            <span style="font-size: 0.85rem; color: var(--color-text-light); font-weight: 400; margin-left: 8px;">
              （点击查看详情，🤍收藏）
            </span>
          </h2>
          <div class="results-actions">
            <button
              class="action-btn primary"
              @click="handleGenerate(store.currentParams)"
            >
              🎲 再来一批
            </button>
          </div>
        </div>

        <div class="results-grid">
          <NameCard
            v-for="(item, idx) in store.results"
            :key="item.fullName + idx"
            :nameItem="item"
            :index="idx"
            @favorite="handleFavorite"
            @detail="handleDetail"
          />
        </div>
      </div>

      <!-- 初始空状态 -->
      <div v-else class="empty-container">
        <div class="empty-emoji">🌟</div>
        <p>输入姓氏、选择生肖</p>
        <span class="empty-hint">点击"开始起名"获取专属推荐</span>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <DetailModal
      v-if="detailNameItem"
      :nameItem="detailNameItem"
      @close="closeDetail"
    />

    <div class="page-footer">
      <p>宝宝起名助手 · 为每个新生命送上最美好的祝愿</p>
      <p class="disclaimer">⚠️ 本工具基于传统生肖文化与字根匹配推荐，仅供参考，请以专业命理师意见为准</p>
    </div>
  </div>
</template>
