<script setup>
import { ELEMENT_COLORS, STYLE_COLORS, ZODIAC_EMOJI, getMatchDesc, getElementRelation, getZodiacMatchDesc } from '../utils/helpers'

const props = defineProps({
  nameItem: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

function elementColor(element) {
  return ELEMENT_COLORS[element] || { bg: '#E8E8E8', text: '#333', border: '#D0D0D0' }
}
</script>

<template>
  <div class="modal-overlay" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="emit('close')">✕</button>

      <div class="modal-title">{{ nameItem.fullName }}</div>
      <div class="modal-pinyin">{{ nameItem.pinyin }}</div>

      <!-- 名字解读 -->
      <div class="modal-section">
        <div class="modal-section-title">💡 名字寓意</div>
        <p style="font-size: 0.95rem; line-height: 1.8; color: var(--color-text);">
          {{ nameItem.meaning }}
        </p>
      </div>

      <!-- 逐字分析 -->
      <div class="modal-section">
        <div class="modal-section-title">📖 逐字分析</div>
        <div class="char-breakdown">
          <div class="char-item">
            <div class="char-display">{{ nameItem.firstCharInfo?.char || '' }}</div>
            <div class="char-pinyin">{{ nameItem.firstCharInfo?.pinyin || '' }}</div>
            <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; justify-content: center;">
              <span
                class="meta-tag element"
                :style="{
                  '--tag-bg': elementColor(nameItem.elementA).bg,
                  '--tag-text': elementColor(nameItem.elementA).text,
                  '--tag-border': elementColor(nameItem.elementA).border
                }"
              >
                {{ nameItem.elementA }}
              </span>
              <span class="meta-tag info-tag">{{ nameItem.firstCharInfo?.strokes || 0 }}画</span>
              <span class="meta-tag info-tag">部首·{{ nameItem.firstCharInfo?.radical || '' }}</span>
            </div>
            <div class="char-meaning">{{ nameItem.firstCharInfo?.meaning || '' }}</div>
          </div>
          <div v-if="nameItem.secondCharInfo" class="char-item">
            <div class="char-display">{{ nameItem.secondCharInfo.char }}</div>
            <div class="char-pinyin">{{ nameItem.secondCharInfo.pinyin }}</div>
            <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; justify-content: center;">
              <span
                class="meta-tag element"
                :style="{
                  '--tag-bg': elementColor(nameItem.elementB).bg,
                  '--tag-text': elementColor(nameItem.elementB).text,
                  '--tag-border': elementColor(nameItem.elementB).border
                }"
              >
                {{ nameItem.elementB }}
              </span>
              <span class="meta-tag info-tag">{{ nameItem.secondCharInfo.strokes }}画</span>
              <span class="meta-tag info-tag">部首·{{ nameItem.secondCharInfo.radical }}</span>
            </div>
            <div class="char-meaning">{{ nameItem.secondCharInfo.meaning }}</div>
          </div>
        </div>
      </div>

      <!-- 五行与生肖 -->
      <div class="modal-section">
        <div class="modal-section-title">🔮 五行与生肖</div>
        <div class="modal-detail-grid">
          <div class="modal-detail-item">
            <div class="detail-label">五行关系</div>
            <div class="detail-value">{{ getElementRelation(nameItem.elementA, nameItem.elementB) }}</div>
          </div>
          <div class="modal-detail-item">
            <div class="detail-label">生肖匹配</div>
            <div class="detail-value">
              {{ nameItem.zodiacIcon || ZODIAC_EMOJI[nameItem.zodiacName] }} {{ nameItem.zodiacName }}
              {{ '·' }}{{ getMatchDesc(nameItem.score || 50).text }}
            </div>
          </div>
          <div class="modal-detail-item">
            <div class="detail-label">笔画合计</div>
            <div class="detail-value">{{ nameItem.strokes }}画</div>
          </div>
          <div class="modal-detail-item">
            <div class="detail-label">风格标签</div>
            <div class="detail-value">
              <span
                v-for="tag in (nameItem.tags || []).slice(0, 3)"
                :key="tag"
                class="meta-tag style-tag"
                :style="{
                  '--tag-bg': STYLE_COLORS[tag]?.bg || '#F5F5F5',
                  '--tag-text': STYLE_COLORS[tag]?.text || '#666'
                }"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 匹配说明 -->
      <div class="modal-section">
        <div class="modal-section-title">📋 匹配说明</div>
        <p style="font-size: 0.88rem; line-height: 1.8; color: var(--color-text); background: #FFF8E7; padding: 14px 16px; border-radius: 12px; border-left: 3px solid #FFE066;">
          {{ getZodiacMatchDesc(nameItem) }}
        </p>
      </div>

      <p style="font-size: 0.78rem; color: var(--color-text-light); text-align: center; margin-top: 8px;">
        ⚠️ 以上分析仅供参考，请以专业命理师意见为准
      </p>
    </div>
  </div>
</template>
