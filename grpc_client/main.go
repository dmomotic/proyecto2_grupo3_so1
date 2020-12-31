// Package main implements a client for Greeter service.
package main

import (
	"context"
	"log"
	"os"
	"time"
	"fmt"
	"net/http"
	"io/ioutil"

	"github.com/gorilla/mux"
	"google.golang.org/grpc"
	pb "google.golang.org/grpc/examples/helloworld/helloworld"
)

func homePage(w http.ResponseWriter, r *http.Request) {
	reqBody, _ := ioutil.ReadAll(r.Body)
	data := string(reqBody)
	connect_with_grpc_server(data)
	fmt.Fprintf(w, "%+v", data)
}

func main() {
	fmt.Println("Starting gRPC client...")
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/", homePage)
	log.Fatal(http.ListenAndServe(":8080", router))
}

func connect_with_grpc_server(data string) {
	address := fmt.Sprintf("%s:8081", os.Getenv("GRPC_SERVER_ADDRESS"))
	// Set up a connection to the server.
	conn, err := grpc.Dial(address, grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	c := pb.NewGreeterClient(conn)

	// Contact the server and print out its response.
	name := data
	if len(os.Args) > 1 {
		name = os.Args[1]
	}
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()
	r, err := c.SayHello(ctx, &pb.HelloRequest{Name: name})
	if err != nil {
		log.Fatalf("could not greet: %v", err)
	}
	log.Printf("Greeting: %s", r.GetMessage())
}
