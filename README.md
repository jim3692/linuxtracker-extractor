# LinuxTracker Extractor

This project extracts the magnet links of the top 10 seeded Linux Torrents in LinuxTracker and adds them to Transmission. The goal is to allow users with high bandwidth to easily become seeders of those files and help the Linux community.

# Requirements

- A Linux machine with the latest versions of Docker and Docker Compose
- Ability to forward port 51413
- Enough storage for the Linux images (at least 60GB, AlmaLinux is huge)

# Setup

### Warning: If all ports are forwarded by default, make sure to disable the access port 9091, or remove the `- 9091:9091` line from `docker-compose.yml`. This port is used for the control panel of Transmission.

#### Step 1. Download and run the project

```bash
git clone https://github.com/jim3692/linuxtracker-extractor.git
cd linuxtracker-extractor
docker-compose up -d
```

#### Step 2. Forward the ports

This project requires port 51413, both TCP and UDP, to be forwarded. The exact process to forward those ports depends on your network equipment.

# More Details

- There is a hardcoded cron job in `src/app.js` to extract the magnet links every 2 hours.
- The bandwidth is set to 20,000kbps down and 35,000kbps up, but it can be changed in `docker-compose.yml`. Setting those limits to 0 will disable them.

# Disclaimer

Using torrent for Linux images is not considered piracy. However, some regions have banned torrents in general. I am not responsible for any legal issues you may face if your server lives in those regions.
