# proyecto2_grupo3_so1
Repositorio proyecto 2 del curso Sistemas Operativos 1 - USAC

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Tabla de Contenidos</summary>
  <ol>
    <li>
      <a href="#acerca-del-proyecto">Acerca del proyecto</a>
      <ul>
        <li><a href="#tecnologías-utilizadas">Tecnologías Utilizadas</a></li>
      </ul>
    </li>
    <li>
      <a href="#comenzando">Comenzando</a>
      <ul>
        <li><a href="#pre-requisitos">Pre-requisitos</a></li>
        <li><a href="#creando-el-cluster">Creando el clúster</a></li>
        <li><a href="#instalar-linkerd-en-el-cluster">Instalar Linkerd en el cluster</a></li>
        <li><a href="#creación-de-ingress-nginx">Creación de Ingress Nginx</a></li>
        <li><a href="#inyección-del-ingress-con-linkerd">Inyección del Ingress con Linkerd</a></li>
        <li><a href="#creación-de-deployments-service-ingresses-y-function-split">Creación de Deployments, Service, Ingresses y Function Split</a></li>
        <li><a href="#inyección-de-los-despliegues">Inyección de los Despliegues</a></li>
      </ul>
    </li>
    <li>
      <a href="#blue-deployment">Blue Deployment</a>
    </li>
    <li>
      <a href="#green-deployment">Green Deployment</a>
    </li>
  </ol>
</details>

## Acerca del Proyecto

### Tecnologías Utilizadas

## Comenzando

### Pre-requisitos

1. Tener cuenta en google cloud
2. Tener instalado gcloud, kubectl, linkerd, helm, locust

### Creando el Cluster
  * Iniciar GCloud
    ```
    gcloud init
    ```
  * Crear el clúster
    ```
    gcloud container clusters create k8s-demo --num-nodes=1 --tags=allin,allout --enable-legacy-authorization --enable-basic-auth --issue-client-certificate --machine-type=n1-standard-2 --no-enable-network-policy
    ```
  
### Instalar linkerd en el cluster
  ```
  linkerd install | kubectl apply -f -
  ```
  
### Creación de Ingress Nginx

  * Crear namespace para ingress
    ```
    kubectl create ns nginx-ingress
    ``` 
  
  * Actualizar repositorios de helm
    ```
    helm repo update
    ``` 
 
  * Instalar el ingress de nginx
    ```
    helm install nginx-ingress ingress-nginx/ingress-nginx -n nginx-ingress
    ```
    
### Inyección del Ingress con Linkerd

  * Inyectar los pods al ingress para linkerd
    ```
    kubectl get deployment nginx-ingress-ingress-nginx-controller -n nginx-ingress -o yaml | linkerd inject --ingress - | kubectl apply -f -
    ```
    
 ### Creación de Deployments, Service, Ingresses y Function Split
 
  * Para ello se utiliza el siguiente comando con cada archivo .yaml o se puede utilizar una archivo .yaml que contenga todas las configuraciones.
    ```
    kubectl create -f [file.yaml]
    ```
    
 #### Namespace
  
  Se crea el namespace 'project' en el cual se agrupan las configuraciones.
  
 #### Deployments
 
  Se crean los siguentes despliegues:
  * dummy: Despliegue de la API dummy la cual funciona como punto de division del tráfico.
  * grpc-client-deployment: Despliegue blue del cliente de grpc.
  * grpc-server-deployment: Despliegue para el servidor de grpc.
  * redis-pub-deployment: Despliegue green del publish para redis.
  * redis-sub-deployment: Despliegue para el subscribe de redis.
  
#### Services

  Se crean los siguientes servicios:
  * dummy: Servicio de la API dummy de división de tráfico.
  * grpc-client-service: Servicio del despliegue blue para el cliente de grpc.
  * grpc-server-service: Servicio del server para grpc.
  * redis-pub-service: Servicio del despliegue green del publish para redis.
  * redis-sub-service: Servicio para el subscrib de redis.
  
#### Ingresses

  Se crean los siguientes Ingresses
  * dummy-ingress: Controlador de ingreso para la API dummy.
  * blue-ingress: Controlador de ingreso para el cliente de grpc.
  * green-ingress: Controlador de ingreso para el publish de redis.
  
#### TrafficSplit

  * function-split: Función para el servicio dummy que divide el tráfico hacia los despliegues blue y green.
  
### Inyección de los Despliegues

  * Se deben inyectar los despliegues lo cual permite que cada uno tenga 2 pods.

    ```
    kubectl get -n project deploy -o yaml \
    | linkerd inject - \
    | kubectl apply -f -
    ```
    
 ## Blue Deployment
 
 ## Green Deployment
 
 ### Redis Publish
  
   * Servicio de redis que publica a un canal y agrega los datos a la base de datos de Redis.
   
 #### Funciones en Go
 
   * main: 
   * :
   
 ### Redis Subscribe
  
   * Servicio de redis que está suscrito a un canal y agrega los datos recibido por el mismo a la base de datos de Mongo.

 #### Funciones en Go para Redis Sub
 
 ##### main
 
   * Conecta con la base de datos de Redis con la función redis.Dial() que recibe el tipo de red y la dirección en la cual se encuentra alojado Redis. 
   
     ```
     c, err := redis.Dial("tcp", "35.188.216.162:6379")
     ```
   
   * Luego utiliza el método redis.PubSubConn de recepción convierte un mensaje enviado en tipos convenientes para usar en un cambio de tipo y lo asigna a una variable. Para suscribirse al canal se utiliza la funcion psc.Subscribe("canal1") dónde 'psc' es la variable a la cual se asignó con PubSubConn.
     
     ```
     psc := redis.PubSubConn{Conn: c}
     psc.Subscribe("canal1")
     ```
     
   * Se utiliza una sentencia for para verificar si hay mensajes recibidos y en caso de que existan se llama a la función insert_mongo() para instertar los registros a la base de datos de Mongo. Con la función Receive().(type) se obitene el objeto recibido que puede ser un mensaje, suscripción o un error.
   
     ```
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
     ```
     
 ##### insert_mongo
