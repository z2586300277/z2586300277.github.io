print(0b100)  # 二进制整数
print(0o100)  # 八进制整数
print(100)    # 十进制整数
print(0x100)  # 十六进制整数

print(123.456)    # 数学写法
print(1.23456e2)  # 科学计数法

a = 45;        # 定义变量a，赋值45
b = 12        # 定义变量b，赋值12
print(a + b)  # 输出a+b的值
print(a - b)  # 输出a-b的值
print(a * b)  # 输出a*b的值
print(a / b)  # 输出a/b的值
print(a % b)  # 输出a%b的值
print(a // b) # 输出 // 整除
print(2 ** 3)  # 2的3次方
print(2 ** 0.5)  # 2的 开根号
print(9 ** 0.5)  # 9的0.5次方


print(type(a))  # <class 'int'>
print(type(b))  # <class 'float'>

c = 'hello, world'
d = True
print(type(c))  # <class 'str'>
print(type(d))  # <class 'bool'>

a = 100
b = 123.45
c = '123'
d = '100'
e = '123.45'
f = 'hello, world'
g = True
print(float(a))         # int类型的100转成float，输出100.0
print(int(b))           # float类型的123.45转成int，输出123
print(int(c))           # str类型的'123'转成int，输出123
print(int(c, base=16))  # str类型的'123'按十六进制转成int，输出291
print(int(d, base=2))   # str类型的'100'按二进制转成int，输出4
print(float(e))         # str类型的'123.45'转成float，输出123.45
print(bool(f))          # str类型的'hello, world'转成bool，输出True
print(int(g))           # bool类型的True转成int，输出1
print(chr(a))           # int类型的100转成str，输出'd'
print(ord('d'))         # str类型的'd'转成int，输出100

float(False) # 0.0
float(True)  # 1.0

# 这两个将 一个字符 与 编码 之间的转换
chr(50) # 将整数（字符编码）转换成对应的（一个字符的）字符串 
ord('2')# 将（一个字符的）字符串转换成对应的整数（字符编码）。

