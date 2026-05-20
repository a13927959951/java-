<template>
  <div class="game-container">
    <button class="home-btn" @click="goHome">🏠 返回首页</button>
    
    <div class="header">
      <h1>🚀 Java I/O 闯关挑战</h1>
      <div class="stats">
        <div class="stat">
          <span class="stat-icon">⭐</span>
          <span>分数: <span>{{ gameStore.score }}</span></span>
        </div>
        <div class="stat">
          <span class="stat-icon">🏆</span>
          <span>关卡: <span>{{ gameStore.currentLevel + 1 }}</span>/6</span>
        </div>
        <div class="stat">
          <span class="stat-icon">❤️</span>
          <span>生命: <span>{{ gameStore.lives }}</span></span>
        </div>
        <div class="stat">
          <span class="stat-icon">🔥</span>
          <span>连击: <span>{{ gameStore.combo }}</span></span>
        </div>
      </div>
    </div>

    <div class="game-screen" v-if="currentQuestionData">
      <div class="level-info">
        <span class="level-badge">{{ currentLevelData.name }}</span>
      </div>

      <div class="question-box">
        <div class="question-number">问题 {{ gameStore.currentQuestion + 1 }}/{{ currentLevelData.questions.length }}</div>
        <div class="question-text">{{ currentQuestionData.question }}</div>
        <div class="code-block" v-if="currentQuestionData.code">{{ currentQuestionData.code }}</div>
      </div>

      <div class="options">
        <div 
          v-for="(option, index) in currentQuestionData.options" 
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
        <strong>解析：</strong>{{ currentQuestionData.explanation }}
      </div>

      <button class="btn" :class="{ show: selectedOption !== null }" @click="handleNext">
        {{ isLastQuestion ? '下一关' : '下一题' }}
      </button>
    </div>

    <div class="game-over" v-else>
      <h2>🎉 恭喜通关！</h2>
      <div class="final-score">最终得分: {{ gameStore.score }}</div>
      <button class="btn" @click="goHome">返回首页</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGameStore } from '../stores/gameStore'

const router = useRouter()
const route = useRoute()
const gameStore = useGameStore()

const selectedOption = ref(null)
const isCorrect = ref(false)
const feedbackText = ref('')

const currentLevelData = computed(() => gameStore.currentLevelData)
const currentQuestionData = computed(() => gameStore.currentQuestionData)
const isLastQuestion = computed(() => {
  if (!currentLevelData.value) return false
  return gameStore.currentQuestion === currentLevelData.value.questions.length - 1
})

onMounted(() => {
  const levelId = parseInt(route.params.levelId) || 0
  if (levelId !== gameStore.currentLevel) {
    gameStore.startGame(levelId)
  }
})

function selectOption(index) {
  if (selectedOption.value !== null) return
  
  selectedOption.value = index
  isCorrect.value = index === currentQuestionData.value.correct
  
  gameStore.answerQuestion(isCorrect.value)
  
  if (isCorrect.value) {
    feedbackText.value = '🎉 回答正确！'
  } else {
    feedbackText.value = `❌ 回答错误！正确答案是 ${String.fromCharCode(65 + currentQuestionData.value.correct)}`
  }
  
  if (gameStore.lives <= 0) {
    setTimeout(() => {
      alert('游戏结束！')
      goHome()
    }, 1000)
  }
}

function handleNext() {
  if (isLastQuestion.value) {
    if (gameStore.currentLevel >= gameStore.levels.length - 1) {
      gameStore.unlockAchievement('allLevelsComplete')
      alert('恭喜你完成所有关卡！')
      goHome()
    } else {
      gameStore.currentLevel++
      gameStore.currentQuestion = 0
      selectedOption.value = null
      feedbackText.value = ''
    }
  } else {
    gameStore.nextQuestion()
    selectedOption.value = null
    feedbackText.value = ''
  }
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
  background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
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
  gap: 25px;
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

.level-info {
  margin-bottom: 20px;
}

.level-badge {
  background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
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
  color: #0066cc;
  font-weight: bold;
  font-size: 0.95em;
  margin-bottom: 15px;
}

.question-text {
  font-size: 1.2em;
  color: #333;
  line-height: 1.6;
}

.code-block {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 15px;
  border-radius: 10px;
  margin-top: 15px;
  font-family: 'Consolas', monospace;
  font-size: 0.9em;
  overflow-x: auto;
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
  border-color: #0066cc;
  background: #f0f6ff;
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
  background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
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
  box-shadow: 0 5px 20px rgba(0, 102, 204, 0.4);
}

.game-over {
  text-align: center;
  padding: 60px;
}

.game-over h2 {
  font-size: 2.5em;
  color: #0066cc;
  margin-bottom: 20px;
}

.final-score {
  font-size: 1.5em;
  color: #333;
  margin-bottom: 30px;
}
</style>