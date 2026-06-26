import time

def record_time():

    def wrapper():
       
       return 'Function executed in {} seconds'.format(time.time())
    
    return wrapper

record_time()()




def my_decorator(func):
    def 新包装的函数():
        print("开始啦！")
        func()  # 调用原来的函数
        print("结束啦！")
        return "装饰器的返回值"
    return 新包装的函数

@my_decorator
def 吃饭():
    print("我在吃饭")
ss = 吃饭()
print(ss)

# 当你定义一个函数并用 @decorator 装饰它时，Python 会立刻把这个函数传给装饰器，生成一个“新函数”来替代它。

# 之后你每次调用这个函数，实际上是在调用装饰器返回的那个“新函数”

def my_decorator2(name, num):
    def retfunc(func):
        print("开始啦！名字是{}，数字是{}".format(name, num))
        func()  # 调用原来的函数
    return retfunc

@my_decorator2("Alice", 42)
def 吃饭2():
    print("我在吃饭2")