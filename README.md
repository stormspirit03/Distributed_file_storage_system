<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull reques
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!

-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->




<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
  
  </a>

  <h1 align="center">Distributed File storage system</h1

  <p align="center">
    A durable, available, and highly scalable storage solution!
    <br />
    <br />
    <br />
  
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary >Table of Contents</summary>
  <ol>
    <li><a href="#about">About</a></li>
    <li><a href="#components">Components</a></li>
    <li><a href="#flow">Flow</a></li>
    <li><a href="#user-api-details">User-api details</a></li>
    <li><a href="#sequence_diagram">Sequence_diagram </a></li>
    <li><a href="#the-file">The File </a></li>
    <li><a href="#load-balancer">Load Balancer </a></li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#postman_collection">Postman_collection</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About 
This system is designed to be able to store and download large-size files, manage folders, manage version control explicitly, and file sharing.

From an architecture point of view, the primary goal of this system is to streamline durable and scalable file storage, and access-controlled file sharing, All on top of "flat file storage " by leveraging the file meta-data for logical separation. The system is kept decoupled using a central queue and can be scaled horizontally just by adding more storage servers. <br><br>

<p align="center">
  <img src="https://github.com/stormspirit03/Distributed_file_storage_system/assets/53505985/7f4559ed-0a88-4a58-8ece-9519a1ac9921" alt="Distributed storage system drawio (2)">
</p>

<br><br>
## Components
1) <b>User Service:</b> This is responsible for user authentication.<br>
2) <b>Meta Server/Load Balancer:</b> This server stores file metadata and also acts as a load balancer.<br>
3) <b>Storage Servers:</b> These are the servers where the files are stored. They also handle synchronous replication for higher data durability.<br>
4) <b>Central Queue Server:</b> This server decouples the process of storing file metadata from the rest of the system.


<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Flow
1) Users are authenticated through the User Service. 
2) Once authenticated, the Meta Server, acting as a Load Balancer, directs the front end to the appropriate Storage Server based on the current load. 
3) The front end then directly uploads the file to the assigned Storage Server. 
4) The files are replicated synchronously across the servers for higher durability. 
5) Finally, the file metadata is stored in the Meta Server via the Central Queue, ensuring decoupling and enhanced performance. <br>
Additionally, read operations are performed on the replicas. Since replicas are generated synchronously to ensure real-time availability and read operations are non-conflicting, this approach further enhances the efficiency and reliability of the system.
<br><br>

## The File
<pre>{
  1. filename
  2. prefix
  3. userId
  4. hash
  5. versionId
  6. version
  7. path
  8. type
  9. size
  10. service
  11. access
  12. sharedAccessIds
  13. encoded-path
}
</pre>
* A file is uniquely identified using <code>hash</code> and <code>versionId</code>. 
* File <code>hash</code> is a combination of <code>filename</code>, <code>prefix</code>, and <code>userId</code> i.e. which file? in which folder? of which user? 
* <code>hash</code> is enough in itself, however <code>versionId</code> enables to store multiple versions of the same file.

## Load balancer
 1.  Determines the best database service to use based on the responses from data storage services.
 2.  Factors considered include whether the services are free and the total payload of each service.
 3.  If both services are not free, it chooses the one with the lower total payload.
 4.  If one service is free and the other is not, it chooses the free service.
 5.  If both services are free or if there is an error, it randomly selects one of the services.

####  * Sentry middleware to calculate payload at Storage service.
  I call it sentry, as it watches the incoming requests. This is done at each storage service end.

####  * Flow
1. The function checks if the request is for an upload or download endpoint by comparing the request method and path.
2. If the request is for an upload or download endpoint, the stats object is updated to indicate that the server is busy and the total payload and incoming requests are incremented.
3. The function attaches an error event listener to the request object. If an error occurs during the request, the stats object is updated to indicate that the server is free, and the total payload and incoming requests are decremented.
4. The function attaches a finish event listener to the response object. When the response is finished, the stats object is updated to indicate that the server is free, and the total payload and incoming requests are decremented.
5. The function calls the next function to pass control to the next middleware in the stack.
<br><br>
## Built With

