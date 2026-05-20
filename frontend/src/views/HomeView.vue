<template>
  <div class="home-container">
    <div class="game-container">
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
        </div>
      </div>

      <div class="start-screen">
        <h2>欢迎来到 Java I/O 闯关挑战！</h2>
        <p>这是一个帮助你学习 Java 输入输出机制的小游戏</p>
        <p>共有 <strong>6 个关卡</strong>，还有 <strong>无尽挑战模式</strong> 等你探索！</p>

        <div class="level-preview">
          <div 
            v-for="(level, index) in gameStore.levels" 
            :key="level.id"
            class="level-card"
            @click="goToLevel(index)"
          >
            <h3>{{ level.name.split('：')[0] }}</h3>
            <p>{{ level.name.split('：')[1] }}</p>
          </div>
        </div>

        <div class="btn-group">
          <button class="btn" @click="goToLevel(0)">🎯 开始挑战</button>
          <button class="btn btn-secondary" @click="goToEndless">♾️ 无尽挑战</button>
          <button class="btn btn-secondary" @click="goToMindmap">📚 知识导图</button>
          <button class="btn btn-secondary" @click="goToAiAssistant">🤖 AI 助手</button>
        </div>

        <div class="achievements-panel">
          <div class="achievements-title">🏅 成就系统</div>
          <div class="achievements-list">
            <div 
              v-for="achievement in gameStore.achievements" 
              :key="achievement.id"
              :class="['achievement', achievement.unlocked ? 'unlocked' : 'locked']"
            >
              <span class="achievement-icon">{{ achievement.unlocked ? achievement.icon : '🔒' }}</span>
              <div class="achievement-info">
                <div class="achievement-name">{{ achievement.name }}</div>
                <div class="achievement-desc">{{ achievement.desc }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'

const router = useRouter()
const gameStore = useGameStore()

onMounted(() => {
  gameStore.loadAchievements()
})

function goToLevel(levelIndex) {
  gameStore.startGame(levelIndex)
  router.push(`/game/${levelIndex}`)
}

function goToEndless() {
  gameStore.startEndlessMode()
  router.push('/endless')
}

function goToMindmap() {
  router.push('/mindmap')
}

function goToAiAssistant() {
  router.push('/ai-assistant')
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.game-container {
  background: rgba(255, 255, 255, 0.97);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 900px;
  width: 100%;
  overflow: hidden;
}

.header {
  background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
  color: white;
  padding: 25px;
  text-align: center;
}

.header h1 {
  font-size: 2em;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  font-size: 1.1em;
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

.start-screen {
  text-align: center;
  padding: 40px;
}

.start-screen h2 {
  color: #333;
  font-size: 1.8em;
  margin-bottom: 20px;
}

.start-screen p {
  color: #666;
  font-size: 1.1em;
  margin-bottom: 10px;
}

.level-preview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin: 30px 0;
}

.level-card {
  background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
  color: white;
  padding: 20px 15px;
  border-radius: 15px;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.level-card:hover {
  transform: translateY(-5px);
}

.level-card h3 {
  font-size: 1.1em;
  margin-bottom: 8px;
}

.level-card p {
  font-size: 0.85em;
  color: #cce0ff;
  margin: 0;
}

.btn-group {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
}

.btn {
  background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0, 102, 204, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #4a90d9 0%, #3a7bc8 100%);
}

.achievements-panel {
  margin-top: 30px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 15px;
}

.achievements-title {
  font-size: 1.2em;
  font-weight: bold;
  color: #0066cc;
  margin-bottom: 15px;
}

.achievements-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.achievement {
  display: flex;
  gap: 10px;
  padding: 10px;
  background: white;
  border-radius: 8px;
  border: 1px solid #cce0ff;
  transition: all 0.3s ease;
}

.achievement.unlocked {
  border-color: #00cc66;
  background: #e6fff0;
}

.achievement.locked {
  opacity: 0.6;
}

.achievement-icon {
  font-size: 1.8em;
}

.achievement-info {
  flex: 1;
}

.achievement-name {
  font-weight: bold;
  color: #333;
  font-size: 0.9em;
}

.achievement-desc {
  color: #666;
  font-size: 0.8em;
}

@media (max-width: 768px) {
  .level-preview {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .achievements-list {
    grid-template-columns: 1fr;
  }
  
  .stats {
    gap: 15px;
  }
}
</style>