<template>
  <div class="game-container">
    <button class="home-btn" @click="goHome">🏠 返回首页</button>
    
    <div class="header">
      <h1>♾️ 无尽挑战模式</h1>
      <div class="stats">
        <div class="stat">
          <span class="stat-icon">⭐</span>
          <span>分数: <span>{{ gameStore.score }}</span></span>
        </div>
        <div class="stat">
          <span class="stat-icon">💪</span>
          <span>难度: <span>{{ gameStore.currentDifficulty }}</span></span>
        </div>
        <div class="stat">
          <span class="stat-icon">❤️</span>
          <span>生命: <span>{{ gameStore.lives }}</span></span>
        </div>
        <div class="stat">
          <span class="stat-icon">🔥</span>
          <span>连击: <span>{{ gameStore.combo }}</span></span>
        </div>
        <div class="stat">
          <span class="stat-icon">📝</span>
          <span>题目: <span>{{ gameStore.endlessQuestionCount }}</span></span>
        </div>
      </div>
    </div>

    <div class="game-screen" v-if="!isGameOver">
      <div v-if="isLoading" class="loading-indicator">
        <div class="spinner"></div>
        <span>正在生成题目...</span>
      </div>

      <template v-else-if="currentQuestion">
        <div class="level-info">
          <span class="level-badge">无尽挑战 - 难度 {{ gameStore.currentDifficulty }}</span>
        </div>

        <div class="question-box">
          <div class="question-number">问题 {{ gameStore.endlessQuestionCount + 1 }}</div>
          <div class="question-text">{{ currentQuestion.question }}</div>
        </div>

        <div class="options">
          <div 
            v-for="(option, index) in currentQuestion.options" 
            :key="index"
            :class="['option', selectedOption === index ? (isCorrect ? 'correct' : 'wrong') : '']"
            :style="{ pointerEvents: selectedOption !== null ? 'none' : 'auto' }"
            @click="selectOption(index)"
          >
            <span class="option-label">{{ String.fromCharCode(65 + index) }}.</span>
            <span>{{ option }}</span>
          </div>
        </div>

        <div :class="['feedback', selectedOption !== null ? (isCorrect ? 'correct' : 'wrong') : '']">
          {{ feedbackText }}
        </div>

        <div class="explanation" :class="{ show: selectedOption !== null }">
          <strong>解析：</strong>{{ currentQuestion.explanation }}
        </div>

        <button class="btn" :class="{ show: selectedOption !== null }" @click="nextQuestion">
          下一题
        </button>
      </template>
    </div>

    <div class="game-over" v-else>
      <h2>💔 游戏结束</h2>
      <div class="final-stats">
        <div class="final-stat">最终得分: {{ gameStore.score }}</div>
        <div class="final-stat">答对题目: {{ gameStore.totalCorrect }}</div>
        <div class="final-stat">最高连击: {{ gameStore.maxCombo }}</div>
        <div class="final-stat">答题数量: {{ gameStore.endlessQuestionCount }}</div>
      </div>
      <button class="btn" @click="restart">再来一局</button>
      <button class="btn btn-secondary" @click="goHome">返回首页</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'

const router = useRouter()
const gameStore = useGameStore()

const selectedOption = ref(null)
const isCorrect = ref(false)
const feedbackText = ref('')
const isLoading = ref(false)
const isGameOver = ref(false)
const currentQuestion = ref(null)

const fallbackQuestions = [
  {
    question: 'Java中，以下哪个类是所有字节输入流的抽象基类？',
    options: ['OutputStream', 'InputStream', 'Reader', 'Writer'],
    correct: 1,
    explanation: 'InputStream 是所有字节输入流的抽象基类，OutputStream 是字节输出流基类，Reader/Writer 是字符流基类。'
  },
  {
    question: 'BufferedReader的readLine()方法返回什么？',
    options: ['字节', '字符', '字符串', '整数'],
    correct: 2,
    explanation: 'readLine()方法读取一行文本并返回字符串，到达文件末尾时返回null。'
  },
  {
    question: 'Java NIO中，flip()方法的作用是什么？',
    options: ['翻转缓冲区', '切换到读模式', '清空缓冲区', '写入数据'],
    correct: 1,
    explanation: 'flip()方法将缓冲区从写模式切换到读模式，设置limit=position，position=0。'
  },
  {
    question: 'try-with-resources语句的优势是什么？',
    options: ['代码更短', '自动关闭资源', '运行更快', '占用内存更少'],
    correct: 1,
    explanation: 'try-with-resources会自动关闭实现AutoCloseable接口的资源，即使发生异常也能正确关闭。'
  },
  {
    question: '以下哪个类用于对象序列化？',
    options: ['FileOutputStream', 'ObjectOutputStream', 'DataOutputStream', 'BufferedOutputStream'],
    correct: 1,
    explanation: 'ObjectOutputStream用于将Java对象序列化并写入输出流。'
  }
]

