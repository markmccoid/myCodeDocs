---
id: server-config-ssh
title: Server Config and SSH
sidebar_label: Server Config / SSH
---

## Setting up SSH keys on a Mac.

Go to the SSH Directory and if it doesn't exist, create it.

```bash
$ cd ~/.ssh
# If this directory doesn't exist, then create it (the -p says to make if it doesn't exist)
$ mkdir -p ~/.ssh
```

Next, you will need to create your keys by running `ssh-keygen`

```bash
$ ssh-keygen
# you will be prompted for a name and an optional passphrase
```

This will create two files in your ssh directory.  For example, if you named your key `mykey` then you would have the following in your directory:

```bash
mykey
mykey.pub
```

The .pub is your public key.  This is the one that goes on your server.

### Logging into your server via SSH

```bash
# substitute your ip address
$ ssh root@100.100.100.100

# This will most likely deny you access since it doesn't know which key to check
$ ssh -i mykey root@100.100.100.100
```

Since you don't want to have to type the `-i mykey` every time, you need to create a config file in your ssh directory with the following.

```bash
# first cd into the ssh directory
$ cd ~/.ssh
$ vi config

# Enter the following into the config file and save
Host *
 AddKeysToAgent yes
 UseKeychain yes
```

To manually add to the keychain use the command below. 

> NOTE: you don't need to do this if your config file has the above lines.

```bash
ssh-add -K ~/.ssh/mykey
```

