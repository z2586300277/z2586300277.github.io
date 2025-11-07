


# 注释代码 单行注释 
""" 

多行测试注释
python learning

"""

def add(*args, **kwargs):
    print(args)
    print(kwargs)
    return sum(args)

print(add(1,2,3,4,5,6,7,8,9,10,a=1,b=2,c=3,d=4,e=5,f=6,g=7,h=8,i=9,j=10))

import random
import string

ALL_CHARS = string.digits + string.ascii_letters
print(ALL_CHARS)


def generate_code(*, code_len=4):
    """
    生成指定长度的验证码
    :param code_len: 验证码的长度(默认4个字符)
    :return: 由大小写英文字母和数字构成的随机验证码字符串
    """
    return ''.join(random.choices(ALL_CHARS, k=code_len))

print(generate_code())

