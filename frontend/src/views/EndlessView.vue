<template>
  <div class="game-container">
    <button class="home-btn" @click="goHome">🏠 返回首页</button>
    
    <div class="header">
      <h1>♾️ 无尽挑战模式 <span v-if="hasApiKey" class="ai-badge">🤖 AI 生成</span></h1>
      <div class="stats">
        <div class="stat">
          <span class="stat-icon">⭐</span>
          <span>分数: <span>{{ gameStore.score }}</span></span>
        </div>
        <div class="stat">
          <span class="stat-icon">💪</span>
          <span>难度: <span>{{ gameStore.currentDifficulty }}</span>/6</span>
        </div>
        <div class="stat">
          <span class="stat-icon">❤️</span>
          <span>生命: <span>{{ '❤️'.repeat(gameStore.lives) }}{{ '🖤'.repeat(Math.max(0, 3 - gameStore.lives)) }}</span></span>
        </div>
        <div class="stat">
          <span class="stat-icon">🔥</span>
          <span>连击: <span>{{ gameStore.combo }}</span></span>
        </div>
        <div class="stat">
          <span class="stat-icon">📝</span>
          <span>已答: <span>{{ gameStore.endlessQuestionCount }}</span> 题</span>
        </div>
      </div>
    </div>

    <div class="game-screen" v-if="!isGameOver">
      <div v-if="isLoading" class="loading-area">
        <div class="spinner"></div>
        <p>{{ loadingText }}</p>
        <p class="loading-sub">题目绝不重复，难度随连击递增喵~</p>
      </div>

      <template v-else-if="currentQuestion">
        <div class="level-info">
          <span class="level-badge">无尽挑战 · 难度 {{ gameStore.currentDifficulty }}/6</span>
          <span v-if="currentQuestion.fromAI" class="ai-tag">🤖 AI 生成</span>
          <span v-else class="local-tag">📚 题库</span>
        </div>

        <div class="question-box">
          <div class="question-number">第 {{ gameStore.endlessQuestionCount + 1 }} 题</div>
          <div class="question-text">{{ currentQuestion.question }}</div>
        </div>

        <div class="options">
          <div 
            v-for="(option, index) in currentQuestion.options" 
            :key="index"
            :class="optionClass(index)"
            :style="{ pointerEvents: selectedOption !== null ? 'none' : 'auto' }"
            @click="selectOption(index)"
          >
            <span class="option-label">{{ String.fromCharCode(65 + index) }}.</span>
            <span>{{ option }}</span>
            <span v-if="selectedOption === index && isCorrect" class="option-check">✅</span>
            <span v-if="selectedOption === index && !isCorrect" class="option-check">❌</span>
          </div>
        </div>

        <transition name="fade">
          <div v-if="selectedOption !== null" :class="['feedback', isCorrect ? 'feedback-correct' : 'feedback-wrong']">
            {{ feedbackText }}
          </div>
        </transition>

        <transition name="slide">
          <div v-if="selectedOption !== null" class="explanation-box">
            <strong>💡 解析：</strong>{{ currentQuestion.explanation }}
          </div>
        </transition>

        <transition name="fade">
          <button v-if="selectedOption !== null" class="next-btn" @click="nextQuestion">
            下一题 ➤
          </button>
        </transition>
      </template>
    </div>

    <div class="game-over" v-else>
      <h2>{{ gameStore.lives <= 0 ? '💔 挑战结束' : '🎉 精彩！' }}</h2>
      <div class="final-stats">
        <div class="final-stat">🌟 最终得分: <strong>{{ gameStore.score }}</strong></div>
        <div class="final-stat">✅ 答对题目: <strong>{{ gameStore.totalCorrect }}</strong></div>
        <div class="final-stat">🔥 最高连击: <strong>{{ gameStore.maxCombo }}</strong></div>
        <div class="final-stat">📝 答题数量: <strong>{{ gameStore.endlessQuestionCount }}</strong></div>
        <div class="final-stat">💪 最终难度: <strong>{{ gameStore.currentDifficulty }}/6</strong></div>
      </div>
      <div class="game-over-buttons">
        <button class="btn" @click="restart">🔁 再来一局</button>
        <button class="btn btn-secondary" @click="goHome">🏠 返回首页</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'

