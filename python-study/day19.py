class Student:

    def __init__(self, name, age):
        self.__name = name
        self._age = age

    def study(self, course_name):
        print(f'{self.__name}正在学习{course_name}.')


stu = Student('王大锤', 20)
stu.study('Python程序设计')
print(stu._age) # 可以访问受保护的属性
# 命名约定：
# 以 单下划线 _ 开头，例如 _name
# 特点：
# 这是一种约定，表示该属性/方法是“内部使用”的，不建议外部直接访问。
# Python 不会阻止你访问或修改它。
# 在 from module import * 时，以 _ 开头的名称不会被导入（除非模块显式定义了 __all__）。

# 私有属性/方法
class Person:
    def __init__(self, name):
        self.__name = name  # 私有属性

p = Person("Bob")
# print(p.__name)       # 报错：AttributeError
print(p._Person__name)  # 可以通过改写后的名称访问


# 使用 __slots__ 限制属性
class Student:
    __slots__ = ('name', 'age')

    def __init__(self, name, age):
        self.name = name
        self.age = age


stu = Student('王大锤', 20)
# AttributeError: 'Student' object has no attribute 'sex'
stu.sex = '男'



""" 在 Python 面向对象编程中，@staticmethod、@property 和 @classmethod 是三个非常重要的方法装饰器，它们分别用于定义不同行为的方法。下面是对三者的清晰对比和详解：

🧩 1. @property —— 将方法变成“属性”
作用：
把一个实例方法变成可像属性一样访问的计算字段，常用于封装私有变量或提供只读/可控读写属性。

特点：
自动调用，无需加括号 ()
可配合 @<name>.setter 和 @<name>.deleter 实现完整属性控制
只能用于实例（不能用于类直接调用逻辑）
示例：
python
编辑
class Circle:
    def __init__(self, radius):
        self._radius = radius

    @property
    def area(self):               # 读取时自动计算
        return 3.1416 * self._radius ** 2

    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, value):
        if value < 0:
            raise ValueError("半径不能为负")
        self._radius = value
使用：

python
编辑
c = Circle(5)
print(c.area)      # 78.54（像访问属性，实际是方法）
c.radius = 10      # 触发 setter
🧩 2. @classmethod —— 类方法
作用：
定义一个与类相关但不依赖实例状态的方法。第一个参数是 cls（类本身）。

特点：
可通过 类名 或 实例 调用
常用于替代构造函数（工厂方法）或操作类变量
示例：
python
编辑
class Person:
    species = "Homo sapiens"

    def __init__(self, name):
        self.name = name

    @classmethod
    def get_species(cls):
        return cls.species

    @classmethod
    def from_string(cls, name_str):  # 工厂方法
        name = name_str.strip().title()
        return cls(name)  # 返回新实例
使用：

python
编辑
print(Person.get_species())        # Homo sapiens
p = Person.from_string(" alice ")  # 创建实例
🧩 3. @staticmethod —— 静态方法
作用：
定义一个逻辑上属于类，但完全不依赖类或实例状态的函数。

特点：
没有 self 或 cls 参数
不能访问实例或类的属性
本质上就是一个普通函数，只是放在类里面便于组织代码
示例：
python
编辑
class MathUtils:
    @staticmethod
    def add(a, b):
        return a + b

    @staticmethod
    def is_even(n):
        return n % 2 == 0
使用：

python
编辑
print(MathUtils.add(2, 3))      # 5
print(MathUtils.is_even(4))     # True

# 也可以通过实例调用（但不推荐）
obj = MathUtils()
print(obj.add(1, 1))            # 2（语义不清，应避免）
🔍 三者对比总结表
特性	@property	@classmethod	@staticmethod
第一个参数	无（但隐含 self）	cls（类）	无
能否访问实例属性	✅（通过 self）	❌	❌
能否访问类属性	✅（通过 self.__class__）	✅（通过 cls）	❌（除非硬编码类名）
调用方式	obj.attr（无括号）	Cls.method() 或 obj.method()	Cls.method() 或 obj.method()
典型用途	封装属性、计算字段	工厂方法、类配置	工具函数、辅助逻辑
是否依赖实例	✅	❌	❌
✅ 使用建议
想让方法像属性一样访问？ → 用 @property
需要访问或修改类变量，或创建替代构造函数？ → 用 @classmethod
方法和类有关，但完全独立（无 self/cls）？ → 用 @staticmethod
如果你有具体场景（比如“我想实现一个只读的配置项”或“我想从字符串创建对象”），我可以帮你选择最合适的装饰器！ """