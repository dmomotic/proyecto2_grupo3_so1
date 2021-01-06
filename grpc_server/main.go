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

	"github.com/gomodule/redigo/redis"
)

const (
	port = ":8081"
)

//Struct to save into Mongodb
type Request struct {
  Name string `redis:"name"`
	Location string `redis:"location"`
	Age int `redis:"age"`
	InfectedType string `json:"infected_type"`
	State string `redis:"state"`
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
		fmt.Println("Inserted data in mongo with ID:", insertResult.InsertedID)

		//Inserting into redis
		c, err := redis.Dial("tcp", "35.188.216.162:6379")
		if err != nil {
			log.Println("No se pudo conectar a redis desde GRPC", err)
		} else {
			//It sets the id if its null
			value, _ := c.Do("GET", "id")
			if value == nil {
				c.Do("SET", "id", 1)
			}

			//Getting id counter from redis
			i, _ := redis.Int(c.Do("GET", "id"))

			if i < 5 {
				//Adding 1 to the counter
				c.Do("INCR", "id")
			} else {
				if i > 5 {
					i = 1
				}
				//Restaring the counter
				c.Do("SET", "id", 1)
			}

			//Id to identify record
			id := fmt.Sprintf("id%v", i)

			//Inserting object
			if _, err := c.Do("HMSET", redis.Args{}.Add(id).AddFlat(&req)...); err != nil {
				fmt.Println("Error insertando objeto en redis desde GRPC: ",err)
			}
		}
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
