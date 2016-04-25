## NodeJS API RESTful Starter kit

* Objective:
I've working on the RESTful web application, and would like to practice more security in term of fetching data
from cloud server or authurised server

## Tasks to do.
- Seperate files between Server and Client 
- Create Webpage
- Login/Register Page
- Dashboard 

## How to run
- git clone https://github.com/mrtawans/nodejs-api-and-token-starter-kit.git
- git cd nodejs-api-and-token-starter-kit
- npm install
- npm run start

__Go to http://localhost:3000 for Client__

__Do Fake Authencation__

* Go to http://localhost:3000/auth/tawan
* You would get generated token
* Look at src/server/routes/index.js
* Fetch data from RESTful API server

_Go to http://localhost:3000/api/city?token=__TOKEN___
- BOOM! you could fetch secured datas as JSON format.

## TO DO:
- POST the generated token by x-www-form-urlencoded
- Create form submit and stores token into cookies or session. # web-project
# web-project
