package main

import (
	"fmt"
	"log"
	"net/http"
	"io/ioutil"
	"encoding/json"

	"github.com/gorilla/mux"
	"github.com/gomodule/redigo/redis"
)

//Base estruct
type Request struct {
  Name string `redis:"name"`
	Location string `redis:"location"`
	Age int `redis:"age"`
	InfectedType string `json:"infected_type"`
	State string `redis:"state"`
}

func homePage(w http.ResponseWriter, r *http.Request) {
	reqBody, _ := ioutil.ReadAll(r.Body)
	data := string(reqBody)
	transformAndStore(data)
	fmt.Fprintf(w, "%+v", data)
}

func main() {
	fmt.Println("Starting redis PUB...")
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/", homePage)
	log.Fatal(http.ListenAndServe(":8080", router))
}

func transformAndStore(jsonString string) {
	//Connection to redis VPC
	c, err := redis.Dial("tcp", "35.188.216.162:6379")
	if err != nil {
		log.Println(err)
	} else {
		log.Println("Redis PUB connected with Redis Server!!!")
	}
	// defer c.Close()

	//Parsing JSON string to Struct
	var req Request	
	json.Unmarshal([]byte(jsonString), &req)

	//Checking valid struct
	if (Request{} != req) {

		//Struct to jsonstring just to ensure a good format
		b, err := json.Marshal(req)
		if err != nil {
			fmt.Println(err)
			return
		}

		//Inserting object
		if _, err := c.Do("LPUSH", "lista", string(b)); err != nil {
			fmt.Println("Error insertando objeto en redis: ",err)
		}
	}
	
	// This is for Publisher
	c.Do("PUBLISH", "canal1", jsonString)
}