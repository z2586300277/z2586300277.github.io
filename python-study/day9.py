
languages = ['Python', 'Java', 'C++']
languages.append('JavaScript')
print(languages)  # ['Python', 'Java', 'C++', 'JavaScript']
languages.insert(1, 'SQL')
print(languages)  # ['Python', 'SQL', 'Java', 'C++', 'JavaScript']

languages = ['Python', 'SQL', 'Java', 'C++', 'JavaScript']
if 'Java' in languages:
    languages.remove('Java')
if 'Swift' in languages:
    languages.remove('Swift')
print(languages)  # ['Python', 'SQL', C++', 'JavaScript']


languages.pop()
temp = languages.pop(1)
print(temp)       # SQL
languages.append(temp)
print(languages)  # ['Python', C++', 'SQL']

languages.clear()
print(languages)  # []

languages.append('chinese')
languages.append('english')
print(languages) 
if('chinese' in languages):
    languages.remove('chinese') # 删除第一个匹配的元素
print(languages)  # ['english']

arr = ['hello','z', 'guang','tesa', 'wwww' ]
arr.insert(4, 'test')
arr.pop(1)
arr.append('append')
arr.remove('hello')
arr.remove('append')
del arr[5]
print(arr) 

arr.append('sss')

print(arr.index('guang')) 
print(arr.index('sss', 7)) 

arr.sort()
print(arr)

arr.reverse()
print(arr)