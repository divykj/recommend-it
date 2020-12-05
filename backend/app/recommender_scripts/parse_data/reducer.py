#!/usr/bin/env python
# -*-coding:utf-8 -*
"""reducer.py"""

import sys
from itertools import groupby
from operator import itemgetter


def read_mapper_output(input_file, separator="\t"):
    for line in input_file:
        yield line.rstrip().split(separator, 1)


def main(separator="\t"):
    data = read_mapper_output(sys.stdin, separator=separator)
    for user_id, group in groupby(data, itemgetter(0)):
        try:
            values = separator.join(value for _, value in group)
            sys.stdout.write(f"{user_id}{separator}{values}\n")
        except ValueError:
            pass


if __name__ == "__main__":
    main()
