import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 8080

app.use(cors())
app.use(express.json())

const questions = [
  {
    id: 1,
    level: 1,
    question: 'Java中，以下哪个类是所有字节输入流的抽象基类？',
    options: ['OutputStream', 'InputStream', 'Reader', 'Writer'],
    correct: 1,
    explanation: 'InputStream 是所有字节输入流的抽象基类，OutputStream 是字节输出流基类，Reader/Writer 是字符流基类。'
  },
  {
    id: 2,
    level: 1,
    question: 'InputStream的read()方法返回-1表示什么？',
    options: ['读取错误', '文件结束', '读取超时', '缓冲区为空'],
    correct: 1,
    explanation: 'read()方法返回-1表示已到达输入流的末尾。'
  },
  {
    id: 3,
    level: 2,
    question: 'BufferedReader的readLine()方法返回什么？',
    options: ['字节', '字符', '字符串', '整数'],
    correct: 2,
    explanation: 'readLine()方法读取一行文本并返回字符串，到达文件末尾时返回null。'
  },
  {
    id: 4,
    level: 2,
    question: '以下哪个流是字符流？',
    options: ['FileInputStream', 'BufferedInputStream', 'FileReader', 'DataOutputStream'],
    correct: 2,
    explanation: 'FileReader是字符输入流，其他选项都是字节流。'
  },
  {
    id: 5,
    level: 3,
    question: 'OutputStreamWriter的作用是什么？',
    options: ['将字节转为字符', '将字符转为字节', '缓冲输出', '序列化对象'],
    correct: 1,
    explanation: 'OutputStreamWriter是字符流到字节流的桥梁，将字符编码为字节。'
  },
  {
    id: 6,
    level: 3,
    question: 'try-with-resources语句的优势是什么？',
    options: ['代码更短', '自动关闭资源', '运行更快', '占用内存更少'],
    correct: 1,
    explanation: 'try-with-resources会自动关闭实现AutoCloseable接口的资源，即使发生异常也能正确关闭。'
  },
  {
    id: 7,
    level: 4,
    question: '以下哪个类用于对象序列化？',
    options: ['FileOutputStream', 'ObjectOutputStream', 'DataOutputStream', 'BufferedOutputStream'],
    correct: 1,
    explanation: 'ObjectOutputStream用于将Java对象序列化并写入输出流。'
  },
  {
    id: 8,
    level: 4,
    question: '以下哪个接口用于自动资源管理？',
    options: ['Closeable', 'AutoCloseable', 'Serializable', 'Cloneable'],
    correct: 1,
    explanation: 'AutoCloseable接口是try-with-resources的基础，Java 7引入。'
  },
  {
    id: 9,
    level: 5,
    question: 'Java NIO中，flip()方法的作用是什么？',
    options: ['翻转缓冲区', '切换到读模式', '清空缓冲区', '写入数据'],
    correct: 1,
    explanation: 'flip()方法将缓冲区从写模式切换到读模式，设置limit=position，position=0。'
  },
  {
    id: 10,
    level: 5,
    question: 'Java NIO中，Channel的主要特点是什么？',
    options: ['只能读', '只能写', '双向传输', '只能处理文件'],
    correct: 2,
    explanation: 'Channel是双向的，可以同时进行读写操作。'
  },
  {
    id: 11,
    level: 6,
    question: 'FileReader和InputStreamReader的关系是什么？',
    options: ['没有关系', 'FileReader继承InputStreamReader', 'InputStreamReader继承FileReader', '都是抽象类'],
    correct: 1,
    explanation: 'FileReader继承自InputStreamReader，是读取字符文件的便捷类。'
  },
  {
    id: 12,
    level: 6,
    question: 'BufferedInputStream的默认缓冲区大小是多少？',
    options: ['1024字节', '2048字节', '4096字节', '8192字节'],
    correct: 3,
    explanation: 'BufferedInputStream的默认缓冲区大小为8192字节（8KB）。'
  }
]

