<template>
  <div class="mindmap-container">
    <button class="home-btn" @click="goHome">🏠 返回首页</button>
    
    <div class="header">
      <h1>🗺️ Java I/O 知识导图</h1>
    </div>

    <div class="mindmap-content">
      <div class="mindmap-section">
        <div 
          class="mindmap-header" 
          :class="{ active: expandedSections.includes('byteStream') }"
          @click="toggleSection('byteStream')"
        >
          <span class="section-icon">📥</span>
          <span>1. 字节流体系</span>
          <span class="expand-icon">{{ expandedSections.includes('byteStream') ? '▼' : '▶' }}</span>
        </div>
        <div class="mindmap-details" v-show="expandedSections.includes('byteStream')">
          <p><strong>核心概念：</strong>以字节（8位）为单位进行读写，适合处理二进制数据（图片、视频、文件等）。</p>
          <div class="mindmap-subsection">
            <h4>InputStream（输入流基类）：</h4>
            <ul>
              <li><code>FileInputStream</code> - 文件输入流</li>
              <li><code>BufferedInputStream</code> - 缓冲输入流，提高效率</li>
              <li><code>ObjectInputStream</code> - 对象反序列化</li>
            </ul>
          </div>
          <div class="mindmap-subsection">
            <h4>OutputStream（输出流基类）：</h4>
            <ul>
              <li><code>FileOutputStream</code> - 文件输出流</li>
              <li><code>BufferedOutputStream</code> - 缓冲输出流</li>
              <li><code>ObjectOutputStream</code> - 对象序列化</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mindmap-section">
        <div 
          class="mindmap-header" 
          :class="{ active: expandedSections.includes('charStream') }"
          @click="toggleSection('charStream')"
        >
          <span class="section-icon">📝</span>
          <span>2. 字符流体系</span>
          <span class="expand-icon">{{ expandedSections.includes('charStream') ? '▼' : '▶' }}</span>
        </div>
        <div class="mindmap-details" v-show="expandedSections.includes('charStream')">
          <p><strong>核心概念：</strong>以字符（16位Unicode）为单位进行读写，适合处理文本数据，支持中文等多语言。</p>
          <div class="mindmap-subsection">
            <h4>Reader（输入流基类）：</h4>
            <ul>
              <li><code>FileReader</code> - 文件字符输入流</li>
              <li><code>BufferedReader</code> - 缓冲字符输入流，提供 readLine() 方法</li>
              <li><code>InputStreamReader</code> - 字节流转字符流的桥梁</li>
            </ul>
          </div>
          <div class="mindmap-subsection">
            <h4>Writer（输出流基类）：</h4>
            <ul>
              <li><code>FileWriter</code> - 文件字符输出流</li>
              <li><code>BufferedWriter</code> - 缓冲字符输出流</li>
              <li><code>OutputStreamWriter</code> - 字符流转字节流的桥梁</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mindmap-section">
        <div 
          class="mindmap-header" 
          :class="{ active: expandedSections.includes('bufferStream') }"
          @click="toggleSection('bufferStream')"
        >
          <span class="section-icon">⚡</span>
          <span>3. 缓冲流进阶</span>
          <span class="expand-icon">{{ expandedSections.includes('bufferStream') ? '▼' : '▶' }}</span>
        </div>
        <div class="mindmap-details" v-show="expandedSections.includes('bufferStream')">
          <p><strong>核心概念：</strong>通过缓冲区减少实际 I/O 操作次数，显著提高读写效率。</p>
          <div class="mindmap-subsection">
            <h4>缓冲流的工作原理：</h4>
            <ul>
              <li>数据先写入缓冲区，缓冲区满后再一次性写入目标</li>
              <li>默认缓冲区大小为 8KB</li>
              <li>可以通过 <code>flush()</code> 方法强制刷新缓冲区</li>
            </ul>
          </div>
          <div class="mindmap-subsection">
            <h4>常用缓冲流：</h4>
            <ul>
              <li><code>BufferedInputStream</code> - 缓冲字节输入流</li>
              <li><code>BufferedOutputStream</code> - 缓冲字节输出流</li>
              <li><code>BufferedReader</code> - 缓冲字符输入流</li>
              <li><code>BufferedWriter</code> - 缓冲字符输出流</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mindmap-section">
        <div 
          class="mindmap-header" 
          :class="{ active: expandedSections.includes('fileOperation') }"
          @click="toggleSection('fileOperation')"
        >
          <span class="section-icon">📁</span>
          <span>4. 文件操作</span>
          <span class="expand-icon">{{ expandedSections.includes('fileOperation') ? '▼' : '▶' }}</span>
        </div>
        <div class="mindmap-details" v-show="expandedSections.includes('fileOperation')">
          <p><strong>核心概念：</strong>Java 提供了丰富的文件操作类，支持文件的创建、读取、写入、删除等操作。</p>
          <div class="mindmap-subsection">
            <h4>File 类：</h4>
            <ul>
              <li><code>exists()</code> - 检查文件是否存在</li>
              <li><code>createNewFile()</code> - 创建新文件</li>
              <li><code>mkdir()</code> - 创建目录</li>
              <li><code>delete()</code> - 删除文件或目录</li>
            </ul>
          </div>
          <div class="mindmap-subsection">
            <h4>NIO Files 类（Java 7+）：</h4>
            <ul>
              <li><code>Files.copy()</code> - 复制文件</li>
              <li><code>Files.move()</code> - 移动文件</li>
              <li><code>Files.readAllLines()</code> - 读取所有行</li>
              <li><code>Files.write()</code> - 写入文件</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mindmap-section">
        <div 
          class="mindmap-header" 
          :class="{ active: expandedSections.includes('nio') }"
          @click="toggleSection('nio')"
        >
          <span class="section-icon">🚀</span>
          <span>5. NIO 新世界</span>
          <span class="expand-icon">{{ expandedSections.includes('nio') ? '▼' : '▶' }}</span>
        </div>
        <div class="mindmap-details" v-show="expandedSections.includes('nio')">
          <p><strong>核心概念：</strong>Java NIO（New I/O）提供了非阻塞 I/O 操作，适合高并发场景。</p>
          <div class="mindmap-subsection">
            <h4>三大核心组件：</h4>
            <ul>
              <li><strong>Channel（通道）</strong> - 双向数据传输通道</li>
              <li><strong>Buffer（缓冲区）</strong> - 数据容器，支持多种数据类型</li>
              <li><strong>Selector（选择器）</strong> - 多路复用，单线程管理多个通道</li>
            </ul>
          </div>
          <div class="mindmap-subsection">
            <h4>Buffer 常用方法：</h4>
            <ul>
              <li><code>flip()</code> - 切换到读模式</li>
              <li><code>clear()</code> - 清空缓冲区</li>
              <li><code>rewind()</code> - 重置位置</li>
              <li><code>remaining()</code> - 返回剩余元素数量</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mindmap-section">
        <div 
          class="mindmap-header" 
          :class="{ active: expandedSections.includes('resourceManagement') }"
          @click="toggleSection('resourceManagement')"
        >
          <span class="section-icon">🔒</span>
          <span>6. 资源管理</span>
          <span class="expand-icon">{{ expandedSections.includes('resourceManagement') ? '▼' : '▶' }}</span>
        </div>
        <div class="mindmap-details" v-show="expandedSections.includes('resourceManagement')">
          <p><strong>核心概念：</strong>正确管理 I/O 资源，避免资源泄漏。</p>
          <div class="mindmap-subsection">
            <h4>try-with-resources（Java 7+）：</h4>
            <p>自动关闭实现 <code>AutoCloseable</code> 接口的资源：</p>
            <pre>try (FileInputStream fis = new FileInputStream("test.txt")) {
    // 使用资源
} catch (IOException e) {
    // 异常处理
}</pre>
          </div>
          <div class="mindmap-subsection">
            <h4>序列化：</h4>
            <ul>
              <li>实现 <code>Serializable</code> 接口</li>
              <li><code>ObjectOutputStream</code> - 序列化对象</li>
              <li><code>ObjectInputStream</code> - 反序列化对象</li>
              <li><code>transient</code> 关键字 - 标记不序列化的字段</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button class="btn" @click="expandAll">展开全部</button>
      <button class="btn btn-secondary" @click="collapseAll">收起全部</button>
      <button class="btn btn-primary" @click="startQuiz">开始测验</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'

