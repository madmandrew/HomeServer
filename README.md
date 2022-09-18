# HomeServer
Catch all server (mostly movie filtering and media management)

# UI for adding media to torrent
    Also for monitoring downloads

# Scans for downloads to finish
    after detecting download finished move to toFilter plex folder
    
# UI for toFilter media
    Select media, setup filters, set as movie or tv
    
    potentially set options for changing codec? or let plex do that not sure

# Queue filter/conversion jobs
    probably just one job at a time
    when finished move original file to archive?
    move converted file to plex media


#TODO

    add ui for displaying data like
    -active downloads
    -active jobs
    -job queue
    -ready to filter

    create ui for selecting a movie to filter
    
    eventually automate grabbing filter settings and such
    -clearplay
    -vidangel

    send filter job to backend

    deploy to server and test
