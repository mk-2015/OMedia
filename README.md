# OCloud
Media storage and command execution heaven.

## Configuration
Place runtime and network settings in server/config.json. Example:
```json
{
  "host": "0.0.0.0",
  "port": 443,
  "ssl": {
    "use": true,
    "keyfile": "./key.pem",
    "certfile": "./cert.pem"
  },
  "admin_password": "admin"
}
```

Configure SSL paths, host and port before starting the service.

## Setup
Recommended deployment using Docker Compose:
```bash
docker compose up -d
```
Requirements:
- Docker
- Docker Compose

For a native Python deployment, create a virtual environment, install dependencies (FastAPI, Uvicorn, aiosqlite) and run the ASGI server.

## Components

### OMedia

OMedia is a performant, self-hosted storage component built with Python and FastAPI. It provides per-user file storage, authentication, and an admin interface for user and file management.

Key features
- User registration, login and session management
- Password-protected accounts for regular users
- Admin dashboard for user and file management
- Per-user filesystem storage under server/data
- File operations: create folder, upload, download, list, move, delete
- Minimal web UI for browsing and managing files

Project layout
- server/server.py — FastAPI application and storage logic
- server/root/ — frontend pages and static assets (HTML, CSS, JS, logo)
- server/data/ — per-user directories and SQLite database (database.db)
- server/config.json — runtime configuration (host, port, SSL, admin)

Requirements
- Python 3.10+
- FastAPI
- Uvicorn
- aiosqlite

Storage model
Each user has a directory under server/data. Example:
```
server/data/
  user1/
    docs/
      note.html
    file.bin
  user2/
    report.docx
  database.db
```

Web interface
- /login.html — user login
- /new_user.html — account creation
- /userdashboard.html — user file manager
- /admin.html — admin dashboard

API highlights
- /api/login
- /api/logout
- /api/me
- /api/create_user
- /api/lsdir/{username}
- /api/lsfile/{username}
- /api/mkdir/{username}
- /api/rmdir/{username}
- /api/upload/{username}
- /api/download/{username}/{path}
- /api/content/{username}/{path}
- /api/delete/{username}/{path}
- /api/move/{username}
- /api/admin/users
- /api/admin/files/{username}
- /api/admin/users/{username}

License
This component is licensed under the GNU General Public License v3.0.

Contributing
Contributions are welcome. Please fork the repository, make changes in a branch and submit a pull request.

### Cube

- Repeat this with me:
```coc
I Will not share nor distribute AWS Firecracker tokens.
```

#### What is cube?
* Cube is a VPS-Like system. Its supposed to be used for spinning up AWS Firecracker MicroVMS, execute commands, get output and shutdown

#### Where can it be used?
* It can be used anywhere like-homelabbing, offices (though use in private networks), or just accessing linux through the web.

#### Whats linux?
* Many people will probably ask this so: [Whats Linux? deep-dive](https://www.youtube.com/watch?v=ztUW6X7-RXE) or [read](https://forums.debian.net/viewtopic.php?t=54767&start=120)

#### Whats a VPS?
* a VPS stands for Virtual Private Server. Think of it like your home. its personal, and YOU! Own it. And firecracker the lock with its authentication token being the key to your home (VPS).

#### Why is it needed in OCloud?
* A Cloud is storage (OMedia) and Servers (Cube). to Even compete with google drive we need to, in-some way have a VPS.