<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
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
    A highly scalable , available and durable storage solution!
    <br />
    <a href="https://github.com/othneildrew/Best-README-Template"><strong>Explore the docs »</strong></a>
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
    <li><a href="#installation">Installation</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About 
The high level functionality of system is to be able to manage folders, store and download large size files, manage version control explicitly and file sharing.

In architecture point of view the primary goal of this system is to streamline durable and scalable file storage, access controlled file sharing, All on top of "flat file storage " by leveraging the file meta-data for logical separation. System is kept decoupled using central queue and can be scaled horizontally just by adding more storage servers. <br><br>

<p align="center">
  <img src="https://github.com/stormspirit03/Distributed_file_storage_system/assets/53505985/7f4559ed-0a88-4a58-8ece-9519a1ac9921" alt="Distributed storage system drawio (2)">
</p>


## Components
1) <b>User Service:</b> This is responsible for user authentication.<br>
2) <b>Meta Server/Load Balancer:</b> This server stores file metadata and also acts as a load balancer.<br>
3) <b>Storage Servers:</b> These are the servers where the files are stored. They also handle synchronous replication for higher data durability.<br>
4) <b>Central Queue Server:</b> This server decouples the process of storing file metadata from the rest of the system.


<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Flow
1) Users are authenticated through the User Service. 
2) Once authenticated, the Meta Server, acting as a Load Balancer, directs the frontend to the appropriate Storage Server based on the current load. 
3) The frontend then directly uploads the file to the assigned Storage Server. 
4) The files are replicated synchronously across the servers for higher durability. 
5) Finally, the file metadata is stored in the Meta Server via the Central Queue, ensuring decoupling and enhanced performance. <br>
Additionally, read operations are performed on the replicas. Since replicas are generated synchronously to ensure real-time availability and read operations are non-conflicting, this approach further enhances the efficiency and reliability of the system.

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


## Sequence_diagram
<a href="https://drive.google.com/file/d/1G3ViS_Al7HYg2Qsg1ajoU1aDROXGa0CI/view?usp=sharing" target="_blank">API Sequence Diagram</a> Dont shy away from zooming it.


## Installation
### For Docker images   [![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
1. Create a Dockerfile on the same level as the 'src' directory.  [Sample Dockerfile](https://github.com/stormspirit03/Distributed_file_storage_system/blob/main/sample%20docker%20file.txt)
2. Create a custom network for your project. Ensure all microservices, including databases, are on the same network for communication.
3. Ensure all requirements are mentioned correctly. <br>
   Build the Docker image using the following command:
```sh
   docker build -t meta-service /D:/dev/capstone/meta_service
   ```

4. Run the container using the following command:
```sh
   docker run -d --network=my-custom-network --name meta-service -p 10000:10000 meta-service
   ```

5. To know the IP address, use the following command:
```sh
   docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' meta-service
   ```
6. To stop the container, use the command:
```sh
   docker stop container-name
   ```
7. To remove the container, use the command:
```sh
   docker rm container-name
   ```


### For Git
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


<!-- CONTACT -->
## Contact

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white&link=https://www.linkedin.com/in/raviraj-gardi/)](https://www.linkedin.com/in/raviraj-gardi/) <br>

Mail me at Raviraj03.py@gmail.com ( I respond the mails )

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Thanks to Dhaval Trivedi for his valueable feedback and guidance  <br>  [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white&link=https://www.linkedin.com/in/dhaval-trivedi/)](https://www.linkedin.com/in/dhaval-trivedi/)
.  <br> <br>
Thanks to Vedant Rathore for his timely support and guidance. 

<p align="right">(<a href="#readme-top">back to top</a>)</p>


