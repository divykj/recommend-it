#!/usr/bin/env python
# -*-coding:utf-8 -*
"""reducer.py"""


import sys
from itertools import groupby
from math import sqrt
from operator import itemgetter


def read_mapper_output(input_file, separator="\t"):
    for line in input_file:
        yield line.rstrip().split(separator, 1)


def main(separator="\t"):
    data = read_mapper_output(sys.stdin, separator=separator)

    for movie_pair, rating_pairs_group in groupby(data, itemgetter(0)):
        X, Y = (
            list(d)
            for d in zip(
                *(
                    [int(rating) for rating in rating_pair.split(":")]
                    for _, rating_pair in rating_pairs_group
                )
            )
        )

        n = len(X)

        X_mean = sum(X) / n
        Y_mean = sum(Y) / n

        numerator = sum((x - X_mean) * (y - Y_mean) for x, y in zip(X, Y))
        denominator = sqrt(
            sum((x - X_mean) ** 2 for x in X) * sum((y - Y_mean) ** 2 for y in Y)
        )

        if denominator == 0:
            continue

        correlation = numerator / denominator

        sys.stdout.write(f"{movie_pair}{separator}{correlation}\n")


if __name__ == "__main__":
    main()
