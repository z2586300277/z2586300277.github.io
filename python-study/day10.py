print("day10.py 正在被导入...")

arr = [1, 2, 3, 4, 5]

def get_arr():
    return arr

print("day10.py 导入完成")

def fib(n):    # 定义到 n 的斐波那契数列
    a, b = 0, 1
    while b < n:
        print(b, end=' ')
        a, b = b, a+b
    print()
 
def fib2(n): # 返回到 n 的斐波那契数列
    result = []
    a, b = 0, 1
    while b < n:
        result.append(b)
        a, b = b, a+b
    return result

# 添加调试信息
if __name__ == "__main__":
    print("day10.py 被直接运行")
    print(f"get_arr() 返回: {get_arr()}")
else:
    print("day10.py 被作为模块导入")

a = 1, 10, 100, 1000
i, j, *k = a
print(i, j, k)        # 1 10 [100, 1000]
i, *j, k = a
print(i, j, k)        # 1 [10, 100] 1000
*i, j, k = a
print(i, j, k)        # [1, 10] 100 1000
*i, j = a
print(i, j)           # [1, 10, 100] 1000
i, *j = a
print(i, j)           # 1 [10, 100, 1000]
i, j, k, *l = a
print(i, j, k, l)     # 1 10 100 [1000]
i, j, k, l, *m = a
print(i, j, k, l, m)  # 1 10 100 1000 []
print(a[0])        # 1
print(a[1])        # 10
print(a[2])        # 100
print(a[3])        # 1000