package main

import (
	"context"
	"fmt"
  "github.com/go-redis/redis"
)

var ctx = context.Background()

func main() {
  client := redis.NewClient(&redis.Options{
		Addr:     "35.188.216.162:6379", // host:port of the redis server
		Password: "", // no password set
		DB:       0,  // use default DB
 	})

	pong, err := client.Ping(client.Context()).Result()

	if err !=nil {
		fmt.Println("err",err);
	}

	client.Set(ctx, "key", "ojala esto si funcione", 0).Err()

	val, err := client.Get(ctx, "key").Result()

	if err != nil {
		fmt.Println("err",err);
		panic(err)
	}

	fmt.Println("key", val)
}