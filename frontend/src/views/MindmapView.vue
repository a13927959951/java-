<template>
  <div class="mindmap-container">
    <button class="home-btn" @click="goHome">🏠 返回首页</button>
    
    <div class="header">
      <h1>🗺️ Java 全能知识导图</h1>
      <p class="header-desc">从基础到进阶，系统掌握 Java 开发核心技能</p>
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
  { label: '基础', value: 'basics', icon: '📚' },
  { label: 'OOP', value: 'oop', icon: '🏠' },
  { label: '集合', value: 'collections', icon: '📦' },
  { label: '线程', value: 'thread', icon: '🧵' },
  { label: 'IO', value: 'io', icon: '💾' },
  { label: '数据库', value: 'database', icon: '🗄️' },
  { label: '网络', value: 'network', icon: '🌐' }
]

const mindmapData = ref([
  {
    id: 'javaBasics',
    icon: '📚',
    title: 'Java基础语法',
    description: '数据类型、运算符、流程控制',
    concept: 'Java语言的基础知识，包括数据类型、变量、运算符、流程控制语句等，是学习Java的第一步。',
    tags: ['basics'],
    quizLevel: 0,
    subsections: [
      {
        title: '数据类型',
        items: [
          { code: 'int', description: '整数类型，4字节', note: '-2^31 到 2^31-1' },
          { code: 'double', description: '双精度浮点，8字节', note: 'IEEE 754标准' },
          { code: 'boolean', description: '布尔类型', note: 'true / false' },
          { code: 'char', description: '字符类型，2字节', note: 'Unicode编码' }
        ]
      },
      {
        title: '流程控制',
        items: [
          { code: 'if-else', description: '条件判断语句' },
          { code: 'switch', description: '多路分支选择' },
          { code: 'for / while / do-while', description: '循环语句' },
          { code: 'break / continue', description: '控制循环流程' }
        ]
      },
      {
        title: '运算符',
        items: [
          { code: '== / !=', description: '相等判断' },
          { code: '&& / ||', description: '逻辑与/或' },
          { code: '++ / --', description: '自增/自减' },
          { code: '?:', description: '三元运算符' }
        ]
      }
    ]
  },
  {
    id: 'oopFundamentals',
    icon: '🏠',
    title: '面向对象基础',
    description: '封装、继承、多态、抽象',
    concept: '面向对象编程是Java的核心思想，通过封装、继承、多态和抽象四大特性实现代码复用和模块化设计。',
    tags: ['oop'],
    quizLevel: 1,
    subsections: [
      {
        title: '封装',
        items: [
          { code: 'private', description: '私有访问修饰符', note: '仅本类可见' },
          { code: 'public', description: '公共访问修饰符', note: '所有类可见' },
          { code: 'protected', description: '保护访问修饰符', note: '同包及子类可见' },
          { code: 'getter/setter', description: '访问器方法', note: '封装属性访问' }
        ]
      },
      {
        title: '继承',
        items: [
          { code: 'extends', description: '继承关键字', note: '单继承' },
          { code: 'super', description: '引用父类', note: '调用父类成员' },
          { code: 'final', description: '最终类/方法', note: '不可继承/重写' },
          { code: 'Object', description: '所有类的父类', note: '根类' }
        ]
      },
      {
        title: '多态',
        items: [
          { code: 'override', description: '方法重写', note: '子类覆盖父类方法' },
          { code: 'overload', description: '方法重载', note: '同一类中方法名相同参数不同' },
          { code: 'abstract', description: '抽象方法', note: '只有声明没有实现' },
          { code: 'instanceof', description: '类型判断', note: '检查对象类型' }
        ]
      },
      {
        title: '接口',
        items: [
          { code: 'interface', description: '接口定义', note: '抽象方法集合' },
          { code: 'implements', description: '实现接口', note: '实现所有抽象方法' },
          { code: 'default', description: '默认方法', note: 'Java 8+ 新增' },
          { code: 'static', description: '静态方法', note: '接口中的静态方法' }
        ]
      }
    ]
  },
  {
    id: 'collectionsFramework',
    icon: '📦',
    title: '集合框架',
    description: 'List、Map、Set、迭代器',
    concept: 'Java集合框架提供了一套统一的容器类，用于存储和管理对象集合，包括List、Set、Map三大接口及其实现类。',
    tags: ['collections'],
    quizLevel: 2,
    subsections: [
      {
        title: 'List接口',
        items: [
          { code: 'ArrayList', description: '动态数组实现', note: '随机访问快' },
          { code: 'LinkedList', description: '双向链表实现', note: '插入删除快' },
          { code: 'Vector', description: '线程安全数组', note: '性能较差' },
          { code: 'ListIterator', description: '双向迭代器', note: '支持向前遍历' }
        ]
      },
      {
        title: 'Set接口',
        items: [
          { code: 'HashSet', description: '哈希表实现', note: '无序，不重复' },
          { code: 'TreeSet', description: '红黑树实现', note: '自然排序' },
          { code: 'LinkedHashSet', description: '保持插入顺序', note: '有序去重' },
          { code: 'equals/hashCode', description: '判断元素相等', note: '必须同时重写' }
        ]
      },
      {
        title: 'Map接口',
        items: [
          { code: 'HashMap', description: '哈希表实现', note: '无序，允许null' },
          { code: 'TreeMap', description: '红黑树实现', note: '键排序' },
          { code: 'LinkedHashMap', description: '保持插入顺序', note: '有序Map' },
          { code: 'ConcurrentHashMap', description: '并发安全', note: '分段锁实现' }
        ]
      },
      {
        title: '实战代码',
        codeTitle: '集合操作示例',
        code: '// ArrayList 使用\nList<String> list = new ArrayList<>();\nlist.add(\"Java\");\nlist.add(\"Python\");\nfor (String item : list) {\n    System.out.println(item);\n}\n\n// HashMap 使用\nMap<String, Integer> map = new HashMap<>();\nmap.put(\"age\", 25);\nmap.get(\"age\"); // 返回 25\n\n// HashSet 去重\nSet<String> set = new HashSet<>(list);\nset.add(\"Java\"); // 重复元素被忽略',
        tips: [
          '优先使用ArrayList而非Vector',
          'HashMap是非线程安全的',
          '遍历大集合时使用迭代器'
        ]
      }
    ]
  },
  {
    id: 'exceptionHandling',
    icon: '⚠️',
    title: '异常处理',
    description: 'try-catch、自定义异常',
    concept: '异常处理是Java程序的重要组成部分，通过try-catch-finally语句捕获和处理运行时异常，保证程序的健壮性。',
    tags: ['basics'],
    quizLevel: 3,
    subsections: [
      {
        title: '异常分类',
        items: [
          { code: 'Exception', description: '可恢复异常', note: '程序可处理' },
          { code: 'Error', description: '严重错误', note: '通常不可恢复' },
          { code: 'Checked', description: '检查异常', note: '必须显式处理' },
          { code: 'RuntimeException', description: '运行时异常', note: '无需显式处理' }
        ]
      },
      {
        title: '异常处理机制',
        items: [
          { code: 'try-catch', description: '捕获异常', note: '处理异常逻辑' },
          { code: 'finally', description: '最终执行', note: '无论是否异常都执行' },
          { code: 'throw', description: '抛出异常', note: '手动抛出' },
          { code: 'throws', description: '声明异常', note: '向上层抛出' }
        ]
      },
      {
        title: '实战代码',
        codeTitle: '异常处理示例',
        code: 'try {\n    // 可能抛出异常的代码\n    FileInputStream fis = new FileInputStream(\"test.txt\");\n    int data = fis.read();\n} catch (FileNotFoundException e) {\n    // 处理文件不存在异常\n    System.err.println(\"文件未找到\");\n} catch (IOException e) {\n    // 处理IO异常\n    e.printStackTrace();\n} finally {\n    // 资源清理\n    System.out.println(\"操作完成\");\n}',
        tips: [
          '优先捕获具体异常而非Exception',
          'finally块适合资源清理',
          '不要忽略异常'
        ]
      }
    ]
  },
  {
    id: 'multithreading',
    icon: '🧵',
    title: '多线程编程',
    description: 'Thread、Runnable、并发',
    concept: '多线程编程允许程序同时执行多个任务，提高CPU利用率和程序响应性，是高并发应用的基础。',
    tags: ['thread'],
    quizLevel: 4,
    subsections: [
      {
        title: '线程创建',
        items: [
          { code: 'extends Thread', description: '继承Thread类', note: '单继承限制' },
          { code: 'implements Runnable', description: '实现Runnable接口', note: '推荐方式' },
          { code: 'implements Callable', description: '实现Callable接口', note: '可返回结果' },
          { code: 'ExecutorService', description: '线程池', note: '管理线程生命周期' }
        ]
      },
      {
        title: '线程同步',
        items: [
          { code: 'synchronized', description: '同步关键字', note: '保证原子性' },
          { code: 'volatile', description: '可见性保证', note: '禁止指令重排序' },
          { code: 'Lock', description: '显式锁', note: '更灵活的锁机制' },
          { code: 'Atomic', description: '原子操作类', note: '无锁并发' }
        ]
      },
      {
        title: '并发工具',
        items: [
          { code: 'CountDownLatch', description: '计数器', note: '等待多个任务完成' },
          { code: 'CyclicBarrier', description: '循环栅栏', note: '等待所有线程到达' },
          { code: 'Semaphore', description: '信号量', note: '控制并发数量' },
          { code: 'Future', description: '异步结果', note: '获取异步任务结果' }
        ]
      },
      {
        title: '实战代码',
        codeTitle: '线程创建与同步',
        code: '// 创建线程方式1：实现Runnable\nThread thread = new Thread(() -> {\n    System.out.println(\"线程执行中\");\n});\nthread.start();\n\n// 线程同步\nsynchronized void increment() {\n    count++;\n}\n\n// 使用线程池\nExecutorService executor = Executors.newFixedThreadPool(4);\nexecutor.submit(() -> doWork());\nexecutor.shutdown();',
        tips: [
          '优先使用线程池而非手动创建线程',
          '避免死锁：按序获取锁',
          'volatile不能保证原子性'
        ]
      }
    ]
  },
  {
    id: 'javaIo',
    icon: '💾',
    title: 'Java I/O',
    description: '字节流、字符流、NIO',
    concept: 'Java I/O提供了丰富的输入输出操作，包括传统的字节流/字符流和NIO的Channel/Buffer/Selector。',
    tags: ['io'],
    quizLevel: 5,
    subsections: [
      {
        title: '字节流',
        items: [
          { code: 'InputStream', description: '字节输入流基类', note: '抽象类' },
          { code: 'OutputStream', description: '字节输出流基类', note: '抽象类' },
          { code: 'FileInputStream', description: '文件字节输入流', note: '读取二进制文件' },
          { code: 'BufferedInputStream', description: '缓冲字节输入流', note: '提高效率' }
        ]
      },
      {
        title: '字符流',
        items: [
          { code: 'Reader', description: '字符输入流基类', note: '处理文本' },
          { code: 'Writer', description: '字符输出流基类', note: '处理文本' },
          { code: 'BufferedReader', description: '缓冲字符输入流', note: 'readLine()' },
          { code: 'InputStreamReader', description: '字节流转字符流', note: '指定编码' }
        ]
      },
      {
        title: 'NIO',
        items: [
          { code: 'Channel', description: '双向通道', note: '比Stream更高效' },
          { code: 'Buffer', description: '数据缓冲区', note: 'flip()切换读写' },
          { code: 'Selector', description: '多路复用器', note: '单线程管理多连接' },
          { code: 'Path/Files', description: 'NIO.2文件API', note: '简化文件操作' }
        ]
      },
      {
        title: '实战代码',
        codeTitle: '文件读写示例',
        code: '// 使用 try-with-resources 读取文件\ntry (BufferedReader reader = new BufferedReader(\n    new FileReader(\"data.txt\"))) {\n    String line;\n    while ((line = reader.readLine()) != null) {\n        System.out.println(line);\n    }\n}\n\n// NIO 文件复制\ntry (FileChannel in = new FileInputStream(\"src.txt\").getChannel();\n     FileChannel out = new FileOutputStream(\"dst.txt\").getChannel()) {\n    ByteBuffer buf = ByteBuffer.allocate(8192);\n    while (in.read(buf) != -1) {\n        buf.flip();\n        out.write(buf);\n        buf.clear();\n    }\n}',
        tips: [
          '始终使用try-with-resources',
          '处理大文件使用NIO',
          '注意字符编码问题'
        ]
      }
    ]
  },
  {
    id: 'database',
    icon: '🗄️',
    title: '数据库编程',
    description: 'JDBC、SQL、连接池',
    concept: 'Java通过JDBC接口访问数据库，执行SQL语句，实现数据的增删改查操作，是企业级应用的核心技能。',
    tags: ['database'],
    quizLevel: 6,
    subsections: [
      {
        title: 'JDBC基础',
        items: [
          { code: 'DriverManager', description: '驱动管理', note: '加载驱动建立连接' },
          { code: 'Connection', description: '数据库连接', note: '会话对象' },
          { code: 'Statement', description: 'SQL语句对象', note: '执行静态SQL' },
          { code: 'PreparedStatement', description: '预编译语句', note: '防止SQL注入' },
          { code: 'ResultSet', description: '结果集', note: '存储查询结果' }
        ]
      },
      {
        title: '连接池',
        items: [
          { code: 'HikariCP', description: '高性能连接池', note: 'Spring Boot默认' },
          { code: 'Druid', description: '阿里连接池', note: '监控功能强大' },
          { code: 'C3P0', description: '传统连接池', note: '稳定性好' },
          { code: 'DataSource', description: '数据源接口', note: '连接池标准' }
        ]
      },
      {
        title: '事务管理',
        items: [
          { code: 'setAutoCommit(false)', description: '关闭自动提交', note: '手动控制事务' },
          { code: 'commit()', description: '提交事务', note: '成功时调用' },
          { code: 'rollback()', description: '回滚事务', note: '失败时调用' },
          { code: 'Savepoint', description: '保存点', note: '部分回滚' }
        ]
      },
      {
        title: '实战代码',
        codeTitle: 'JDBC查询示例',
        code: 'try (Connection conn = DriverManager.getConnection(\n    \"jdbc:mysql://localhost:3306/mydb\", \"user\", \"pass\");\n     PreparedStatement stmt = conn.prepareStatement(\n        \"SELECT * FROM users WHERE id = ?\")) {\n    \n    stmt.setInt(1, 1); // 设置参数\n    ResultSet rs = stmt.executeQuery();\n    \n    while (rs.next()) {\n        String name = rs.getString(\"name\");\n        int age = rs.getInt(\"age\");\n    }\n}\n// 使用 try-with-resources 自动关闭资源',
        tips: [
          '使用PreparedStatement防止SQL注入',
          '连接池必须配置合理',
          '事务边界要明确'
        ]
      }
    ]
  },
  {
    id: 'networkProgramming',
    icon: '🌐',
    title: '网络编程',
    description: 'Socket、HTTP、TCP/IP',
    concept: 'Java网络编程实现不同主机间的通信，包括Socket编程、HTTP通信等，是分布式系统的基础。',
    tags: ['network'],
    quizLevel: 7,
    subsections: [
      {
        title: 'Socket编程',
        items: [
          { code: 'ServerSocket', description: '服务器端套接字', note: '监听端口' },
          { code: 'Socket', description: '客户端套接字', note: '建立连接' },
          { code: 'InetAddress', description: 'IP地址封装', note: '表示网络地址' },
          { code: 'SocketTimeoutException', description: '超时异常', note: '连接超时' }
        ]
      },
      {
        title: 'HTTP通信',
        items: [
          { code: 'HttpURLConnection', description: 'HTTP连接', note: 'JDK内置' },
          { code: 'OkHttp', description: 'HTTP客户端', note: '高性能' },
          { code: 'HttpClient', description: 'Java 11+ HTTP客户端', note: '新API' },
          { code: 'RestTemplate', description: 'Spring HTTP客户端', note: '简化REST调用' }
        ]
      },
      {
        title: 'TCP/UDP',
        items: [
          { code: 'TCP', description: '传输控制协议', note: '可靠、有序' },
          { code: 'UDP', description: '用户数据报协议', note: '不可靠、快速' },
          { code: 'DatagramSocket', description: 'UDP套接字', note: '发送数据报' },
          { code: 'DatagramPacket', description: '数据报包', note: 'UDP数据单元' }
        ]
      },
      {
        title: '实战代码',
        codeTitle: 'Socket服务端示例',
        code: '// 服务端\nServerSocket server = new ServerSocket(8888);\nwhile (true) {\n    Socket client = server.accept();\n    // 处理客户端连接\n    new Thread(() -> handleClient(client)).start();\n}\n\n// HTTP GET 请求\nHttpClient client = HttpClient.newHttpClient();\nHttpRequest request = HttpRequest.newBuilder()\n    .uri(URI.create(\"https://api.example.com/data\"))\n    .GET()\n    .build();\nHttpResponse<String> response = client.send(request,\n    HttpResponse.BodyHandlers.ofString());',
        tips: [
          '服务端需要处理并发连接',
          'HTTP客户端优先使用OkHttp',
          'UDP适合实时性要求高的场景'
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  border-color: #667eea;
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
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 0.85em;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-tag:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-tag.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
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
  border: 1px solid #e2e8f0;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.mindmap-section.completed {
  border-color: #10b981;
  background: #f0fdf4;
}

.mindmap-header {
  display: flex;
  align-items: center;
  padding: 18px 22px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mindmap-header:hover {
  background: linear-gradient(135deg, #5a6fd6 0%, #6b4190 100%);
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
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 20px;
}

.concept-icon {
  font-size: 2em;
  margin-right: 15px;
}

.concept-content h4 {
  color: #6d28d9;
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
  color: #667eea;
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
  background: #f3f4f6;
  padding: 4px 10px;
  border-radius: 6px;
  font-family: 'Consolas', monospace;
  font-size: 0.9em;
  color: #667eea;
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
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
}

.action-btn-secondary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  padding: 25px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
}

.btn-primary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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