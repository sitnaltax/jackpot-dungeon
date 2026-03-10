# Final Ordeal - Specification

This document describes a new addition, the "Final Ordeal" (filling the role of a "boss fight")

After the depth 18 shops, instead of another ordinary encounter, the player begins a special encounter called the Final Ordeal. This is similar to an ordinary encounter, but:

* The encounter has a very large Mystery value (let's start with 200, but this should be configurable, and scalable based on difficulty)
* The player will face this encounter multiple times; the Mystery pool is tracked across turns, so the player's goal is to eventually deplete it
* The encounter's Trouble increases every subsequent time (scaling based on difficulty)

In between rounds of the Final Encounter, the player does not encounter ordinary shop. Instead, are presented with an option to use their XP on one of the following:

* Remember a Clue (convert XP to Mystery loss at a 3-1 ratio; this cannot reduce the Mystery below 1)
* Remember your Home (converts XP to Stamina at a 3-1 ratio)
* Remember a Technique (go to an ordinary pod shop)
* Remember a Treasure (convert XP to Treasure at a 10-1 ratio, then go to an item shop)

If the player runs out of Stamina, they are defeated as normal. If the player depletes the Ordeal's Mystery without running out of Stamina, they win the game. They should get a version of the Game Over summary screen, stylized for victory.
