const levels = [
    {
        name: "第1关：字节流基础",
        icon: "📥",
        difficulty: 1,
        questions: [
            {
                question: "在 Java 中，哪个类是所有字节输入流的抽象基类？",
                options: ["OutputStream", "InputStream", "Reader", "Writer"],
                correct: 1,
                explanation: "InputStream 是所有字节输入流的抽象基类，而 OutputStream 是字节输出流的基类。Reader 和 Writer 是字符流的基类。"
            },
            {
                question: "以下哪个类用于向文件中写入字节数据？",
                options: ["FileReader", "FileWriter", "FileInputStream", "FileOutputStream"],
                correct: 3,
                explanation: "FileOutputStream 用于向文件中写入字节数据。FileReader/FileWriter 是字符流，用于读写文本文件。"
            },
            {
                question: "阅读以下代码，输出什么？",
                code: "InputStream in = new FileInputStream(\"test.txt\");\nSystem.out.println(in.read());",
                options: ["读取的第一个字符", "读取的第一个字节", "文件内容长度", "抛出异常"],
                correct: 1,
                explanation: "InputStream 的 read() 方法读取的是单个字节，返回 0-255 的 int 值，而不是字符。返回 -1 表示到达文件末尾。"
            },
            {
                question: "close() 方法在 I/O 操作中的主要作用是什么？",
                options: ["加快读取速度", "释放系统资源", "清空缓冲区", "加密数据"],
                correct: 1,
                explanation: "close() 方法用于关闭流并释放与该流相关的系统资源。如果不关闭，可能导致资源泄漏。"
            }
        ]
    },
    {
        name: "第2关：字符流入门",
        icon: "📝",
        difficulty: 1,
        questions: [
            {
                question: "在 Java 中，哪个类是所有字符输入流的抽象基类？",
                options: ["InputStream", "OutputStream", "Reader", "Writer"],
                correct: 2,
                explanation: "Reader 是所有字符输入流的抽象基类。InputStream/OutputStream 是字节流基类，Writer 是字符输出流基类。"
            },
            {
                question: "FileReader 和 FileInputStream 的主要区别是什么？",
                options: [
                    "FileReader 更快",
                    "FileReader 按字符读取，FileInputStream 按字节读取",
                    "没有区别",
                    "FileReader 用于二进制文件"
                ],
                correct: 1,
                explanation: "FileReader 以字符为单位读取，适合文本文件；FileInputStream 以字节为单位读取，适合二进制文件。"
            },
            {
                question: "以下哪个方法可以一次性读取一行文本？",
                options: ["read()", "read(byte[])", "readLine()", "readChar()"],
                correct: 2,
                explanation: "readLine() 是 BufferedReader 的方法，用于读取一行文本。read() 读取单个字符，read(byte[]) 读取字节数组。"
            },
            {
                question: "字符流相对于字节流的优势是什么？",
                options: [
                    "速度更快",
                    "能直接处理中文字符",
                    "不需要关闭",
                    "可以处理二进制数据"
                ],
                correct: 1,
                explanation: "字符流能直接处理 Unicode 字符（如中文），而字节流需要额外的字符编码转换，处理中文时可能会出现乱码。"
            }
        ]
    },
    {
        name: "第3关：缓冲流进阶",
        icon: "⚡",
        difficulty: 2,
        questions: [
            {
                question: "BufferedInputStream 的主要作用是什么？",
                options: [
                    "压缩数据",
                    "提供缓冲功能，减少实际 I/O 操作次数",
                    "加密数据",
                    "分割数据"
                ],
                correct: 1,
                explanation: "BufferedInputStream 使用缓冲区减少对底层流的实际读取次数，提高 I/O 效率。"
            },
            {
                question: "使用缓冲流时，数据是什么时候真正被写入磁盘的？",
                options: [
                    "立即写入",
                    "缓冲区满时自动写入",
                    "程序结束时",
                    "永远不会自动写入"
                ],
                correct: 1,
                explanation: "缓冲流在缓冲区满时自动将数据写入磁盘。也可以调用 flush() 方法强制立即写入。"
            },
            {
                question: "以下哪个组合是正确的缓冲流包装？",
                options: [
                    "BufferedInputStream(FileReader)",
                    "BufferedReader(FileInputStream)",
                    "BufferedWriter(FileWriter)",
                    "BufferedOutputStream(FileOutputStream)"
                ],
                correct: 3,
                explanation: "BufferedOutputStream 包装 FileOutputStream，BufferedWriter 包装 FileWriter。字节流和字符流不能混用包装。"
            },
            {
                question: "newLine() 方法的作用是什么？",
                options: [
                    "创建新文件",
                    "写入平台相关的换行符",
                    "清空缓冲区",
                    "关闭流"
                ],
                correct: 1,
                explanation: "newLine() 在 BufferedWriter 中使用，写入平台相关的换行符（Windows 是 \\r\\n，Linux 是 \\n）。"
            }
        ]
    },
    {
        name: "第4关：文件流实战",
        icon: "📁",
        difficulty: 2,
        questions: [
            {
                question: "当文件不存在时，FileInputStream 会怎样？",
                options: [
                    "自动创建文件",
                    "返回 null",
                    "抛出 FileNotFoundException",
                    "返回空流"
                ],
                correct: 2,
                explanation: "FileInputStream 构造方法要求文件必须存在，否则抛出 FileNotFoundException。FileOutputStream 则会尝试创建新文件。"
            },
            {
                question: "如果要以追加模式打开文件，应该使用哪个构造方法？",
                code: "FileOutputStream fos = new FileOutputStream(?, true);",
                options: [
                    "文件名",
                    "File 对象",
                    "FileDescriptor",
                    "Path 对象"
                ],
                correct: 0,
                explanation: "FileOutputStream(String name, boolean append) 的第二个参数为 true 时表示追加模式。直接传文件名即可实现追加。"
            },
            {
                question: "阅读代码，假设文件存在且可读，结果是什么？",
                code: "FileInputStream fis = new FileInputStream(\"data.bin\");\nint b1 = fis.read();\nfis.skip(2);\nint b2 = fis.read();\nSystem.out.println(b2);",
                options: [
                    "与 b1 相同",
                    "跳过 2 个字节后的第一个字节值",
                    "2",
                    "抛出异常"
                ],
                correct: 1,
                explanation: "read() 读取一个字节，skip(2) 跳过 2 个字节，然后 read() 读取下一个字节。所以 b2 是跳过 2 个字节后的值。"
            },
            {
                question: "try-with-resources 的优势是什么？",
                options: [
                    "代码更短",
                    "自动关闭资源，即使发生异常",
                    "执行更快",
                    "可以同时打开多个文件"
                ],
                correct: 1,
                explanation: "try-with-resources 确保资源在语句结束时自动关闭，即使发生异常也会正确关闭资源，避免资源泄漏。"
            }
        ]
    },
    {
        name: "第5关：NIO新世界",
        icon: "🔮",
        difficulty: 3,
        questions: [
            {
                question: "Java NIO 中的 Buffer 的主要作用是什么？",
                options: [
                    "压缩数据",
                    "作为数据的临时存储容器",
                    "加密数据",
                    "管理线程"
                ],
                correct: 1,
                explanation: "Buffer 是 NIO 中的核心组件，用于临时存储数据。可以写入数据到缓冲区，或从缓冲区读取数据。"
            },
            {
                question: "在 NIO 中，Channel 和传统 Stream 的主要区别是什么？",
                options: [
                    "没有区别",
                    "Channel 可以非阻塞操作，支持多路复用",
                    "Stream 更快",
                    "Channel 不能读写数据"
                ],
                correct: 1,
                explanation: "Channel 可以非阻塞操作，配合 Selector 实现多路复用，适合高并发场景。传统 Stream 只能阻塞式读写。"
            },
            {
                question: "ByteBuffer 的 flip() 方法有什么作用？",
                options: [
                    "翻转缓冲区",
                    "切换读写模式（limit=position, position=0）",
                    "清空缓冲区",
                    "关闭缓冲区"
                ],
                correct: 1,
                explanation: "flip() 方法将缓冲区从写模式切换到读模式：limit 设置为当前 position，position 重置为 0，以便读取刚写入的数据。"
            },
            {
                question: "NIO 的三大核心组件是什么？",
                options: [
                    "Stream, Buffer, Selector",
                    "Channel, Buffer, Selector",
                    "InputStream, OutputStream, Reader",
                    "File, Directory, Path"
                ],
                correct: 1,
                explanation: "NIO 的三大核心组件是：Channel（通道）、Buffer（缓冲区）、Selector（选择器）。"
            }
        ]
    },
    {
        name: "第6关：综合挑战",
        icon: "🏆",
        difficulty: 3,
        questions: [
            {
                question: "以下哪种场景最适合使用字符流而不是字节流？",
                options: [
                    "读写图片文件",
                    "读写视频文件",
                    "读写文本文件（包含中文）",
                    "读写压缩文件"
                ],
                correct: 2,
                explanation: "文本文件（特别是包含中文等非ASCII字符）最适合使用字符流，因为字符流能正确处理 Unicode 编码。"
            },
            {
                question: "要高效读取一个大型文本文件，应该使用以下哪种组合？",
                options: [
                    "FileInputStream + BufferedReader",
                    "BufferedReader + FileReader",
                    "FileReader + BufferedInputStream",
                    "BufferedInputStream + InputStreamReader"
                ],
                correct: 1,
                explanation: "BufferedReader + FileReader 是读取文本文件的最佳组合。BufferedReader 提供缓冲和 readLine() 方法，FileReader 处理字符流。"
            },
            {
                question: "阅读代码，分析输出结果：",
                code: "String content = \"Hello\";\nByteArrayOutputStream baos = new ByteArrayOutputStream();\nbaos.write(content.getBytes());\nSystem.out.println(baos.toString());",
                options: [
                    "Hello",
                    "字节数组地址",
                    "抛出异常",
                    "空字符串"
                ],
                correct: 0,
                explanation: "ByteArrayOutputStream 将数据写入内存字节数组，write() 写入字节，toString() 将其转换为字符串输出 \"Hello\"。"
            },
            {
                question: "ObjectInputStream/ObjectOutputStream 的主要用途是什么？",
                options: [
                    "读写文本",
                    "读写图片",
                    "读写 Java 对象（序列化/反序列化）",
                    "读写压缩数据"
                ],
                correct: 2,
                explanation: "ObjectInputStream/ObjectOutputStream 用于 Java 对象的序列化（写入）和反序列化（读取），实现对象的持久化传输。"
            },
            {
                question: "在处理 I/O 异常时，正确的做法是什么？",
                code: "try (FileInputStream fis = new FileInputStream(\"file.txt\")) {\n    // 读取文件\n} catch (IOException e) {\n    e.printStackTrace();\n}",
                options: [
                    "错误，应该在 try 外面关闭流",
                    "正确，使用了 try-with-resources",
                    "错误，catch 应该捕获所有异常",
                    "错误，不应该捕获异常"
                ],
                correct: 1,
                explanation: "这段代码正确使用了 try-with-resources，确保 FileInputStream 自动关闭。IOException 是 I/O 操作最常见的异常类型。"
            }
        ]
    }
];

