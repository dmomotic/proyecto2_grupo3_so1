FROM golang:1.14

RUN apt-get update

RUN go get google.golang.org/grpc
RUN go get github.com/gomodule/redigo/redis
RUN go get go.mongodb.org/mongo-driver/mongo
RUN go get google.golang.org/grpc/examples/helloworld/helloworld

WORKDIR /app
COPY . .

RUN go build -o main .
CMD ["/app/main"]