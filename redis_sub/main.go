package main

import (
	"fmt"
	"log"
	"time"
	"context"
	"encoding/json"

	"github.com/gomodule/redigo/redis"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

//Struct to save into Mongodb
type Request struct {
	Name string
	Location string
	Age int
	InfectedType string `json:"infected_type"`
	State string
}

func main() {
	//https://godoc.org/github.com/gomodule/redigo/redis#Pool
	fmt.Println("Hello World")

	c, err := redis.Dial("tcp", "35.188.216.162:6379")
	if err != nil {
		log.Println(err)
	} else {
		log.Println("Everything is fine!!!")
	}
	// defer c.Close()

	/// This code is for Subscriber
	psc := redis.PubSubConn{Conn: c}
	psc.Subscribe("canal1")
	for {
		switch v := psc.Receive().(type) {
		case redis.Message:
			fmt.Printf("%s: message: %s\n", v.Channel, v.Data)
			insert_mongo(string(v.Data))
		case redis.Subscription:
			fmt.Printf("%s: %s %d\n", v.Channel, v.Kind, v.Count)
		case error:
			fmt.Println(v)
		}
	}
	/// End here

}

// InsertMongo
func insert_mongo(jsonString string) {
	//JSON string (it comes from client)

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
}
