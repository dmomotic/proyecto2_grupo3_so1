# proyecto2_grupo3_so1
Repositorio proyecto 2 del curso Sistemas Operativos 1 - USAC

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Tabla de Contenidos</summary>
  <ol>
    <li>
      <a href="#acerca-del-proyecto">Acerca del proyecto</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisitos">Prerequisites</a></li>
        <li><a href="#creando-el-cluster">Creando el clúster</a></li>
        <li><a href="#instalar-linkerd-en-el-cluster">Instalar Linkerd en el cluster</a></li>
        <li><a href="#creación-de-ingress-nginx">Creación de Ingress Nginx</a></li>
        <li><a href="#inyección-del-ingress-con-linkerd">Inyección del Ingress con Linkerd</a></li>
      </ul>
    </li>
  </ol>
</details>

## Acerca del Proyecto

### Built With

## Getting Started

### Prerequisitos

1. Tener cuenta en google cloud
2. Tener instalado gcloud, kubectl, linkerd, helm, locust

### Creando el Cluster
  * Iniciar GCloud
    ```
    gcloud init
    ```
  * Crear el clúster
    ```
    gcloud container clusters create k8s-demo --num-nodes=1 --tags=allin,allout --enable-legacy-authorization --enable-basic-auth --issue-client-certificate --machine-type=>
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
    helm install nginx-ingress ingress-nginx/ingress-nginx -n nginx-ingress
    ```
    
 