const router = useRouter()
const gameStore = useGameStore()

const selectedOption = ref(null)
const isCorrect = ref(false)
const feedbackText = ref('')
const isLoading = ref(false)
const loadingText = ref('正在生成题目...')
const isGameOver = ref(false)
const currentQuestion = ref(null)
const usedQuestionHashes = ref([])
const consecutiveCorrect = ref(0)

const hasApiKey = computed(() => {
  const key = localStorage.getItem('deepseek_api_key')
  return !!(key && key.trim())
})

onMounted(() => {
  gameStore.startEndlessMode()
  loadNextQuestion()
})

async function loadNextQuestion() {
  isLoading.value = true
  selectedOption.value = null
  feedbackText.value = ''

  const texts = ['🧠 AI 正在出题...', '📝 构思题目中...', '🔍 确保题目不重复...', '✨ 即将生成新题...']
  loadingText.value = texts[Math.floor(Math.random() * texts.length)]

  try {
    const apiKey = localStorage.getItem('deepseek_api_key') || ''

    const res = await fetch('/api/ai/generate-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey,
        difficulty: gameStore.currentDifficulty,
        usedQuestionHashes: usedQuestionHashes.value
      })
    })

    if (res.ok) {
      const question = await res.json()
      if (question.question && question.options) {
        const hash = simpleHash(question.question)
        if (!usedQuestionHashes.value.includes(hash)) {
          usedQuestionHashes.value.push(hash)
        }
        currentQuestion.value = question
      } else {
        throw new Error('题目格式错误')
      }
    } else {
      throw new Error('接口返回错误')
    }
  } catch (err) {
    console.error('获取题目失败:', err)
    currentQuestion.value = {
      question: 'Java中，InputStream 的 read() 方法返回 -1 表示什么？',
      options: ['读取错误', '文件结束（EOF）', '读取超时', '缓冲区为空'],
      correct: 1,
      explanation: 'read() 方法返回 -1 表示已到达输入流的末尾（EOF，End of File）。这是一个经典的 Java I/O 面试题喵~',
      fromAI: false
    }
    const hash = simpleHash(currentQuestion.value.question)
    if (!usedQuestionHashes.value.includes(hash)) {
      usedQuestionHashes.value.push(hash)
    }
  } finally {
    isLoading.value = false
  }
}

function simpleHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return 'q' + Math.abs(hash).toString(36)
}

function optionClass(index) {
  if (selectedOption.value === null) return 'option'
  if (index === currentQuestion.value.correct) return 'option option-correct'
  if (index === selectedOption.value) return 'option option-wrong'
  return 'option option-dimmed'
}

function selectOption(index) {
  if (selectedOption.value !== null) return

  selectedOption.value = index
  const correct = index === currentQuestion.value.correct
  isCorrect.value = correct

  if (correct) {
    consecutiveCorrect.value++
    feedbackText.value = '🎉 回答正确！太棒了喵~'
  } else {
    consecutiveCorrect.value = 0
    feedbackText.value = `❌ 回答错误！正确答案是 ${String.fromCharCode(65 + currentQuestion.value.correct)}`
  }

  gameStore.answerQuestion(correct)

  const newDifficulty = Math.floor(consecutiveCorrect.value / 3) + 1
  gameStore.currentDifficulty = Math.min(newDifficulty, 6)

  if (gameStore.lives <= 0) {
    setTimeout(() => {
      isGameOver.value = true
    }, 1200)
  }
}

function nextQuestion() {
  gameStore.nextQuestion()
  loadNextQuestion()
}