// 成就系统数据
const achievements = [
  { id: 1, name: '初次启程', description: '完成第1关', icon: '🌟' },
  { id: 2, name: '流之使者', description: '完成第2关', icon: '🌊' },
  { id: 3, name: '缓冲大师', description: '完成第3关', icon: '⚡' },
  { id: 4, name: '文件掌控者', description: '完成第4关', icon: '📁' },
  { id: 5, name: 'NIO探索者', description: '完成第5关', icon: '🚀' },
  { id: 6, name: '知识达人', description: '通过知识导图测验', icon: '🧠' },
  { id: 7, name: '满分选手', description: '任一关卡满分通关', icon: '💯' },
  { id: 8, name: '无尽勇士', description: '无尽模式连续答对10题', icon: '♾️' },
  { id: 9, name: 'Java I/O大师', description: '通过全部关卡', icon: '👑' },
  { id: 10, name: '终身学习者', description: '累计答对50题', icon: '📚' }
]

app.get('/api/questions/random', (req, res) => {
  const difficulty = parseInt(req.query.difficulty) || 1
  const levelQuestions = questions.filter(q => q.level <= difficulty)
  if (levelQuestions.length === 0) {
    return res.json(questions[Math.floor(Math.random() * questions.length)])
  }
  const question = levelQuestions[Math.floor(Math.random() * levelQuestions.length)]
  res.json(question)
})

app.post('/api/questions/random', (req, res) => {
  const difficulty = (req.body && req.body.difficulty) ? parseInt(req.body.difficulty) : 1
  const levelQuestions = questions.filter(q => q.level <= difficulty)
  if (levelQuestions.length === 0) {
    return res.json(questions[Math.floor(Math.random() * questions.length)])
  }
  const question = levelQuestions[Math.floor(Math.random() * levelQuestions.length)]
  res.json(question)
})

app.get('/api/questions/all', (req, res) => {
  res.json(questions)
})

app.get('/api/questions/level/:level', (req, res) => {
  const level = parseInt(req.params.level)
  const levelQuestions = questions.filter(q => q.level === level)
  res.json(levelQuestions)
})

