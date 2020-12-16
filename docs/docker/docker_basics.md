---
id: docker_basics
title: Docker Basics
sidebar_label: Docker Basics
---

## Installing Docker on Windows

You can do it on the Home version, but Windows Pro is preferrable.

**Enable Hyper-V**
Open PowerShell as administrator (right-click on executable, "Run as Administrator") and run the following command:

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
```

Dive into the official docs for more information: https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v
Alternatively, you could also enable and use the "WSL 2" feature Windows offers - see the "Windows 10 Home" section in this document.

**Enable Containers Feature**
Open PowerShell as administrator (right-click on executable, "Run as Administrator") and run the following command:

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName containers –All
```

## Docker Hub

[hub.docker.com](hub.docker.com)

You can find pre built containers on Docker Hub.  You can use spin these up as stand alone containers or use them in your own containers.

To run a container you find on docker hub:

```bash
$ docker run node // or whatever the container name is
```

If docker does not find the container locally, it will look on docker hub and if it find a container of that name, it will download and create it.

If the container/image doesn't "do" anything, then it will be created, run and then exit.  Node will do this.

If you run `docker ps -a`, you will see the container was created and exited.

If you want to interact with this node container, then run the image with the `-it` flag.

```bash
$ docker run -it node
```

This will expose the node shell to us.  Not real useful yet.  You will typically build up on existing images, like node, to create your own custom image.

## Dockerfile

To create your own image, you will need to create a file named `Dockerfile`.  This file should most likely be located in your applications directory.

Here is an example of a simple node server application, that we can run with only Docker.  Meaning, you would not need to install Node or any other dependencies.

Here is  our application directory structure:

![image-20201216124509416](..\assets\docker-basics_001.png)

To start, our Dockerfile will need the node environment.  Since we know there is one on docker hub called "node", we can use the `FROM` command to get access to it and add it to our image.

Next, we need our application files in our image's file system.  To do this, we will use the `COPY` command.  They syntax is `COPY source target`.  So we are telling it what files to copy from our dev environment over to the Image's filesystem.  A period `.` in the source means copy everything recursively and  a period `.` in the target means copy it to the root of the Image's filesystem.  

Usually you will not copy to the root, but into a specific directory.

```dockerfile
FROM node

# copy everything to the /app directory in our image
# by using the /app we are setting the directory to be an absolute path (will not care what working dir is)
COPY . /app
```

**`WORKDIR`**

Since we have copied our application files to a new directory in our image, and will be running commands on those files, we can change the working directory for all commands after the WORKDIR runs.

`WORKDIR /app`

> Once you do this, all commands, even COPY will run in the set workdir.  If you set workdir to /app, then `COPY . .`, would copy into the /app directory. Or you could be explicit and do `COPY . /app`

**`RUN`**

You will need to run commands like `npm install`.  The `RUN` command will do this and execute in whatever is the directory set by the Working Directory or the root if no working directory is set.

```dockerfile
FROM node

WORKDIR /app

COPY . /app

RUN npm install
```

**`CMD`**

You must understand the difference between and image and a container.  The Dockerfile contains the template for an image which can them be used to spawn a container.  So it is all the instructions to get the container environment set up so that it can be used.  Also, **multiple** containers can be spawned from a single image.

So, the RUN command will execute when we are building our image.  That is what all the instructions in the Dockerfile are for, to build an image, that can then be "run" as a container with all dependencies ready taken care of.

However, once  you spawn and image as a container, there will be things that you want to run, like your application, once the container is started.  

This is what the **`CMD`** command is for.  It will start/run the command like `node server.js` based on the container's image.

```dockerfile
FROM node

WORKDIR /app

COPY . /app

RUN npm install

CMD node server.js
```

We are almost there, but remember that Docker containers are isolated from everything, thus we will not be able to access the server that this container created.

Even though this app is set to listen on port 80 `app.listen(80)`, this will be listening on the Docker containers internal environment.

To get around this, we will use the `EXPOSE` command BEFORE we run the CMD command and expose port 80.

> **Important** the EXPOSE command is simply documentation.  It doesn't really do anything.  To actually expose a port to your local environment, you will use the `-p 3000:80` followed by the external (local)port number to expose : internal port number that the app is using.

```dockerfile
FROM node

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 80

CMD node server.js
```

**`docker build .`**

Now that we have our Dockerfile created, we need to actually build our image.  This is done with the `docker build .` command.  We run it where our docker file is located and put the `.` to indicate this.

