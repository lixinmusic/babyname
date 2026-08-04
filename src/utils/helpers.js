/** 将 JSON 文件导出为 ES module */

/** 五行标签颜色 */
export const ELEMENT_COLORS = {
  '金': { bg: '#FFF3CD', text: '#856404', border: '#FFEEBA' },
  '木': { bg: '#D4EDDA', text: '#155724', border: '#C3E6CB' },
  '水': { bg: '#D1ECF1', text: '#0C5460', border: '#BEE5EB' },
  '火': { bg: '#F8D7DA', text: '#721C24', border: '#F5C6CB' },
  '土': { bg: '#E2D9D1', text: '#5A4A3A', border: '#D5C9BE' }
}

/** 风格标签颜色 */
export const STYLE_COLORS = {
  '文雅': { bg: '#E8D5F0', text: '#6C3483' },
  '大气': { bg: '#D5E8F0', text: '#1A5276' },
  '温和': { bg: '#FDEBD0', text: '#A04000' },
  '智慧': { bg: '#D5F0E3', text: '#117A65' }
}

/** 生肖 emoji */
export const ZODIAC_EMOJI = {
  '鼠': '🐭', '牛': '🐮', '虎': '🐯', '兔': '🐰',
  '龙': '🐲', '蛇': '🐍', '马': '🐴', '羊': '🐑',
  '猴': '🐵', '鸡': '🐔', '狗': '🐶', '猪': '🐷'
}

/** 性别显示 */
export const GENDER_LABEL = {
  'male': '男孩',
  'female': '女孩',
  'any': '男女通用'
}

/** 长度显示 */
export const LENGTH_LABEL = {
  'single': '单字名',
  'double': '双字名'
}

/** 风格选项 */
export const STYLE_OPTIONS = [
  { value: 'random', label: '🎲 随机' },
  { value: '文雅', label: '📖 文雅' },
  { value: '大气', label: '🏔️ 大气' },
  { value: '温和', label: '🌸 温和' },
  { value: '智慧', label: '🧠 智慧' }
]

/** 性别选项 */
export const GENDER_OPTIONS = [
  { value: 'male', label: '男孩', color: '#5B9BD5' },
  { value: 'female', label: '女孩', color: '#FFB6C1' },
  { value: 'any', label: '中性', color: '#87CEEB' }
]

/** 长度选项 */
export const LENGTH_OPTIONS = [
  { value: 'single', label: '单字名' },
  { value: 'double', label: '双字名' }
]

/** 生肖列表 */
export const ZODIAC_OPTIONS = [
  { name: '鼠', icon: '🐭' },
  { name: '牛', icon: '🐮' },
  { name: '虎', icon: '🐯' },
  { name: '兔', icon: '🐰' },
  { name: '龙', icon: '🐲' },
  { name: '蛇', icon: '🐍' },
  { name: '马', icon: '🐴' },
  { name: '羊', icon: '🐑' },
  { name: '猴', icon: '🐵' },
  { name: '鸡', icon: '🐔' },
  { name: '狗', icon: '🐶' },
  { name: '猪', icon: '🐷' }
]

/** 根据年份推算生肖 */
export function getZodiacByYear(year) {
  const yearNum = Number(year)
  if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) return null
  const names = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
  return names[(yearNum - 4) % 12]
}

/** 根据匹配度返回描述 */
export function getMatchDesc(score) {
  if (score >= 80) return { text: '完美匹配', color: '#28A745' }
  if (score >= 60) return { text: '高度匹配', color: '#5CB85C' }
  if (score >= 40) return { text: '基本匹配', color: '#F0AD4E' }
  return { text: '待优化', color: '#D9534F' }
}

/** 验证姓氏 */
export function validateSurname(surname) {
  if (!surname) return '请输入姓氏'
  if (surname.length > 0) {
    for (let i = 0; i < surname.length; i++) {
      const c = surname.charCodeAt(i)
      if (c < 0x4e00 || c > 0x9fff) return '请输入中文姓氏'
    }
  } else return '请输入姓氏'
  if (surname.length > 4) return '姓氏不得超过4个字'
  return null
}

/** 五行相生说明 */
export function getElementRelation(elementA, elementB) {
  if (!elementA || !elementB) return '—'
  if (elementA === elementB) return '同气，相辅相成'
  const generatedOrder = ['金', '水', '木', '火', '土']
  const idxA = generatedOrder.indexOf(elementA)
  const idxB = generatedOrder.indexOf(elementB)
  if (idxA !== -1 && idxB !== -1) {
    if ((idxA + 1) % 5 === idxB) return elementA + '生' + elementB + '，相生吉利'
    if ((idxB + 1) % 5 === idxA) return elementB + '生' + elementA + '，相生吉利'
  }
  return '五行互补'
}

/** 生肖匹配说明 */
export function getZodiacMatchDesc(nameItem) {
  const rad = nameItem.radicals || []
  const fav = nameItem.favorableRadicals || []
  const matched = rad.filter(r => fav.includes(r))
  if (matched.length > 0) {
    const level = (nameItem.score || 0) >= 70 ? '极高' : (nameItem.score || 0) >= 50 ? '较高' : '中等'
    return '名字含宜用字根「' + matched.join('、') + '」，与「' + nameItem.zodiacName + '」生肖匹配度' + level
  }
  const level = (nameItem.score || 0) >= 50 ? '较好' : '一般'
  return '名字与「' + nameItem.zodiacName + '」生肖匹配度' + level + '，可结合八字综合参考'
}
