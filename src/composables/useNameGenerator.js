import charactersData from '../data/characters.json'
import zodiacData from '../data/zodiac.json'

// 五行相生表
const ELEMENT_HARMONY = {
  '金': '金生水，相生',
  '水': '水生木，相生',
  '木': '木生火，相生',
  '火': '火生土，相生',
  '土': '土生金，相生'
}

// 单字 → 名字项
function charToNameItem(charInfo) {
  return {
    char: charInfo.char,
    pinyin: charInfo.pinyin,
    meaning: charInfo.meaning,
    radical: charInfo.radical,
    strokes: charInfo.strokes,
    element: charInfo.element,
    tags: charInfo.tags,
    // 双字名时用于第二个字
    isSingleChar: true,
    secondChar: null
  }
}

function generateTwoCharName(surname, charA, charB) {
  return {
    fullName: surname + charA.char + charB.char,
    pinyin: charA.pinyin + ' ' + charB.pinyin,
    meaning: charA.meaning + '；' + charB.meaning,
    radicals: [charA.radical, charB.radical],
    strokes: charA.strokes + charB.strokes,
    elementA: charA.element,
    elementB: charB.element,
    tags: charA.tags.concat(charB.tags),
    firstCharInfo: charA,
    secondCharInfo: charB
  }
}

function generateSingleCharName(surname, charInfo) {
  return {
    fullName: surname + charInfo.char,
    pinyin: charInfo.pinyin,
    meaning: charInfo.meaning,
    radicals: [charInfo.radical],
    strokes: charInfo.strokes,
    elementA: charInfo.element,
    elementB: null,
    tags: charInfo.tags,
    firstCharInfo: charInfo,
    secondCharInfo: null
  }
}

// 检查字根是否在宜用字根中
function isFavorable(charInfo, favorableRadicals) {
  return favorableRadicals.some(r => charInfo.radical === r)
}

// 检查字根是否在忌用字根中
function isAvoid(charInfo, avoidRadicals) {
  return avoidRadicals.some(r => charInfo.radical === r)
}

// 计算名字匹配度分数
function calculateScore(nameItem, zodiac) {
  let score = 0
  const favorable = zodiac.favorableRadicals || []
  const avoid = zodiac.avoidRadicals || []

  // 第一字匹配
  if (nameItem.firstCharInfo) {
    if (isFavorable(nameItem.firstCharInfo, favorable)) score += 30
    if (isAvoid(nameItem.firstCharInfo, avoid)) score -= 20
    // 避免字符与姓氏相同
    if (nameItem.firstCharInfo.char === nameItem.firstCharInfo.char) {
      // 无特殊处理，后续去重解决
    }
  }

  // 第二字匹配
  if (nameItem.secondCharInfo) {
    if (isFavorable(nameItem.secondCharInfo, favorable)) score += 30
    if (isAvoid(nameItem.secondCharInfo, avoid)) score -= 20
  }

  // 风格匹配
  const baseTags = nameItem.tags || []
  // 基础分
  score += 40

  return Math.max(0, Math.min(100, score))
}

// 根据风格标签筛选
function filterByStyle(chars, style) {
  if (!style || style === 'random') return chars
  return chars.filter(c => c.tags && c.tags.includes(style))
}

// 去除重复名字
function deduplicate(results) {
  const seen = new Set()
  return results.filter(item => {
    if (seen.has(item.fullName)) return false
    seen.add(item.fullName)
    return true
  })
}

// 洗牌
function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    var idx = Math.floor(Math.random() * (i + 1))
    var tmp = a[i]
    a[i] = a[idx]
    a[idx] = tmp
  }
  return a
}

/**
 * 核心起名函数
 * @param {object} params
 * @param {string} params.surname - 姓氏
 * @param {string} params.gender - 性别: male / female / any
 * @param {string} params.zodiacName - 生肖名
 * @param {string} params.length - 名字长度: single / double
 * @param {string} params.style - 风格: 文雅 / 大气 / 温和 / 智慧 / random
 * @param {number} params.count - 推荐数量
 * @returns {Array} 名字列表
 */
