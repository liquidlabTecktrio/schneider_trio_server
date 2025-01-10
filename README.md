## schneider server API Documentation

Root url for Testing 
```
https://sandbox.liquidlab.in/
```

Root url for production 
```
https://schiendertrackingsystem.com
```
## Authentication

| **API Endpoints**  | **Params**  | **Function**                                      |
|--------------------|--------------------|---------------------------------------------------|
| **adminLogin**     | {"username":"test","password":"test"} | Return Authentication key for all other requests  |
| **spokeLogin**     | {"spokeUserName":"test","Password":"test"} | Return Authentication key for all other requests  |
| **spokeRegister**  | { "spokeName":"", "spokeShortName":"" , "spokeUserName":"", "spokePassword":"" } | Return Authentication key for all other requests  |
| **hublogin**       | {"hubUsername":"test","hubPassword":"test"}  | Return Authentication key for all other requests  |
| **hubregister**    | {"hubName":"", "hubShortName":"", "hubUsername":"", "hubPassword":"", "logo_ZPL":""} | Return Authentication key for all other requests  |


## Project Related APIs

| **API Endpoints**               | **Function**                                      |
|---------------------------------|---------------------------------------------------|
| **getAllProjects**              | Return all the project records in the system      |
| **getOpenProjects**             | Return all the open project records in the system |
| **getProjectDetailsWithParts**  | Return all projects with parts in it              |
| **getProjectsDetails**          | Return project detail for a specific project      |
| **getAllPartsInProject**        | Return all the parts for a specific project       |


## Commertial Refference Related APIs

| **API Endpoints**               | **Function**                                      |
|---------------------------------|---------------------------------------------------|
| **getAllProjects**              | Return all the project records in the system      |
| **getOpenProjects**             | Return all the open project records in the system |
| **getProjectDetailsWithParts**  | Return all projects with parts in it              |
| **getProjectsDetails**          | Return project detail for a specific project      |
| **getAllPartsInProject**        | Return all the parts for a specific project       |