## PC5 Node.JS PROJECT
----------------------
  #   SNAKES GAME      
----------------------


                              EN                    

#SNAKES GAME is a multiplayer browser game. 
#Gameplay: Each client that connects to the server controls a snake. The snake moves it's head, with the rest following, to the
#position of the last click of the client. When the snake collides with another snake or an obstacles, it reapears in a different 
#random location.

                  SETTING UP THE PROJECT               

         INSTALLING NECESSARY MODULES     
#Firstly you need to install NODE and NPM on your machine:
#   Download and install a version of NPM with NODE included. 
#        You can find a version suited for your OS here : 
#            https://nodejs.org/download/release/latest/
            
#        On a Linux based OS you can also use these commands : 
#            > sudo apt-get install node
#             and
#            > sudo apt-get install npm
            
#Then install the necessary modules:
#        - https
#        - fs
#        - path
#        - ws
#        - express
#        - tape
#        - jslint ou jshint
        
#    You can install these modules globally or inside the project in the folder: "~/P5C" ('~'   path to project location in the folders hierarchy)

          COMMANDS     
##    OPTIONAL: INSTALLING THE MODULES INSIDE THE PROJECT
##    To install the modules inside the project you need to run the following command in a terminal:
##-> cd ~/P5C
##    !Don't use this command if you want to add the modules globally.
        
#For installing the modules run the following command for every module listed above in a terminal :
#-> npm install <module_name>       
           
##    // <module_name> - one of the names in the module list above
##     A folder named "node_modules" will appear in your project or in a default location. 
##     It will contain all the modules that you installed.
     
         GENERATING SSL KEY AND CERTIFICATE     
#To generate a key and a certificate for running a HTTPS server you need to run the following command in a terminal:
#-> openssl req -nodes -new -x509 -keyout server.key -out server.cert

#Then you have to move the files from the folder where they were created in to "~/P5C/private".

         STARTING THE HTTPS SERVER     
#To start the https server you have to run the "~/P5C/public/server.js" file.
#You can either import the whole project into a IDE and run it from there or just run the file from the terminal.

         PLAYING THE GAME     
#To connect as a client to the https server and play the game you have to open a browser and type into the address bar:
#- from the same PC:
#    https://localhost:8081 
#- from another PC:
#    https://<server_ip>:8081 
##    //where <server_ip> is the IPv4 ip address of the machine that runs the server file,
##    //and 8081 is the port used by the https server(the server listens to that port).
    
          LICENCE     

#Code and documentation copyright 2015 Iulia Andreea Balta. You are free to use and modify this code, as per the specifications 
#of the GNU General Public Licence V2 (see LICENCE.txt for a full copy of the licence).
     
                              FR                    
#SNAKES GAME est un jeu multijoueur par navigateur. 
#Gameplay: Chaque joueur connect� contr�le un serpent. Le serpent se d�place sa t�te, et le reste le suit, dans la direction 
#du dernier clic. Quand un serpent percute un autre serpent ou un obstacle, il est r�initialis� � une position
#al�atoire.

               CONFIGURATION DU PROJET               

         INSTALLATION DU MODULES NECESSAIRES     
#En premier lieu il faut installer NODE et NPM sur votre machine:
    ##T�l�charger et installer une version de la NGP avec NODE inclus. 
    ##Vous pouvez trouver une version adapt�e � votre syst�me d'exploitation ici : https://nodejs.org/download/release/latest/
         
#     Sur un syst�me d'exploitation bas� sur Linux, vous pouvez �galement utiliser ces commandes : 
##         > sudo apt-get install node
#          et
##         > sudo apt-get install npm
         
#Ensuite, installez les modules n�cessaires:
#     - https
#     - fs
#     - path
#     - ws
#     - express
#     - tape
#     - jslint ou jshint
     
##Vous pouvez installer ces modules globalement ou � l'int�rieur du projet dans le dossier: "~/P5C" 
#'~'   chemin d'acc�s � l'emplacement du projet dans la hi�rarchie des dossiers

#COMMANDES
###     OPTION: INSTALLATION DES MODULES � L'INT�RIEUR DU PROJET
###     Pour installer les modules � l'int�rieur du projet, vous devez ex�cuter la commande suivante dans un terminal:
###-> cd ~/P5C
###    ! Ne pas utiliser cette commande si vous souhaitez ajouter des modules globalement.
     
##Pour l'installation des modules ex�cutez la commande suivante pour chaque module list� ci-dessus dans un terminal :
##-> npm install <module_name>       
        
### // <module_name> - l'un des noms dans la liste des modules ci-dessus
###  Un dossier nomm� "node_modules" appara�tra dans votre projet ou dans un emplacement par d�faut. 
###  Il contiendra tous les modules que vous avez install�r.

#G�N�RATION DU SSL CLE ET DU CERTIFICAT
##Pour g�n�rer une cl� et un certificat pour l'ex�cution d'un serveur HTTPS, vous devez ex�cuter la commande suivante dans 
##un terminal:
##-> openssl req -nodes -new -x509 -keyout server.key -out server.cert

#Ensuite, vous devez d�placer les fichiers du dossier dans lequel ils ont �t� cr��s dans le dossier "~/P5C/priate".

#LE DEMARRAGE DU SERVEUR HTTPS 
##Pour d�marrer le serveur https, vous devez ex�cuter le fichier "~/P5C/public/server.js".
##Vous pouvez importer l'ensemble du projet dans un IDE et l'ex�cuter � partir de l� ou tout simplement ex�cuter le fichier 
##� partir du terminal:
##-> node .~/P5C/public/server.js

#COMMENT JOUER 
##Pour vous connecter comme un client au serveur https et de jouer le jeu, vous devez ouvrir un navigateur et tapez dans la barre d'adresse:
##- depuis le m�me ordinateur personnel:
###   https://localhost:8081 
##- depuis un autre ordinateur personnel:
###    https://<ip_server>:8081 
###   //o� <ip_server> est l'adresse IP IPv4 de la machine qui ex�cute le fichier du serveur,
###   //et 8081 est le port utilis� par le serveur https (le serveur �coute a cet port).



    
