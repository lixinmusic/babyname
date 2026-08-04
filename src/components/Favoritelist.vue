<script setup>
import { ref } from 'vue'
import { useNameStore } from '../stores/nameStore'
import { ELEMENT_COLORS, ZODIAC_EMOJI, STYLE_COLORS, getMatchDesc, getElementRelation } from '../utils/helpers'

const store = useNameStore()
const emit = defineEmits(['close', 'detail'])

const favorites = ref(store.favorites)

function elementColor(element) {
  return ELEMENT_COLORS[element] || { bg: '#E8E8E8', text: '#333', border: '#D0D0D0' }
}

function removeFromFavorites(fullName) {
  store.removeFavorite(fullName)
  favorites.value = [...store.favorites]
}

function goToDetail(nameItem) {
  emit('detail', nameItem)
}
</script>

<template>
  <div class="favorites-section">
    <div class="favorites-header">
      <h2>⭐ 我的收藏</h2>
      <span class="favorites-count">共 {{ favorites.length }} 个</span>
    </div>

    <div v-if="favorites.length === 0" class="favorites-empty">
      <div class="empty-emoji">💛</div>
      <p>还没有收藏的名字</p>
      <span class="empty-hint">点击名字卡片上的 ❤ 即可收藏</span>
    </div>

    <div v-else class="results-grid">
      <div
        v-for="(item, idx) in favorites"
        :key="item.fullName + item.favoritedAt"
        :class="['name-card', 'favorited']"
        :style="{ animationDelay: (idx * 0.05) + 's' }"
        @click="goToDetail(item)"
      >
        <div class="name-card-top">
          <span class="full-name">{{ item.fullName }}</span>
          <button
            class="favorite-btn"
            title="取消收藏"
            @click.stop="removeFromFavorites(item.fullName)"
          >
            💛
          </button>
        </div>

        <div class="name-card-pinyin">{{ item.pinyin }}</div>

        <p class="name-card-meaning">{{ item.meaning }}</p>

        <div class="name-card-meta">
          <span
            class="meta-tag element"
            :style="{
              '--tag-bg': elementColor(item.elementA).bg,
              '--tag-text': elementColor(item.elementA).text,
              '--tag-border': elementColor(item.elementA).border
            }"
          >
            五行·{{ item.elementA }}
          </span>

          <span
            v-if="item.elementB"
            class="meta-tag element"
            :style="{
              '--tag-bg': elementColor(item.elementB).bg,
              '--tag-text': elementColor(item.elementB).text,
              '--tag-border': elementColor(item.elementB).border
            }"
          >
            五行·{{ item.elementB }}
          </span>

          <span
            v-for="tag in (item.tags || []).slice(0, 2)"
            :key="tag"
            class="meta-tag style-tag"
            :style="{
              '--tag-bg': STYLE_COLORS[tag]?.bg || '#F5F5F5',
              '--tag-text': STYLE_COLORS[tag]?.text || '#666'
            }"
          >
            {{ tag }}
          </span>

          <span class="meta-tag info-tag">📝 {{ item.strokes }}画</span>
        </div>

        <div class="name-card-bottom">
          <span
            class="match-badge"
            :style="{
              '--badge-bg': '#FFF3CD',
              '--badge-text': '#856404'
            }"
          >
            {{ item.zodiacIcon || ZODIAC_EMOJI[item.zodiacName] || '🐭' }}
            {{ item.zodiacName }}·{{ getMatchDesc(item.score || 50).text }}
          </span>

          <span class="zodiac-info">
            {{ getElementRelation(item.elementA, item.elementB) }}
          </span>
        </div>
      </div>
    </div>

    <div style="text-align: center; margin-top: 24px;">
      <button class="action-btn" @click="emit('close')">
        ← 返回起名
      </button>
    </div>
  </div>
</template>