const router = useRouter()
const gameStore = useGameStore()

const expandedSections = ref(['byteStream'])

function toggleSection(section) {
  const index = expandedSections.value.indexOf(section)
  if (index === -1) {
    expandedSections.value.push(section)
  } else {
    expandedSections.value.splice(index, 1)
  }
}

function expandAll() {
  expandedSections.value = ['byteStream', 'charStream', 'bufferStream', 'fileOperation', 'nio', 'resourceManagement']
}

function collapseAll() {
  expandedSections.value = []
}

function startQuiz() {
  gameStore.toggleMindmap()
  gameStore.startGame(0)
  router.push('/game/0')
}

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.mindmap-container {
  background: rgba(255, 255, 255, 0.97);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 900px;
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
  margin-bottom: 10px;
}

.mindmap-content {
  padding: 30px;
}

.mindmap-section {
  margin-bottom: 15px;
  border: 1px solid #cce0ff;
  border-radius: 12px;
  overflow: hidden;
}

.mindmap-header {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mindmap-header:hover {
  background: linear-gradient(135deg, #0055bb 0%, #003388 100%);
}

.mindmap-header.active {
  background: linear-gradient(135deg, #0055bb 0%, #003388 100%);
}

.section-icon {
  font-size: 1.3em;
  margin-right: 12px;
}

.expand-icon {
  margin-left: auto;
  font-size: 0.8em;
  transition: transform 0.3s ease;
}

.mindmap-details {
  padding: 20px;
  background: #f8fafc;
}

.mindmap-details p {
  color: #333;
  line-height: 1.6;
  margin-bottom: 15px;
}

.mindmap-subsection {
  margin-bottom: 20px;
}

.mindmap-subsection:last-child {
  margin-bottom: 0;
}

.mindmap-subsection h4 {
  color: #0066cc;
  margin-bottom: 10px;
  font-size: 1.05em;
}

.mindmap-subsection ul {
  list-style: none;
  padding-left: 20px;
}

.mindmap-subsection li {
  color: #555;
  margin-bottom: 8px;
  position: relative;
}

.mindmap-subsection li::before {
  content: '•';
  color: #0066cc;
  position: absolute;
  left: -15px;
}

.mindmap-subsection code {
  background: #e0e6ff;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Consolas', monospace;
  font-size: 0.9em;
  color: #004499;
}

.mindmap-subsection pre {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 15px;
  border-radius: 10px;
  overflow-x: auto;
  font-family: 'Consolas', monospace;
  font-size: 0.9em;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  padding: 25px;
  background: #f8fafc;
  border-top: 1px solid #e0e0e0;
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

.btn-primary {
  background: linear-gradient(135deg, #00cc66 0%, #00aa55 100%);
}

@media (max-width: 768px) {
  .mindmap-content {
    padding: 15px;
  }
  
  .action-buttons {
    flex-wrap: wrap;
  }
}
</style>