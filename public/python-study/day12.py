set1 = {1, 2, 3, 3, 3, 2}
print(set1)

set2 = {'banana', 'pitaya', 'apple', 'apple', 'banana', 'grape'}
print(set2)

set3 = set('hello')
print(set3)

set4 = set([1, 2, 2, 3, 3, 3, 2, 1])
print(set4)

# 取出第三个元素
print(list(set4)[2])

#遍历 
for elem in set4:
    print(elem)

set5 = {num for num in range(1, 20) if num % 3 == 0 or num % 7 == 0}
print(set5)


guang = { 'name': 'Guang', 'age': 18, 'gender': 'male' }

zhang = { 'name': 'Zhang', 'age': 19 }

gz = guang | zhang  # 合并两个集合
print(gz)

gz2 = { 2 , 5} & { 3, 5, 7}  # 交集
print(gz2)