const achievements = {
    firstWin: { id: 'firstWin', name: '初次胜利', desc: '答对第一题', icon: '🎯', unlocked: false },
    fiveCorrect: { id: 'fiveCorrect', name: '小有成就', desc: '累计答对5题', icon: '⭐', unlocked: false },
    tenCorrect: { id: 'tenCorrect', name: '稳步前进', desc: '累计答对10题', icon: '🌟', unlocked: false },
    twentyCorrect: { id: 'twentyCorrect', name: '知识达人', desc: '累计答对20题', icon: '💫', unlocked: false },
    firstLevelComplete: { id: 'firstLevelComplete', name: '关卡突破', desc: '完成第一个关卡', icon: '🏁', unlocked: false },
    allLevelsComplete: { id: 'allLevelsComplete', name: '全面通关', desc: '完成所有6个关卡', icon: '👑', unlocked: false },
    tenCombo: { id: 'tenCombo', name: '连胜达人', desc: '连续答对10题', icon: '🔥', unlocked: false },
    perfectLevel: { id: 'perfectLevel', name: '完美通关', desc: '某个关卡全部答对', icon: '💎', unlocked: false },
    endlessSurvivor: { id: 'endlessSurvivor', name: '无尽挑战者', desc: '无尽模式答对15题', icon: '♾️', unlocked: false },
    learnedMindmap: { id: 'learnedMindmap', name: '知识探索者', desc: '学习知识导图并完成测验', icon: '📚', unlocked: false }
};