onMounted(() => {
  loadNextQuestion()
})

async function loadNextQuestion() {
  isLoading.value = true
  selectedOption.value = null
  
  try {
    // 尝试从后端获取题目
    const response = await fetch('/api/questions/random', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ difficulty: gameStore.currentDifficulty })
    })
    
    if (response.ok) {
      currentQuestion.value = await response.json()
    } else {
      // 使用本地备用题目
      currentQuestion.value = getRandomFallbackQuestion()
    }
  } catch (error) {
    // 使用本地备用题目
    currentQuestion.value = getRandomFallbackQuestion()
  } finally {
    isLoading.value = false
  }
}

function getRandomFallbackQuestion() {
  const index = Math.floor(Math.random() * fallbackQuestions.length)
  return fallbackQuestions[index]
}

function selectOption(index) {
  if (selectedOption.value !== null) return
  
  selectedOption.value = index
  isCorrect.value = index === currentQuestion.value.correct
  
  gameStore.answerQuestion(isCorrect.value)
  
  if (isCorrect.value) {
    feedbackText.value = '🎉 回答正确！'
  } else {
    feedbackText.value = `❌ 回答错误！正确答案是 ${String.fromCharCode(65 + currentQuestion.value.correct)}`
  }
  
  if (gameStore.lives <= 0) {
    setTimeout(() => {
      isGameOver.value = true
    }, 1000)
  }
}

function nextQuestion() {
  gameStore.nextQuestion()
  loadNextQuestion()
  feedbackText.value = ''
}

function restart() {
  gameStore.startEndlessMode()
  isGameOver.value = false
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
}

.home-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.95);
  color: #0066cc;
  border: 2px solid #0066cc;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9em;
  z-index: 100;
}

.home-btn:hover {
  background: #0066cc;
  color: white;
}

.header {
  background: linear-gradient(135deg, #ff6600 0%, #cc5200 100%);
  color: white;
  padding: 25px;
  text-align: center;
}

.header h1 {
  font-size: 1.8em;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
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

.stat-icon {
  font-size: 1.2em;
}

.game-screen {
  padding: 30px;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #cce0ff;
  border-top-color: #0066cc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-indicator span {
  color: #0066cc;
  font-size: 1.1em;
  margin-top: 15px;
}

.level-info {
  margin-bottom: 20px;
}

.level-badge {
  background: linear-gradient(135deg, #ff6600 0%, #cc5200 100%);
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.9em;
}

.question-box {
  background: #f8fafc;
  padding: 25px;
  border-radius: 15px;
  margin-bottom: 25px;
}

.question-number {
  color: #ff6600;
  font-weight: bold;
  font-size: 0.95em;
  margin-bottom: 15px;
}

.question-text {
  font-size: 1.2em;
  color: #333;
  line-height: 1.6;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option {
  display: flex;
  align-items: flex-start;
  padding: 15px 20px;
  background: white;
  border: 2px solid #cce0ff;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option:hover {
  border-color: #ff6600;
  background: #fff8f0;
}

.option.correct {
  border-color: #00cc66;
  background: #e6fff0;
}

.option.wrong {
  border-color: #ff6666;
  background: #ffebee;
}

.option-label {
  font-weight: bold;
  color: #0066cc;
  margin-right: 10px;
  min-width: 25px;
}

.feedback {
  text-align: center;
  padding: 15px;
  margin: 20px 0;
  border-radius: 10px;
  font-size: 1.2em;
  font-weight: bold;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feedback.correct {
  background: #e6fff0;
  color: #00cc66;
  opacity: 1;
}

.feedback.wrong {
  background: #ffebee;
  color: #ff6666;
  opacity: 1;
}

.explanation {
  background: #f0f6ff;
  padding: 20px;
  border-radius: 10px;
  color: #333;
  line-height: 1.6;
  display: none;
}

.explanation.show {
  display: block;
}

.btn {
  display: none;
  background: linear-gradient(135deg, #ff6600 0%, #cc5200 100%);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 25px;
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 20px auto;
}

.btn.show {
  display: block;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(255, 102, 0, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #4a90d9 0%, #3a7bc8 100%);
}

.game-over {
  text-align: center;
  padding: 60px;
}

.game-over h2 {
  font-size: 2.5em;
  color: #ff6600;
  margin-bottom: 20px;
}

.final-stats {
  margin-bottom: 30px;
}

.final-stat {
  font-size: 1.2em;
  color: #333;
  margin-bottom: 10px;
}
</style>