FROM golang:1.14

RUN apt-get update

RUN go get google.golang.org/grpc
RUN go get google.golang.org/grpc/examples/helloworld/helloworld
RUN go get github.com/gorilla/mux

WORKDIR /app
COPY . .

EXPOSE 8080

RUN go build -o main .
CMD ["/app/main"]