function restart() {
  gameStore.startEndlessMode()
  usedQuestionHashes.value = []
  consecutiveCorrect.value = 0
  isGameOver.value = false
  selectedOption.value = null
  feedbackText.value = ''
  loadNextQuestion()
}

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.game-container {
  background: rgba(255, 255, 255, 0.97);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 800px;
  width: 100%;
  overflow: hidden;
  position: relative;
  margin: 20px auto;
}

.home-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.95);
  color: #667eea;
  border: 2px solid #667eea;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9em;
  z-index: 100;
}

.home-btn:hover {
  background: #667eea;
  color: white;
}

.header {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 25px;
  text-align: center;
}

.header h1 {
  font-size: 1.8em;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.ai-badge {
  background: rgba(255,255,255,0.2);
  padding: 3px 12px;
  border-radius: 12px;
  font-size: 0.5em;
  vertical-align: middle;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 1em;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-icon { font-size: 1.2em; }

.game-screen {
  padding: 30px;
}

.loading-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 30px;
}

.spinner {
  width: 44px;
  height: 44px;
  border: 4px solid #fce7f3;
  border-top-color: #f5576c;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin { to { transform: rotate(360deg); } }

.loading-area p {
  color: #f5576c;
  font-size: 1.15em;
  font-weight: bold;
}

.loading-sub {
  font-size: 0.9em !important;
  color: #999 !important;
  font-weight: normal !important;
  margin-top: 8px;
}

.level-info {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.level-badge {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 7px 18px;
  border-radius: 18px;
  font-size: 0.9em;
}

.ai-tag {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  color: #fff;
  padding: 5px 14px;
  border-radius: 14px;
  font-size: 0.82em;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.local-tag {
  background: #fce7f3;
  color: #f5576c;
  padding: 5px 14px;
  border-radius: 14px;
  font-size: 0.82em;
}

.question-box {
  background: #fdf2f8;
  padding: 25px;
  border-radius: 15px;
  margin-bottom: 25px;
  border-left: 4px solid #f5576c;
}

.question-number {
  color: #f5576c;
  font-weight: bold;
  font-size: 0.95em;
  margin-bottom: 15px;
}

.question-text {
  font-size: 1.25em;
  color: #333;
  line-height: 1.6;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  background: white;
  border: 2px solid #e0e6f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.option:hover { border-color: #f5576c; background: #fdf2f8; }

.option-correct {
  border-color: #00cc66 !important;
  background: #e6fff0 !important;
}

.option-wrong {
  border-color: #ff4444 !important;
  background: #ffeaea !important;
}

.option-dimmed { opacity: 0.5; }

.option-label {
  font-weight: bold;
  color: #667eea;
  margin-right: 10px;
  min-width: 25px;
}

.option-check { margin-left: auto; font-size: 1.1em; }

.feedback {
  text-align: center;
  padding: 15px;
  margin: 20px 0;
  border-radius: 12px;
  font-size: 1.2em;
  font-weight: bold;
}

.feedback-correct { background: #e6fff0; color: #00aa55; }
.feedback-wrong { background: #ffeaea; color: #e33; }

.explanation-box {
  background: #f0f9ff;
  padding: 18px;
  border-radius: 12px;
  color: #333;
  line-height: 1.6;
  border-left: 3px solid #667eea;
  margin-bottom: 20px;
}

.next-btn {
  display: block;
  width: 100%;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 25px;
  font-size: 1.15em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.next-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(245, 87, 108, 0.4);
}

.fade-enter-active { transition: opacity 0.4s ease; }
.fade-enter-from { opacity: 0; }

.slide-enter-active { transition: all 0.4s ease; }
.slide-enter-from { opacity: 0; transform: translateY(10px); }

.game-over {
  text-align: center;
  padding: 50px;
}

.game-over h2 {
  font-size: 2.2em;
  color: #f5576c;
  margin-bottom: 20px;
}

.final-stats {
  margin-bottom: 30px;
}

.final-stat {
  font-size: 1.15em;
  color: #333;
  margin-bottom: 8px;
}

.final-stat strong {
  color: #f5576c;
}

.game-over-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  padding: 13px 35px;
  border-radius: 25px;
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(245, 87, 108, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
