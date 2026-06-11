class Student:
    """学生"""

    def __init__(self, name, age):
        """初始化方法"""
        self.name = name
        self.age = age
        print(f'创建了一个学生对象，名字是{self.name}, 年龄是{self.age}.')

    def study(self, course_name):
        """学习"""
        print(f'{self.name}正在学习{course_name}.')

    def play(self):
        """玩耍"""
        print(f'{self.name}正在玩游戏.')
# self 必须添加为第一个参数

stu1 = Student('小明', 20)
stu1.study('Python编程')
Student.play(stu1)  # 通过类名调用方法，需要传入实例对象作为第一个参数