let currentLevel = 0;
let currentQuestion = 0;
let score = 0;
let lives = 3;
let totalCorrect = 0;
let totalQuestions = 0;
let combo = 0;
let maxCombo = 0;
let isEndlessMode = false;
let endlessQuestionCount = 0;
let currentDifficulty = 1;
let usedQuestionIndices = new Set();
let levelPerfect = true;
let learnedMindmap = false;

function loadAchievements() {
    const saved = localStorage.getItem('javaIOGameAchievements');
    if (saved) {
        const data = JSON.parse(saved);
        Object.keys(data).forEach(key => {
            if (achievements[key]) {
                achievements[key].unlocked = data[key];
            }
        });
    }
    const stats = localStorage.getItem('javaIOGameStats');
    if (stats) {
        const data = JSON.parse(stats);
        totalCorrect = data.totalCorrect || 0;
    }
}

function saveAchievements() {
    const data = {};
    Object.keys(achievements).forEach(key => {
        data[key] = achievements[key].unlocked;
    });
    localStorage.setItem('javaIOGameAchievements', JSON.stringify(data));
    
    localStorage.setItem('javaIOGameStats', JSON.stringify({
        totalCorrect: totalCorrect
    }));
}

function unlockAchievement(achievementKey) {
    if (!achievements[achievementKey].unlocked) {
        achievements[achievementKey].unlocked = true;
        saveAchievements();
        showAchievementNotification(achievements[achievementKey]);
        renderAchievements();
    }
}

