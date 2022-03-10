<div align="center">
<img src="www\img\parking.png" alt="parking" width="80" height="80"/>
</div>
# shared parking

 A responsive web application to manage your local parking space. Request a parking spot from others and provide your own parking spot for others to use!

## Description

I live in a big house with more than 200 flats. Each flat has an assigned parking spot, but all spots are used all the time.
Therefore we share out spaces, mostly for when visitors come over.
So far, we used a WhatsApp Group chat to manage the requests and spots, but that's confusing and inconvenient.
For example: If one asks for a spot ahead of times, it might not get a response because people can't say for sure.

To improve the situation, this application was created.
You can send requests, answer requests or simply provide your parking spot in case anyone might need it. 

## Getting Started

### Dependencies

* Docker and docker-compose
Please make sure docker-compose is installed
```
docker-compose --version
```

If you haven't installed docker-compose, please refer to the [project documentation](https://docs.docker.com/compose/install/)

* The Docker images are based on:
    * nodejs
    * mongoDB

### Preparations: Environment Variables
Create a `.env` file in the root directory of the project:
```
#Webserver configuration
APP_PORT="4000"

#credentials for the Mongo Database
#should probably be left alone, can be used to connect an external mongoDB
DB_HOST="localhost"
DB_PORT="27017"
DB_USER="root"
DB_PASSWORD="rootpassword"

#VAPID-Keys for push-notifications
PUBLIC_VAPID_KEY="Your-Public-Key"
PRIVATE_VAPID_KEY="Your-Private-Key"
VAPID_EMAIL="Your-EMail"
```

### Installing

No installation required, we simply use [docker-compose](https://docs.docker.com/compose/install/) and the rest is handled for us.

### Executing program

Simply start up the application:
```
docker-compose up -d
```
Point your browser to your application [http://localhost:4000/](http://localhost:4000/)  
Make sure your port is the same as configured in the `.env` file.

## Help

Any advise for common problems or issues.
```
command to run if program contains helper info
```

## Authors

* [@thebootable](https://github.com/thebootable)

## Version History

* 0.1
    * Initial Release

## License

This project is licensed under the GNU General Public License v3.0 License - see the LICENSE.md file for details

## Acknowledgments

Inspiration, code snippets, etc.
* [basic readme template](https://gist.github.com/DomPizzie/7a5ff55ffa9081f2de27c315f5018afc)
* [Project Parking icons created by Smashicons - Flaticon](https://www.flaticon.com/free-icons/parking)
