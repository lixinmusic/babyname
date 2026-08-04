<script setup>
import { ref, watch } from 'vue'
import { useNameStore } from '../stores/nameStore'
import { getZodiacByYear, validateSurname, ZODIAC_OPTIONS, GENDER_OPTIONS, STYLE_OPTIONS, LENGTH_OPTIONS, ZODIAC_EMOJI } from '../utils/helpers'

const store = useNameStore()
const emit = defineEmits(['generate', 'show-favorites'])

// 表单数据
const surname = ref('')
const birthYear = ref('')
const gender = ref('any')
const zodiac = ref('')
const length = ref('double')
const style = ref('random')
const surnameError = ref('')

// 字数限制
const maxSurnameLen = 4

// 根据出生年份自动推算生肖
watch(birthYear, (val) => {
  if (val && val.length === 4) {
    const z = getZodiacByYear(val)
    if (z) zodiac.value = z
  }
})

// 提交
function handleSubmit() {
  const error = validateSurname(surname.value)
  if (error) {
    surnameError.value = error
    return
  }
  surnameError.value = ''

  if (!zodiac.value) {
    alert('请选择生肖属相，或输入出生年份自动推算')
    return
  }

  store.setParams({
    surname: surname.value,
    gender: gender.value,
    zodiac: zodiac.value,
    length: length.value,
    style: style.value
  })

  emit('generate', {
    surname: surname.value,
    gender: gender.value,
    zodiac: zodiac.value,
    length: length.value,
    style: style.value
  })
}

// 性别按钮类
function genderClass(value) {
  const map = { male: 'gender-male', female: 'gender-female', any: 'gender-any' }
  return map[value] || ''
}

function toggleFavorites() {
  emit('show-favorites')
}
</script>

<template>
  <div class="page-header">
    <div class="header-emoji">🍼</div>
    <h1>宝宝起名助手</h1>
    <p class="subtitle">为宝宝选一个独一无二的名字</p>
  </div>

  <div class="input-card">
    <div class="input-row">
      <div class="input-group">
        <label>👨‍👩‍👧 姓氏 <span class="hint">宝宝姓氏</span></label>
        <input
          v-model="surname"
          type="text"
          :maxlength="maxSurnameLen"
          placeholder="请输入宝宝姓氏"
        />
        <div v-if="surnameError" class="input-error">{{ surnameError }}</div>
      </div>
      <div class="input-group">
        <label>📅 出生年份 <span class="hint">自动推算生肖</span></label>
        <input
          v-model="birthYear"
          type="number"
          :min="2020"
          :max="2030"
          placeholder="如 2024"
        />
      </div>
    </div>

    <div class="option-group">
      <div class="option-label">👶 性别</div>
      <div class="option-buttons">
        <button
          v-for="opt in GENDER_OPTIONS"
          :key="opt.value"
          :class="['option-btn', genderClass(opt.value), { active: gender === opt.value }]"
          @click="gender = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <div class="option-group">
      <div class="option-label">🐲 生肖属相</div>
      <div class="zodiac-grid">
        <button
          v-for="z in ZODIAC_OPTIONS"
          :key="z.name"
          :class="['zodiac-btn', { active: zodiac === z.name }]"
          @click="zodiac = z.name"
        >
          <span class="zodiac-emoji">{{ ZODIAC_EMOJI[z.name] || z.icon }}</span>
          <span class="zodiac-name">{{ z.name }}</span>
        </button>
      </div>
    </div>

    <div class="option-group">
      <div class="option-label">📏 名字长度</div>
      <div class="option-buttons">
        <button
          v-for="opt in LENGTH_OPTIONS"
          :key="opt.value"
          :class="['option-btn', { active: length === opt.value }]"
          @click="length = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <div class="option-group">
      <div class="option-label">🎨 风格偏好</div>
      <div class="option-buttons">
        <button
          v-for="opt in STYLE_OPTIONS"
          :key="opt.value"
          :class="['option-btn', { active: style === opt.value }]"
          @click="style = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <button
      class="submit-btn"
      :disabled="!surname || !zodiac"
      @click="handleSubmit"
    >
      <span class="btn-icon">✨</span>
      开始起名
      <span class="btn-icon">✨</span>
    </button>

    <div style="text-align: center; margin-top: 16px;">
      <button class="action-btn" @click="toggleFavorites">
        ⭐ 我的收藏
      </button>
    </div>
  </div>
</template>
