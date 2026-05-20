<template>
  <div class="ai-page">
    <div class="ai-container">
      <button class="home-btn" @click="goHome">🏠 返回首页</button>

      <div class="chat-header">
        <h1>🤖 Java 全能学习助手</h1>
        <p>有问题随时问我喵~ 支持 Java 全知识点问答、代码生成和题目生成</p>
      </div>

      <div class="chat-body" ref="chatBody">
        <div v-for="(msg, i) in messages" :key="i" :class="['msg-wrapper', msg.role === 'user' ? 'msg-right' : 'msg-left']">
          <div :class="['msg-bubble', msg.role === 'user' ? 'bubble-user' : 'bubble-ai']">
            <div v-if="msg.role === 'assistant'" class="bubble-avatar">🐱</div>
            <div class="bubble-content" v-html="renderContent(msg.content)"></div>
          </div>
        </div>
        <div v-if="loading" class="msg-wrapper msg-left">
          <div class="msg-bubble bubble-ai">
            <div class="bubble-avatar">🐱</div>
            <div class="typing-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-footer">
        <div class="toolbar">
          <div class="role-group">
            <button
              v-for="r in roles"
              :key="r.id"
              :class="['role-btn', currentRole === r.id ? 'role-active' : '']"
              @click="currentRole = r.id"
              :title="r.desc"
            >
              {{ r.icon }} {{ r.label }}
            </button>
          </div>
          <button class="clear-btn" @click="clearChat">🗑 清空对话</button>
        </div>

        <div class="input-row">
          <textarea
            v-model="inputText"
            placeholder="输入你的问题，按 Enter 发送..."
            @keydown="onKeydown"
            :disabled="loading"
            rows="2"
            ref="inputEl"
          ></textarea>
          <button class="send-btn" :disabled="!inputText.trim() || loading" @click="send">
            发送
          </button>
        </div>

        <div class="api-row">
          <input
            type="password"
            v-model="apiKey"
            placeholder="输入 DeepSeek API 密钥（可选，不填也能用本地知识库）"
            class="api-input"
          />
          <button class="save-key-btn" @click="saveKey">💾 保存</button>
          <span v-if="keySaved" class="saved-tip">✅ 已保存</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const chatBody = ref(null)
const inputEl = ref(null)
const inputText = ref('')
const apiKey = ref('')
const keySaved = ref(false)
const loading = ref(false)
const currentRole = ref('general')
const messages = ref([])

const roles = [
  { id: 'general', label: '问答', icon: '💬', desc: 'Java全知识点问答' },
  { id: 'code', label: '代码', icon: '💻', desc: 'Java代码生成' },
  { id: 'question', label: '出题', icon: '📝', desc: '题目生成模式' },
  { id: 'javaExpert', label: '专家', icon: '🔧', desc: 'Java专家模式' }
]

onMounted(() => {
  const saved = localStorage.getItem('deepseek_api_key')
  if (saved) {
    apiKey.value = saved
    keySaved.value = true
  }

  messages.value.push({
    role: 'assistant',
    content: `你好！我是 **Java 全能学习助手**喵~ 🐱

我可以帮你解答以下方面的知识：
- 📚 **Java基础**（数据类型、运算符、流程控制）
- 🏠 **面向对象**（封装、继承、多态、接口）
- 📦 **集合框架**（List、Set、Map）
- ⚠️ **异常处理**（try-catch、自定义异常）
- 🧵 **多线程**（Thread、Runnable、并发工具）
- 💾 **Java I/O**（字节流、字符流、NIO）
- 🗄️ **数据库**（JDBC、SQL、连接池）
- 🌐 **网络编程**（Socket、HTTP、TCP/IP）

💡 **提示：** 在底部输入 DeepSeek API 密钥可获得更强大的 AI 回答！不填密钥也能使用本地知识库喵~`
  })
})

function onKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}

async function send() {
  const text = inputText.value.trim()
  if (!text || loading.value) return

  inputText.value = ''
  messages.value.push({ role: 'user', content: text })
  loading.value = true
  await scrollBottom()

  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: apiKey.value.trim(),
        message: text,
        role: currentRole.value
      })
    })

    const data = await res.json()
    messages.value.push({ role: 'assistant', content: data.reply || '（无响应）' })
  } catch (err) {
    messages.value.push({ role: 'assistant', content: `❌ 网络请求失败：${err.message}\n请检查后端服务是否启动喵~` })
  } finally {
    loading.value = false
    await scrollBottom()
  }
}

function saveKey() {
  const key = apiKey.value.trim()
  if (key) {
    localStorage.setItem('deepseek_api_key', key)
    keySaved.value = true
    setTimeout(() => { keySaved.value = false }, 2000)
  }
}

function clearChat() {
  messages.value = [{
    role: 'assistant',
    content: '对话已清空喵~ 有什么想问的吗？'
  }]
}

