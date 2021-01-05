FROM golang:1.14

RUN apt-get update

RUN go get github.com/go-redis/redis

WORKDIR /app
COPY . .

RUN go build -o main .
CMD ["/app/main"]