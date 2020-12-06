from typing import List

from fastapi import Body, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from more_itertools import take

from .movies import (
    Movie,
    MovieScore,
    Recommendations,
    find_movie_by_id,
    movie_recommendations,
    movies,
)

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return "Movie Recommedations"


@app.get("/movies/", response_model=List[Movie])
async def read_movies(q: str):
    return take(
        10,
        filter(
            lambda movie: movie.id in movie_recommendations
            and q.lower() in movie.name.lower(),
            movies,
        ),
    )


@app.post("/recommend/", response_model=List[Recommendations])
async def get_recommendation(
    favourites: List[int] = Body(...),
):
    result = []
    for movie_id in favourites:
        movie_recommedation = movie_recommendations[movie_id]
        result.append(
            Recommendations(
                movie=find_movie_by_id(movies, movie_id),
                recommendations=[
                    MovieScore(movie=find_movie_by_id(movies, movie_id), score=score)
                    for movie_id, score in movie_recommedation[
                        : min(10, len(movie_recommedation))
                    ]
                ],
            )
        )
    return result
