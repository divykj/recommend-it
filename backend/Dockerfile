FROM python:3.8

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /src

RUN wget -qO- http://mirror.intergrid.com.au/apache/hadoop/common/hadoop-3.3.0/hadoop-3.3.0.tar.gz \
    | tar xvz -C /

RUN echo "deb http://ftp.us.debian.org/debian sid main" >> /etc/apt/sources.list

RUN apt update
RUN apt install -y gcc-8-base
RUN apt install -y ssh openjdk-8-jdk
RUN service ssh restart \
    && ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa \
    && cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys \
    && chmod 0600 ~/.ssh/authorized_keys

RUN pip install -U pip setuptools wheel pipenv
COPY Pipfile* /src/
RUN pipenv lock --requirements > requirements.txt && pip install --no-cache-dir -r requirements.txt

COPY hadoop-config/ /hadoop-3.3.0/etc/hadoop

RUN echo "\n\
    export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-amd64 \n\
    export HADOOP_HOME=/hadoop-3.3.0\n\
    export PATH=\$PATH:\$HADOOP_HOME/bin\n\
    export HADOOP_CONF_DIR=\$HADOOP_HOME/etc/hadoop\n\ 
    export HDFS_NAMENODE_USER=root\n\
    export HDFS_DATANODE_USER=root\n\
    export HDFS_SECONDARYNAMENODE_USER=root\n\
    export YARN_RESOURCEMANAGER_USER=root\n\
    export YARN_NODEMANAGER_USER=root\n" \
    >> ~/.bashrc

RUN echo "\n\
    export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-amd64 \n" \
    >> /hadoop-3.3.0/etc/hadoop/hadoop-env.sh

EXPOSE 80 9870

COPY app /src/app
COPY entrypoint.sh /src/entrypoint.sh

ENTRYPOINT "/src/entrypoint.sh"