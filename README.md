###  PC5 Node.JS PROJECT
----------------------
#           SNAKES GAME      
----------------------


## << ENGLISH >>                    

SNAKES GAME is a multiplayer browser game.   
Gameplay: Each client that connects to the server controls a snake. The snake moves it's head, with the rest following, to the position of the last click of the client. When the snake collides with another snake or an obstacles, it reapears in a different random location.

## SETTING UP THE PROJECT               

### 1. INSTALLING NECESSARY MODULES     
Firstly you need to install NODE and NPM on your machine:  
- Download and install a version of NPM with NODE included.   
       You can find a version suited for your OS here :   
           https://nodejs.org/download/release/latest/
            
 - On a Linux based OS you can also use these commands :   
```sh
$ sudo apt-get install node  
```
and  
```sh
$ sudo apt-get install npm
```
            
Then install the necessary modules:  
> https  
> fs  
> path  
> ws  
> express  
> tape  
> jslint or jshint
        
! You can install these modules globally or inside the project in the folder: "~/P5C" ('~'   path to project location in the folders hierarchy)

### 2. COMMANDS     
OPTIONAL: INSTALLING THE MODULES INSIDE THE PROJECT  
   To install the modules inside the project you need to run the following command in a terminal:
```sh
$ cd ~/P5C
```
 ! Don't use this command if you want to add the modules globally.
        
For installing the modules run the following command for every module listed above in a terminal :  
```sh
$ npm install <module_name>       
```           
// <module_name> - one of the names in the module list above
 A folder named "node_modules" will appear in your project or in a default location. 
It will contain all the modules that you installed.
     
### 3. GENERATING SSL KEY AND CERTIFICATE     
To generate a key and a certificate for running a HTTPS server you need to run the following command in a terminal:
``` sh
$ openssl req -nodes -new -x509 -keyout server.key -out server.cert
```
Then you have to move the files from the folder where they were created in to "~/P5C/private".

### 4. STARTING THE HTTPS SERVER     
To start the https server you have to run the "~/P5C/public/server.js" file.  
You can either import the whole project into a IDE and run it from there or just run the file from the terminal.

##  PLAYING THE GAME     
To connect as a client to the https server and play the game you have to open a browser and type into the address bar:
- from the same PC:  
    https://localhost:8081 
- from another PC:  
    https://<server_ip>:8081   
  
Where :
- <server_ip> is the IPv4 ip address of the machine that runs the server file,
- 8081 is the port used by the https server(the server listens to that port).
    
## LICENCE     

Code and documentation copyright 2015 Iulia Andreea Balta. You are free to use and modify this code, as per the specifications 
of the GNU General Public Licence V2 (see LICENCE.txt for a full copy of the licence).
     
## << FRANCAIS >>                    
SNAKES GAME est un jeu multijoueur par navigateur.   
GAMEPLAY: Chaque joueur connecté contrôle un serpent. Le serpent se déplace sa tête, et le reste le suit, dans la direction du dernier clic. Quand un serpent percute un autre serpent ou un obstacle, il est réinitialisé à une position aléatoire.

##### CONFIGURATION DU PROJET               

### 1. INSTALLATION DU MODULES NECESSAIRES     
En premier lieu il faut installer NODE et NPM sur votre machine:
- Télécharger et installer une version de la NGP avec NODE inclus. 
- Vous pouvez trouver une version adaptée à votre système d'exploitation ici :   https://nodejs.org/download/release/latest/
         
Sur un système d'exploitation basé sur Linux, vous pouvez également utiliser ces commandes : 
```sh
$ sudo apt-get install node
```
   et
```sh
$ sudo apt-get install npm
```
         
Ensuite, installez les modules nécessaires:
> https  
> fs  
> path  
> ws  
> express  
> tape  
> jslint ou jshint
     
Vous pouvez installer ces modules globalement ou à l'intérieur du projet dans le dossier: "~/P5C"   
'~'  = chemin d'accès à l'emplacement du projet dans la hiérarchie des dossiers

### 2. COMMANDES
OPTION: INSTALLATION DES MODULES À L'INTÉRIEUR DU PROJET
Pour installer les modules à l'intérieur du projet, vous devez exécuter la commande suivante dans un terminal:
```sh
cd ~/P5C
```
 ! Ne pas utiliser cette commande si vous souhaitez ajouter des modules globalement.
     
Pour l'installation des modules exécutez la commande suivante pour chaque module listé ci-dessus dans un terminal :
```sh
$ npm install <module_name>     
```
        
<module_name> - l'un des noms dans la liste des modules ci-dessus
 Un dossier nommé "node_modules" apparaîtra dans votre projet ou dans un emplacement par défaut. 
Il contiendra tous les modules que vous avez installér.

### 3. GÉNÉRATION DU SSL CLE ET DU CERTIFICAT
Pour générer une clé et un certificat pour l'exécution d'un serveur HTTPS, vous devez exécuter la commande suivante dans un terminal:
```sh
$ openssl req -nodes -new -x509 -keyout server.key -out server.cert
```

Ensuite, vous devez déplacer les fichiers du dossier dans lequel ils ont été créés dans le dossier "~/P5C/private".

### 4. LE DEMARRAGE DU SERVEUR HTTPS 
Pour démarrer le serveur https, vous devez exécuter le fichier "~/P5C/public/server.js".
##Vous pouvez importer l'ensemble du projet dans un IDE et l'exécuter à partir de là ou tout simplement exécuter le fichier 
##à partir du terminal:
```sh
$ node .~/P5C/public/server.js
```
## COMMENT JOUER   
Pour vous connecter comme un client au serveur https et de jouer le jeu, vous devez ouvrir un navigateur et tapez dans la barre d'adresse:
- depuis le même ordinateur personnel:  
 https://localhost:8081 
- depuis un autre ordinateur personnel:  
 https://<ip_server>:8081 

Où :
> <ip_server> = l'adresse IP IPv4 de la machine qui exécute le fichier du serveur  
> 8081 = le port utilisé par le serveur https (le serveur écoute a cet port).


    
