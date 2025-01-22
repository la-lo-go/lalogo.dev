---
layout: "@layouts/BlogLayout.astro"
title: "Mounting SMB/CIFS Shares from your NAS in Linux and Setting Up Plex"
description: "A step-by-step guide for mounting SMB/CIFS shares from your NAS in Linux and setting up Plex Media Server with Docker - Learn how to securely connect your network storage and stream your media library."
---

# Mounting SMB/CIFS Shares from your NAS in Linux and Setting Up Plex

Struggling with network storage in Linux and not sure where to begin? You're not alone! In this step-by-step guide, we'll walk you through the complete process of mounting SMB shares in Linux and configuring a Plex Media Server using external NAS storage. 

## Getting Your System Ready

First, let's install the necessary packages for SMB/CIFS support:

```bash
sudo apt update
sudo apt install cifs-utils
```

Next, we'll need to know your user ID (UID) and group ID (GID) for proper permissions. Get these with:

```bash
id -u $USER    # Usually 1000 both for the first user
id -g $USER    # Usually 1000 for the first user
```

Now, let's create a cozy home for your NAS shares:

```bash
sudo mkdir -p /mnt/nas/{series,movies,config}
```

Understanding the permissions we'll use:

- 644 for files (owner can read/write, group and others can read)
- 755 for directories (owner can read/write/execute, group and others can read/execute)

### The Secret Vault: Setting Up Credentials

Security first! Let's create a secure vault for your NAS credentials:

```bash
sudo nano /root/.credentials
```

Inside, store your credentials like this:

```bash
username=your_username
password=your_password
```

Lock down that vault with the proper permissions (600 means only root can read and write):

```bash
sudo chmod 600 /root/.credentials
```

## The Magic of SMB/CIFS Mounting

Now comes the exciting part - telling your system how to connect to your NAS. We'll edit the system's mount blueprint:

```bash
sudo nano /etc/fstab
```

Add these magical incantations (adjust IP address, UID and GID as needed). Note how we set specific permissions for optimal security:

```bash
#SMB/CIFS Folders
//192.168.1.119/series    /mnt/nas/series    cifs    credentials=/root/.credentials,iocharset=utf8,vers=3.1.1,_netdev,uid=1000,gid=1000,file_mode=0644,dir_mode=0755    0    0
//192.168.1.119/movies    /mnt/nas/movies    cifs    credentials=/root/.credentials,iocharset=utf8,vers=3.1.1,_netdev,uid=1000,gid=1000,file_mode=0644,dir_mode=0755    0    0
//192.168.1.119/config    /mnt/nas/config    cifs    credentials=/root/.credentials,iocharset=utf8,vers=3.1.1,_netdev,uid=1000,gid=1000,file_mode=0644,dir_mode=0755    0    0
```

> - uid/gid: Sets the owner of the mounted files
> 
> - file_mode/dir_mode: Sets default permissions
> 
> - _netdev: Ensures mounting after network is available
> 
> - vers=3.1.1: Sets [SMB protocol version](https://cifs.com/)

## Bringing It All Together

Before we can mount our shares, we need to refresh the system's memory:

```bash
systemctl daemon-reload
```

Now, let's mount everything:

```bash
sudo mount -a
```

## Setting Up Plex with Docker

Now that we have our storage ready, let's set up Plex! First, create a directory for your docker-compose file:

```bash
mkdir ~/plex-docker
cd ~/plex-docker
```

Create the docker-compose.yml file:

```bash
nano docker-compose.yml
```

Add this configuration (notice how we match the UID/GID from earlier):

```yaml
---
services:
  plex:
    image: lscr.io/linuxserver/plex:latest
    container_name: plex
    network_mode: host
    environment:
      - PUID=1000    # Use the UID we found earlier
      - PGID=1000    # Use the GID we found earlier
      - TZ=Europe/Madrid
      - VERSION=docker
      - PLEX_CLAIM=    # Optional - get from plex.tv/claim
    volumes:
      - /mnt/nas/config:/config
      - /mnt/nas/series:/tv
      - /mnt/nas/movies:/movies
    restart: unless-stopped
```

Deploy the container using Docker Compose:

```bash
docker-compose up -d
```

## Verification: Trust But Verify

Let's make sure everything is working as expected:

```bash
df -h | grep nas
ls -la /mnt/nas/*
docker ps | grep plex
docker logs plex
```

## Accessing Plex

Once everything is up and running, access your Plex server at `http://YOUR-SERVER-IP:32400/web`

## Troubleshooting Tips

If things aren't working quite right, here are some handy diagnostic commands:

- Check system logs: `dmesg | grep cifs`
- Verify mounts: `mount | grep cifs`
- Check permissions: `ls -la /mnt/nas/`
- Check Plex container: `docker exec -it plex ls -la /tv`

And if all else fails, you can always try remounting everything and restarting Plex:

```bash
sudo mount -a
docker restart plex
```
