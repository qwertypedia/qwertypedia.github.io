---
layout: layouts/blog.njk
tags: post
title: Kill Credit Mechanics Explained
image: /assets/images/index/killcredit.png
description: Ever wonder who gets the kill if 1000 players each deal 1 damage? Here, we go in-depth on how exactly a Kill Credit is calculated.
permalink: /posts/killcredit/
icon: fas fa-book
order: 1
---

# Kill Credit Mechanics Explained

![list of 16 entries](/assets/images/killcredit/image1.png)

An npc has an internal point system to keep track of players and their dealt damage. A list of 16 entries is used to determine kill credit. Each entry contains a player UID and a damage counter (known internally as "heropoints") for that individual player. The player with the most dealt damage gets the kill credit. By default, an entry has no player UID and 0 dealt damage.

![a recent and a new player deals damage](/assets/images/killcredit/image2.png)

To be added to the list, a player must deal non-zero damage or neutral damage (such as from recoils). The player will be assigned to the next available entry. If the player deals additional damage, their damage counter is incremented accordingly and their position in the list remains the same.

Neutral damage (such as from recoils) acts as 0 damage and allows a player to be added to the list with 0 damage dealt.

When an npc regenerates back to full HP, the list of entries is reset.

## Determining kill credit 💀💳

![sorted list](/assets/images/killcredit/image4.png)

When an npc dies, the list is sorted based on the dealt damage using an in-house unstable quicksort algorithm. The player at the start of the sorted list is given the kill credit, and the loot should appear for that player, as long as their dealt damage is greater than 0.

No loot will appear if the player with kill credit is logged out, or if that player is an ironman and there are other players in the list. An example is that an ironman will get no loot if another player has recoiled the npc, as there will be another player in the list with 0 dealt damage.

Side note: If the list isn't full, the game also sorts and swaps around those entries that have no assigned player during the quicksort, as shown in the image above. This could be more efficient if a binary search is performed so only the entries that have an assigned player is sorted, though this could change the outcome of who gets the kill credit in the case of a tie.

## Who gets the kill credit if 1000 players each deal 1 damage? 🤔

When the list is full and an extra player deals damage, the damage is dealt as normal but the list remains unchanged.

If 1000 players each deal 1 damage, the list will have 16 entries each with 1 damage. Since the game uses an unstable sorting algorithm, the player who ends up at the beginning of the list is "random" but predictable - the 12th player to deal damage will get the kill credit.

These mechanics were figured out to see if you could bypass the tutorial island melee / ranged xp. Consider the following scenario - The main deals a 0xp spawn hit (dealing 1 damage), then another player deals 1 damage, then another player deals the final 1 damage. What if, before the final player finishes off the kill, the rat regens by 1 hp and then another player deals 1 damage? Who would get the kill credit if 100 players dealt 1 damage to the rat without it regenerating back to full hp? Is there a combination of players where the first player to deal damage is given the kill credit? Well, turns out there is no combination. bummer.

Check out the [Kill Credit Calculator](/killcreditcalc.html) to see for yourself!

### code (python)

<script src="https://gist.github.com/KeyboardOSRS/8ed9459c7de0d55dda4edb1809124b5a.js"></script>
