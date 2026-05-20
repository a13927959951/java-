import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGameStore = defineStore('game', () => {
  // 游戏状态
  const currentModule = ref(0)
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
  const currentKnowledgeArea = ref('')

  // 成就状态
  const achievements = ref({
    firstWin: { id: 'firstWin', name: '初露锋芒', desc: '答对第一道题', icon: '⭐', unlocked: false },
    firstLevelComplete: { id: 'firstLevelComplete', name: '新手入门', desc: '完成第一关', icon: '🎯', unlocked: false },
    perfectLevel: { id: 'perfectLevel', name: '完美通关', desc: '一关内全部答对', icon: '💯', unlocked: false },
    allLevelsComplete: { id: 'allLevelsComplete', name: '通关大师', desc: '完成所有关卡', icon: '🏆', unlocked: false },
    tenCombo: { id: 'tenCombo', name: '连击高手', desc: '连续答对10题', icon: '🔥', unlocked: false },
    twentyCorrect: { id: 'twentyCorrect', name: '答题达人', desc: '累计答对20题', icon: '📚', unlocked: false },
    endlessSurvivor: { id: 'endlessSurvivor', name: '无尽挑战者', desc: '无尽模式答对15题', icon: '♾️', unlocked: false },
    learnedMindmap: { id: 'learnedMindmap', name: '知识探索者', desc: '学习知识导图', icon: '📖', unlocked: false },
    javaMaster: { id: 'javaMaster', name: 'Java大师', desc: '完成所有模块', icon: '👑', unlocked: false },
    oopExpert: { id: 'oopExpert', name: 'OOP专家', desc: '完成面向对象模块', icon: '🏠', unlocked: false },
    collectionKing: { id: 'collectionKing', name: '集合金手', desc: '完成集合框架模块', icon: '📦', unlocked: false },
    threadNinja: { id: 'threadNinja', name: '线程忍者', desc: '完成多线程模块', icon: '🧵', unlocked: false },
    ioMaster: { id: 'ioMaster', name: 'IO达人', desc: '完成IO模块', icon: '💾', unlocked: false },
    dbWizard: { id: 'dbWizard', name: '数据库巫师', desc: '完成数据库模块', icon: '🗄️', unlocked: false }
  })

  // 知识点模块数据
  const knowledgeModules = ref([
    {
      id: 'basics',
      name: '📚 Java基础',
      icon: '📚',
      color: '#0066cc',
      description: '数据类型、运算符、流程控制',
      levels: [
        {
          id: 1,
          name: '第1关：数据类型',
          questions: [
            {
              id: 1,
              question: 'Java中，以下哪个是基本数据类型？',
              options: ['String', 'Integer', 'int', 'ArrayList'],
              correct: 2,
              explanation: 'int是Java的基本数据类型，String、Integer、ArrayList都是引用类型。'
            },
            {
              id: 2,
              question: 'Java中，byte类型的取值范围是？',
              options: ['0-255', '-128到127', '-256到255', '-32768到32767'],
              correct: 1,
              explanation: 'byte类型占1字节，取值范围是-128到127。'
            },
            {
              id: 3,
              question: '以下哪个不是Java的关键字？',
              options: ['class', 'void', 'main', 'public'],
              correct: 2,
              explanation: 'main是方法名，不是Java关键字。class、void、public都是关键字。'
            },
            {
              id: 4,
              question: 'Java中，== 和 equals() 的主要区别是什么？',
              options: ['没区别', '==比较引用，equals()比较内容', '==比较内容，equals()比较引用', '都是比较引用'],
              correct: 1,
              explanation: '==比较对象引用是否相同，equals()方法默认比较引用，但很多类（如String）重写它来比较内容。'
            }
          ]
        },
        {
          id: 2,
          name: '第2关：流程控制',
          questions: [
            {
              id: 5,
              question: 'for循环的正确语法是？',
              options: ['for i=0; i<10; i++', 'for (int i=0; i<10)', 'for (int i=0; i<10; i++)', 'for int i in 0..10'],
              correct: 2,
              explanation: 'for循环的标准语法是：for (初始化; 条件; 更新) { ... }'
            },
            {
              id: 6,
              question: 'switch语句支持哪些类型？',
              options: ['只有int', 'int、char、String、enum', '所有类型', '只有String'],
              correct: 1,
              explanation: 'Java 7及以上支持int、char、String和枚举类型的switch语句。'
            },
            {
              id: 7,
              question: '以下哪个循环会至少执行一次？',
              options: ['for', 'while', 'do-while', 'for-each'],
              correct: 2,
              explanation: 'do-while循环先执行循环体再判断条件，所以至少执行一次。'
            },
            {
              id: 8,
              question: 'break和continue的区别是？',
              options: ['没区别', 'break跳出循环，continue跳过本次', 'continue跳出循环，break跳过本次', '都是跳出循环'],
              correct: 1,
              explanation: 'break完全跳出循环，continue只是跳过当前迭代，继续下一次循环。'
            }
          ]
        },
        {
          id: 3,
          name: '第3关：运算符',
          questions: [
            {
              id: 9,
              question: 'a++ 和 ++a 的区别是？',
              options: ['没区别', 'a++先使用后自增，++a先自增后使用', '相反', '都是先自增'],
              correct: 1,
              explanation: 'a++是后自增，先返回原值再自增；++a是前自增，先自增再返回新值。'
            },
            {
              id: 10,
              question: '位运算符 & 和 && 的区别是？',
              options: ['没区别', '&&有短路求值，&没有', '&有短路求值，&&没有', '都是逻辑与'],
              correct: 1,
              explanation: '&&是短路与，当第一个操作数为false时不再计算第二个；&是按位与，总是计算两边。'
            },
            {
              id: 11,
              question: '以下哪个是三元运算符？',
              options: ['+', '?', '?:', '??'],
              correct: 2,
              explanation: '三元运算符（条件运算符）的语法是：condition ? expr1 : expr2'
            },
            {
              id: 12,
              question: 'instanceof运算符的作用是？',
              options: ['计算实例大小', '判断对象是否是某个类的实例', '创建实例', '删除实例'],
              correct: 1,
              explanation: 'instanceof用于判断对象是否是特定类或其子类的实例。'
            }
          ]
        }
      ]
    },
    {
      id: 'oop',
      name: '🏠 面向对象',
      icon: '🏠',
      color: '#00cc66',
      description: '封装、继承、多态、抽象',
      levels: [
        {
          id: 1,
          name: '第1关：封装与类',
          questions: [
            {
              id: 13,
              question: 'Java中，private修饰符的作用是？',
              options: ['所有类都可访问', '仅本类可访问', '同包可访问', '子类可访问'],
              correct: 1,
              explanation: 'private修饰的成员仅在本类内部可访问，体现封装性。'
            },
            {
              id: 14,
              question: '构造方法的特点是？',
              options: ['返回void', '方法名与类名相同', '必须有参数', '不能重载'],
              correct: 1,
              explanation: '构造方法名称必须与类名相同，没有返回类型，可以重载。'
            },
            {
              id: 15,
              question: 'static关键字修饰的成员属于？',
              options: ['对象', '类', '方法', '变量'],
              correct: 1,
              explanation: 'static成员属于类本身，不属于任何对象实例。'
            },
            {
              id: 16,
              question: 'this关键字的作用是？',
              options: ['引用父类', '引用当前对象', '引用子类', '引用静态方法'],
              correct: 1,
              explanation: 'this引用当前对象实例，可以用来访问实例成员。'
            }
          ]
        },
        {
          id: 2,
          name: '第2关：继承',
          questions: [
            {
              id: 17,
              question: 'Java中一个类可以继承几个父类？',
              options: ['多个', '一个', '零个', '取决于内存'],
              correct: 1,
              explanation: 'Java是单继承语言，一个类只能继承一个父类，但可以实现多个接口。'
            },
            {
              id: 18,
              question: 'super关键字的作用是？',
              options: ['引用子类', '引用父类', '引用当前对象', '引用静态成员'],
              correct: 1,
              explanation: 'super用于访问父类的成员和构造方法。'
            },
            {
              id: 19,
              question: '子类构造方法中，super()调用的位置是？',
              options: ['任意位置', '第一行', '最后一行', '不能调用'],
              correct: 1,
              explanation: 'super()必须是子类构造方法的第一条语句。'
            },
            {
              id: 20,
              question: 'final类的特点是？',
              options: ['可以继承', '不能被继承', '只能有一个方法', '只能有一个成员变量'],
              correct: 1,
              explanation: 'final类不能被继承，常用于防止继承带来的副作用。'
            }
          ]
        },
        {
          id: 3,
          name: '第3关：多态',
          questions: [
            {
              id: 21,
              question: '多态的实现方式有哪些？',
              options: ['只有继承', '继承和接口', '只有接口', '抽象类'],
              correct: 1,
              explanation: '多态可以通过继承（方法重写）和接口实现。'
            },
            {
              id: 22,
              question: '方法重写（override）的条件是？',
              options: ['方法名不同', '方法名相同，参数列表相同', '只有返回值相同', '参数列表必须不同'],
              correct: 1,
              explanation: '方法重写要求方法名、参数列表完全相同，返回类型兼容。'
            },
            {
              id: 23,
              question: '方法重载（overload）的条件是？',
              options: ['方法名不同', '方法名相同，参数列表不同', '返回类型不同', '访问修饰符不同'],
              correct: 1,
              explanation: '方法重载要求方法名相同，但参数列表（类型、数量、顺序）不同。'
            },
            {
              id: 24,
              question: '抽象方法的特点是？',
              options: ['有方法体', '没有方法体', '必须是static', '必须是private'],
              correct: 1,
              explanation: '抽象方法只有声明没有实现，必须在抽象类中，由子类实现。'
            }
          ]
        },
        {
          id: 4,
          name: '第4关：接口',
          questions: [
            {
              id: 25,
              question: '接口中的方法默认是什么修饰符？',
              options: ['private', 'protected', 'public abstract', 'default'],
              correct: 2,
              explanation: '接口中的方法默认是public abstract，Java 8+还支持default和static方法。'
            },
            {
              id: 26,
              question: '一个类可以实现几个接口？',
              options: ['一个', '多个', '零个', '只能实现一个'],
              correct: 1,
              explanation: 'Java类可以实现多个接口，弥补单继承的限制。'
            },
            {
              id: 27,
              question: '接口和抽象类的区别是？',
              options: ['没区别', '接口只能有抽象方法，抽象类可以有实现', '抽象类只能有抽象方法', '接口可以有构造方法'],
              correct: 1,
              explanation: '接口只能包含抽象方法（Java 8+除外），抽象类可以有抽象方法和具体方法。'
            },
            {
              id: 28,
              question: 'Java 8接口新增了什么特性？',
              options: ['私有方法', '默认方法和静态方法', '构造方法', '成员变量'],
              correct: 1,
              explanation: 'Java 8允许接口包含default方法（有实现）和static方法。'
            }
          ]
        }
      ]
    },
    {
      id: 'collections',
      name: '📦 集合框架',
      icon: '📦',
      color: '#cc6600',
      description: 'List、Map、Set、迭代器',
      levels: [
        {
          id: 1,
          name: '第1关：List接口',
          questions: [
            {
              id: 29,
              question: 'ArrayList和LinkedList的主要区别是？',
              options: ['没区别', 'ArrayList基于数组，LinkedList基于链表', '相反', '都是线程安全的'],
              correct: 1,
              explanation: 'ArrayList基于动态数组，随机访问快；LinkedList基于双向链表，插入删除快。'
            },
            {
              id: 30,
              question: 'List的特点是？',
              options: ['元素无序，不允许重复', '元素有序，允许重复', '元素无序，允许重复', '元素有序，不允许重复'],
              correct: 1,
              explanation: 'List是有序集合，允许元素重复，元素可通过索引访问。'
            },
            {
              id: 31,
              question: 'ArrayList的默认初始容量是？',
              options: ['0', '10', '16', '8'],
              correct: 1,
              explanation: 'ArrayList默认初始容量是10，当元素超过容量时自动扩容50%。'
            },
            {
              id: 32,
              question: 'Vector和ArrayList的区别是？',
              options: ['没区别', 'Vector是线程安全的', 'ArrayList是线程安全的', 'Vector更快'],
              correct: 1,
              explanation: 'Vector是线程安全的（方法加了synchronized），但性能不如ArrayList。'
            }
          ]
        },
        {
          id: 2,
          name: '第2关：Set接口',
          questions: [
            {
              id: 33,
              question: 'HashSet的特点是？',
              options: ['有序，允许重复', '无序，不允许重复', '有序，不允许重复', '无序，允许重复'],
              correct: 1,
              explanation: 'HashSet基于哈希表，元素无序且不允许重复。'
            },
            {
              id: 34,
              question: 'TreeSet的特点是？',
              options: ['无序', '自然排序', '随机排序', '插入顺序'],
              correct: 1,
              explanation: 'TreeSet基于红黑树，元素按自然顺序或自定义比较器排序。'
            },
            {
              id: 35,
              question: 'HashSet判断元素相等的依据是？',
              options: ['equals()', 'hashCode()', 'equals()和hashCode()', '=='],
              correct: 2,
              explanation: 'HashSet先比较hashCode()，再用equals()确认，两者都相等才视为相同元素。'
            },
            {
              id: 36,
              question: 'LinkedHashSet的特点是？',
              options: ['无序', '自然排序', '保持插入顺序', '随机排序'],
              correct: 2,
              explanation: 'LinkedHashSet是HashSet的子类，保持元素的插入顺序。'
            }
          ]
        },
        {
          id: 3,
          name: '第3关：Map接口',
          questions: [
            {
              id: 37,
              question: 'HashMap的特点是？',
              options: ['键有序', '键无序，允许null键', '键有序，不允许null', '线程安全'],
              correct: 1,
              explanation: 'HashMap键值对无序，允许一个null键和多个null值，非线程安全。'
            },
            {
              id: 38,
              question: 'TreeMap的特点是？',
              options: ['键无序', '键按自然顺序排序', '保持插入顺序', '允许null键'],
              correct: 1,
              explanation: 'TreeMap基于红黑树，键按自然顺序或自定义比较器排序。'
            },
            {
              id: 39,
              question: 'HashMap的默认初始容量是？',
              options: ['8', '16', '10', '32'],
              correct: 1,
              explanation: 'HashMap默认初始容量是16，负载因子0.75。'
            },
            {
              id: 40,
              question: 'ConcurrentHashMap和Hashtable的区别是？',
              options: ['没区别', 'ConcurrentHashMap分段锁，性能更好', 'Hashtable更快', '都是线程安全的，没区别'],
              correct: 1,
              explanation: 'ConcurrentHashMap使用分段锁，并发性能远优于Hashtable的全局锁。'
            }
          ]
        }
      ]
    },
    {
      id: 'exception',
      name: '⚠️ 异常处理',
      icon: '⚠️',
      color: '#ff6600',
      description: 'try-catch、自定义异常',
      levels: [
        {
          id: 1,
          name: '第1关：异常分类',
          questions: [
            {
              id: 41,
              question: 'Exception和Error的区别是？',
              options: ['没区别', 'Exception可恢复，Error不可恢复', 'Error可恢复，Exception不可恢复', '都是运行时异常'],
              correct: 1,
              explanation: 'Exception是程序可以处理的异常，Error是严重错误（如OutOfMemoryError），通常无法恢复。'
            },
            {
              id: 42,
              question: 'Checked Exception和Unchecked Exception的区别是？',
              options: ['没区别', 'Checked必须显式处理', 'Unchecked必须显式处理', '都是编译时检查'],
              correct: 1,
              explanation: 'Checked Exception（如IOException）必须显式处理（try-catch或throws），Unchecked Exception（如RuntimeException）不需要。'
            },
            {
              id: 43,
              question: '以下哪个是RuntimeException？',
              options: ['IOException', 'SQLException', 'NullPointerException', 'ClassNotFoundException'],
              correct: 2,
              explanation: 'NullPointerException是运行时异常，不需要显式处理。'
            },
            {
              id: 44,
              question: 'finally块的特点是？',
              options: ['总是执行', '只有异常时执行', '只有正常时执行', '永不执行'],
              correct: 0,
              explanation: 'finally块无论是否发生异常都会执行（除非调用System.exit()），常用于资源清理。'
            }
          ]
        },
        {
          id: 2,
          name: '第2关：异常处理机制',
          questions: [
            {
              id: 45,
              question: 'try-catch-finally的执行顺序是？',
              options: ['catch -> try -> finally', 'try -> catch -> finally', 'finally -> try -> catch', 'try -> finally -> catch'],
              correct: 1,
              explanation: '正常情况：try -> finally；异常情况：try -> catch -> finally。'
            },
            {
              id: 46,
              question: 'throws关键字的作用是？',
              options: ['抛出异常', '声明方法可能抛出的异常', '捕获异常', '忽略异常'],
              correct: 1,
              explanation: 'throws用于声明方法可能抛出的异常，将异常处理责任交给调用方。'
            },
            {
              id: 47,
              question: 'throw和throws的区别是？',
              options: ['没区别', 'throw抛出异常对象，throws声明异常', '相反', '都是抛出异常'],
              correct: 1,
              explanation: 'throw是语句，用于抛出具体的异常对象；throws是方法声明的一部分。'
            },
            {
              id: 48,
              question: '自定义异常需要继承哪个类？',
              options: ['Object', 'Throwable', 'Exception', 'RuntimeException'],
              correct: 2,
              explanation: '自定义异常通常继承Exception（Checked）或RuntimeException（Unchecked）。'
            }
          ]
        }
      ]
    },
    {
      id: 'thread',
      name: '🧵 多线程',
      icon: '🧵',
      color: '#9933cc',
      description: 'Thread、Runnable、并发',
      levels: [
        {
          id: 1,
          name: '第1关：线程基础',
          questions: [
            {
              id: 49,
              question: '创建线程的两种方式是？',
              options: ['继承Thread类', '实现Runnable接口', '继承Thread或实现Runnable', '实现Callable接口'],
              correct: 2,
              explanation: '创建线程主要有两种方式：继承Thread类或实现Runnable接口。'
            },
            {
              id: 50,
              question: 'start()和run()方法的区别是？',
              options: ['没区别', 'start()启动新线程，run()只是普通方法调用', '相反', '都是启动线程'],
              correct: 1,
              explanation: 'start()方法启动新线程并调用run()，直接调用run()不会创建新线程。'
            },
            {
              id: 51,
              question: '线程的生命周期有哪些状态？',
              options: ['只有运行和停止', '新建、就绪、运行、阻塞、死亡', '只有运行', '就绪、运行、阻塞'],
              correct: 1,
              explanation: '线程生命周期：New（新建）-> Runnable（就绪）-> Running（运行）-> Blocked（阻塞）-> Dead（死亡）。'
            },
            {
              id: 52,
              question: 'sleep()和wait()的区别是？',
              options: ['没区别', 'sleep()不释放锁，wait()释放锁', '相反', '都是释放锁'],
              correct: 1,
              explanation: 'sleep()让线程休眠但不释放锁，wait()让线程等待并释放锁。'
            }
          ]
        },
        {
          id: 2,
          name: '第2关：线程同步',
          questions: [
            {
              id: 53,
              question: 'synchronized关键字的作用是？',
              options: ['加速执行', '保证线程安全，实现互斥', '创建新线程', '终止线程'],
              correct: 1,
              explanation: 'synchronized用于实现线程同步，保证同一时刻只有一个线程执行同步代码。'
            },
            {
              id: 54,
              question: 'synchronized方法和synchronized块的区别是？',
              options: ['没区别', '方法锁整个方法，块锁指定对象', '块锁整个方法', '方法锁指定对象'],
              correct: 1,
              explanation: 'synchronized方法锁定当前对象（this），synchronized块可以指定锁定的对象。'
            },
            {
              id: 55,
              question: 'volatile关键字的作用是？',
              options: ['创建线程', '保证可见性和禁止指令重排序', '锁定对象', '释放锁'],
              correct: 1,
              explanation: 'volatile保证变量的可见性（一个线程修改后对其他线程立即可见），并禁止指令重排序。'
            },
            {
              id: 56,
              question: '死锁产生的条件是？',
              options: ['只有一个线程', '互斥、持有等待、不可剥夺、循环等待', '只有互斥', '只有循环等待'],
              correct: 1,
              explanation: '死锁需要四个条件同时满足：互斥、持有等待、不可剥夺、循环等待。'
            }
          ]
        },
        {
          id: 3,
          name: '第3关：并发工具',
          questions: [
            {
              id: 57,
              question: 'Java并发包（java.util.concurrent）提供了哪些工具？',
              options: ['只有线程', '线程池、锁、并发集合', '只有集合', '只有锁'],
              correct: 1,
              explanation: 'java.util.concurrent包提供了线程池、锁（Lock）、并发集合、同步工具等。'
            },
            {
              id: 58,
              question: 'ExecutorService的作用是？',
              options: ['执行单个任务', '管理线程池，执行异步任务', '创建线程', '终止线程'],
              correct: 1,
              explanation: 'ExecutorService是线程池框架，管理线程生命周期，执行异步任务。'
            },
            {
              id: 59,
              question: 'CountDownLatch的作用是？',
              options: ['计数', '让一组线程等待直到计数器归零', '锁定对象', '创建线程'],
              correct: 1,
              explanation: 'CountDownLatch让一个或多个线程等待其他线程完成操作。'
            },
            {
              id: 60,
              question: 'CyclicBarrier和CountDownLatch的区别是？',
              options: ['没区别', 'CyclicBarrier可重用，CountDownLatch不可重用', '相反', '都是一次性的'],
              correct: 1,
              explanation: 'CyclicBarrier可以重复使用（调用reset()），CountDownLatch是一次性的。'
            }
          ]
        }
      ]
    },
    {
      id: 'io',
      name: '💾 Java I/O',
      icon: '💾',
      color: '#00aa99',
      description: '字节流、字符流、NIO',
      levels: [
        {
          id: 1,
          name: '第1关：字节流',
          questions: [
            {
              id: 61,
              question: 'InputStream和OutputStream的区别是？',
              options: ['没区别', 'InputStream读，OutputStream写', '相反', '都是读'],
              correct: 1,
              explanation: 'InputStream是字节输入流（读），OutputStream是字节输出流（写）。'
            },
            {
              id: 62,
              question: 'FileInputStream的作用是？',
              options: ['写入文件', '读取文件字节', '读取字符', '网络通信'],
              correct: 1,
              explanation: 'FileInputStream用于从文件读取字节数据。'
            },
            {
              id: 63,
              question: 'BufferedInputStream的作用是？',
              options: ['加密数据', '提高读取效率', '压缩数据', '写入数据'],
              correct: 1,
              explanation: 'BufferedInputStream通过缓冲区减少实际I/O操作，提高读取效率。'
            },
            {
              id: 64,
              question: 'read()方法返回-1表示什么？',
              options: ['读取错误', '文件结束（EOF）', '读取超时', '缓冲区为空'],
              correct: 1,
              explanation: 'read()返回-1表示已到达输入流末尾（EOF）。'
            }
          ]
        },
        {
          id: 2,
          name: '第2关：字符流',
          questions: [
            {
              id: 65,
              question: 'Reader和Writer的特点是？',
              options: ['按字节读写', '按字符读写，支持Unicode', '只能读写二进制', '只能读写文本'],
              correct: 1,
              explanation: 'Reader/Writer是字符流，按字符（Unicode）读写，适合处理文本。'
            },
            {
              id: 66,
              question: 'InputStreamReader的作用是？',
              options: ['写入字节', '字节流转字符流', '字符流转字节流', '读取字符'],
              correct: 1,
              explanation: 'InputStreamReader是字节流到字符流的桥梁，将字节转换为字符。'
            },
            {
              id: 67,
              question: 'BufferedReader的readLine()方法返回什么？',
              options: ['字节', '字符', '字符串', '整数'],
              correct: 2,
              explanation: 'readLine()读取一行文本并返回字符串，文件末尾返回null。'
            },
            {
              id: 68,
              question: '字符流和字节流的区别是？',
              options: ['没区别', '字符流按字符，字节流按字节', '字符流更快', '字节流支持中文'],
              correct: 1,
              explanation: '字符流按字符（16位Unicode）处理，适合文本；字节流按字节（8位）处理，适合二进制数据。'
            }
          ]
        },
        {
          id: 3,
          name: '第3关：NIO',
          questions: [
            {
              id: 69,
              question: 'NIO的三大核心组件是？',
              options: ['Stream、Reader、Writer', 'Channel、Buffer、Selector', 'File、Path、Files', 'Thread、Lock、Semaphore'],
              correct: 1,
              explanation: 'NIO三大核心组件：Channel（通道）、Buffer（缓冲区）、Selector（选择器）。'
            },
            {
              id: 70,
              question: 'Channel和Stream的区别是？',
              options: ['没区别', 'Channel双向，Stream单向', 'Channel单向，Stream双向', '都是单向'],
              correct: 1,
              explanation: 'Channel是双向的，可以同时读写；Stream是单向的（InputStream只读，OutputStream只写）。'
            },
            {
              id: 71,
              question: 'Buffer的flip()方法作用是？',
              options: ['清空缓冲区', '切换到读模式', '写入数据', '扩容'],
              correct: 1,
              explanation: 'flip()将缓冲区从写模式切换到读模式：limit=position，position=0。'
            },
            {
              id: 72,
              question: 'Selector的作用是？',
              options: ['选择文件', '多路复用I/O', '加密数据', '压缩数据'],
              correct: 1,
              explanation: 'Selector允许单个线程管理多个Channel，实现多路复用I/O。'
            }
          ]
        }
      ]
    },
    {
      id: 'database',
      name: '🗄️ 数据库',
      icon: '🗄️',
      color: '#3366ff',
      description: 'JDBC、SQL、连接池',
      levels: [
        {
          id: 1,
          name: '第1关：JDBC基础',
          questions: [
            {
              id: 73,
              question: 'JDBC连接数据库的步骤是？',
              options: ['直接查询', '加载驱动→建立连接→创建Statement→执行SQL→处理结果→关闭资源', '只需要连接', '只需要执行SQL'],
              correct: 1,
              explanation: 'JDBC标准流程：加载驱动→建立连接→创建Statement→执行SQL→处理结果→关闭资源。'
            },
            {
              id: 74,
              question: 'Statement和PreparedStatement的区别是？',
              options: ['没区别', 'PreparedStatement预编译，防止SQL注入', 'Statement更快', '都是预编译'],
              correct: 1,
              explanation: 'PreparedStatement预编译SQL，支持参数化查询，防止SQL注入攻击。'
            },
            {
              id: 75,
              question: 'ResultSet的作用是？',
              options: ['存储连接', '存储查询结果', '执行SQL', '关闭连接'],
              correct: 1,
              explanation: 'ResultSet存储SQL查询结果集，通过游标遍历。'
            },
            {
              id: 76,
              question: 'JDBC事务的默认行为是？',
              options: ['自动提交', '手动提交', '不提交', '回滚'],
              correct: 0,
              explanation: 'JDBC默认自动提交事务（autoCommit=true），每条SQL执行后自动提交。'
            }
          ]
        },
        {
          id: 2,
          name: '第2关：连接池',
          questions: [
            {
              id: 77,
              question: '连接池的作用是？',
              options: ['减少内存使用', '复用数据库连接，提高性能', '加密数据', '压缩数据'],
              correct: 1,
              explanation: '连接池复用数据库连接，避免频繁创建/销毁连接的开销。'
            },
            {
              id: 78,
              question: '常见的连接池有哪些？',
              options: ['只有JDBC', 'HikariCP、C3P0、Druid', '只有Hibernate', '只有MyBatis'],
              correct: 1,
              explanation: '常用连接池：HikariCP（高性能）、C3P0、Druid（阿里）等。'
            },
            {
              id: 79,
              question: 'HikariCP的特点是？',
              options: ['慢', '高性能、低延迟', '功能少', '不稳定'],
              correct: 1,
              explanation: 'HikariCP是Spring Boot默认连接池，以高性能、低延迟著称。'
            },
            {
              id: 80,
              question: '连接池配置的关键参数有哪些？',
              options: ['只有URL', '最小连接数、最大连接数、超时时间', '只有用户名密码', '只有驱动类'],
              correct: 1,
              explanation: '连接池关键参数：minimumIdle（最小空闲连接）、maximumPoolSize（最大连接数）、connectionTimeout（连接超时）等。'
            }
          ]
        }
      ]
    },
    {
      id: 'network',
      name: '🌐 网络编程',
      icon: '🌐',
      color: '#ff3366',
      description: 'Socket、HTTP、TCP/IP',
      levels: [
        {
          id: 1,
          name: '第1关：Socket编程',
          questions: [
            {
              id: 81,
              question: 'TCP和UDP的区别是？',
              options: ['没区别', 'TCP可靠有序，UDP不可靠无序', 'UDP可靠，TCP不可靠', '都是可靠的'],
              correct: 1,
              explanation: 'TCP是面向连接的、可靠的、有序的；UDP是无连接的、不可靠的、无序的。'
            },
            {
              id: 82,
              question: 'ServerSocket的作用是？',
              options: ['客户端连接', '服务器端监听端口', '发送数据', '接收数据'],
              correct: 1,
              explanation: 'ServerSocket在服务器端监听指定端口，接受客户端连接。'
            },
            {
              id: 83,
              question: 'Socket通信的步骤是？',
              options: ['直接发送', '服务器绑定端口→监听→接受连接→读写数据', '只需要连接', '只需要发送'],
              correct: 1,
              explanation: 'Socket流程：服务器bind→listen→accept；客户端connect→读写→close。'
            },
            {
              id: 84,
              question: 'InetAddress的作用是？',
              options: ['存储端口号', '存储IP地址', '存储域名', '存储协议'],
              correct: 1,
              explanation: 'InetAddress表示IP地址，可以通过域名解析获取IP。'
            }
          ]
        },
        {
          id: 2,
          name: '第2关：HTTP编程',
          questions: [
            {
              id: 85,
              question: 'HttpURLConnection的作用是？',
              options: ['创建Socket', '发送HTTP请求', '创建服务器', '解析HTML'],
              correct: 1,
              explanation: 'HttpURLConnection用于发送HTTP请求和接收HTTP响应。'
            },
            {
              id: 86,
              question: 'HTTP GET和POST的区别是？',
              options: ['没区别', 'GET参数在URL，POST参数在请求体', '相反', '都是一样的'],
              correct: 1,
              explanation: 'GET请求参数在URL中，POST请求参数在请求体中，更安全且支持大数据。'
            },
            {
              id: 87,
              question: 'HTTP状态码200表示？',
              options: ['错误', '成功', '重定向', '服务器错误'],
              correct: 1,
              explanation: 'HTTP 200表示请求成功。'
            },
            {
              id: 88,
              question: '常见的HTTP客户端库有哪些？',
              options: ['只有HttpURLConnection', 'OkHttp、HttpClient、RestTemplate', '只有Socket', '只有JDBC'],
              correct: 1,
              explanation: '常用HTTP客户端：OkHttp、Apache HttpClient、Spring RestTemplate/WebClient。'
            }
          ]
        }
      ]
    }
  ])

  // 计算属性
  const currentModuleData = computed(() => knowledgeModules.value[currentModule.value])
  const currentLevelData = computed(() => {
    if (!currentModuleData.value) return null
    return currentModuleData.value.levels[currentLevel.value]
  })
  const currentQuestionData = computed(() => {
    if (!currentLevelData.value) return null
    return currentLevelData.value.questions[currentQuestion.value]
  })

  // 方法
  function startGame(moduleIndex = 0, levelIndex = 0) {
    currentModule.value = moduleIndex
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
    currentModule.value = 0
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
      
      const baseScore = isEndlessMode.value ? currentDifficulty.value * 15 : (currentModule.value + 1) * 10
      score.value += baseScore
      
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
      currentDifficulty.value = Math.min(5, 1 + Math.floor(endlessQuestionCount.value / 3))
    } else {
      if (currentQuestion.value >= currentLevelData.value.questions.length - 1) {
        currentQuestion.value = 0
        if (currentLevel.value >= currentModuleData.value.levels.length - 1) {
          currentLevel.value = 0
          currentModule.value++
        } else {
          currentLevel.value++
        }
      } else {
        currentQuestion.value++
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
    if (currentModule.value === 0 && currentLevel.value === 0 && currentQuestion.value === 0 && totalCorrect.value > 0) unlockAchievement('firstLevelComplete')
    if (totalCorrect.value >= 20) unlockAchievement('twentyCorrect')
    if (combo.value >= 10) unlockAchievement('tenCombo')
    if (isEndlessMode.value && endlessQuestionCount.value >= 15) unlockAchievement('endlessSurvivor')
    if (currentModule.value >= knowledgeModules.value.length) unlockAchievement('allLevelsComplete')
    if (currentModule.value >= knowledgeModules.value.length) unlockAchievement('javaMaster')
    if (currentModule.value >= 1 && currentModule.value < 2) unlockAchievement('oopExpert')
    if (currentModule.value >= 2 && currentModule.value < 3) unlockAchievement('collectionKing')
    if (currentModule.value >= 4 && currentModule.value < 5) unlockAchievement('threadNinja')
    if (currentModule.value >= 5 && currentModule.value < 6) unlockAchievement('ioMaster')
    if (currentModule.value >= 6 && currentModule.value < 7) unlockAchievement('dbWizard')
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

  function setKnowledgeArea(area) {
    currentKnowledgeArea.value = area
  }

  return {
    // 状态
    currentModule,
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
    currentKnowledgeArea,
    achievements,
    knowledgeModules,
    // 计算属性
    currentModuleData,
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
    toggleMindmap,
    setKnowledgeArea
  }
})