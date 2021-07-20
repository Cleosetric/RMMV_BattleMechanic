# Introduction
Oya oya hello there, uh this is a repository for me **(a noob scripter)** trying to make plugins for RMMV Engine, from concept to real code, and perhaps can be usable in real implementation (or not), maybe  will release like a short battle demo (prototype) after done write all the plugin.


# (Try) RMMV Battle Mechanic
a repository for plugins used to add new features in default battle mechanic.

![Range Mechanic](https://user-images.githubusercontent.com/87144416/126355025-0ca198e8-73c7-431a-98d5-34f5ddd7ecee.jpg "Battle Range Core Mechanic RMMV")

## - [x] Range Core Mechanic ✔
a plugins to add range mechanic to enemy and actor

**IMPLEMENTED FEATURES LIST:**
- Add position and distance for Actor and Enemy
- Add skill range based subject position
- Add escape enemy when enemy move far away to certain distance
- Add Brave Trait to Enemy, so enemy wouldn't run away from battle
- Add Approach Command, so party will move closer to enemy position but cost a turn
- Change Enemy battler sprite scale depend on its position
- Change Enemy battler sprite idle, and move when attacking
- Add Tag &lt;FLY&gt; to enemy to tag its flying, &lt;GROUND&gt; to tag ground enemy
- Add Tag &lt;IMMOVABLE&gt; to tag enemy is immovable
- Set enemy battler Y position by it's position / distance
- Add Party Sprite Front-view with auto aligned center
- Add Skill (State) To Stop Enemies Move Away aka Propulsion Jammer (Disrupted)

## - [ ] Weapon Attack-TP Booster
a plugins to add ATP as a default attack booster, ATP is accumulated point of default TP (Increase each time perform a hit) and will increase up to Level-3 ATP.

**WIP FEATURE LIST :**
- Add ATP Mechanic
- ATP is add bonus damage to next default attack
- When ATP is level-3 and perform next default attack, ATP level is reset

## - [ ] Skill Input Squence
a skill input squence, as long as power grid still not empty you can perform any skill available

**WIP FEATURE LIST :**
- Add Squence Skill Input
- Add PowerGrid restriction based on Actor's MP and skill's MP

## - [ ] Battle HUD
a plugin for create battle UI or commonly called Battle HUD to show detail information about what happen in the battle scene

**WIP HUD & WINDOWS**
- Add Turn-Order HUD
- Add Distance HUD to Enemy
- Add Party HUD
- Add Troop HUD
- Add Power-Grid (MP) HUD
- Add Enemy Detailed Information (By Trigger Button)
- Add Enemy Selection Target Locking by Range
- Add Skill Range and Weapon / Modules Sprite, Detail Information
