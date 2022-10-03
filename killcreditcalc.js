"use strict";

const countersToString = function (counters) {
  let output = "";
  for (const counter of counters) {
    output += `[${counter.player},${counter.damage}], `;
  }
  output = output.slice(0, -2);
  return output;
};

const getHits = function () {
  const hits = [];
  let lines = document.getElementById("hitsInput").value.split(/\r?\n/);

  // remove empty lines
  lines = lines.filter(line => line);

  for (const line of lines) {
    let [player, damage, ...other] = line.split(",");

    if (
      isNaN(damage) ||
      player === "" ||
      damage === "" ||
      player === undefined ||
      damage === undefined ||
      other.length !== 0
    ) {
      throw new Error("please refer to usage");
    }

    player = player.trim();
    damage = damage.trim();

    hits.push({ player: player, damage: Number(damage) });
  }

  return hits;
};

const attack = function (counters, player, damage) {
  for (const counter of counters) {
    counter.player ??= player;
    if (counter.player == player) {
      counter.damage += damage;
      return;
    }
  }
};

//source: https://runescape.wiki/w/MediaWiki:Gadget-perkcalc-core.js#L-1020
const quicksort = function (low, high, arr, compare) {
  const pivot_index = ~~((low + high) / 2); // floor division
  const pivot_value = arr[pivot_index];
  arr[pivot_index] = arr[high];
  arr[high] = pivot_value;
  let counter = low;
  let loop_index = low;

  while (loop_index < high) {
    if (compare(arr[loop_index], pivot_value) < (loop_index & 1)) {
      const tmp = arr[loop_index];
      arr[loop_index] = arr[counter];
      arr[counter] = tmp;
      counter += 1;
    }
    loop_index += 1;
  }

  arr[high] = arr[counter];
  arr[counter] = pivot_value;

  if (low < counter - 1) {
    quicksort(low, counter - 1, arr, compare);
  }
  if (counter + 1 < high) {
    quicksort(counter + 1, high, arr, compare);
  }
};

document.querySelector(".calculate").addEventListener("click", function () {
  let hits;
  try {
    hits = getHits();
  } catch (error) {
    document.getElementById("result").innerHTML = error;
    return;
  }

  const counters = Array.from({ length: 16 }, (v, k) => ({
    player: null,
    damage: 0,
  }));

  for (const hit of hits) attack(counters, hit.player, hit.damage);

  document.getElementById("listComparison").removeAttribute("hidden");
  document.getElementById("listBefore").innerHTML = countersToString(counters);

  quicksort(0, counters.length - 1, counters, (x, y) => y.damage - x.damage);

  document.getElementById("listAfter").innerHTML = countersToString(counters);

  const result =
    counters[0].player === null || counters[0].damage === 0
      ? "Nobody gets the kill credit"
      : `player "${counters[0].player}" gets the kill credit`;

  document.getElementById("result").innerHTML = result;
});