function showAchievementNotification(achievement) {
    const notification = document.getElementById('achievementNotification');
    document.getElementById('achievementNotificationText').textContent = `${achievement.name}: ${achievement.desc}`;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function renderAchievements() {
    const container = document.getElementById('achievementsList');
    container.innerHTML = '';
    Object.values(achievements).forEach(ach => {
        const div = document.createElement('div');
        div.className = `achievement ${ach.unlocked ? 'unlocked' : 'locked'}`;
        div.innerHTML = `
            <span class="achievement-icon">${ach.unlocked ? ach.icon : '🔒'}</span>
            <div class="achievement-info">
                <div class="achievement-name">${ach.name}</div>
                <div class="achievement-desc">${ach.desc}</div>
            </div>
        `;
        container.appendChild(div);
    });
}

function checkAchievements() {
    if (totalCorrect >= 1) unlockAchievement('firstWin');
    if (totalCorrect >= 5) unlockAchievement('fiveCorrect');
    if (totalCorrect >= 10) unlockAchievement('tenCorrect');
    if (totalCorrect >= 20) unlockAchievement('twentyCorrect');
    if (combo >= 10) unlockAchievement('tenCombo');
}

function startGame() {
    startLevel(0);
}

function startLevel(levelIndex) {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    isEndlessMode = false;
    document.getElementById('endlessBadge').classList.add('hidden');
    document.getElementById('comboStat').style.display = 'none';
    currentLevel = levelIndex;
    currentQuestion = 0;
    score = 0;
    lives = 3;
    combo = 0;
    levelPerfect = true;
    updateStats();
    loadQuestion();
}

function startEndlessMode() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    isEndlessMode = true;
    document.getElementById('endlessBadge').classList.remove('hidden');
    document.getElementById('comboStat').style.display = 'flex';
    currentLevel = 0;
    currentQuestion = 0;
    score = 0;
    lives = 3;
    combo = 0;
    maxCombo = 0;
    endlessQuestionCount = 0;
    currentDifficulty = 1;
    usedQuestionIndices = new Set();
    updateStats();
    loadEndlessQuestion();
}

