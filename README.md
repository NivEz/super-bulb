# Super Bulb
Interactive controller for Broadlink smart bulbs

![super-bulb-example](https://github.com/NivEz/super-bulb/assets/86365162/e10cfecc-72ed-4627-a0fe-7a54c9c8327b)

## About
Super Bulb is a personal project that lets you control a Broadlink smart bulb.
<br>
Currently it supports on/off, brightness, transition durations, color mode and interactive mode (integration with microphone in the browser).

Super Bulb has 2 main parts:
1. The controller - a client side built with React.
2. The server - a websocket server built with Python.

The controller passes commands to the server through a websocket connection and then the server processes and passes the commands to the smart device via the Broadlink Python package.

In order for Super Bulb to work you need to make sure that the controller can communicate with the websocket server, and that the websocket server is hosted in the same network of the smart device.
<br>
In other words, it means that you can host the controller anywhere you want (on your computer, on a Raspberry Pi or even on the internet) - as long as the `contoller <-> server <-> bulb` communication is properly set.

Personally I host the websocket server on my Raspberry Pi and I use `Twingate` zero trust network - this setup lets me use the controller from anywhere I want in the world - even outside of my home Wi-Fi.

## SSL & interactive mode
In order for the interactive mode (microphone integration) to work from your phone the setup is a bit more complex. Since the browser allows microphone access only from localhost or a secure connection (HTTPS).
<br>
You can deploy the controller on the internet (with HTTPS) but then you cannot access the websocket server since the browser will not allow you to access an unsecure websocket server from a secure connection.

In order to bypass this you need to setup a secure connection in both the client and the server.
<br>
[This video explains how to set it up.](https://www.youtube.com/watch?v=qlcVx-k-02E&list=PLtj8tgA-NlB4_iLyhwfp7cwwo6_4iyU0Y&index=40&ab_channel=Wolfgang%27sChannel)
<br>
Basically you'll have to:
1. Register a domain via a domain registrar and add DNS records.
2. Setup `Nginx Proxy Manager`.

### DNS records
Simply add the following DNS records:

| Record Type | Name |      Content      |
|:-----------:|:----:|:-----------------:|
|      A      |  pi  |  your internal IP |
|    CNAME    | *.pi | pi.yourdomain.com |

### Nginx Proxy Manager
Follow these steps:
1. Set up Nginx Proxy Manager via docker ([quick setup guide](https://nginxproxymanager.com/guide/#quick-setup)) and open the browser on the host machine on port 81.
2. Add SSL certificate:
    1. Go to `SSL Certificates` => `Add SSL Certificate`.
    2. Add `pi.yourdomain.com` and `*.pi.yourdomain.com` as your domain names.
    3. Toggle on `Use a DNS Challenge`.
    4. Add your DNS provider and provide a relevant API token.
    5. Agree to Let's Encrpyt terms.
3. Add controller proxy host:
    1. Go to `Hosts` => `Proxy Hosts` => `Add Proxy Host`. 
    2. Add Domain name `bulb.pi.yourdomain.com` with the following properties:
       
        | Scheme | NameForwar Hostname / IP | Forward Port |
        |:------:|:------------------------:|:------------:|
        |  http  |   host ip (192.168...)   |     8080     |
   3. Go to `SSL` tab and add the certificate we created at step number 2.
   4. Toggle on `Force SSL` and `HTTP/2 Support`.
   5. Save.
4. Add websocket server proxy host (almost the same as the previous step):
    1. Go to `Hosts` => `Proxy Hosts` => `Add Proxy Host`. 
    2. Add Domain name `bulb-server.pi.yourdomain.com` with the following properties:
       
        | Scheme | NameForwar Hostname / IP | Forward Port |
        |:------:|:------------------------:|:------------:|
        |  http  |   host ip (192.168...)   |     6543     |
   3. Toggle on `Websockets Support`.
   4. Go to `SSL` tab and add the certificate we created at step number 2.
   5. Toggle on `Force SSL` and `HTTP/2 Support`.
   6. Save.

This setup will let you access the controller and the server through the subdomains you defined in the `Nginx Proxy Manager` with `SSL`.

## How to use Super Bulb
The easiest way to get Super Bulb up and running is with docker.

First you'll have to clone the repo:
```
git clone https://github.com/NivEz/super-bulb
```

Simply execute:
```
docker compose up -d
```

You can run it directly without docker as well:
1. Run the controller:
```
cd client
yarn dev
```
2. Run the websocket server:
```
cd server
python websocket.py
```
