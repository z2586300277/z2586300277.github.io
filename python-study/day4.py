print(321 + 12)     # 加法运算，输出333
print(321 - 12)     # 减法运算，输出309
print(321 * 12)     # 乘法运算，输出3852
print(321 / 12)     # 除法运算，输出26.75
print(321 // 12)    # 整除运算，输出26
print(321 % 12)     # 求模运算，输出9
print(321 ** 12)    # 求幂运算，输出1196906950228928915420617322241
print(2 + 3 * 5)           # 17
print((2 + 3) * 5)         # 25
print((2 + 3) * 5 ** 2)    # 125
print(((2 + 3) * 5) ** 2)  # 625

a = 5
a *= 5 + 2
print(a)  # 35

# print(a = 10)  报错
print(a = 10)  # 10

flag0 = 1 == 1
print(flag0)  # True
flag1 = 3 > 2
print(flag1)  # True
flag2 = 2 < 1
print(flag2)  # False
flag3 = flag1 and flag2
print(flag3)  # False
flag4 = flag1 or flag2
print(flag4)  # True
flag5 = not flag0
print(flag5)  # False

b = 50
a = 5 
e = b is not a
print(e)  # True 

year = int(input('请输入年份: '))
print(year)

# 占位符 %f 代表一个浮点数，%.2f 表示小数点后保留两位小数
# %d 代表一个整数
# %s 代表一个字符串
f = float(input('请输入华氏温度: '))
c = (f - 32) / 1.8
print('%.1f华氏度 = %.1f摄氏度' % (f, c)) # %.1f 保留一位小数

f = float(input('请输入华氏温度: '))
c = (f - 32) / 1.8
print(f'{f:.2f}华氏度 = {c:.1f}摄氏度')

import math
print(math.pi)

# print(f'{is_leap = }') 这行代码使用了Python的一种称为“f-string”
# 格式化字符串字面量）的功能，该功能自Python 3.6起可用
# 。f-string允许您在字符串中嵌入表达式，这些表达式会被其值替换。
year = int(input('请输入年份: '))
is_leap = year % 4 == 0 and year % 100 != 0 or year % 400 == 0
print(f'{is_leap = }')

print(f'fdasdf{year + 11}')

a = 11
print(f'{a + 11}{555}')

z = 1
h = 2.1888
g = 'gua'

# 通用占位符
print('这是一个占位符测试 %s %.1f %s' % (z, h, g))

