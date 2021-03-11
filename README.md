# pong
A JavaScript implementation of the classic arcade game Pong rendered with DOM elements.

Play it online here: https://deydim.github.io/pong

I have tried to implement a kind of observer pattern via set triggers, which I figured would be the simplest implementation of the pattern. All inter-object mutations are introduced by addObservers() method of Game class in main.js.

In the design I have followed the idea that these triggers and the loop() function in main.js should be the sole place where a change that occurs to the state of a given instance is allowed to lead directly or through triggers to a change to the state of another instance. All other data connections among objects are read-only.

TODO:

- add different ball sizes for multi-ball game setting
- add more precise vector generation for balls' movement and avoid balls overlapping
- improve AI with multiple balls