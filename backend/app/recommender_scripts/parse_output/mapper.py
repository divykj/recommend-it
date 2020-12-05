#!/usr/bin/env python
# -*-coding:utf-8 -*
"""mapper.py"""


import sys


def read_data(input_file, separator="\t"):
    for line in input_file:
        yield line.strip().split(separator, 1)


def main(separator="\t"):
    for moviepair, similarity in read_data(sys.stdin):
        movie1, movie2 = moviepair.split(":")

        sys.stdout.write(f"{movie1}{separator}{movie2}:{similarity}\n")
        sys.stdout.write(f"{movie2}{separator}{movie1}:{similarity}\n")


if __name__ == "__main__":
    main()
