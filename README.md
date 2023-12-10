# HomeServer
Catch all server (mostly movie filtering and media management)

# UI for media that needs filtered
    Select media, setup filters, set as movie or tv
    
    potentially set options for changing codec? or let plex do that not sure

# Queue filter/conversion jobs
    probably just one job at a time
    when finished move original file to archive?
    move converted file to plex media

# Docker info

to run docker compose on server

     sudo docker compose -f docker-compose-prod.yml up

to update an image

    sudo docker pull madmandrew/filterapp:latest
