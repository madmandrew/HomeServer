# HomeServer
Catch all server (mostly movie filtering and media management)

# UI for media that needs filtered
    Select media, setup filters, set as movie or tv
    
    potentially set options for changing codec? or let plex do that not sure

# Queue filter/conversion jobs
    Config default is 1 job at a time. 
    Can increase if the server can handle it or GPU encoding is enabled
    Moves original file to unfilteredArchive

# Docker info

to run docker compose on server

     sudo docker compose -f docker-compose-prod.yml up

to update an image

    sudo docker pull madmandrew/filterapp:latest
