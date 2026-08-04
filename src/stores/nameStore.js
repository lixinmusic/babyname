import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNameStore = defineStore('name', () => {
  // 当前推荐结果
  const results = ref([])
  const isLoading = ref(false)

  // 收藏列表（从 localStorage 读取）
  const favorites = ref(JSON.parse(localStorage.getItem('babyname-favorites') || '[]'))

  // 当前输入参数
  const currentParams = ref({
    surname: '',
    gender: 'any',
    zodiac: '',
    length: 'double',
    style: 'random'
  })

  // 是否已收藏
  const isFavorited = (fullName) => {
    return favorites.value.some(f => f.fullName === fullName)
  }

  // 添加收藏
  const addFavorite = (nameItem) => {
    if (isFavorited(nameItem.fullName)) return
    favorites.value.push({ ...nameItem, favoritedAt: Date.now() })
    saveFavorites()
  }

  // 移除收藏
  const removeFavorite = (fullName) => {
    favorites.value = favorites.value.filter(f => f.fullName !== fullName)
    saveFavorites()
  }

  // 保存收藏到 localStorage
  const saveFavorites = () => {
    localStorage.setItem('babyname-favorites', JSON.stringify(favorites.value))
  }

  // 设置当前参数
  const setParams = (params) => {
    currentParams.value = { ...currentParams.value, ...params }
  }

  // 设置结果
  const setResults = (data) => {
    results.value = data
  }

  // 设置加载状态
  const setLoading = (loading) => {
    isLoading.value = loading
  }

  // 重置
  const reset = () => {
    results.value = []
    currentParams.value = {
      surname: '',
      gender: 'any',
      zodiac: '',
      length: 'double',
      style: 'random'
    }
  }

  return {
    results,
    isLoading,
    favorites,
    currentParams,
    isFavorited,
    addFavorite,
    removeFavorite,
    setParams,
    setResults,
    setLoading,
    reset
  }
})
