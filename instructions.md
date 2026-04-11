# Jacq's Quest

Welcome to **Jacq's Quest**, a quick-playing roguelike deckbuilderish game.

# Story

For reasons which are too complicated to detail, you find yourself caught in a strange fey realm. You need to face a series of increasinly-challenging encounters, and a final ordeal, before you can escape with your goal.

# How to Play

## Tokens and Encounters

You start with a bag of **tokens**. Each encounter, you will draw 6 tokens from the bag. Based on your items or class, you may have one or more redraws:

* **Redraw Selected** lets you choose any number of them, put them back in the bag, and draw out replacements.
* **Redraw All** lets you toss them all back in the bag and draw out replacements.

Tokens grant **Insight**, **Resolve**, or **XP**:

* **Insight** is measured against the encounter's **Mystery**. If you have enough Insight, you get bonus Treasure, and also XP (half of the encounter's Mystery). If not, you get only a minimal amount of Treasure, and no XP.
* **Resolve** is measured against the encounter's **Trouble**. If you don't have enough Resolve, you lose Stamina. Unlike Insight, this isn't all or nothing. If you're only short by 1 Resolve, you lose just a little Stamina (5). If you don't have any, you can lose twice the encounter's Trouble! Values in between scale.
* **XP** (Experience) adds directly to your XP. After every encounter, you will visit a shop where you can spend your XP to buy new tokens.

When you are satisfied with your draws, or can't redraw any more, choose Onwards.

## Pods and the Pod Shop

Tokens come in groups of 3, called **pods**. Unlike some similar games, you will always have the same number of pods. When you buy a new pod, you replace an old one (discarding it).

### Token Basics

Tokens have a **type** and a **rank**. A token's type specifies what resources it gives you. Its rank is a multiplier on how much of the resource you get. In order, the ranks are: Iron, Bronze, Silver, Gold, Platinum, Diamond, Mythical. Rank is very important--Mythical tokens give 3 times as much as Bronze! You'll find higher-ranked tokens as you venture further.

### Token Types

In addition to finding higher ranks, you'll also encounter more exotic types of tokens as you venture further. The broad categories include:

**Musical** tokens (Melody and Harmony), by themselves, give less Insight and Resolve than basic tokens of that flavor. However, when both are drawn together, they give more! You don't need to pair them up--one Harmony will activate any number of Melody tokens, and vice versa. Later on, you'll encounter the Chord and Discord tokens, which give multiple resources, but require you to draw 3 or even 4 different Musical tokens together for their full value. You may want to look for an Instrument item; that counts as a type of Musical token for the purpose of powering them up.

**Celestial** tokens (Scorpio, Capricorn, and Taurus) give Insight, Resolve, and XP. Celestial tokens power each other up--the more you draw at once, the more each is worth, although there is a limit. Further on, you can encounter Celestial tokens that provide Insight and XP, Resolve and XP, or even all three.

**Botanical** tokens (Lotus, Oak, Clover) work the same way. Botanical tokens have a slight bias toward Resolve (those are more common, and provide a little bigger bonus) while Celestial tokens have an Insight bias, but they are otherwise symmetric.

**Chthonic** tokens (Obsidian, Granite, Star Ruby) work differently. These have a low value, but grant a bonus when **discarded** in an encounter. Thus, they are at their most powerful when they can be drawn and discarded several times.

### Shopping

Pods cost XP. Their costs are slightly randomized, but are mostly based on the rank of the tokens they contain. Whenever you buy a new pod, you'll need to choose the old one to replace. You'll usually want to replace your older pods with lower ranks!

You can also spend XP to refresh the pod shop, to see new pods, if you don't like the ones available.

## Items and the Item Shop

There is an item shop after every even-numbered encounter.

### Item Basics

You can hold three items at a time. Items can provide the following bonuses:

* Redraw All and/or Redraw Selected, available every encounter
* Insight and/or Resolve, a flat bonus you get every encounter
* Bonus Stamina, which also comes with bonus maximum Stamina, and a small amount of regeneration after every encounter
* The _Musical_ tag, which helps Musical tokens  

If you have three items and want to buy another one, you'll need to choose one to discard.

Items have a category which generally describes their effect, but that's just Flavor. For example, Books grant Redraw Selected, and Weapons grant Resolve.

### Light Sources

There's one more category of items, the most important of all: **Light Sources**. You can only carry one Light Source at a time.

