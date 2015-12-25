# PGNChess

PGNChess is a lightweight Node.js, Express.js, and MongoDB web application. It allows users to record chess games and moves using PGN (Portable Game Notation). It also allows other users to view live updates of the chess game in progress. 

Example of PGN Chess Game (read more: http://www.enpassant.dk/chess/palview/manual/pgn.htm):

```sh
[Event "CA-2008-0-00195"]
[Site "IECG"]
[Date "2008.08.15"]
[Round "1"]
[White "Boni, Roberto"]
[Black "McShane, Mike"]
[Result "0-1"]

1. e4 e6 2. d4 d5 3. Nd2 c5 4. exd5 exd5 5. Ngf3 Nc6 6. Bb5 Bd6
7. O-O cxd4 8. Nb3 Nge7 9. Bxc6+ Nxc6 10. Nbxd4 O-O 11. Re1 Bg4
12. h3 Bxf3 13. Nxf3 Qf6 14. Qxd5 Qd8 15. Be3 Bh2+ 0-1
```

### Setup
  * You will need Node.js installed
    * Download and install Node.js through this link and follow instructions https://nodejs.org/en/download/
 * You will need MongoDB installed as well
   * Download and install MongoDB through this link and follow instructions https://www.mongodb.org/downloads#production
 * Git clone this repo locally

    ```
    $ git clone https://github.com/rahuang/PGNChess.git
    ```

  * Now that the repo is cloned and Node is installed, the npm package manager should be installed too. Change your directory to the project directory and install node modules. Follow these next steps:

    ```
    $ cd PGNChess
    $ npm install
    ```

  * This will create a new directory in your project folder called node_modules. This will download and install all node modules needed to run the web application. Wait for all npm install to complete.
  * Open another command prompt window and run mongod. *(Note: The app assumes that you have a MongoDB database called 'chess' and will be working with a collection called 'pgnchess'.)*

    ```
    $ mongod
    ```  

  * Go back to your first command prompt window and now you can start up the Node.js server and run the app.

    ```
    $ npm start
    ```  

  * Now you can open up any web browser (preferably Chrome) and go to [http://localhost:3000/chess](http://localhost:3000/chess). The server should be running properly and a list of all the chess game (empty if you haven't populated your Mongo database) will be displayed.

### Common problems
###### Express Problems
  * If for some reason the server doesn't start up properly, it's probably because express wasn't installed properly. Follow these commands:

    ```
    $ npm install -g express-generator
    ```  

###### Generic Node Module Problems
  * If any problems occur with package.json or the node_modules make sure you have the right/current copy of the package.json file from the remote git repo.
  * Go to your directory in a command prompt. Delete the whole node_modules directory

    ```
    $ rm -rf node_modules
    ```  

  * Reinstall all the node modules

    ```
    $ npm install
    ```  
 
 ### License
 Authors: Richard Huang and Akshay Goradia

