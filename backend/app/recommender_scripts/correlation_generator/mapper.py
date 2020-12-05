#!/usr/bin/env python
# -*-coding:utf-8 -*
"""mapper.py"""


import sys
from itertools import combinations


def read_data(input_file, separator="\t"):
    for line in input_file:
        yield line.strip().split(separator, 1)


def main(separator="\t"):
    for _, movieratings in read_data(sys.stdin):
        movieratings = movieratings.split(separator)

        for movierating1, movierating2 in combinations(movieratings, 2):
            moviepair, ratingpair = zip(
                movierating1.split(":"), movierating2.split(":")
            )
            sys.stdout.write(
                f"{':'.join(moviepair)}{separator}{':'.join(ratingpair)}\n"
            )


if __name__ == "__main__":
    main()
