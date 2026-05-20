<template>
  <div class="home-container">
    <div class="game-container">
      <div class="header">
      <h1>🎮 Java 学习闯关游戏</h1>
      <p class="subtitle">系统化学习 Java 开发，从基础到高级全掌握！</p>
        <div class="stats">
          <div class="stat">
            <span class="stat-icon">⭐</span>
            <span>分数: <span>{{ gameStore.score }}</span></span>
          </div>
          <div class="stat">
            <span class="stat-icon">🏆</span>
            <span>模块: <span>{{ gameStore.currentModule + 1 }}</span>/{{ gameStore.knowledgeModules.length }}</span>
          </div>
          <div class="stat">
            <span class="stat-icon">❤️</span>
            <span>生命: <span>{{ gameStore.lives }}</span></span>
          </div>
        </div>
      </div>

      <div class="start-screen">
        <h2>🎮 选择学习模块</h2>
        <p>每个模块包含多个关卡，完成所有关卡解锁成就！</p>

        <div class="modules-grid">
          <div 
            v-for="(module, moduleIndex) in gameStore.knowledgeModules" 
            :key="module.id"
            class="module-card"
            :style="{ '--module-color': module.color }"
            @click="selectModule(moduleIndex)"
          >
            <div class="module-icon">{{ module.icon }}</div>
            <h3>{{ module.name.split(' ')[1] }}</h3>
            <p class="module-desc">{{ module.description }}</p>
            <div class="module-levels">
              <span class="levels-count">{{ module.levels.length }} 个关卡</span>
            </div>
          </div>
        </div>

        <div class="btn-group">
          <button class="btn btn-endless" @click="goToEndless">♾️ 无尽挑战</button>
          <button class="btn btn-mindmap" @click="goToMindmap">📚 知识导图</button>
          <button class="btn btn-ai" @click="goToAiAssistant">🤖 AI 助手</button>
        </div>

        <div class="achievements-panel">
          <div class="achievements-title">🏅 成就系统</div>
          <div class="achievements-grid">
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

        <div v-if="selectedModule !== null" class="module-modal" @click="selectedModule = null">
          <div class="modal-content" @click.stop>
            <div class="modal-header" :style="{ background: gameStore.knowledgeModules[selectedModule].color }">
              <span class="modal-icon">{{ gameStore.knowledgeModules[selectedModule].icon }}</span>
              <h3>{{ gameStore.knowledgeModules[selectedModule].name }}</h3>
              <span class="close-btn" @click="selectedModule = null">×</span>
            </div>
            <div class="modal-body">
              <p>{{ gameStore.knowledgeModules[selectedModule].description }}</p>
              <div class="levels-list">
                <h4>关卡列表:</h4>
                <div 
                  v-for="(level, levelIndex) in gameStore.knowledgeModules[selectedModule].levels" 
                  :key="level.id"
                  class="level-item"
                  @click="startLevel(selectedModule, levelIndex)"
                >
                  <span class="level-number">{{ level.id }}</span>
                  <span class="level-name">{{ level.name }}</span>
                  <span class="question-count">{{ level.questions.length }} 题</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'

const router = useRouter()
const gameStore = useGameStore()
const selectedModule = ref(null)

onMounted(() => {
  gameStore.loadAchievements()
})

function selectModule(moduleIndex) {
  selectedModule.value = moduleIndex
}

function startLevel(moduleIndex, levelIndex) {
  gameStore.startGame(moduleIndex, levelIndex)
  router.push(`/game/${moduleIndex}/${levelIndex}`)
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
  max-width: 1000px;
  width: 100%;
  overflow: hidden;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  text-align: center;
}

.header h1 {
  font-size: 2.2em;
  margin-bottom: 8px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.header .subtitle {
  font-size: 1.1em;
  opacity: 0.9;
  margin-bottom: 15px;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  font-size: 1.1em;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-icon {
  font-size: 1.3em;
}

.start-screen {
  text-align: center;
  padding: 40px;
  position: relative;
}

.start-screen h2 {
  color: #333;
  font-size: 1.8em;
  margin-bottom: 15px;
}

.start-screen p {
  color: #666;
  font-size: 1.1em;
  margin-bottom: 30px;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.module-card {
  background: white;
  border-radius: 15px;
  padding: 25px 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.module-card:hover {
  transform: translateY(-8px);
  border-color: var(--module-color);
  box-shadow: 0 12px 30px rgba(0,0,0,0.15);
}

.module-icon {
  font-size: 3em;
  margin-bottom: 12px;
}

.module-card h3 {
  font-size: 1.15em;
  color: #333;
  margin-bottom: 8px;
}

.module-desc {
  font-size: 0.85em;
  color: #666;
  margin-bottom: 12px;
  min-height: 40px;
}

.module-levels {
  background: rgba(0,0,0,0.05);
  padding: 6px 12px;
  border-radius: 20px;
  display: inline-block;
}

.levels-count {
  font-size: 0.85em;
  color: #555;
}

.btn-group {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.btn {
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 25px;
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.btn-endless {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.btn-mindmap {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.btn-ai {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.achievements-panel {
  margin-top: 20px;
  padding: 25px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 15px;
}

.achievements-title {
  font-size: 1.3em;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 20px;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.achievement {
  display: flex;
  gap: 10px;
  padding: 12px;
  background: white;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.achievement.unlocked {
  border-color: #10b981;
  background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
}

.achievement.locked {
  opacity: 0.5;
}

.achievement-icon {
  font-size: 1.6em;
}

.achievement-info {
  flex: 1;
  text-align: left;
}

.achievement-name {
  font-weight: bold;
  color: #333;
  font-size: 0.85em;
}

.achievement-desc {
  color: #666;
  font-size: 0.75em;
  margin-top: 3px;
}

.module-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 500px;
  width: 90%;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.modal-header {
  color: white;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
}

.modal-icon {
  font-size: 2.5em;
}

.modal-header h3 {
  font-size: 1.4em;
  margin: 0;
}

.close-btn {
  position: absolute;
  right: 20px;
  font-size: 2em;
  cursor: pointer;
  opacity: 0.8;
}

.close-btn:hover {
  opacity: 1;
}

.modal-body {
  padding: 25px;
}

.modal-body p {
  color: #666;
  font-size: 1.1em;
  margin-bottom: 20px;
}

.levels-list h4 {
  color: #333;
  margin-bottom: 15px;
}

.level-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8fafc;
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.level-item:hover {
  background: #e2e8f0;
  transform: translateX(5px);
}

.level-number {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.level-name {
  flex: 1;
  font-weight: 600;
  color: #333;
}

.question-count {
  color: #666;
  font-size: 0.9em;
}

@media (max-width: 900px) {
  .modules-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .achievements-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .modules-grid {
    grid-template-columns: 1fr;
  }
  
  .achievements-grid {
    grid-template-columns: 1fr;
  }
  
  .stats {
    gap: 20px;
  }
  
  .header h1 {
    font-size: 1.8em;
  }
}
</style>