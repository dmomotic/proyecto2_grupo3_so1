// Package main implements a server for Greeter service.
package main

import (
	"log"
	"net"
	"fmt"
	"time"
	"context"
	"encoding/json"

	"google.golang.org/grpc"
	pb "google.golang.org/grpc/examples/helloworld/helloworld"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	port = ":8081"
)

//Struct to save into Mongodb
type Request struct {
  Name string
	Location string
	Age int
	InfectedType string `json:"infected_type"`
	State string
}

// server is used to implement helloworld.GreeterServer.
type server struct {
	pb.UnimplementedGreeterServer
}

// SayHello implements helloworld.GreeterServer
func (s *server) SayHello(ctxt context.Context, in *pb.HelloRequest) (*pb.HelloReply, error) {
	//JSON string (it comes from client)
	jsonString := in.GetName()
	
	//Print received data from the client
	log.Printf("Data received: %v", jsonString)

	//Connection with Mongodb Atlas
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb+srv://admin:admin123@cluster0.4d9ky.mongodb.net/testdb?retryWrites=true&w=majority"))
	if err != nil {
		log.Fatal(err)
	}
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)

	//Accessing the collection inside the database
	collection := client.Database("testdb").Collection("users")

	//Parsing JSON string to Struct
	var req Request	
	json.Unmarshal([]byte(jsonString), &req)

	//Checking valid struct
	if (Request{} != req) {
		//Inserting into Mongodb 
		insertResult, err := collection.InsertOne(context.TODO(), req)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println("Inserted post with ID:", insertResult.InsertedID)
	} 

	//Return something to the client
	return &pb.HelloReply{Message: "Hello " + jsonString}, nil
}

func main() {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterGreeterServer(s, &server{})
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
