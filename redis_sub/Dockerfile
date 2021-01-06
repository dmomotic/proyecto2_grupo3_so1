FROM golang:1.14

RUN apt-get update

RUN go get github.com/gomodule/redigo/redis
RUN go get go.mongodb.org/mongo-driver/mongo

WORKDIR /app
COPY . .

RUN go build -o main .
CMD ["/app/main"]