function openAiAssistant() {
    window.location.href = 'ai-assistant.html';
}

function showMindmap() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('mindmapScreen').classList.remove('hidden');
}

function toggleMindmap(element) {
    const content = element.nextElementSibling;
    content.classList.toggle('active');
}

function startMindmapQuiz() {
    learnedMindmap = true;
    startGame();
}

function backToStart() {
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('endScreen').classList.add('hidden');
    document.getElementById('mindmapScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');
    renderAchievements();
}

function getRandomQuestion() {
    const allQuestions = [];
    levels.forEach((level, levelIndex) => {
        if (level.difficulty <= currentDifficulty) {
            level.questions.forEach((q, qIndex) => {
                allQuestions.push({ ...q, levelIndex, qIndex });
            });
        }
    });

    let availableQuestions = allQuestions.filter((q, i) => !usedQuestionIndices.has(`${q.levelIndex}-${q.qIndex}`));
    
    if (availableQuestions.length === 0) {
        usedQuestionIndices.clear();
        availableQuestions = allQuestions;
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selected = availableQuestions[randomIndex];
    usedQuestionIndices.add(`${selected.levelIndex}-${selected.qIndex}`);
    return selected;
}

function loadQuestion() {
    const level = levels[currentLevel];
    const question = level.questions[currentQuestion];

    document.getElementById('levelBadge').textContent = level.name;
    document.getElementById('questionNumber').textContent = `问题 ${currentQuestion + 1}/${level.questions.length}`;
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('codeBlock').textContent = question.code || '';
    document.getElementById('codeBlock').style.display = question.code ? 'block' : 'none';

    renderOptions(question);
    updateProgress();
}

async function loadEndlessQuestion() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const optionsContainer = document.getElementById('optionsContainer');
    
    // 显示加载状态
    loadingIndicator.style.display = 'block';
    optionsContainer.innerHTML = '';
    document.getElementById('questionText').textContent = '正在生成题目...';

    try {
        // 获取当前难度（根据答题数量动态调整，最多5级）
        const adjustedDifficulty = Math.min(5, 1 + Math.floor(endlessQuestionCount / 3));
        
        // 调用 AI 生成题目
        const question = await window.deepSeekService?.generateSingleQuestion(adjustedDifficulty) || 
                        generateLocalQuestion(adjustedDifficulty);

        endlessQuestionCount++;

        document.getElementById('levelBadge').textContent = `无尽挑战 - 难度 ${adjustedDifficulty}`;
        document.getElementById('questionNumber').textContent = `问题 ${endlessQuestionCount}`;
        document.getElementById('questionText').textContent = question.question;
        document.getElementById('codeBlock').textContent = question.code || '';
        document.getElementById('codeBlock').style.display = question.code ? 'block' : 'none';

        renderOptions(question);
    } catch (error) {
        console.error('加载题目失败:', error);
        // 使用本地备用题目
        const question = generateLocalQuestion(Math.min(5, 1 + Math.floor(endlessQuestionCount / 3)));
        endlessQuestionCount++;
        document.getElementById('levelBadge').textContent = `无尽挑战 - 难度 ${currentDifficulty}`;
        document.getElementById('questionNumber').textContent = `问题 ${endlessQuestionCount}`;
        document.getElementById('questionText').textContent = question.question;
        renderOptions(question);
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

// 本地备用题库（当AI不可用时使用）
function generateLocalQuestion(difficulty) {
    const localQuestions = [
        {
            question: "Java中，以下哪个类是所有字节输入流的抽象基类？",
            options: ["OutputStream", "InputStream", "Reader", "Writer"],
            correct: 1,
            explanation: "InputStream 是所有字节输入流的抽象基类，OutputStream 是字节输出流基类，Reader/Writer 是字符流基类。"
        },
        {
            question: "BufferedReader的readLine()方法返回什么？",
            options: ["字节", "字符", "字符串", "整数"],
            correct: 2,
            explanation: "readLine()方法读取一行文本并返回字符串，到达文件末尾时返回null。"
        },
        {
            question: "Java NIO中，flip()方法的作用是什么？",
            options: ["翻转缓冲区", "切换到读模式", "清空缓冲区", "写入数据"],
            correct: 1,
            explanation: "flip()方法将缓冲区从写模式切换到读模式，设置limit=position，position=0。"
        },
        {
            question: "try-with-resources语句的优势是什么？",
            options: ["代码更短", "自动关闭资源", "运行更快", "占用内存更少"],
            correct: 1,
            explanation: "try-with-resources会自动关闭实现AutoCloseable接口的资源，即使发生异常也能正确关闭。"
        },
        {
            question: "以下哪个类用于对象序列化？",
            options: ["FileOutputStream", "ObjectOutputStream", "DataOutputStream", "BufferedOutputStream"],
            correct: 1,
            explanation: "ObjectOutputStream用于将Java对象序列化并写入输出流。"
        },
        {
            question: "InputStream的read()方法返回-1表示什么？",
            options: ["读取错误", "文件结束", "读取超时", "缓冲区为空"],
            correct: 1,
            explanation: "read()方法返回-1表示已到达输入流的末尾。"
        },
        {
            question: "以下哪个流是字符流？",
            options: ["FileInputStream", "BufferedInputStream", "FileReader", "DataOutputStream"],
            correct: 2,
            explanation: "FileReader是字符输入流，其他选项都是字节流。"
        },
        {
            question: "Java NIO中，Channel的主要特点是什么？",
            options: ["只能读", "只能写", "双向传输", "只能处理文件"],
            correct: 2,
            explanation: "Channel是双向的，可以同时进行读写操作。"
        },
        {
            question: "OutputStreamWriter的作用是什么？",
            options: ["将字节转为字符", "将字符转为字节", "缓冲输出", "序列化对象"],
            correct: 1,
            explanation: "OutputStreamWriter是字符流到字节流的桥梁，将字符编码为字节。"
        },
        {
            question: "以下哪个接口用于自动资源管理？",
            options: ["Closeable", "AutoCloseable", "Serializable", "Cloneable"],
            correct: 1,
            explanation: "AutoCloseable接口是try-with-resources的基础，Java 7引入。"
        }
    ];

    // 根据难度选择题目
    const startIndex = Math.min(difficulty - 1, 5);
    const endIndex = Math.min(startIndex + 5, localQuestions.length);
    const availableQuestions = localQuestions.slice(startIndex, endIndex);
    
    return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
}

function renderOptions(question) {
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => selectOption(index, question);
        optionsContainer.appendChild(optionDiv);
    });

    document.getElementById('feedback').className = 'feedback';
    document.getElementById('feedback').textContent = '';
    document.getElementById('explanation').classList.remove('show');
    document.getElementById('nextBtn').classList.remove('show');
    document.getElementById('continueBtn').classList.remove('show');
}