app.get('/api/achievements', (req, res) => {
  res.json(achievements)
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

const rolePrompts = {
  general: '你是一个专业的 Java 编程助手，擅长解答 Java 输入输出（I/O）相关问题。请用中文回答，保持专业且友好。',
  code: '你是一个 Java 代码生成专家。请根据用户需求生成高质量的 Java 代码，必须包含详细的中文注释。代码要完整、可运行。',
  question: '你是一个 Java 出题专家。请根据用户需求生成 Java I/O 相关的选择题，格式为：题目\nA. 选项1\nB. 选项2\nC. 选项3\nD. 选项4\n正确答案：X\n解析：...',
  ioExpert: '你是 Java I/O 领域的顶级专家。请深入详细地解答关于 Java 输入输出流、NIO、文件操作、序列化、字符编码等问题。用中文回答，举例说明。'
}

app.post('/api/ai/chat', async (req, res) => {
  try {
    const { apiKey, message, role } = req.body

    if (!message || !message.trim()) {
      return res.status(400).json({ error: '消息不能为空' })
    }

    if (!apiKey || !apiKey.trim()) {
      return res.json({
        reply: getLocalReply(message, role || 'general')
      })
    }

    const systemPrompt = rolePrompts[role] || rolePrompts.general

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 4096,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`DeepSeek API 错误 (${response.status}): ${errorData}`)
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || '暂无响应'

    res.json({ reply })
  } catch (error) {
    console.error('AI Chat Error:', error.message)
    res.json({
      reply: `❌ AI 服务暂时不可用：${error.message}\n\n请检查 API 密钥是否正确，或稍后重试喵~`
    })
  }
})

function getLocalReply(message, role) {
  const msg = message.toLowerCase()

  if (role === 'code') {
    if (msg.includes('读取文件') || msg.includes('read') || msg.includes('fileinputstream')) {
      return `以下是使用 Java I/O 读取文件的示例代码：

\`\`\`java
import java.io.*;

public class FileReadExample {
    public static void main(String[] args) {
        String filePath = "test.txt";
        
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            System.err.println("读取文件失败: " + e.getMessage());
        }
    }
}
\`\`\`

🔑 **关键点：**
- 使用 \`try-with-resources\` 自动关闭流
- \`BufferedReader\` 提供 \`readLine()\` 方法逐行读取
- \`FileReader\` 是字符流，适合读取文本文件`
    }

    if (msg.includes('写入文件') || msg.includes('write') || msg.includes('fileoutputstream')) {
      return `以下是使用 Java I/O 写入文件的示例代码：

\`\`\`java
import java.io.*;

public class FileWriteExample {
    public static void main(String[] args) {
        String content = "Hello, Java I/O!\\n这是第二行内容。";
        
        try (BufferedWriter writer = new BufferedWriter(new FileWriter("output.txt"))) {
            writer.write(content);
            writer.newLine();
            writer.write("追加的一行。");
            System.out.println("文件写入成功！");
        } catch (IOException e) {
            System.err.println("写入文件失败: " + e.getMessage());
        }
    }
}
\`\`\`

💡 **提示：** \`BufferedWriter\` 的默认缓冲区为 8192 字节，可使用 \`flush()\` 强制刷新。`
    }
  }

  if (msg.includes('字节流') || msg.includes('inputstream') || msg.includes('outputstream')) {
    return `📘 **Java 字节流**是以字节（8位）为单位进行读写的流，适合处理二进制数据（图片、视频等）。

**常用字节流：**
| 类型 | 输入流 | 输出流 |
|------|--------|--------|
| 基础流 | \`InputStream\` | \`OutputStream\` |
| 文件流 | \`FileInputStream\` | \`FileOutputStream\` |
| 缓冲流 | \`BufferedInputStream\` | \`BufferedOutputStream\` |
| 数据流 | \`DataInputStream\` | \`DataOutputStream\` |
| 对象流 | \`ObjectInputStream\` | \`ObjectOutputStream\` |

**核心方法：**
- \`read()\` - 读取一个字节，返回 -1 表示文件结束
- \`write(int b)\` - 写入一个字节
- \`close()\` - 关闭流释放资源`
  }

  if (msg.includes('字符流') || msg.includes('reader') || msg.includes('writer')) {
    return `📘 **Java 字符流**是以字符（16位Unicode）为单位进行读写的流，适合处理文本数据，支持中文等。

**常用字符流：**
| 类型 | 输入流 | 输出流 |
|------|--------|--------|
| 基础流 | \`Reader\` | \`Writer\` |
| 文件流 | \`FileReader\` | \`FileWriter\` |
| 缓冲流 | \`BufferedReader\` | \`BufferedWriter\` |
| 转换流 | \`InputStreamReader\` | \`OutputStreamWriter\` |

🔑 **转换流是关键桥梁：**
- \`InputStreamReader\`：字节 → 字符（解码）
- \`OutputStreamWriter\`：字符 → 字节（编码）`
  }

  if (msg.includes('nio') || msg.includes('channel') || msg.includes('buffer')) {
    return `🚀 **Java NIO（New I/O）**提供非阻塞I/O操作，三大核心组件：

1. **Channel（通道）** - 双向数据传输
   - \`FileChannel\` - 文件通道
   - \`SocketChannel\` - 网络通道

2. **Buffer（缓冲区）** - 数据容器
   - \`flip()\` - 切换到读模式
   - \`clear()\` - 清空缓冲区
   - \`remaining()\` - 剩余元素数量

3. **Selector（选择器）** - 单线程管理多通道，实现高并发`
  }

  if (msg.includes('序列化') || msg.includes('serializable')) {
    return `📦 **Java 序列化**是将对象转换为字节序列的过程，便于存储和传输。

\`\`\`java
import java.io.*;

class Person implements Serializable {
    private static final long serialVersionUID = 1L;
    private String name;
    private transient int age; // 不序列化
    
    // 构造器、getter、setter...
}

// 序列化
try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("person.ser"))) {
    oos.writeObject(new Person("张三", 25));
}

// 反序列化
try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("person.ser"))) {
    Person p = (Person) ois.readObject();
}
\`\`\`

⚠️ \`transient\` 关键字标记的字段不会被序列化。`
  }

  return `你好！我是 Java I/O AI 助手喵~ 🐱

我可以帮你解答以下方面的知识：
- 📥 **字节流**（InputStream/OutputStream）
- 📝 **字符流**（Reader/Writer）
- ⚡ **缓冲流**（BufferedStream）
- 🚀 **NIO**（Channel/Buffer/Selector）
- 📦 **序列化**（ObjectStream）
- 📁 **文件操作**（File/Files）
- 🔒 **try-with-resources** 资源管理

💡 **提示：** 设置 DeepSeek API 密钥后，我可以调用 AI 大模型提供更智能的回答！只需免费注册 DeepSeek 获取密钥即可喵~`
}

const questionPool = {}
const localQuestionBank = [
  { level: 1, question: 'Java中哪个类是所有字节输入流的抽象基类？', options: ['OutputStream', 'InputStream', 'Reader', 'Writer'], correct: 1, explanation: 'InputStream 是所有字节输入流的抽象基类。' },
  { level: 1, question: 'FileInputStream 主要用于什么场景？', options: ['读取文本文件', '读取二进制文件', '写入文件', '网络通信'], correct: 1, explanation: 'FileInputStream 以字节流方式读取任意文件，尤其适合二进制文件（图片、视频等）。' },
  { level: 1, question: 'InputStream.read() 方法一次读取多少数据？', options: ['一个字符', '一个字节', '一行', '所有数据'], correct: 1, explanation: 'read() 方法每次读取一个字节（0-255），返回 -1 表示文件结束。' },
  { level: 1, question: 'OutputStream 的 write(int b) 参数类型是？', options: ['byte', 'int', 'char', 'short'], correct: 1, explanation: 'write(int b) 虽然接受 int 参数，但只写入低 8 位（一个字节）。' },
  { level: 2, question: 'FileReader 和 FileInputStream 的主要区别是什么？', options: ['没有区别', 'FileReader 按字符读取，FileInputStream 按字节读取', 'FileReader 更快', 'FileInputStream 只能读文本'], correct: 1, explanation: 'FileReader 是字符流，按字符（16位Unicode）读取；FileInputStream 是字节流。' },
  { level: 2, question: 'InputStreamReader 的核心作用是什么？', options: ['加速读取', '将字节流转换为字符流', '将字符流转换为字节流', '缓冲数据'], correct: 1, explanation: 'InputStreamReader 是字节流到字符流的桥梁，可将字节解码为字符。' },
  { level: 2, question: 'BufferedReader 的 readLine() 读到末尾返回什么？', options: ['-1', 'null', '空字符串', '抛出异常'], correct: 1, explanation: 'readLine() 读取一行返回 String，到达末尾时返回 null。' },
  { level: 2, question: 'Writer 和 OutputStream 的关系是？', options: ['Writer 继承 OutputStream', 'Writer 是字符输出流的基类', '两者完全相同', 'OutputStream 是字符流'], correct: 1, explanation: 'Writer 是所有字符输出流的抽象基类，OutputStream 是字节输出流的基类。' },
  { level: 3, question: 'BufferedInputStream 默认缓冲区大小为？', options: ['1024字节', '4096字节', '8192字节', '16384字节'], correct: 2, explanation: 'BufferedInputStream 默认缓冲区为 8192 字节（8KB）。' },
  { level: 3, question: 'BufferedWriter 的 flush() 方法作用是什么？', options: ['关闭流', '清空文件内容', '强制将缓冲区数据写入目标', '删除缓冲区'], correct: 2, explanation: 'flush() 将缓冲区中的数据强制刷新到底层输出流。' },
  { level: 3, question: '以下关于缓冲流的描述哪个是错误的？', options: ['缓冲流能减少实际 I/O 操作', '缓冲流默认缓冲区 8KB', '缓冲流只能用于文件操作', '缓冲流包装在基础流之上'], correct: 2, explanation: '缓冲流不仅用于文件，也适用于网络流等任何 I/O 操作。' },
  { level: 3, question: '使用缓冲流后，数据写入目标文件的时机是？', options: ['立即写入', '缓冲区满或调用 flush()/close() 时', '每 1 秒写入一次', '程序结束时写入'], correct: 1, explanation: '数据先写入缓冲区，缓冲区满或手动 flush()/close() 时才实际写入。' },
  { level: 4, question: 'Java 序列化需要实现哪个接口？', options: ['Cloneable', 'Serializable', 'Closeable', 'Comparable'], correct: 1, explanation: '要实现 Java 对象序列化，类必须实现 java.io.Serializable 接口。' },
  { level: 4, question: 'transient 关键字的作用是？', options: ['加速序列化', '标记字段不参与序列化', '标记字段必须序列化', '改变序列化顺序'], correct: 1, explanation: 'transient 修饰的字段在序列化时会被忽略，不会被写入输出流。' },
  { level: 4, question: 'try-with-resources 要求资源必须实现什么接口？', options: ['Closeable', 'AutoCloseable', 'Serializable', 'Flushable'], correct: 1, explanation: 'try-with-resources 要求资源实现 AutoCloseable 接口（Java 7 引入）。' },
  { level: 4, question: 'serialVersionUID 的作用是什么？', options: ['标识序列化版本', '控制序列化顺序', '决定文件大小', '加密序列化数据'], correct: 0, explanation: 'serialVersionUID 用于验证序列化对象的版本兼容性，不匹配会抛出 InvalidClassException。' },
  { level: 5, question: 'Java NIO 中 Channel 与 Stream 的根本区别是？', options: ['Channel 更快', 'Channel 是双向的，Stream 是单向的', 'Channel 只能读', 'Channel 只能写'], correct: 1, explanation: 'Channel 支持双向读写，而传统的 Stream 是单向的（InputStream 只读，OutputStream 只写）。' },
  { level: 5, question: 'Buffer.flip() 方法执行后会发生什么？', options: ['清空缓冲区', 'limit=position，position=0', 'position=limit，limit=0', '重置所有数据'], correct: 1, explanation: 'flip() 将 limit 设为 position，position 归零，从写模式切换到读模式。' },
  { level: 5, question: 'Selector 在 NIO 中的作用是？', options: ['选择文件', '单线程管理多个 Channel', '选择缓冲区', '选择编码方式'], correct: 1, explanation: 'Selector 是多路复用器，允许单线程同时监控多个 Channel 的 I/O 事件。' },
  { level: 5, question: 'Buffer.remaining() 返回什么？', options: ['总容量', '已写入的元素数', '可读/可写的剩余元素数', '缓冲区位置'], correct: 2, explanation: 'remaining() 返回 limit - position 的值，即可读（或可写）的剩余元素数量。' },
  { level: 6, question: 'Java NIO 的 FileChannel 相比传统 FileInputStream 的优势？', options: ['更简单', '支持内存映射和文件锁定', '只能顺序读取', '不需要关闭'], correct: 1, explanation: 'FileChannel 支持内存映射（MappedByteBuffer）、文件区域锁定、随机位置读写等高级特性。' },
  { level: 6, question: 'RandomAccessFile 的 "rw" 模式表示什么？', options: ['只读', '只写', '读写', '读写追加'], correct: 2, explanation: '"rw" 模式表示以可读写方式打开文件，文件不存在时会自动创建。' },
  { level: 6, question: '以下哪个场景最不适合用字节流处理？', options: ['复制图片文件', '读取纯中文文本并逐行显示', '下载网络文件', '序列化对象'], correct: 1, explanation: '读取中文文本应使用字符流（如 BufferedReader/FileReader），字节流按字节读取可能破坏多字节字符。' },
  { level: 6, question: 'PrintWriter 与 BufferedWriter 的主要区别？', options: ['没有区别', 'PrintWriter 提供格式化输出方法（print/println）', 'BufferedWriter 更快', 'PrintWriter 只能写字节'], correct: 1, explanation: 'PrintWriter 提供 print()/println()/printf() 等便捷方法，且默认自动刷新。' },
  { level: 6, question: 'PipedInputStream 和 PipedOutputStream 的连接方式是？', options: ['通过文件连接', '通过 connect() 方法连接', '通过 Socket 连接', '不需要显式连接'], correct: 1, explanation: '需要通过 connect() 方法或构造器将 PipedInputStream 和 PipedOutputStream 配对，实现线程间管道通信。' },
  { level: 6, question: 'DataInputStream 的主要用途是？', options: ['读取文本', '读取二进制数据并还原为 Java 基本类型', '读取图片', '网络通信'], correct: 1, explanation: 'DataInputStream 用于读取 DataOutputStream 写入的 Java 基本类型数据（int、double、UTF 字符串等）。' }
]

app.post('/api/ai/generate-question', async (req, res) => {
  try {
    const { apiKey, difficulty, usedQuestionHashes } = req.body
    const level = Math.min(Math.max(parseInt(difficulty) || 1, 1), 6)
    const usedHashes = usedQuestionHashes || []

    if (apiKey && apiKey.trim()) {
      try {
        const topicList = getTopicsByLevel(level)
        const excludeHint = usedHashes.length > 0
          ? `已经考过的知识点（题目内容哈希）：${usedHashes.join(',')}。请避开这些知识点，出全新的题目。`
          : ''

        const prompt = `请生成一道 Java I/O（输入输出流）相关的选择题，难度等级 ${level}/6。

${excludeHint}

难度参考：
1级=基本概念（InputStream/OutputStream基类识别）
2级=字符流入门（Reader/Writer/转换流）
3级=缓冲流原理（BufferedStream/flush/缓冲区机制）
4级=文件操作与序列化（File/Serializable/try-with-resources）
5级=NIO基础（Channel/Buffer/Selector）
6级=高级特性（内存映射/管道流/数据流/RandomAccessFile）

请输出严格的JSON格式（不要Markdown代码块）：
{"question":"题目内容","options":["A选项","B选项","C选项","D选项"],"correct":0-3,"explanation":"解析"}`

        const aiResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { role: 'system', content: '你是一个 Java I/O 出题专家。严格按JSON格式输出，不要包裹在```中。生成全新不重复的题目。' },
              { role: 'user', content: prompt }
            ],
            max_tokens: 1024,
            temperature: 0.9
          })
        })

        if (aiResponse.ok) {
          const data = await aiResponse.json()
          const raw = data.choices?.[0]?.message?.content || ''
          const jsonMatch = raw.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const question = JSON.parse(jsonMatch[0])
            if (question.question && question.options && question.correct !== undefined) {
              question.fromAI = true
              return res.json(question)
            }
          }
        }
      } catch (aiErr) {
        console.error('AI 生成题目失败，使用本地题库:', aiErr.message)
      }
    }

    const available = localQuestionBank.filter(q => {
      const hash = simpleHash(q.question)
      return q.level <= level && !usedHashes.includes(hash)
    })

    if (available.length === 0) {
      const allAvailable = localQuestionBank.filter(q => !usedHashes.includes(simpleHash(q.question)))
      if (allAvailable.length === 0) {
        const idx = Math.floor(Math.random() * localQuestionBank.length)
        return res.json({ ...localQuestionBank[idx], fromAI: false })
      }
      const pick = allAvailable[Math.floor(Math.random() * allAvailable.length)]
      return res.json({ ...pick, fromAI: false })
    }

    const candidates = available.filter(q => q.level === level)
    const pool = candidates.length >= 2 ? candidates : available
    const pick = pool[Math.floor(Math.random() * pool.length)]
    res.json({ ...pick, fromAI: false })
  } catch (err) {
    console.error('Generate question error:', err.message)
    res.status(500).json({ error: '题目生成失败' })
  }
})

function simpleHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + ch
    hash |= 0
  }
  return 'q' + Math.abs(hash).toString(36)
}

function getTopicsByLevel(level) {
  const topics = {
    1: ['InputStream基类', 'OutputStream基类', 'FileInputStream', 'FileOutputStream', 'read方法', 'write方法'],
    2: ['Reader基类', 'Writer基类', 'FileReader', 'FileWriter', 'InputStreamReader转换流', 'OutputStreamWriter转换流', 'readLine方法', '字符编码'],
    3: ['BufferedInputStream', 'BufferedOutputStream', 'BufferedReader', 'BufferedWriter', 'flush机制', '缓冲区大小', '缓冲原理'],
    4: ['File类', 'Files工具类', 'Serializable接口', 'ObjectOutputStream', 'ObjectInputStream', 'transient关键字', 'serialVersionUID', 'try-with-resources', 'AutoCloseable'],
    5: ['Channel通道', 'Buffer缓冲区', 'Selector选择器', 'FileChannel', 'flip方法', 'clear方法', '非阻塞IO', 'SocketChannel'],
    6: ['RandomAccessFile', '内存映射MappedByteBuffer', '文件锁定', 'PipedInputStream管道流', 'DataInputStream', 'DataOutputStream', 'PrintWriter', 'SequenceInputStream']
  }
  return topics[level] || topics[1]
}

app.listen(PORT, () => {
  console.log(`🚀 Java I/O Game Server is running on http://localhost:${PORT}`)
  console.log(`📋 API Endpoints:`)
  console.log(`   GET/POST /api/questions/random       - 随机获取题目`)
  console.log(`   GET     /api/questions/all           - 获取所有题目`)
  console.log(`   GET     /api/questions/level/:level  - 按关卡获取题目`)
  console.log(`   POST    /api/ai/generate-question    - AI 生成题目（支持去重+难度递增）`)
  console.log(`   POST    /api/ai/chat                 - AI 对话`)
  console.log(`   GET     /api/achievements            - 获取成就列表`)
  console.log(`   GET     /api/health                  - 健康检查`)
})
