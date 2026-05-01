## Overview

This change introduces a new difficulty, Glory.

Glory replaces Insane difficulty, and all existing references to Insane (both UI and variables) should now reference Glory. The way Glory works is this:

* All numeric parameters (encounter difficulty, starting stamina, final ordeal difficulty) are the same as in Expert mode.
* A new type of token, Glory, is introduced.

## Glory Tokens and Glory

Glory tokens never appear naturally at any difficulty. Instead, in the fourth pod in every pod shop, the last token is replaced by a Glory token.

Glory tokens have a base value of 5 and calculate their value normally according to their rank. However, Glory tokens do not add their value to anything in the encounter! Instead, after every encounter, each Glory token the player owns adds its value to the player's Glory score--whether it was drawn or not.

After the Final Ordeal starts, two things change:

1. Glory tokens no longer appear in the pod shop
2. The player no longer gets Glory for each encounter. 

The reason for these is to keep the player from stalling the Final Ordeal to farm more points. Instead, each Glory token that the player wins the game with contributes 7 times its normal value.

## UI

Glory tokens should be white, with a firework icon as the icon.

When the player is in Glory difficulty, the total Glory should be shown in the Player Status bar, immediately after Treasure. In other difficulties it should not be visible.

Glory should be displayed on the final screen, if and only if the player wins. (There is no glory in loss.) If the player wins it should also be copied in the social media Share button.