
REM Map Tiles
magick montage -mode Concatenate -background None raw/mapTiles/* mapTiles.png


REM Items
magick montage -mode Concatenate -background None raw/items/* items.png

REM Doors
magick montage -mode Concatenate -background None raw/doors/* doors.png

REM Pawn Clothes
magick montage -mode Concatenate -background None raw/pawn/* pawnClothes.png

