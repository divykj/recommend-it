#!/usr/bin/env bash

set -e

source ~/.bashrc

/etc/init.d/ssh start

echo Generating Recommendations
mkdir -p /src/app/data/output/
cat /src/app/data/ratings/* \
  | /src/app/recommender_scripts/parse_data/mapper.py \
  | sort -k1,1 \
  | /src/app/recommender_scripts/parse_data/reducer.py \
  | tee /src/app/data/output/parsed_data.txt \
  | /src/app/recommender_scripts/correlation_generator/mapper.py \
  | sort -k1,1 \
  | /src/app/recommender_scripts/correlation_generator/reducer.py \
  | tee /src/app/data/output/correlation_scores.txt \
  | /src/app/recommender_scripts/parse_output/mapper.py \
  | sort -k1,1 \
  | /src/app/recommender_scripts/parse_output/reducer.py \
  > /src/app/data/output/movie_recommendations.txt

# $HADOOP_HOME/bin/hdfs namenode -format
# $HADOOP_HOME/sbin/start-dfs.sh
# $HADOOP_HOME/sbin/start-yarn.sh

# hdfs dfs -mkdir -p ratings
# hdfs dfs -copyFromLocal /src/app/data/ratings/ .

# mapred streaming \
#     -file /src/app/recommender_scripts/parse_data/mapper.py \
#     -file /src/app/recommender_scripts/parse_data/reducer.py \
#     -input ratings/ \
#     -mapper mapper.py \
#     -reducer reducer.py \
#     -output parsed_data/


# mapred streaming \
#     -file /src/app/recommender_scripts/correlation_generator/mapper.py \
#     -file /src/app/recommender_scripts/correlation_generator/reducer.py \
#     -input parsed_data/ \
#     -mapper mapper.py \
#     -reducer reducer.py \
#     -output correlation_scores/


# mapred streaming \
#     -file /src/app/recommender_scripts/parse_output/mapper.py \
#     -file /src/app/recommender_scripts/parse_output/reducer.py \
#     -input correlation_scores/ \
#     -mapper mapper.py \
#     -reducer reducer.py \
#     -output movie_recommendations/

# mkdir -p /src/app/output/movie_recommendations
# hdfs dfs -copyToLocal movie_recommendations/ /src/app/output/movie_recommendations/

uvicorn app.main:app --host 0.0.0.0 --port 80 --reload