|                           |                           |                           |
|:-------------------------:|:-------------------------:|:-------------------------:|
| [![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/) | [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/) | [![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)](https://redis.io/) |
| [![Multer](https://img.shields.io/badge/Multer-47A248)](https://www.npmjs.com/package/multer) |[![Apache Kafka](https://img.shields.io/badge/Apache%20Kafka-231F20?logo=apache-kafka&logoColor=white)](https://kafka.apache.org/) | [![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/) |



<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
</head>
<body>

<h2 id="user-api-details">User-API Details</h2>

<table >
    <tr>
        <th>API</th>
        <th>Endpoint</th>
        <th>Input</th>
        <th>Output</th>
    </tr>
    <tr>
        <td>Register</td>
        <td>POST http://user_service:8000/user/register</td>
        <td>
            <pre>
{
    "fullName": "Raviraj Gardi",
    "email": "Raviraj03@gmail25.com",
    "password": "12345678"
}
            </pre>
        </td>
        <td><pre><center>201 OK</center></pre></td>
    </tr>
    <tr>
        <td>Login</td>
        <td>POST http://host:8000/user/login</td>
        <td><pre>{
    "email":"Raviraj03@gmail28.com",
    "password":"12345678"
} </pre> </td>
        <td>
          <pre>
{
    "user": {
        "userId": "658c39824bf69a0ae39d4e1e",
        "email": "raviraj03@gmail28.com",
        "fullName": "Raviraj Gardi"
    },
    "message": "Login Successful",
    "accessToken": "eyJhbGciOiJIUzI1NiI6IkpXV..."
}
          </pre>
        </td>
    </tr>
    <tr>
        <td>File Upload</td>
        <td>POST http://user_service:9200/file/upload</td>
        <td>
            <pre>
{
    "file": "/C:/User/Pictures/b6b894.jpg",
    "prefix": "//parent//user//b//",
    "access": "public",
    "version": "other",
    "sharedAccessIds": "[]",
    "headers": {
        "x-file-size": "614743040",
        "Authorization": "Bearer eyJhbci9..."
    }
}
            </pre>
        </td>
        <td>
            <pre>
{
    "filename": "b6b894.jpg",
    "prefix": "//parent//user//b//",
    "userId": "658c39824bf69a0ae39d4e1e",
    "path": "/D:/dev/capstone..b6b894.jpg",
    "type": ".jpg",
    "size": 183991,
    "service": "9200",
    "access": "public",
    "sharedAccessIds": [],
    "hash": "0c...10fd48",
    "version": "other",
    "versionId": 1704..24251,
    "url": "http://db_service2:9200/file/...fe10fd48",
    "encoded-path": "%2FD%3A%2..cd040baf88b6b894.jpg"
}
            </pre>
        </td>
    </tr>

<tr>
  <td>Download File</td>
  <td>GET http://db_service2:9200/file/download/
:filepath/:filehash/:versionId</td>
  <td>
    <pre>
 {
    URL Parameters:
    {
        "filepath": "/D:/dev/capst..7760bfb6e814994.jpg",
        "filehash": "0ccfec98ebffe1cc07191468d610fd48",
        "versionId": "1703883106134"
    }
    Headers:
    {
        "Authorization": "Bearer eyJhbGI1NiIsVCJ9..."
    }
}
    </pre>  
  </td>
  <td>
    <pre>
200 OK
    </pre>
  </td>
</tr>
<tr>
  <td>Get all files of an User</td>
  <td>GET meta-service:10000/file/all</td>
  <td>
    <pre>  
    Headers:
    {
        "Authorization": "Bearer eyJhbGciOiJIUNiXVCJ9..."
    }
    </pre>  
  </td>
  <td>
    <pre>
{
    "folder1": [
        {file1 metadata},{file2 metadata}
      ],
    "folder2": [
        {file1 metadata},{file2 metadata}
      ]
}
    </pre>
  </td>
</tr>
<tr>
  <td>Get all files: type wise</td>
  <td>GET meta-service:10000/file/by-type</td>
  <td>
    <pre>  
    Headers:
    {
        "Authorization": "Bearer eyJhbGcUzI1NCJ9..."
    }
    </pre>  
  </td>
  <td>
    <pre>
{
    ".pdf": [
        {file1 metadata},{file2 metadata}
      ],
    ".mp4": [
        {file1 metadata},{file2 metadata}
      ]
}
    </pre>
  </td>
</tr>

<tr>
  <td>Get total storage usage by User</td>
  <td>GET meta-service:10000/file/storage-usage</td>
  <td>
    <pre>  
    Headers:
    {
        "Authorization": "Bearer eyJUziXVCJ9..."
    }
    </pre>  
  </td>
  <td>
    <pre>
{
    "folder1": {
         "size": "44444.00",
        "filesCount": 46
      },
    "folder2":{
         "size": "55555.00",
        "filesCount": 22
      }
      "totalUsage":"99999.00"
}
    </pre>
  </td>
</tr>
<tr>
  <td>Check file access for the User</td>
  <td>GET meta-service:10000/file/check-access/
:hash/:versionId</td>
  <td>
    <pre>  
   {
    URL Parameters:
    {
      "hash": "0ccfec98ebffe1cc07191468d610fd48",
      "versionId": "1703883106134"
    }
    Headers:
    {
        "Authorization": "Bearer eyJhI1NiIsVCJ9..."
    }
  }
    </pre>  
  </td>
  <td>
    <pre>
    true or false
    </pre>
  </td>
</tr>

<tr>
  <td>Get all versions of a given file</td>
  <td>GET meta-service:10000/file/all-versions/:hash</td>
  <td>
    <pre>  
   {
    URL Parameters:
    {
      "hash": "0ccfec98ebffe110fd48",
    }
    Headers:
    {
        "Authorization": "Bearer eyJhbI1NiICJ9..."
    }
  }
    </pre>  
  </td>
  <td>
    <pre>
[
    {
        "_id": "658ef9111098efe53c4f5ad7",
        "version": "other",
        "versionId": "1703868689092",
        "hash": "0ccfec98ebffe1cc07191468d610fd48"
    },
    {
        "_id": "658efe141098efe53c4f5adb",
        "version": "other",
        "versionId": "1703869971063",
        "hash": "0ccfec98ebffe1cc07191468d610fd48"
    },
    {
        "_id": "658efe601098efe53c4f5ae0",
        "version": "other",
        "versionId": "1703870048460",
        "hash": "0ccfec98ebffe1cc07191468d610fd48"
    },
  ]
    </pre>
  </td>
</tr>

<tr>
  <td>Set given file as the current version</td>
  <td>PUT meta-service:10000/file/check-access/
:hash/:versionId</td>
  <td>
    <pre>  
   {
    URL Parameters:
    {
      "hash": "0ccfec98ebffe1cc07191468d610fd48",
      "versionId": "1703883106134"
    }
    Headers:
    {
        "Authorization": "Bearer eyJhI1NiIsVCJ9..."
    }
  }
    </pre>  
  </td>
  <td>
    <pre>
    200 ( OK )
    </pre>
  </td>
</tr>


</table>
</body>
</html>

<br><br>
## Sequence_diagram
<a href="https://drive.google.com/file/d/1G3ViS_Al7HYg2Qsg1ajoU1aDROXGa0CI/view?usp=sharing" target="_blank">API Sequence Diagram</a> Dont shy away from zooming it.

<br><br>
## Installation
### Using Docker    [![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
( This uses running docker images one by one. I am learning about Docker Compose and will update once I successfully do it. Any help is welcomed :P )


#### 1. Pull Docker Images ( All the images are publicly available )

```bash
docker pull dokdokr/distributed-storage-system:mongo-6
docker pull dokdokr/distributed-storage-system:user_service
docker pull dokdokr/distributed-storage-system:meta_service
docker pull dokdokr/distributed-storage-system:db_service1
docker pull dokdokr/distributed-storage-system:db_service2
```
#### 2. Create a Custom Network ( must )
To ensure that all microservices, including databases, are on the same network for communication.
```bash
docker network create my-custom-network
```

#### 3. Run Docker Services
Run the Docker services one by one. Make sure to start MongoDB first and then the remaining services in any order.

```bash
# Run MongoDB
docker run -d --network=my-custom-network --name my-mongodb-6x -p 27017:27017 dokdokr/distributed-storage-system:mongo-6

# Run user_service
docker run -d --network=my-custom-network --name user_service -p 8000:8000 dokdokr/distributed-storage-system:user_service

# Run meta_service
docker run -d --network=my-custom-network --name meta_service -p 10000:10000 dokdokr/distributed-storage-system:meta_service

# Run db_service1
docker run -d --network=my-custom-network --name db_service1 -p 9100:9100 dokdokr/distributed-storage-system:db_service1

# Run db_service2
docker run -d --network=my-custom-network --name db_service2 -p 9200:9200 dokdokr/distributed-storage-system:db_service2

```
Now use the given Postman collection to hit the request and start using it. ✔

#### Tip: Kindly use these ports for the respective services to leverage the  given Postman collection and sample env files.
 <code>27017 </code>for mongo <br>
 <code>8000 </code>for user_service <br> 
 <code>9100 </code>for user_service1 <br>
 <code>9200 </code>for user_servie2 <br>
 <code>10000 </code>for meta_service <br>

### Using Local server
1. Clone the repo.
   ```sh
   git clone https://github.com/stormspirit03/Distributed_file_storage_system
   ```
2. Install NPM packages.
   ```sh
   npm install
   ```
3. Run all services in a separate terminal.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Postman_collection
[![Postman Collection](https://img.shields.io/badge/Postman-Download-FF6C37?style=for-the-badge&logo=postman&logoColor=white)](https://github.com/stormspirit03/Distributed_file_storage_system/blob/main/airtribe%20capstone.postman_collection.json)
<br>
I have shared the Postman collection. Just import it inside Postman and you are good to go.
<!-- CONTACT -->
## Contact

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white&link=https://www.linkedin.com/in/raviraj-gardi/)](https://www.linkedin.com/in/raviraj-gardi/) <br>

Mail me at Raviraj03.py@gmail.com ( I respond to the emails)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Thanks to Dhaval Trivedi for his valuable feedback and guidance.  <br>  [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white&link=https://www.linkedin.com/in/dhaval-trivedi/)](https://www.linkedin.com/in/dhaval-trivedi/)
.  <br> <br>
Thanks to Vedant Rathore for his timely support and guidance. 

<p align="right">(<a href="#readme-top">back to top</a>)</p>


