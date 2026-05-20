import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGameStore = defineStore('game', () => {
  // 游戏状态
  const currentLevel = ref(0)
  const currentQuestion = ref(0)
  const score = ref(0)
  const lives = ref(3)
  const combo = ref(0)
  const maxCombo = ref(0)
  const totalCorrect = ref(0)
  const totalQuestions = ref(0)
  const isEndlessMode = ref(false)
  const endlessQuestionCount = ref(0)
  const currentDifficulty = ref(1)
  const learnedMindmap = ref(false)

  // 成就状态
  const achievements = ref({
    firstWin: { id: 'firstWin', name: '初露锋芒', desc: '答对第一道题', icon: '⭐', unlocked: false },
    firstLevelComplete: { id: 'firstLevelComplete', name: '新手入门', desc: '完成第一关', icon: '🎯', unlocked: false },
    perfectLevel: { id: 'perfectLevel', name: '完美通关', desc: '一关内全部答对', icon: '💯', unlocked: false },
    allLevelsComplete: { id: 'allLevelsComplete', name: '通关大师', desc: '完成所有关卡', icon: '🏆', unlocked: false },
    tenCombo: { id: 'tenCombo', name: '连击高手', desc: '连续答对10题', icon: '🔥', unlocked: false },
    twentyCorrect: { id: 'twentyCorrect', name: '答题达人', desc: '累计答对20题', icon: '📚', unlocked: false },
    endlessSurvivor: { id: 'endlessSurvivor', name: '无尽挑战者', desc: '无尽模式答对15题', icon: '♾️', unlocked: false },
    learnedMindmap: { id: 'learnedMindmap', name: '知识探索者', desc: '学习知识导图', icon: '📖', unlocked: false }
  })

  // 关卡数据
  const levels = ref([
    {
      id: 1,
      name: '第1关：字节流基础',
      icon: '📥',
      difficulty: 1,
      questions: [
        {
          id: 1,
          question: '在 Java 中，哪个类是所有字节输入流的抽象基类？',
          options: ['OutputStream', 'InputStream', 'Reader', 'Writer'],
          correct: 1,
          explanation: 'InputStream 是所有字节输入流的抽象基类，而 OutputStream 是字节输出流的基类。Reader 和 Writer 是字符流的基类。'
        },
        {
          id: 2,
          question: '以下哪个类用于向文件中写入字节数据？',
          options: ['FileReader', 'FileWriter', 'FileInputStream', 'FileOutputStream'],
          correct: 3,
          explanation: 'FileOutputStream 用于向文件中写入字节数据。FileReader/FileWriter 是字符流，用于读写文本文件。'
        },
        {
          id: 3,
          question: 'InputStream 的 read() 方法返回 -1 表示什么？',
          options: ['读取错误', '文件结束', '读取超时', '缓冲区为空'],
          correct: 1,
          explanation: 'read() 方法返回 -1 表示已到达输入流的末尾，没有更多数据可读。'
        },
        {
          id: 4,
          question: 'close() 方法在 I/O 操作中的主要作用是什么？',
          options: ['加快读取速度', '释放系统资源', '清空缓冲区', '加密数据'],
          correct: 1,
          explanation: 'close() 方法用于关闭流并释放与该流相关的系统资源。如果不关闭，可能导致资源泄漏。'
        }
      ]
    },
    {
      id: 2,
      name: '第2关：字符流入门',
      icon: '📝',
      difficulty: 1,
      questions: [
        {
          id: 5,
          question: '在 Java 中，哪个类是所有字符输入流的抽象基类？',
          options: ['InputStream', 'OutputStream', 'Reader', 'Writer'],
          correct: 2,
          explanation: 'Reader 是所有字符输入流的抽象基类。InputStream/OutputStream 是字节流基类，Writer 是字符输出流基类。'
        },
        {
          id: 6,
          question: 'FileReader 和 FileInputStream 的主要区别是什么？',
          options: ['FileReader 更快', 'FileReader 按字符读取，FileInputStream 按字节读取', '没有区别', 'FileReader 只能读取文本文件'],
          correct: 1,
          explanation: 'FileReader 是字符流，按字符读取；FileInputStream 是字节流，按字节读取。字符流适合处理文本，字节流适合处理二进制数据。'
        },
        {
          id: 7,
          question: 'BufferedReader 的 readLine() 方法返回什么？',
          options: ['字节', '字符', '字符串', '整数'],
          correct: 2,
          explanation: 'readLine() 方法读取一行文本并返回字符串，到达文件末尾时返回 null。'
        },
        {
          id: 8,
          question: 'OutputStreamWriter 的作用是什么？',
          options: ['将字节转为字符', '将字符转为字节', '缓冲输出', '序列化对象'],
          correct: 1,
          explanation: 'OutputStreamWriter 是字符流到字节流的桥梁，将字符编码为字节后写入输出流。'
        }
      ]
    },
    {
      id: 3,
      name: '第3关：缓冲流进阶',
      icon: '⚡',
      difficulty: 2,
      questions: [
        {
          id: 9,
          question: '使用缓冲流的主要目的是什么？',
          options: ['加密数据', '提高 I/O 效率', '压缩数据', '并行处理'],
          correct: 1,
          explanation: '缓冲流通过减少实际的 I/O 操作次数来提高效率，数据先写入缓冲区，满了之后再一次性写入磁盘。'
        },
        {
          id: 10,
          question: 'BufferedOutputStream 的 flush() 方法作用是什么？',
          options: ['清空缓冲区', '强制将缓冲区数据写入目标', '关闭流', '重置缓冲区'],
          correct: 1,
          explanation: 'flush() 方法强制将缓冲区中的所有数据立即写入目标输出流，即使缓冲区未满。'
        },
        {
          id: 11,
          question: '以下哪种流组合效率最高？',
          options: ['FileInputStream', 'BufferedInputStream', 'DataInputStream', 'BufferedInputStream + FileInputStream'],
          correct: 3,
          explanation: '将 BufferedInputStream 包装在 FileInputStream 外面可以获得最佳的读取效率，利用缓冲减少磁盘访问次数。'
        },
        {
          id: 12,
          question: '缓冲流默认的缓冲区大小是多少？',
          options: ['512 字节', '1KB', '8KB', '16KB'],
          correct: 2,
          explanation: 'Java 缓冲流默认的缓冲区大小是 8KB (8192 字节)，可以通过构造函数自定义。'
        }
      ]
    },
    {
      id: 4,
      name: '第4关：文件流实战',
      icon: '📁',
      difficulty: 2,
      questions: [
        {
          id: 13,
          question: 'Java 中如何正确读取文件内容？',
          options: ['直接读取整个文件', '使用缓冲区分块读取', '一次性加载到内存', '逐字节读取'],
          correct: 1,
          explanation: '使用缓冲区分块读取是最有效的方式，可以避免一次性加载大文件导致内存溢出。'
        },
        {
          id: 14,
          question: 'File 类的 exists() 方法用于检查什么？',
          options: ['文件内容', '文件是否存在', '文件大小', '文件权限'],
          correct: 1,
          explanation: 'exists() 方法用于检查文件或目录是否存在，返回 boolean 值。'
        },
        {
          id: 15,
          question: '创建新文件应该使用哪个方法？',
          options: ['File.create()', 'File.createNewFile()', 'new File()', 'File.mkdir()'],
          correct: 1,
          explanation: 'createNewFile() 方法用于创建一个新的空文件。mkdir() 用于创建目录。'
        },
        {
          id: 16,
          question: 'Files.copy() 方法来自哪个包？',
          options: ['java.io', 'java.nio.file', 'java.util', 'java.lang'],
          correct: 1,
          explanation: 'Files 类位于 java.nio.file 包中，提供了许多文件操作的静态方法。'
        }
      ]
    },
    {
      id: 5,
      name: '第5关：NIO新世界',
      icon: '🚀',
      difficulty: 3,
      questions: [
        {
          id: 17,
          question: 'Java NIO 中，Channel 的主要特点是什么？',
          options: ['只能读', '只能写', '双向传输', '只能处理文件'],
          correct: 2,
          explanation: 'Channel 是双向的，可以同时进行读写操作，这是它与传统流的主要区别。'
        },
        {
          id: 18,
          question: 'Buffer 的 flip() 方法作用是什么？',
          options: ['翻转缓冲区', '切换到读模式', '清空缓冲区', '写入数据'],
          correct: 1,
          explanation: 'flip() 方法将缓冲区从写模式切换到读模式，设置 limit=position，position=0。'
        },
        {
          id: 19,
          question: 'Selector 的作用是什么？',
          options: ['选择文件', '多路复用 I/O', '加密数据', '压缩数据'],
          correct: 1,
          explanation: 'Selector 允许单个线程管理多个 Channel，实现多路复用 I/O，提高并发性能。'
        },
        {
          id: 20,
          question: 'NIO 相对于传统 I/O 的优势是什么？',
          options: ['更简单', '更快', '支持非阻塞 I/O', '占用内存更少'],
          correct: 2,
          explanation: 'NIO 支持非阻塞 I/O 操作，一个线程可以管理多个连接，适合高并发场景。'
        }
      ]
    },
    {
      id: 6,
      name: '第6关：综合挑战',
      icon: '🏅',
      difficulty: 3,
      questions: [
        {
          id: 21,
          question: 'try-with-resources 语句的优势是什么？',
          options: ['代码更短', '自动关闭资源', '运行更快', '占用内存更少'],
          correct: 1,
          explanation: 'try-with-resources 会自动关闭实现 AutoCloseable 接口的资源，即使发生异常也能正确关闭。'
        },
        {
          id: 22,
          question: '以下哪个接口用于自动资源管理？',
          options: ['Closeable', 'AutoCloseable', 'Serializable', 'Cloneable'],
          correct: 1,
          explanation: 'AutoCloseable 接口是 try-with-resources 的基础，Java 7 引入。'
        },
        {
          id: 23,
          question: 'ObjectOutputStream 的作用是什么？',
          options: ['文件输出', '对象序列化', '数据输出', '缓冲输出'],
          correct: 1,
          explanation: 'ObjectOutputStream 用于将 Java 对象序列化并写入输出流，实现对象的持久化存储。'
        },
        {
          id: 24,
          question: '序列化对象需要实现哪个接口？',
          options: ['Serializable', 'Cloneable', 'AutoCloseable', 'Comparable'],
          correct: 0,
          explanation: '需要实现 Serializable 接口，这是一个标记接口，不需要实现任何方法。'
        }
      ]
    }
  ])

  // 计算属性
  const currentLevelData = computed(() => levels.value[currentLevel.value])
  const currentQuestionData = computed(() => {
    if (!currentLevelData.value) return null
    return currentLevelData.value.questions[currentQuestion.value]
  })

  // 方法
  function startGame(levelIndex = 0) {
    currentLevel.value = levelIndex
    currentQuestion.value = 0
    score.value = 0
    lives.value = 3
    combo.value = 0
    isEndlessMode.value = false
    endlessQuestionCount.value = 0
    currentDifficulty.value = 1
  }

  function startEndlessMode() {
    isEndlessMode.value = true
    currentLevel.value = 0
    currentQuestion.value = 0
    score.value = 0
    lives.value = 3
    combo.value = 0
    maxCombo.value = 0
    endlessQuestionCount.value = 0
    currentDifficulty.value = 1
  }

  function answerQuestion(isCorrect) {
    totalQuestions.value++
    
    if (isCorrect) {
      totalCorrect.value++
      combo.value++
      if (combo.value > maxCombo.value) {
        maxCombo.value = combo.value
      }
      
      const baseScore = isEndlessMode.value ? currentDifficulty.value * 15 : (currentLevel.value + 1) * 10
      score.value += baseScore
      
      // 答对加分
      lives.value = Math.min(lives.value + 1, 10)
      
      checkAchievements()
    } else {
      combo.value = 0
      lives.value--
    }
  }

  function nextQuestion() {
    if (isEndlessMode.value) {
      endlessQuestionCount.value++
      // 每3题增加难度
      currentDifficulty.value = Math.min(5, 1 + Math.floor(endlessQuestionCount.value / 3))
    } else {
      currentQuestion.value++
      if (currentQuestion.value >= currentLevelData.value.questions.length) {
        currentLevel.value++
        currentQuestion.value = 0
      }
    }
  }

  function unlockAchievement(achievementId) {
    if (achievements.value[achievementId]) {
      achievements.value[achievementId].unlocked = true
      saveAchievements()
    }
  }

  function checkAchievements() {
    if (totalCorrect.value >= 1) unlockAchievement('firstWin')
    if (currentLevel.value === 0 && currentQuestion.value === 0 && totalCorrect.value > 0) unlockAchievement('firstLevelComplete')
    if (totalCorrect.value >= 20) unlockAchievement('twentyCorrect')
    if (combo.value >= 10) unlockAchievement('tenCombo')
    if (isEndlessMode.value && endlessQuestionCount.value >= 15) unlockAchievement('endlessSurvivor')
    if (currentLevel.value >= levels.value.length) unlockAchievement('allLevelsComplete')
  }

  function saveAchievements() {
    localStorage.setItem('java-io-achievements', JSON.stringify(achievements.value))
  }

  function loadAchievements() {
    const saved = localStorage.getItem('java-io-achievements')
    if (saved) {
      achievements.value = JSON.parse(saved)
    }
  }

  function toggleMindmap() {
    learnedMindmap.value = true
    unlockAchievement('learnedMindmap')
  }

  return {
    // 状态
    currentLevel,
    currentQuestion,
    score,
    lives,
    combo,
    maxCombo,
    totalCorrect,
    totalQuestions,
    isEndlessMode,
    endlessQuestionCount,
    currentDifficulty,
    learnedMindmap,
    achievements,
    levels,
    // 计算属性
    currentLevelData,
    currentQuestionData,
    // 方法
    startGame,
    startEndlessMode,
    answerQuestion,
    nextQuestion,
    unlockAchievement,
    checkAchievements,
    saveAchievements,
    loadAchievements,
    toggleMindmap
  }
})