function selectOption(index, question) {
    const options = document.querySelectorAll('.option');
    options.forEach(opt => opt.style.pointerEvents = 'none');

    if (index === question.correct) {
        options[index].classList.add('correct');
        document.getElementById('feedback').textContent = '🎉 回答正确！';
        document.getElementById('feedback').className = 'feedback correct';
        
        const baseScore = isEndlessMode ? currentDifficulty * 15 : (currentLevel + 1) * 10;
        score += baseScore;
        totalCorrect++;
        combo++;
        if (combo > maxCombo) maxCombo = combo;
        
        if (isEndlessMode && combo % 5 === 0) {
            if (currentDifficulty < 3) {
                currentDifficulty++;
            }
        }
        
        if (isEndlessMode && totalCorrect >= 15) {
            unlockAchievement('endlessSurvivor');
        }
        
        lives = Math.min(lives + 1, 10);
        
        if (isEndlessMode) {
            document.getElementById('nextBtn').textContent = '下一题';
        } else if (currentQuestion === levels[currentLevel].questions.length - 1 && currentLevel === levels.length - 1) {
            document.getElementById('nextBtn').textContent = '查看结果';
        } else {
            document.getElementById('nextBtn').textContent = '下一题';
        }
        document.getElementById('nextBtn').classList.add('show');
        
        checkAchievements();
    } else {
        options[index].classList.add('incorrect');
        options[question.correct].classList.add('correct');
        document.getElementById('feedback').textContent = '❌ 回答错误！';
        document.getElementById('feedback').className = 'feedback incorrect';
        lives--;
        combo = 0;
        levelPerfect = false;
        
        updateStats();

        if (lives <= 0) {
            document.getElementById('feedback').textContent = '💔 生命值耗尽！';
            document.getElementById('continueBtn').textContent = '查看结果';
            document.getElementById('continueBtn').classList.add('show');
        } else {
            document.getElementById('continueBtn').textContent = '继续挑战';
            document.getElementById('continueBtn').classList.add('show');
        }
    }

    totalQuestions++;
    document.getElementById('explanation').textContent = question.explanation;
    document.getElementById('explanation').classList.add('show');
    updateStats();
}

