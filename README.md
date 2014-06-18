apcs-2014-final-map-editor
==========================

A JavaScript map editor for Saviors of Gundthor, my APCS 2014 Java final.

This editor was used to build maps 1 and 2 in the final project. It's not very complicated and has mostly basic features, but I figured I'd shove it online anyway.

To load a map, open the console and call loadMap with two parameters: the first is the map name (sans ".png", will load from same remote directory as script), and the second is the existing map metadata which it will load and render for you. You won't be able to edit the spawn point or exit areas, but they'll show up so you can verify that they're right and use them as a reference.

Press WASD before left-clicking to set the direction of the entity. Use the bottom-right dropdown to pick the entity. Make sure to unfocus the dropdown before pressing WASD or it might change your selection. Right click on an entity to remove it.

Press `J` to output the compiled metadata JSON to the console. This output will include the spawn point and exit areas that were loaded into the page.