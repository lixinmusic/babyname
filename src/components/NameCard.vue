<script setup>
import { useNameStore } from '../stores/nameStore'
import { ELEMENT_COLORS, ZODIAC_EMOJI, STYLE_COLORS, getMatchDesc, getElementRelation } from '../utils/helpers'

const store = useNameStore()

const props = defineProps({
  nameItem: { type: Object, required: true },
  index: { type: Number, default: 0 }
})

const emit = defineEmits(['favorite', 'detail'])

function elementColor(element) {
  return ELEMENT_COLORS[element] || { bg: '#E8E8E8', text: '#333', border: '#D0D0D0' }
}

function getMatchInfo() {
  return getMatchDesc(props.nameItem.score || 50)
}

function isFavorited() {
  return store.isFavorited(props.nameItem.fullName)
}

function handleFavorite(e) {
  e.stopPropagation()
  emit('favorite', props.nameItem)
}

function handleDetail() {
  emit('detail', props.nameItem)
}
</script>

<template>
  <div
    :class="['name-card', { favorited: isFavorited() }]"
    :style="{ animationDelay: (index * 0.05) + 's' }"
    @click="handleDetail"
  >
    <div class="name-card-top">
      <span class="full-name">{{ nameItem.fullName }}</span>
      <button
        class="favorite-btn"
        :title="isFavorited() ? '取消收藏' : '收藏'"
        @click="handleFavorite"
      >
        {{ isFavorited() ? '💛' : '🤍' }}
      </button>
    </div>

    <div class="name-card-pinyin">{{ nameItem.pinyin }}</div>

    <p class="name-card-meaning">{{ nameItem.meaning }}</p>

    <div class="name-card-meta">
      <span
        class="meta-tag element"
        :style="{
          '--tag-bg': elementColor(nameItem.elementA).bg,
          '--tag-text': elementColor(nameItem.elementA).text,
          '--tag-border': elementColor(nameItem.elementA).border
        }"
      >
        五行·{{ nameItem.elementA }}
      </span>

      <span
        v-if="nameItem.elementB"
        class="meta-tag element"
        :style="{
          '--tag-bg': elementColor(nameItem.elementB).bg,
          '--tag-text': elementColor(nameItem.elementB).text,
          '--tag-border': elementColor(nameItem.elementB).border
        }"
      >
        五行·{{ nameItem.elementB }}
      </span>

      <span
        v-for="tag in (nameItem.tags || []).slice(0, 2)"
        :key="tag"
        class="meta-tag style-tag"
        :style="{
          '--tag-bg': STYLE_COLORS[tag]?.bg || '#F5F5F5',
          '--tag-text': STYLE_COLORS[tag]?.text || '#666'
        }"
      >
        {{ tag }}
      </span>

      <span class="meta-tag info-tag">📝 {{ nameItem.strokes }}画</span>
    </div>

    <div class="name-card-bottom">
      <span
        class="match-badge"
        :style="{
          '--badge-bg': getMatchInfo().text === '完美匹配' ? '#D4EDDA' : getMatchInfo().text === '高度匹配' ? '#E8F5E9' : '#FFF3CD',
          '--badge-text': getMatchInfo().text === '完美匹配' ? '#155724' : getMatchInfo().text === '高度匹配' ? '#1B5E20' : '#856404'
        }"
      >
        {{ nameItem.zodiacIcon || ZODIAC_EMOJI[nameItem.zodiacName] || '🐭' }}
        {{ nameItem.zodiacName }}·{{ getMatchInfo().text }}
      </span>

      <span class="zodiac-info">
        {{ getElementRelation(nameItem.elementA, nameItem.elementB) }}
      </span>
    </div>
  </div>
</template>