function nextQuestion() {
    if (isEndlessMode) {
        loadEndlessQuestion();
        return;
    }
    
    currentQuestion++;
    const level = levels[currentLevel];

    if (currentQuestion >= level.questions.length) {
        if (currentLevel === 0) unlockAchievement('firstLevelComplete');
        if (levelPerfect) unlockAchievement('perfectLevel');
        
        currentLevel++;
        currentQuestion = 0;
        levelPerfect = true;
    }

    if (currentLevel >= levels.length) {
        unlockAchievement('allLevelsComplete');
        if (learnedMindmap) unlockAchievement('learnedMindmap');
        showEndScreen();
    } else {
        loadQuestion();
    }
}

function continueGame() {
    if (lives <= 0) {
        showEndScreen();
        return;
    }

    if (isEndlessMode) {
        loadEndlessQuestion();
        return;
    }

    currentQuestion++;
    const level = levels[currentLevel];

    if (currentQuestion >= level.questions.length) {
        if (currentLevel === 0) unlockAchievement('firstLevelComplete');
        currentLevel++;
        currentQuestion = 0;
    }

    if (currentLevel >= levels.length) {
        unlockAchievement('allLevelsComplete');
        if (learnedMindmap) unlockAchievement('learnedMindmap');
        showEndScreen();
    } else {
        loadQuestion();
    }
}

