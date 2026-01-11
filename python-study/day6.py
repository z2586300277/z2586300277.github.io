import time

for i in range(3600):
    print('hello, world')
    time.sleep(1)

total = 0
for i in range(88, 101, 3):
    print(i)
    total += i
print(total)

a = 1 
while a <= 10:
    a += 1
    if(a in [3, 5, 7, 9]):
        continue
    print(a)
    

"""
range(101)可以用来产0到100范围的整数需要注意的是取不到101。
range(1, 101)可以用来产生1到100范围的整数相当于是左闭右开的设定即[1, 101)。
range(1, 101, 2)可以用来产生1到100的奇数其中2是步长 跨度即每次递增的值101取不到。
range(100, 0, -2)可以用来产生100到1的偶数其中-2是步长 跨度即每次递减的值0取不到。
"""

total = 0
i = 2
while True:
    total += i
    i += 2
    if i > 100:
        break
print(total) 

for i in range(1, 10):
    for j in range(1, i + 1):
        print(f'{i}×{j}={i * j}', end='\t')
    print()

total = 0
for i in range(1, 101):
    if i % 2 != 0:
        continue
    total += i
print(total)

import random
if (a := random.randint(1, 10)) in [ 2, 4]:
    print(f'{a} in [2, 4]')
elif a < 5:
    print(f'{a} < 5')
else:
    print(f'{a} >= 5')

import random

answer = random.randrange(1, 101)
counter = 0
while True:
    counter += 1
    num = int(input('请输入: '))
    if num < answer:
        print('大一点.')
    elif num > answer:
        print('小一点.')
    else:
        print('猜对了.')
        break
print(f'你一共猜了{counter}次.')