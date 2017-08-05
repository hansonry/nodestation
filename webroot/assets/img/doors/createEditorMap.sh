#!/bin/bash


rm editorMap.png

FILES=*.png

mkdir temp

for file in $FILES
do  
   if [ "$file" == "overlays.png" ]
   then
      continue
   fi 
   bname=`basename $file .png`
   echo $bname
   convert $file -crop 32x32+0+0   door.png
   convert $file -crop 32x32+96+64 doorCover.png
   cp door.png temp/${bname}Window.png
   if [ "$file" != "freezer.png" ]
   then
      composite -background none door.png doorCover.png temp/${bname}NoWindow.png
   fi
   
done


montage -mode Concatenate -background None temp/*.png editorMap.png

rm -rf temp

rm door.png
rm doorCover.png

