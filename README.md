# CakeFusion: A full stack baking book application 
CakeFusion is a full stack web application. It is a baking book with a focus on cakes, where you can add doughs,
fillings and toppings that you can combine to create your own cake.

## Table of Contents
- [Introduction](#introduction)
- [Installation on Raspberry Pi](#Installation-steps-for-a-Raspberry-Pi)
- [Usage](#usage)
- [Planned Features](#planned-features)
- [UI Images](#UI-Images)

## Installation steps for a Raspberry Pi:
Note: These steps have been tested on Raspberry Pi 4 and 5. It may work on other Raspberry Pis.
If you want to access the website without an IP adress, you can check the option "Hostname" at the Raspberry Pi Imager. With that, you can access the website while using the hostname.

### Requirements:
- A Raspberry Pi with a 64-bit OS.
- Basic knowledge of Raspberry Pi setup and SSH connectivity.
- Internet connection for downloading dependencies.


### Initial setup:
1. Install the OS and boot your Pi
2. Connect via SSH
3. Update system packages 
```bash
sudo apt update && sudo apt upgrade -y 
```

### Install MongoDB:
1. Create a directory for the MongoDB binaries and download the package:
```bash
mkdir ~/mdb-binaries && cd ~/mdb-binaries
wget https://github.com/themattman/mongodb-raspberrypi-binaries/releases/download/r7.0.14-rpi-unofficial/mongodb.ce.pi4.r7.0.14.tar.gz
tar xzvf mongodb.ce.pi4.r7.0.14.tar.gz 
```

2. Install the required dependencies and prepare the database directory:
```bash
sudo apt install libssl1.1
sudo mkdir -p /data/db/test_db
sudo touch /data/db/test_db/mongod.log
sudo chown -R ${USER}:${USER} /data
```

3. Set up MongoDB as a systemd service to start automatically on reboot
Create the file
```bash
sudo nano /etc/systemd/system/mongodb.service
```
Then add and edit the following (replace <your_username> with your actual username)

[Unit]
Description=MongoDB Database Server
After=network.target

[Service]
User=<your username>
ExecStart=/home/<your username>/mdb-binaries/mongod --dbpath /data/db/test_db --fork --logpath /data/db/test_db/mongod.log --port 27017
Restart=always
Type=forking

[Install]
WantedBy=multi-user.target

4. Restart systemd and start the MongoDB service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable mongodb.service

sudo systemctl start mongodb.service
sudo systemctl status mongodb.service
```

### Install Node.js:
1. Install NodeJS version 22.
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

2. Check that the installation has worked:
```bash
   node -v
   npm -v
```
Expected output (or similar):
   v22.14.0
   10.9.2

### Nginx setup for the Angular frontend:
1. Install nginx
```bash
sudo apt install nginx git -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

2. Make the directory angular-frontend, where the frontend build will be copied to later.
```bash
sudo mkdir /var/www/angular-frontend
```

3. Create a new nginx site configuration file:
```bash
sudo nano /etc/nginx/sites-available/angular-frontend
```
Paste the following configuration:
```
server {
   listen 80;
   server_name _;

   root /var/www/angular-frontend/browser;
   index index.html;

   location / {
      try_files $uri $uri/ /index.html;
   }

   location /api/ {
      proxy_pass
      http://localhost:3000/api/;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
   }
}
```

4. Remove the default configuration 
```bash
sudo rm /etc/nginx/sites-enabled/default
```

### Install the Angular frontend:
1. Clone the repository, after returning to the home directory
```bash
cd ..
git clone https://github.com/DanielS101010/CakeFusion.git
```

2. Install and build the frontend
```bash
cd CakeFusion/frontend
npm install
npm run build
```

3. Copy frontend to the host directory
```bash
sudo cp -r dist/frontend/* /var/www/angular-frontend/
```

4. This command enables the angular-frontend configuration active by linking it to the directory that Nginx uses to 
load its site configurations
```bash
sudo ln -s /etc/nginx/sites-available/angular-frontend /etc/nginx/sites-enabled/
```
5. Check the syntax and reload nginx
```bash
sudo nginx -t # check syntax
sudo systemctl reload nginx
```

### Install the NestJS backend:
1. Install pm2 to host the NestJS backend
```bash
sudo npm install -g pm2
```

2. Install the dependencies for the backend and build it
```bash
cd ../backend
npm install
npm run build
```

3. Run the backend
```bash
pm2 start dist/main.js --name nest-backend
```

4. setup backend to run on boot. Replace <your_username> with your actual username
```bash
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u <your_username> --hp /home/<your_username>
pm2 save
```

## Usage:
Once everything is installed, open a browser and navigate to your Raspberry Pi's IP address or (if configured) hostname.

## Planned features:
- Search for doughs, fillings, toppings and cakes by name
- Add a picture to a recipe
- Export a recipe as a pdf
- English localisation

## UI Images
![Main Page](https://github.com/user-attachments/assets/f561c15f-ec99-46ce-8e34-499e233b80a9 "Main Page")
![Adding Dough screen](https://github.com/user-attachments/assets/3aa1f31b-aa3d-4378-9cca-468dc9caa049 "Adding Dough Page")
![Adding Filling screen](https://github.com/user-attachments/assets/7be4aa36-4b59-4052-b691-f3a41941f0f7 "Adding Filling Page")
![Adding Topping screen](https://github.com/user-attachments/assets/f18dbcf2-6dce-427b-8c47-ae4288c5a9dc "Adding Topping Page")
![Adding Cake 1 80%](https://github.com/user-attachments/assets/750df40b-fc6e-44b8-8ba3-13b581f091b5 "Adding Cake with using Components")
![Adding Cake 2](https://github.com/user-attachments/assets/cd896b59-f9aa-418a-86e0-900098ca8c10 "Adding Cake without using Components")
![Show Recipe](https://github.com/user-attachments/assets/3648176e-cb85-482d-b3fc-9e20269fcd84 "Show the recipe")
![Edit Recipe](https://github.com/user-attachments/assets/80d4b9f0-b889-46b2-9e76-75d3a45cf475 "Edit Recipe Page")
