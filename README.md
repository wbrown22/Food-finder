# Food-finder
In order to teach myself how to build a RESTful API, I created this project. The project uses MongoDB, Express, Nodejs, and Reactjs (MERN). Another focus of this project was to work more on CSS styling and improve layout and overall aesthetics of my applications.

  The layout of the RESTful API was broken down into routes for good practice. In this particular API, there was only one endpoint so this is fairly straight forward (the request handling can be found in 'backend/Api/Routes/providers.js'). The API supports 'GET', 'POST', 'PATCH', and 'DELETE' request types, however the front end only demonstrates requests of type 'GET'. 
  
 REQUESTS:
    
  ```
       Endpoints:
       Development baseURL => http://localhost:4000
       GET, POST              /providers
       GET, PATCH, DELETE     /providers/id

  ```
       
  ```
      'GET'   /providers
        description: Returns list of food providers that specialize in the foodType provided and are within 100 mi.
        Params => lng, lat, foodType
        Example Request => http://localhost:4000/providers/?lng=80&lat=20&foodType='Pizza'
        Response => {
                     "count": 1,
                     "providers": [
                          {
                              "name": "Papa John's",
                              "specialty": "Pizza",
                              "orders": 0,
                              "distance": 62.9451507882235,
                              "request": {
                                  "type": "GET",
                                  "description": "Get delivery provider details",
                                  "url": "http://localhost:3000/providers/5c528647e608d55e9f43e2a3"
                              }
                          }
                       ]
                     }
                      
  ```
  
  ```
        'GET'   /providers/id
        description: returns details of the food provider that is associated with the provided id.
        Example Request => http://localhost:4000/providers/5c528ece8bc73c5f5590e9f2
        Response => {
                        "location": {
                            "type": "Point",
                            "coordinates": [
                                -81.1,
                                24.95
                            ]
                        },
                        "orders": 0,
                        "open": true,
                        "_id": "5c528ece8bc73c5f5590e9f2",
                        "name": "Mama Lucia",
                        "specialty": "Pasta",
                        "__v": 0
                    }
                    
  ```
  
  ```
      'POST':
  ```

  ```
      'PATCH':
  ```
  
  ```
       'DELETE':
  ```

Info
---
* **Platform**: Web browser
* **Back end**: Nodejs, Express, MongoDB
* **Front end**: Reactjs
* **Code Style**: Standard
* **Unit Test**: None

Demo
---