export function generateNames({ surname, gender = 'any', zodiacName, length = 'double', style = 'random', count = 12 } = {}) {
  const zodiac = zodiacData.zodiacs.find(z => z.name === zodiacName)
  if (!zodiac) return []

  const results = []

  // 获取候选字
  let maleChars = charactersData.male || []
  let femaleChars = charactersData.female || []

  // 按性别筛选
  let poolA = []
  let poolB = []

  if (gender === 'male') {
    poolA = filterByStyle(maleChars, style)
    poolB = filterByStyle(maleChars, style)
  } else if (gender === 'female') {
    poolA = filterByStyle(femaleChars, style)
    poolB = filterByStyle(femaleChars, style)
  } else {
    // any: 合并男女字库
    poolA = filterByStyle(maleChars.concat(femaleChars), style)
    poolB = filterByStyle(maleChars.concat(femaleChars), style)
  }

  if (poolA.length === 0 || poolB.length === 0) return []

  if (length === 'single') {
    // 单字名
    poolA.forEach(charA => {
      const item = generateSingleCharName(surname, charA)
      item.score = calculateScore(item, zodiac)
      item.zodiacName = zodiac.name
      item.zodiacIcon = zodiac.icon
      item.zodiacDesc = zodiac.description
      item.favorableRadicals = zodiac.favorableRadicals
      item.avoidRadicals = zodiac.avoidRadicals
      results.push(item)
    })
  } else {
    // 双字名
    poolA.forEach(charA => {
      poolB.forEach(charB => {
        // 两个字不能相同
        if (charA.char === charB.char) return
        const item = generateTwoCharName(surname, charA, charB)
        item.score = calculateScore(item, zodiac)
        item.zodiacName = zodiac.name
        item.zodiacIcon = zodiac.icon
        item.zodiacDesc = zodiac.description
        item.favorableRadicals = zodiac.favorableRadicals
        item.avoidRadicals = zodiac.avoidRadicals
        results.push(item)
      })
    })
  }

  // 按分数排序
  results.sort((a, b) => b.score - a.score)

  // 去重
  const deduped = deduplicate(results)

  // 随机抽取推荐数量
  const shuffled = shuffle(deduped)
  return shuffled.slice(0, count)
}

// 根据出生年份推算生肖
export function getZodiacByYear(year) {
  const zodiacs = zodiacData.zodiacs
  const yearNum = Number(year)
  if (isNaN(yearNum)) return null
  for (const z of zodiacs) {
    if (z.years.split(',').map(Number).includes(yearNum)) {
      return z.name
    }
  }
  // fallback: 用 12 周期推算（1900=鼠）
  const offset = (yearNum - 1900) % 12
  return zodiacs[(offset + 12) % 12].name
}

// 五行相生说明
export function getElementRelation(elementA, elementB) {
  if (!elementA || !elementB) return '—'
  if (elementA === elementB) return '同气，相辅相成'
  if (ELEMENT_HARMONY[elementA]) {
    // 检查 B 是否是 A 生的五行
    const generatedOrder = ['金', '水', '木', '火', '土']
    const idxA = generatedOrder.indexOf(elementA)
    const idxB = generatedOrder.indexOf(elementB)
    if (idxA !== -1 && idxB !== -1) {
      if ((idxA + 1) % 5 === idxB) return `${elementA}生${elementB}，相生吉利`
      if ((idxB + 1) % 5 === idxA) return `${elementB}生${elementA}，相生吉利`
    }
  }
  return '五行互补'
}

// 生肖匹配说明
export function getZodiacMatchDesc(nameItem) {
  const rad = nameItem.radicals || []
  const fav = nameItem.favorableRadicals || []
  const matched = rad.filter(r => fav.includes(r))
  if (matched.length > 0) {
    return `名字含宜用字根「${matched.join('、')}」，与「${nameItem.zodiacName}」生肖匹配度${nameItem.score >= 70 ? '极高' : nameItem.score >= 50 ? '较高' : '中等'}`
  }
  return `名字与「${nameItem.zodiacName}」生肖匹配度${nameItem.score >= 50 ? '较好' : '一般'}，可结合八字综合参考`
}
