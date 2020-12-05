#!/usr/bin/env python
# -*-coding:utf-8 -*
"""mapper.py"""

import sys


def main(separator="\t"):
    movie = sys.stdin.readline().strip()[:-1]
    for line in sys.stdin:
        line = line.strip()
        if line[-1] == ":":
            movie = line[:-1]
            continue
        user, rating, _ = line.split(",")
        sys.stdout.write(f"{user}{separator}{movie}:{rating}\n")


if __name__ == "__main__":
    main()
