#!/bin/bash

# Map Tiles
montage -mode Concatenate -background None raw/mapTiles/* mapTiles.png

# Items
montage -mode Concatenate -background None raw/items/* items.png

