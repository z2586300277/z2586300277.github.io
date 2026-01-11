# if else 语句
name = 'hello'

if(name.startswith('h') and name.endswith('o')):
    print('yes')

# if else 语句
import random

num = random.randint(1, 100)
if num % 2 == 0:
    print('偶数')
elif num > 50 or num < 10:
    print('大于50或小于10')
elif num > 30 and num < 40:
    print('30-40之间')
else:
    print('其他')


# switch case 语句

# 生成一到十的随机数
num = random.randint(1, 10)

match num:
    case 1:
        print('1')
    case 2:
        print('2')
    case 3:
        print('3')
    case 4:
        print('4')
    case 5 | 6 | 7:
        print(f'{num}或情况')
    case _:
        print('其他')


x = float(input('x = '))
if x > 1:
    y = 3 * x - 5
elif x >= -1:
    y = x + 2
else:
    y = 5 * x + 3
print(f'{y = }')