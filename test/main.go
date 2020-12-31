package main

import (
	"context"
	"fmt"
	"log"
	"time"
	"encoding/json"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Request struct {
  Name string
	Location string
	Age int
	InfectedType string `json:"infected_type"`
	State string
}

func InsertPost(title string, body string) {
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


	collection := client.Database("testdb").Collection("users")

	jsonString := `{"name": "Pablo Mendoza","location": "Guatemala","age": 35,"infected_type": "communitary","state": "asymptomatic"}`
	var req Request	
	json.Unmarshal([]byte(jsonString), &req)
	fmt.Printf("Species: %s, Description: %s", req.Name, req.InfectedType)

	insertResult, err := collection.InsertOne(context.TODO(), req)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Inserted post with ID:", insertResult.InsertedID)
}

func main() {
	InsertPost("title", "first test")
}