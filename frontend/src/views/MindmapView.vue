<template>
  <div class="mindmap-container">
    <button class="home-btn" @click="goHome">🏠 返回首页</button>
    
    <div class="header">
      <h1>🗺️ Java I/O 知识导图</h1>
      <p class="header-desc">系统学习 Java 输入输出流，掌握核心概念与实践技巧</p>
    </div>

    <!-- 搜索和过滤 -->
    <div class="search-bar">
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索知识点..." 
          class="search-input"
        />
        <button v-if="searchQuery" @click="clearSearch" class="clear-btn">✕</button>
      </div>
      <div class="filter-tags">
        <span class="filter-label">筛选:</span>
        <button 
          v-for="tag in filterTags" 
          :key="tag.value"
          :class="['filter-tag', { active: activeFilter === tag.value }]"
          @click="toggleFilter(tag.value)"
        >
          {{ tag.icon }} {{ tag.label }}
        </button>
      </div>
    </div>

    <!-- 学习进度 -->
    <div class="progress-bar">
      <div class="progress-info">
        <span>📚 学习进度</span>
        <span class="progress-percent">{{ progressPercent }}%</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
      <div class="progress-stats">
        <span>已学章节: {{ completedSections.length }}/{{ totalSections }}</span>
        <span>剩余: {{ totalSections - completedSections.length }}</span>
      </div>
    </div>

    <div class="mindmap-content">
      <div 
        v-for="(section, index) in filteredSections" 
        :key="section.id"
        class="mindmap-section"
        :class="{ completed: completedSections.includes(section.id) }"
      >
        <div 
          class="mindmap-header" 
          :class="{ active: expandedSections.includes(section.id) }"
          @click="toggleSection(section.id)"
        >
          <span class="section-number">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="section-icon">{{ section.icon }}</span>
          <div class="section-info">
            <span class="section-title">{{ section.title }}</span>
            <span class="section-desc">{{ section.description }}</span>
          </div>
          <div class="section-meta">
            <span v-if="completedSections.includes(section.id)" class="completed-badge">✓ 已学习</span>
            <span class="expand-icon">{{ expandedSections.includes(section.id) ? '▼' : '▶' }}</span>
          </div>
        </div>
        <transition name="slide">
          <div class="mindmap-details" v-show="expandedSections.includes(section.id)">
            <div class="concept-card">
              <div class="concept-icon">💡</div>
              <div class="concept-content">
                <h4>核心概念</h4>
                <p>{{ section.concept }}</p>
              </div>
            </div>
            
            <div v-for="subsection in section.subsections" :key="subsection.title" class="mindmap-subsection">
              <div class="subsection-header" @click="toggleSubsection(section.id, subsection.title)">
                <h4>{{ subsection.title }}</h4>
                <span class="subsection-toggle">{{ expandedSubsections[section.id]?.includes(subsection.title) ? '▲' : '▼' }}</span>
              </div>
              <transition name="fade">
                <div v-show="expandedSubsections[section.id]?.includes(subsection.title)" class="subsection-content">
                  <ul v-if="subsection.items">
                    <li v-for="(item, idx) in subsection.items" :key="idx">
                      <code class="item-code">{{ item.code }}</code>
                      <span class="item-desc">{{ item.description }}</span>
                      <span v-if="item.note" class="item-note">💡 {{ item.note }}</span>
                    </li>
                  </ul>
                  <div v-if="subsection.code" class="code-block">
                    <div class="code-header">
                      <span>{{ subsection.codeTitle }}</span>
                      <button @click="copyCode(subsection.code)" class="copy-btn">📋</button>
                    </div>
                    <pre><code>{{ subsection.code }}</code></pre>
                  </div>
                  <div v-if="subsection.tips" class="tips-box">
                    <span class="tips-icon">💫</span>
                    <ul>
                      <li v-for="(tip, idx) in subsection.tips" :key="idx">{{ tip }}</li>
                    </ul>
                  </div>
                </div>
              </transition>
            </div>

            <div class="section-actions">
              <button class="action-btn" @click="markCompleted(section.id)">
                {{ completedSections.includes(section.id) ? '🔄 重新学习' : '✅ 标记已学习' }}
              </button>
              <button class="action-btn action-btn-secondary" @click="goToQuiz(section.quizLevel)">
                🎯 关联关卡
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <div class="action-buttons">
      <button class="btn" @click="expandAll">📖 展开全部</button>
      <button class="btn btn-secondary" @click="collapseAll">📚 收起全部</button>
      <button class="btn btn-primary" @click="startQuiz">🎯 开始测验</button>
    </div>

    <!-- 浮动提示 -->
    <div v-if="showTip" class="float-tip" :class="tipType">
      {{ tipMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'

const router = useRouter()
const gameStore = useGameStore()

const searchQuery = ref('')
const activeFilter = ref('all')
const expandedSections = ref(['byteStream'])
const expandedSubsections = reactive({})
const completedSections = ref([])
const showTip = ref(false)
const tipMessage = ref('')
const tipType = ref('success')

const filterTags = [
  { label: '全部', value: 'all', icon: '📦' },
  { label: '字节流', value: 'byte', icon: '📥' },
  { label: '字符流', value: 'char', icon: '📝' },
  { label: 'NIO', value: 'nio', icon: '🚀' },
  { label: '实战', value: 'practice', icon: '⚡' }
]

const mindmapData = ref([
  {
    id: 'byteStream',
    icon: '📥',
    title: '字节流体系',
    description: 'InputStream / OutputStream',
    concept: '以字节（8位）为单位进行读写，适合处理二进制数据（图片、视频、文件等）。是 Java I/O 的基础。',
    tags: ['byte'],
    quizLevel: 0,
    subsections: [
      {
        title: 'InputStream（输入流基类）',
        items: [
          { code: 'FileInputStream', description: '文件输入流，从文件读取字节', note: '最常用的字节输入流' },
          { code: 'BufferedInputStream', description: '缓冲输入流，提高读取效率', note: '内部缓冲区默认8KB' },
          { code: 'ObjectInputStream', description: '对象反序列化，读取对象', note: '需要实现 Serializable' },
          { code: 'DataInputStream', description: '读取基本数据类型', note: 'readInt(), readDouble() 等' }
        ]
      },
      {
        title: 'OutputStream（输出流基类）',
        items: [
          { code: 'FileOutputStream', description: '文件输出流，写入文件', note: '覆盖模式需谨慎' },
          { code: 'BufferedOutputStream', description: '缓冲输出流', note: 'flush() 强制刷新' },
          { code: 'ObjectOutputStream', description: '对象序列化', note: 'transient 字段不序列化' },
          { code: 'DataOutputStream', description: '写入基本数据类型', note: 'writeInt(), writeUTF()' }
        ]
      },
      {
        title: '实战代码',
        codeTitle: '文件复制示例',
        code: 'try (BufferedInputStream bis = new BufferedInputStream(\n    new FileInputStream(\"source.txt\"));\n     BufferedOutputStream bos = new BufferedOutputStream(\n    new FileOutputStream(\"dest.txt\"))) {\n    byte[] buffer = new byte[8192];\n    int bytesRead;\n    while ((bytesRead = bis.read(buffer)) != -1) {\n        bos.write(buffer, 0, bytesRead);\n    }\n} catch (IOException e) {\n    e.printStackTrace();\n}',
        tips: [
          '使用 try-with-resources 自动关闭资源',
          '缓冲区大小通常设为 8KB 或 16KB',
          'read() 返回 -1 表示文件结束'
        ]
      }
    ]
  },
  {
    id: 'charStream',
    icon: '📝',
    title: '字符流体系',
    description: 'Reader / Writer',
    concept: '以字符（16位Unicode）为单位进行读写，适合处理文本数据，自动处理编码转换，支持中文等多语言。',
    tags: ['char'],
    quizLevel: 1,
    subsections: [
      {
        title: 'Reader（字符输入流）',
        items: [
          { code: 'FileReader', description: '文件字符输入流', note: '默认使用系统编码' },
          { code: 'BufferedReader', description: '缓冲字符输入流', note: '提供 readLine() 方法' },
          { code: 'InputStreamReader', description: '字节流转字符流的桥梁', note: '指定编码很重要' },
          { code: 'StringReader', description: '从字符串读取', note: '内存中的字符流' }
        ]
      },
      {
        title: 'Writer（字符输出流）',
        items: [
          { code: 'FileWriter', description: '文件字符输出流', note: '注意编码问题' },
          { code: 'BufferedWriter', description: '缓冲字符输出流', note: 'newLine() 换行' },
          { code: 'OutputStreamWriter', description: '字符流转字节流的桥梁', note: '指定输出编码' },
          { code: 'StringWriter', description: '写入字符串缓冲区', note: '常用于生成字符串' }
        ]
      },
      {
        title: '实战代码',
        codeTitle: '读取文本文件',
        code: 'try (BufferedReader reader = new BufferedReader(\n    new InputStreamReader(\n        new FileInputStream(\"file.txt\"), StandardCharsets.UTF_8))) {\n    String line;\n    while ((line = reader.readLine()) != null) {\n        System.out.println(line);\n    }\n} catch (IOException e) {\n    e.printStackTrace();\n}',
        tips: [
          '始终指定字符编码，避免乱码',
          'StandardCharsets.UTF_8 是最佳实践',
          'readLine() 返回 null 表示文件结束'
        ]
      }
    ]
  },
  {
    id: 'bufferStream',
    icon: '⚡',
    title: '缓冲流进阶',
    description: 'Buffered 系列',
    concept: '通过缓冲区减少实际 I/O 操作次数，显著提高读写效率。缓冲流是对其他流的包装。',
    tags: ['practice'],
    quizLevel: 2,
    subsections: [
      {
        title: '缓冲流工作原理',
        items: [
          { code: '缓冲区', description: '内存中的临时存储区域', note: '默认 8KB' },
          { code: '批量读写', description: '减少磁盘访问次数', note: '减少系统调用开销' },
          { code: 'flush()', description: '强制刷新缓冲区', note: 'close() 前自动调用' },
          { code: 'mark/reset', description: '标记位置并回退', note: '部分流支持' }
        ]
      },
      {
        title: '缓冲流组合',
        items: [
          { code: 'BufferedInputStream + FileInputStream', description: '高效读取二进制文件' },
          { code: 'BufferedOutputStream + FileOutputStream', description: '高效写入二进制文件' },
          { code: 'BufferedReader + FileReader', description: '高效读取文本文件' },
          { code: 'BufferedWriter + FileWriter', description: '高效写入文本文件' }
        ]
      },
      {
        title: '性能对比',
        tips: [
          '无缓冲：每次 read() 调用系统调用',
          '有缓冲：先填满缓冲区再批量写入',
          '性能提升可达 10 倍以上',
          '大文件操作必备'
        ]
      }
    ]
  },
  {
    id: 'fileOperation',
    icon: '📁',
    title: '文件操作',
    description: 'File / Files',
    concept: 'Java 提供了丰富的文件操作类，支持文件的创建、读取、写入、删除、复制、移动等操作。',
    tags: ['practice'],
    quizLevel: 3,
    subsections: [
      {
        title: 'File 类（传统IO）',
        items: [
          { code: 'exists()', description: '检查文件是否存在' },
          { code: 'createNewFile()', description: '创建新文件' },
          { code: 'mkdir() / mkdirs()', description: '创建目录' },
          { code: 'delete()', description: '删除文件或目录' },
          { code: 'listFiles()', description: '列出目录内容' },
          { code: 'renameTo()', description: '重命名文件' }
        ]
      },
      {
        title: 'Files 类（NIO.2）',
        items: [
          { code: 'Files.copy()', description: '复制文件', note: '支持复制选项' },
          { code: 'Files.move()', description: '移动文件', note: '原子操作' },
          { code: 'Files.readAllLines()', description: '读取所有行', note: '小文件适用' },
          { code: 'Files.write()', description: '写入文件', note: '自动创建文件' },
          { code: 'Files.walk()', description: '遍历目录树', note: '支持深度控制' },
          { code: 'Files.delete()', description: '删除文件', note: '不存在抛异常' }
        ]
      },
      {
        title: '实战代码',
        codeTitle: 'NIO.2 文件操作',
        code: '// 读取文件\nList<String> lines = Files.readAllLines(\n    Paths.get(\"data.txt\"), StandardCharsets.UTF_8);\n\n// 写入文件\nFiles.write(Paths.get(\"output.txt\"),\n    content.getBytes(StandardCharsets.UTF_8));\n\n// 复制文件\nFiles.copy(sourcePath, targetPath,\n    StandardCopyOption.REPLACE_EXISTING);\n\n// 遍历目录\nFiles.walk(Paths.get(\".\"))\n    .filter(Files::isRegularFile)\n    .forEach(System.out::println);',
        tips: [
          'NIO.2 API 更简洁易用',
          'Path 替代传统 File',
          '支持批量操作'
        ]
      }
    ]
  },
  {
    id: 'nio',
    icon: '🚀',
    title: 'NIO 新世界',
    description: 'Channel / Buffer / Selector',
    concept: 'Java NIO（New I/O）提供了非阻塞 I/O 操作，适合高并发场景。核心组件包括 Channel、Buffer 和 Selector。',
    tags: ['nio'],
    quizLevel: 4,
    subsections: [
      {
        title: '三大核心组件',
        items: [
          { code: 'Channel', description: '双向数据传输通道', note: '可同时读写' },
          { code: 'Buffer', description: '数据容器', note: '多种数据类型支持' },
          { code: 'Selector', description: '多路复用器', note: '单线程管理多通道' }
        ]
      },
      {
        title: 'Buffer 核心方法',
        items: [
          { code: 'flip()', description: '切换到读模式', note: 'limit=position, position=0' },
          { code: 'clear()', description: '清空缓冲区', note: 'position=0, limit=capacity' },
          { code: 'rewind()', description: '重置位置', note: 'position=0, limit不变' },
          { code: 'remaining()', description: '剩余元素数量', note: 'limit - position' },
          { code: 'compact()', description: '压缩缓冲区', note: '未读数据移到开头' },
          { code: 'mark() / reset()', description: '标记与重置', note: '保存/恢复位置' }
        ]
      },
      {
        title: '实战代码',
        codeTitle: 'NIO 文件复制',
        code: 'try (FileChannel inChannel = new FileInputStream(\n        \"source.txt\").getChannel();\n     FileChannel outChannel = new FileOutputStream(\n        \"dest.txt\").getChannel()) {\n    \n    ByteBuffer buffer = ByteBuffer.allocate(8192);\n    while (inChannel.read(buffer) != -1) {\n        buffer.flip();  // 切换到读模式\n        outChannel.write(buffer);\n        buffer.compact(); // 压缩未读数据\n    }\n} catch (IOException e) {\n    e.printStackTrace();\n}',
        tips: [
          'Channel 必须配合 Buffer 使用',
          'flip() 和 compact() 是关键操作',
          'NIO 适合大文件操作'
        ]
      }
    ]
  },
  {
    id: 'resourceManagement',
    icon: '🔒',
    title: '资源管理',
    description: 'try-with-resources / Serialization',
    concept: '正确管理 I/O 资源，避免资源泄漏。Java 7+ 提供 try-with-resources 自动资源管理。',
    tags: ['practice'],
    quizLevel: 5,
    subsections: [
      {
        title: 'try-with-resources',
        codeTitle: '自动资源管理',
        code: '// Java 7+ 自动关闭资源\ntry (FileInputStream fis = new FileInputStream(\"test.txt\");\n     BufferedInputStream bis = new BufferedInputStream(fis)) {\n    // 使用资源\n    int data = bis.read();\n} catch (IOException e) {\n    // 异常处理\n    e.printStackTrace();\n}\n\n// 资源按声明逆序关闭',
        tips: [
          '实现 AutoCloseable 接口即可自动关闭',
          '资源按声明的逆序关闭',
          '异常会被抑制（suppressed exceptions）',
          '推荐所有资源使用此模式'
        ]
      },
      {
        title: '序列化',
        items: [
          { code: 'Serializable', description: '标记接口', note: '无需实现方法' },
          { code: 'ObjectOutputStream', description: '序列化对象', note: 'writeObject()' },
          { code: 'ObjectInputStream', description: '反序列化对象', note: 'readObject()' },
          { code: 'transient', description: '不序列化字段', note: '临时数据' },
          { code: 'serialVersionUID', description: '版本UID', note: '兼容性控制' }
        ]
      },
      {
        title: '实战代码',
        codeTitle: '对象序列化',
        code: '// 序列化对象\ntry (ObjectOutputStream oos = new ObjectOutputStream(\n        new FileOutputStream(\"data.ser\"))) {\n    User user = new User(\"Alice\", 25);\n    oos.writeObject(user);\n}\n\n// 反序列化\ntry (ObjectInputStream ois = new ObjectInputStream(\n        new FileInputStream(\"data.ser\"))) {\n    User user = (User) ois.readObject();\n}\n\n// User 类必须实现 Serializable\nclass User implements Serializable {\n    private static final long serialVersionUID = 1L;\n    private String name;\n    private int age;\n    // ...\n}',
        tips: [
          '静态字段不会被序列化',
          'transient 字段不会被序列化',
          '序列化版本号确保兼容性',
          '谨慎序列化敏感数据'
        ]
      }
    ]
  }
])

const totalSections = computed(() => mindmapData.value.length)

const filteredSections = computed(() => {
  let result = mindmapData.value
  
  if (activeFilter.value !== 'all') {
    result = result.filter(section => section.tags.includes(activeFilter.value))
  }
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(section => 
      section.title.toLowerCase().includes(query) ||
      section.description.toLowerCase().includes(query) ||
      section.concept.toLowerCase().includes(query) ||
      section.subsections.some(sub => 
        sub.title.toLowerCase().includes(query) ||
        (sub.items && sub.items.some(item => 
          item.code.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        ))
      )
    )
  }
  
  return result
})

const progressPercent = computed(() => {
  return Math.round((completedSections.value.length / totalSections.value) * 100)
})

function toggleSection(sectionId) {
  const index = expandedSections.value.indexOf(sectionId)
  if (index === -1) {
    expandedSections.value.push(sectionId)
    if (!expandedSubsections[sectionId]) {
      expandedSubsections[sectionId] = []
      const section = mindmapData.value.find(s => s.id === sectionId)
      section?.subsections.forEach(sub => {
        expandedSubsections[sectionId].push(sub.title)
      })
    }
  } else {
    expandedSections.value.splice(index, 1)
  }
}

function toggleSubsection(sectionId, subsectionTitle) {
  if (!expandedSubsections[sectionId]) {
    expandedSubsections[sectionId] = []
  }
  const index = expandedSubsections[sectionId].indexOf(subsectionTitle)
  if (index === -1) {
    expandedSubsections[sectionId].push(subsectionTitle)
  } else {
    expandedSubsections[sectionId].splice(index, 1)
  }
}

function expandAll() {
  expandedSections.value = mindmapData.value.map(s => s.id)
  mindmapData.value.forEach(section => {
    expandedSubsections[section.id] = section.subsections.map(sub => sub.title)
  })
}

function collapseAll() {
  expandedSections.value = []
  Object.keys(expandedSubsections).forEach(key => {
    expandedSubsections[key] = []
  })
}

function toggleFilter(tag) {
  activeFilter.value = activeFilter.value === tag ? 'all' : tag
}

function clearSearch() {
  searchQuery.value = ''
}

function markCompleted(sectionId) {
  const index = completedSections.value.indexOf(sectionId)
  if (index === -1) {
    completedSections.value.push(sectionId)
    showNotification('✅ 已标记为学习完成！', 'success')
  } else {
    completedSections.value.splice(index, 1)
    showNotification('🔄 已重置学习状态', 'info')
  }
}

function showNotification(message, type = 'success') {
  tipMessage.value = message
  tipType.value = type
  showTip.value = true
  setTimeout(() => {
    showTip.value = false
  }, 2000)
}

function copyCode(code) {
  navigator.clipboard.writeText(code).then(() => {
    showNotification('📋 代码已复制到剪贴板！', 'success')
  })
}

function goToQuiz(level) {
  gameStore.toggleMindmap()
  gameStore.startGame(level)
  router.push(`/game/${level}`)
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
  max-width: 950px;
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
  padding: 30px;
  text-align: center;
}

.header h1 {
  font-size: 2em;
  margin-bottom: 8px;
}

.header-desc {
  opacity: 0.9;
  font-size: 1.1em;
}

.search-bar {
  padding: 20px 30px;
  background: #f8fafc;
  border-bottom: 1px solid #e0e6f0;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #e0e6f0;
  border-radius: 12px;
  padding: 8px 15px;
  margin-bottom: 12px;
  transition: border-color 0.3s;
}

.search-input-wrapper:focus-within {
  border-color: #0066cc;
}

.search-icon {
  margin-right: 10px;
  font-size: 1.1em;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1em;
}

.clear-btn {
  background: #f0f0f0;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 0.8em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-tags {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-label {
  color: #666;
  font-size: 0.9em;
}

.filter-tag {
  background: white;
  border: 1px solid #cce0ff;
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 0.85em;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-tag:hover {
  border-color: #0066cc;
  color: #0066cc;
}

.filter-tag.active {
  background: #0066cc;
  color: white;
  border-color: #0066cc;
}

.progress-bar {
  padding: 15px 30px;
  background: #fff;
  border-bottom: 1px solid #e0e6f0;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.95em;
  color: #333;
}

.progress-percent {
  font-weight: bold;
  color: #00aa55;
}

.progress-track {
  height: 8px;
  background: #e0e6f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00cc66 0%, #00aa55 100%);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 0.85em;
  color: #666;
}

.mindmap-content {
  padding: 20px 30px;
}

.mindmap-section {
  margin-bottom: 18px;
  border: 1px solid #cce0ff;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.mindmap-section.completed {
  border-color: #00cc66;
  background: #f8fff9;
}

.mindmap-header {
  display: flex;
  align-items: center;
  padding: 18px 22px;
  background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mindmap-header:hover {
  background: linear-gradient(135deg, #0055bb 0%, #003388 100%);
}

.section-number {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.85em;
  margin-right: 12px;
}

.section-icon {
  font-size: 1.4em;
  margin-right: 12px;
}

.section-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 1.1em;
  font-weight: bold;
}

.section-desc {
  font-size: 0.85em;
  opacity: 0.85;
  margin-top: 2px;
}

.section-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.completed-badge {
  background: #00cc66;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75em;
}

.expand-icon {
  font-size: 0.8em;
  transition: transform 0.3s ease;
}

.mindmap-details {
  padding: 22px;
  background: #f8fafc;
}

.concept-card {
  display: flex;
  background: linear-gradient(135deg, #e6f0ff 0%, #d4e4ff 100%);
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 20px;
}

.concept-icon {
  font-size: 2em;
  margin-right: 15px;
}

.concept-content h4 {
  color: #0066cc;
  margin-bottom: 8px;
  font-size: 1.05em;
}

.concept-content p {
  color: #333;
  line-height: 1.6;
  margin: 0;
}

.mindmap-subsection {
  margin-bottom: 22px;
  border: 1px solid #e0e6f0;
  border-radius: 10px;
  overflow: hidden;
}

.subsection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: #fff;
  cursor: pointer;
}

.subsection-header h4 {
  margin: 0;
  color: #0066cc;
  font-size: 1em;
}

.subsection-toggle {
  font-size: 0.7em;
  color: #999;
}

.subsection-content {
  padding: 18px;
  background: #fff;
}

.subsection-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.subsection-content li {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px dashed #e0e6f0;
}

.subsection-content li:last-child {
  border-bottom: none;
}

.item-code {
  background: #e6f0ff;
  padding: 4px 10px;
  border-radius: 6px;
  font-family: 'Consolas', monospace;
  font-size: 0.9em;
  color: #004499;
  margin-right: 10px;
  white-space: nowrap;
}

.item-desc {
  color: #333;
  flex: 1;
  margin-right: 10px;
}

.item-note {
  background: #fff8e6;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8em;
  color: #cc8800;
}

.code-block {
  margin-top: 15px;
  border-radius: 10px;
  overflow: hidden;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2d2d2d;
  padding: 10px 15px;
  color: #ccc;
  font-size: 0.85em;
}

.copy-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 6px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 1.1em;
}

.copy-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.code-block pre {
  margin: 0;
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 18px;
  overflow-x: auto;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.85em;
  line-height: 1.6;
}

.tips-box {
  margin-top: 15px;
  background: #fffef0;
  border: 1px solid #ffe082;
  border-radius: 10px;
  padding: 15px;
}

.tips-icon {
  font-size: 1.2em;
  margin-right: 8px;
}

.tips-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-box li {
  color: #8b7355;
  padding: 6px 0;
  padding-left: 20px;
  position: relative;
}

.tips-box li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #00aa55;
}

.section-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e6f0;
}

.action-btn {
  flex: 1;
  background: linear-gradient(135deg, #00cc66 0%, #00aa55 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 0.95em;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 204, 102, 0.4);
}

.action-btn-secondary {
  background: linear-gradient(135deg, #4a90d9 0%, #3a7bc8 100%);
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
  padding: 13px 35px;
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

.float-tip {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 12px;
  font-size: 1em;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.float-tip.success {
  background: linear-gradient(135deg, #00cc66 0%, #00aa55 100%);
  color: white;
}

.float-tip.info {
  background: linear-gradient(135deg, #4a90d9 0%, #3a7bc8 100%);
  color: white;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}

.slide-enter-to,
.slide-leave-from {
  max-height: 2000px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .mindmap-content {
    padding: 15px;
  }
  
  .search-bar {
    padding: 15px;
  }
  
  .action-buttons {
    flex-wrap: wrap;
  }
  
  .section-info {
    flex: none;
    min-width: 0;
  }
  
  .section-title {
    font-size: 1em;
  }
  
  .section-desc {
    display: none;
  }
}
</style>