function showEndScreen() {
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('endScreen').classList.remove('hidden');

    document.getElementById('finalScore').textContent = score;
    document.getElementById('correctCount').textContent = totalCorrect;
    document.getElementById('totalQuestions').textContent = totalQuestions;
    document.getElementById('accuracy').textContent = totalQuestions > 0 ?
        Math.round((totalCorrect / totalQuestions) * 100) + '%' : '0%';

    let rank, tip;
    const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

    if (accuracy >= 90) {
        rank = '🌟 Java I/O 大师';
        tip = '太棒了！你对 Java I/O 的理解已经非常深入！';
    } else if (accuracy >= 70) {
        rank = '🏅 高级学者';
        tip = '很不错！继续深入学习，你一定能成为大师！';
    } else if (accuracy >= 50) {
        rank = '📚 中级学者';
        tip = '已有基础，建议复习后再次挑战！';
    } else {
        rank = '🔰 初级学者';
        tip = '加油！多练习一定能进步！';
    }

    document.getElementById('rank').textContent = rank;
    document.getElementById('tipText').textContent = tip;
}

function restartGame() {
    document.getElementById('endScreen').classList.add('hidden');
    if (isEndlessMode) {
        startEndlessMode();
    } else {
        startGame();
    }
}

function updateStats() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = currentLevel + 1;
    document.getElementById('lives').textContent = lives;
    document.getElementById('combo').textContent = combo;
}

function updateProgress() {
    if (isEndlessMode) {
        document.getElementById('progressBar').style.width = '100%';
        return;
    }
    const totalLevels = levels.length;
    const levelProgress = currentQuestion / levels[currentLevel].questions.length;
    const overallProgress = ((currentLevel + levelProgress) / totalLevels) * 100;
    document.getElementById('progressBar').style.width = overallProgress + '%';
}

// 设置自动保存机制
let autoSaveInterval = null;

function setupAutoSave() {
    autoSaveInterval = setInterval(() => {
        if (isEndlessMode || currentLevel > 0 || score > 0) {
            const gameState = {
                score,
                lives,
                currentLevel,
                currentQuestion,
                isEndlessMode,
                endlessQuestionCount,
                currentDifficulty,
                timestamp: Date.now()
            };
            localStorage.setItem('java-io-game-state', JSON.stringify(gameState));
        }
    }, 10000); // 每10秒自动保存一次
}

// 设置页面离开前的确认
function setupBeforeUnload() {
    window.addEventListener('beforeunload', function(e) {
        if (isEndlessMode || currentLevel > 0 || score > 0) {
            // 兼容不同浏览器
            e.preventDefault();
            e.returnValue = '';
            return '你确定要离开吗？当前游戏进度将会保存。';
        }
    });
}

// 心跳机制：保持页面活跃，防止超时退出
let heartbeatInterval = null;
let lastActivityTime = Date.now();

function setupHeartbeat() {
    // 监听用户活动
    document.addEventListener('mousemove', () => { lastActivityTime = Date.now(); });
    document.addEventListener('keydown', () => { lastActivityTime = Date.now(); });
    document.addEventListener('click', () => { lastActivityTime = Date.now(); });
    document.addEventListener('scroll', () => { lastActivityTime = Date.now(); });

    // 心跳检查：每30秒检查一次
    heartbeatInterval = setInterval(() => {
        const now = Date.now();
        const idleTime = (now - lastActivityTime) / 1000; // 秒

        // 如果超过10分钟没有活动，显示提醒
        if (idleTime > 600) {
            alert('您已经有一段时间没有操作了！如果继续不操作，页面可能会自动刷新。');
            lastActivityTime = Date.now();
        }
    }, 30000); // 每30秒检查一次
}

// 在初始化时启动心跳机制
function init() {
    loadAchievements();
    renderAchievements();
    loadAIScripts();
    setupAutoSave();
    setupBeforeUnload();
    setupHeartbeat();
}

function loadAIScripts() {
    const scripts = [
        'api-config.js',
        'deepseek-service.js',
        'ai-chat-panel.js'
    ];

    scripts.forEach((src, index) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            console.log(`Loaded: ${src}`);
        };
        script.onerror = () => {
            console.error(`Failed to load: ${src}`);
        };
        document.head.appendChild(script);
    });
}

document.addEventListener('DOMContentLoaded', init);
