def calc(*args, **kwargs):
    items = list(args) + list(kwargs.values())
    result = 0
    for item in items:
        if type(item) in (int, float):
            result += item
    return result

def calc(init_value, op_func, *args, **kwargs):
    items = list(args) + list(kwargs.values())
    result = init_value
    for item in items:
        if type(item) in (int, float):
            result = op_func(result, item)
    return result

from day14.date import date_today


def word():
    return "Hello, World!"

def print_info(name, func):
   sde = func()
   print(sde)

print_info("Alice", date_today)


def test_lu(fucc):
    print("测试函数执行" + fucc())
test_lu(lambda: "Lambda函数返回值")

def test_lu2(fucc):
    print("测试函数执行" + fucc('-参数'))
test_lu2(lambda x: "Lambda函数返回值" + str(x))

import functools

int2 = functools.partial(int, base=2)
int8 = functools.partial(int, base=8)
int16 = functools.partial(int, base=16)

print(int('1001'))    # 1001

print(int2('1001'))   # 9
print(int8('1001'))   # 513
print(int16('1001'))  # 4097