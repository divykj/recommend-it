from typing import List, Optional

from pydantic import BaseModel


class Movie(BaseModel):
    id: int
    name: str
    year: Optional[str]


class MovieScore(BaseModel):
    movie: Movie
    score: float


class Recommendations(BaseModel):
    movie: Movie
    recommendations: List[MovieScore]


def parse_movie_list():
    with open("app/data/movie_titles.csv", "r", encoding="ISO-8859-1") as file:
        for line in file:
            movie_id, year, movie_name = line.strip().split(",", 2)
            yield Movie(
                id=int(movie_id),
                name=movie_name,
                year=(None if year == "NULL" else int(year)),
            )


def parse_recommendations():
    with open(
        "app/data/output/movie_recommendations.txt", "r", encoding="ISO-8859-1"
    ) as file:
        for line in file:
            movie_id, *recommendations = line.strip().split("\t")
            recommendations = sorted(
                (
                    (int(other_movie_id), (float(score) + 1) / 2)
                    for other_movie_id, score in (
                        recommendation.split(":") for recommendation in recommendations
                    )
                ),
                key=lambda recommendation: recommendation[1],
                reverse=True,
            )
            yield int(movie_id), recommendations


def find_movie_by_id(movies: List[Movie], id: int) -> Movie:
    return next(movie for movie in movies if movie.id == id)


movies: List[Movie] = list(parse_movie_list())

movie_recommendations = dict(parse_recommendations())