When you run the docker build command it will spit out long ass sha number that you will use to access your container.  Will learn to rename later.

```bash
$ docker build .
[+] Building 3.6s (10/10) FINISHED
 => [internal] load build definition from Dockerfile                                                                        0.1s  => => transferring dockerfile: 164B                                                                                        0.0s  => [internal] load .dockerignore                                                                                           0.1s  => => transferring context: 2B                                                                                             0.0s  => [internal] load metadata for docker.io/library/node:latest                                                              0.0s  => [internal] load build context                                                                                           0.1s  => => transferring context: 10.51kB                                                                                        0.0s  => [1/5] FROM docker.io/library/node                                                                                       0.0s  => => resolve docker.io/library/node:latest                                                                                0.0s  => [2/5] WORKDIR /app                                                                                                      0.0s  => [3/5] COPY package.json /app                                                                                            0.0s  => [4/5] RUN npm install                                                                                                   3.1s  => [5/5] COPY . /app                                                                                                       0.0s  => exporting to image                                                                                                      0.2s  => => exporting layers                                                                                                     0.2s  => => writing image sha256:88507d6d6a6a63b2299300446fc37d245e9a21500202aa8edf432c67b13f905d
 
 # that sha256... is our image identifier.  To run on our local port 3000
 $ docker run -p 3000:80 sha256:88507d6d6a6a63b2299300446fc37d245e9a21500202aa8edf432c67b13f905d
 
 # you can now access in browser.
 # to stop the container, you can use docker desktop or in a new command prompt run
 # to find all running containers
 $ docker ps
 
 # find the one that you want to stop
 $ docker stop image_name
```

### Changes to your Code

Images are read only, so if you make a change to your code, it will not be reflected in the image.  You will need to rebuild it.

Run `docker build .` again.  You will get a new image name!

Note that docker caches results so when rebuilding an image, it only need to rerun stuff that has changed.  However, once it finds something that has changed, all instructions after that change will be FORCED to rerun.

You will notice that `npm install` will run anytime you change your code.  That is really not needed, unless `package.json `changes.

One easy optimization, would be to reorganize our Dockerfile so that the `npm install` only runs if `package.json` changes.

This is our new Dockerfile:

```dockerfile
FROM node

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 80

CMD node server.js
```

## Images

Every time you run a `docker build` command, you will create an image on your system.  You will also create a local image if you use `docker run image_name` that is an image on docker hub.  

To see the images that you have on your system use:

`docker images`

To **remove** and image use:

`docker rmi imageID`

> You can ONLY remove images if they are not being used by any container.  That includes stopped containers.

To remove all images, you can use the following:

`docker image prune`

## Docker Commands

Quick list of some of the commands for images and containers:

**![image-20201216141436549](..\assets\docker-basics_002.png)**

### **`docker ps -a`**

This will show you all running containers.  If you add the `-a` flag, you will see all containers that exist, even if they are not running.

You can restart a stopped container by using the **`docker start containername`** command.

### **`docker run vs docker start`**

Main difference is `docker run` creates a new container.  The other thing you will notice is that `docker run`, runs a container as an **attached** container, meaning it won't let you do anything else on the command line. 

`docker start` on the other hand runs, by default, in **detached** mode.  

These are simply the way each of these commands are configured by default.  You can change the behavior if needed.  

> In **attached mode** you will be able to see console.log statements or anything written to standard out.

To use `docker run` in detached mode simply add the `-d` flag.

`docker run -p 8000:80 -d sha256:dfad`

BUT, what if you want to attached to a detached container?  First, the container must be running, then use the following command:

`docker container attach container_name`

You can also see any of the logs (console output) from a running container by using the `logs `command.

`docker logs container_name`

Run `docker logs --help` and you will see the options for this command.  One of those options is `-f` to follow.  Which will in essence "attach" you to the container.

### -i -t flags Interactive mode

I don't fully understand this, however, if you have an application that needs input from the outside via a terminal, you can use these flag on the `run` command.

`-i, --interactive                    Keep STDIN open even if not attached`

`-t, --tty                            Allocate a pseudo-TTY`

If you are restarting a container and need this input, you could then use the following:

`docker start -a -i container_name`

This will start the container attached and allow for input.

### Remove Containers rm / container prune

There are two ways to remove stopped containers.  A quick, get rid of all stopped containers:

`docker container prune`

If you just have specific containers that you want to remove use the `rm` option

`docker rm container_name`