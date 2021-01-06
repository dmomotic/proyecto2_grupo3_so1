FROM golang:1.14

RUN apt-get update

RUN go get github.com/gorilla/mux
RUN go get github.com/gomodule/redigo/redis

WORKDIR /app
COPY . .

EXPOSE 8080

RUN go build -o main .
CMD ["/app/main"]