Light Sources grant you the ability to draw extra tokens in every encounter. This is very powerful, so you'll want to buy Light Sources as soon as you can. Light Sources granting 1, 2, or 3 extra draws are available after encounters 6, 12, and 18. You'll always be offered a Light Source you can afford in the shop, if one exists.

Light Sources do have a small catch: whenever you increase your token draws, you'll also be given two new pods, full of junk! So to start making the most of your new draws, you'll need to replace that junk with hopefully-good stuff from the pod shop.

## The Final Ordeal

Beyond depth 18, you'll face one more challenge, your Final Ordeal. This is like an ordinary Encounter with a coouple differences:
* It has huge pool of Mystery that you will need to deplete over several rounds, rather than all at once. The size of the pool depends on the Difficulty
* It gains in Trouble every round
* You don't gain Treasure (all of your Insight goes to reducing its Mystery)

If you reduce its Mystery to 0 without running out of Stamina, you win the game!

In between rounds, you'll be given the opportunity to spend your XP on one of four choices:

* **Remember a Technique** to visit the Pod Shop.
* **Remember a Treasure** will convert your XP to Treasure at an 8:1 ratio. Then you'll visit the Item Shop.
* **Rememmber a Clue** to convert your XP to Insight at a 3:1 ratio. This can't reduce the Mystery below 1, though; you'll still need to face the ordeal at least once more. 
* **Remember your Home** to convert your XP to Stamina. The first use converts 40% of your XP to Stamina; each subsequent use halves the efficiency.

After that choice, you'll face another round of the Ordeal, until either you unravel its Mystery, or run out of Stamina.

## Character Options

When you start, you'll pick a **Class** and **Difficulty**.

### Classes

Your class is your background and the way you approach challenges.

**Agonists** tackle their problems head-on. They get bonus Stamina and bonus Stamina regeneration after every encounter, and start with a little extra Treasure. Their only downside is mediocre starting items.

**Polymaths** learn quickly and can explore many avenues to find the best solution to their problems. They get bonus XP, and also are able to refresh the shop more cheaply to find the best pods. They start with reduced Stamina, so they will need to be careful at first.

**Mavericks** solve problems in unorthodox ways. They can never buy items that grant Redraw Selected! However, they get +2 Redraw All innately, and start with three items including a Musical Instrument. They also gain more Treasure than others as a consolation when they don't have enough Insight.

**Bricoleurs** solve problems by making the best use of the resouces they have. They have an innate +1 Redraw Selected, and also start with a very good +2 Redraw All item. However, their cost to refresh the shop is increased.

### Difficulty

**Normal** is the recommended difficulty for starting out. It's not easy, but provides some room for mistakes.

**Hard** is the intended difficulty for veteran players. (It's the difficulty I usually play at.) The Mystery and Resolve thresholds are significantly higher, and you start with less Stamina. 

**Expert** is intended to be the hardest "fair" challenge. The thresholds are even higher, and your starting Stamina is even lower. You'll need both skill and luck to win.

**Insane** is deeply overtuned and not intended to be balanced, for people who enjoy that sort of thing. Or if you've found some strategy that handles Insane reliably (or even sometimes), it probably needs to be nerfed. 

**Observer** is like Normal, but you'll start with huge reserves of Stamina, XP, and Treasure. This is for debugging or exploring the game.

## Other Notes

* For odd encounters, you'll be given a choice: a normal encounter for that depth, or a more difficult encounter. If you choose and survive the more perilous path, you'll be offered a free pod; you can take it, or half of its value in XP.
* Some encounters grant bonus redraws, but have higher Mystery and Trouble thresholds to compensate.
* The "Lyra" and "Bellflower" tokens count as both Musical/Celestial or Musical/Botanical, respectively. They help power up other tokens of both of their types.

# Other Stuff

## Designer Notes

My most direct inspirations were **Luck Be a Landlord** and **CloverPit**; also **Slay the Spire**. Less directly, I have long been a fan of **Desktop Dungeons**. **Fallen London** was an inspiration for the writing, both in its eerie, otherworldly setting and its attempt to be brief, evocative, and humorous.

I enjoyed those slot-machine games, but I thought: like many roguelike games, these are about finding something unfair and abusing it. I wanted to make a game that was about scraping by, doing the best you can. Sometimes in Jacq's Quest you get offered perfect pods, but that should be pretty rare.

The other big difference here is that tokens come in pods. You don't add and remove them individually--you have to take them in these little packets. This means that tokens don't have to be perfectly balanced; sometimes you get a lousy token in an otherwise-good pod and you take it. Unlike Slay the Spire, you don't need to trim your deck to the perfect cards; you work with what you have.