function renderContent(text) {
  if (!text) return ''
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  html = html.replace(/```(\w+)?\n?([\s\S]*?)```/g, (_, lang, code) => {
    return '<pre><code>' + code.trim() + '</code></pre>'
  })

  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  html = html.replace(/\n/g, '<br>')

  return html
}

async function scrollBottom() {
  await nextTick()
  if (chatBody.value) {
    chatBody.value.scrollTop = chatBody.value.scrollHeight
  }
}

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.ai-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.ai-container {
  background: rgba(255, 255, 255, 0.97);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 850px;
  width: 100%;
  height: 92vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.home-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  background: rgba(255, 255, 255, 0.9);
  color: #0066cc;
  border: 2px solid #0066cc;
  padding: 7px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.85em;
  transition: all 0.3s;
  z-index: 10;
}

.home-btn:hover {
  background: #0066cc;
  color: #fff;
}

.chat-header {
  background: linear-gradient(135deg, #0066cc 0%, #003d99 100%);
  color: #fff;
  padding: 20px 25px;
  text-align: center;
  flex-shrink: 0;
}

.chat-header h1 {
  font-size: 1.5em;
  margin-bottom: 5px;
}

.chat-header p {
  opacity: 0.85;
  font-size: 0.9em;
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: #f5f7fa;
}

.msg-wrapper {
  display: flex;
}

.msg-left { justify-content: flex-start; }
.msg-right { justify-content: flex-end; }

.msg-bubble {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 16px;
  line-height: 1.6;
  display: flex;
  gap: 10px;
  word-break: break-word;
}

.bubble-user {
  background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.bubble-ai {
  background: #fff;
  color: #333;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.bubble-avatar {
  font-size: 1.3em;
  flex-shrink: 0;
}

.bubble-content {
  font-size: 0.93em;
}

.bubble-content :deep(pre) {
  background: #1e1e2e;
  color: #cdd6f4;
  padding: 14px;
  border-radius: 10px;
  overflow-x: auto;
  margin: 8px 0;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 0.88em;
  line-height: 1.5;
}

.bubble-content :deep(code) {
  background: #e0e6ff;
  color: #004499;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 0.9em;
}

.bubble-content :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
}

.bubble-content :deep(strong) {
  color: #0066cc;
}

.bubble-content :deep(table) {
  border-collapse: collapse;
  margin: 8px 0;
  width: 100%;
}

.bubble-content :deep(th),
.bubble-content :deep(td) {
  border: 1px solid #cce0ff;
  padding: 6px 10px;
  text-align: left;
  font-size: 0.88em;
}

.bubble-content :deep(th) {
  background: #e6f0ff;
}

.typing-dots {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 4px 0;
}

.typing-dots span {
  width: 7px;
  height: 7px;
  background: #0066cc;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { animation-delay: 0s; }
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 80%, 100% { opacity: 0.2; transform: translateY(0); }
  40% { opacity: 1; transform: translateY(-6px); }
}

.chat-footer {
  flex-shrink: 0;
  background: #fff;
  border-top: 1px solid #e0e6f0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid #f0f3f8;
}

.role-group {
  display: flex;
  gap: 4px;
}

.role-btn {
  padding: 5px 12px;
  border: 1.5px solid #cce0ff;
  background: #fff;
  border-radius: 15px;
  cursor: pointer;
  font-size: 0.82em;
  transition: all 0.2s;
}

.role-btn:hover {
  background: #e6f0ff;
}

.role-active {
  background: #0066cc;
  color: #fff;
  border-color: #0066cc;
}

.clear-btn {
  padding: 5px 14px;
  border: none;
  background: transparent;
  color: #999;
  cursor: pointer;
  font-size: 0.82em;
  border-radius: 10px;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: #fee;
  color: #e55;
}

.input-row {
  display: flex;
  gap: 10px;
  padding: 12px 16px;
}

.input-row textarea {
  flex: 1;
  padding: 12px 15px;
  border: 1.5px solid #dde5f0;
  border-radius: 14px;
  resize: none;
  font-size: 0.93em;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}

.input-row textarea:focus {
  border-color: #0066cc;
}

.send-btn {
  background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 14px;
  cursor: pointer;
  font-size: 0.95em;
  transition: all 0.2s;
  white-space: nowrap;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0, 102, 204, 0.35);
}

.send-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.api-row {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 8px 16px 14px;
}

.api-input {
  flex: 1;
  padding: 8px 12px;
  border: 1.5px solid #e0e6f0;
  border-radius: 10px;
  font-size: 0.82em;
  outline: none;
}

.api-input:focus {
  border-color: #0066cc;
}

.save-key-btn {
  background: #e6f0ff;
  color: #0066cc;
  border: 1.5px solid #cce0ff;
  padding: 7px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.82em;
  transition: all 0.2s;
  white-space: nowrap;
}

.save-key-btn:hover {
  background: #0066cc;
  color: #fff;
}

.saved-tip {
  color: #00aa55;
  font-size: 0.82em;
  white-space: nowrap;
}
</style>
