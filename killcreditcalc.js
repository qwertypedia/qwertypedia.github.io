function calculate() {
  try {
    var hits = getHits();
  } catch (error) {
    document.getElementById("result").innerHTML = error;
    return;
  }

  var counterArray = createCounterArray();

  for (hit of hits) {
    attack(counterArray, hit.player, hit.damage);
  }

  document.getElementById("listComparison").removeAttribute("hidden");
  document.getElementById("listBefore").innerHTML = listToString(counterArray);

  quicksort(0, counterArray.length - 1, counterArray, function (x, y) {
    return y.damage - x.damage;
  });

  document.getElementById("listAfter").innerHTML = listToString(counterArray);

  var resultText = "";
  if (counterArray[0].player == null || counterArray[0].damage == 0) {
    resultText = "Nobody gets the kill credit";
  } else {
    resultText = 'player "' + counterArray[0].player + '" gets the kill credit';
  }
  document.getElementById("result").innerHTML = resultText;
}

function listToString(counterArray) {
  var text = "";
  for (counter of counterArray) {
    text += "[" + counter.player + "," + String(counter.damage) + "]" + ", ";
  }
  return text;
}

function getHits() {
  var hits = [];
  var lines = document.getElementById("hitsInput").value.split("\n");

  removeItemAll(lines, "");

  for (line of lines) {
    line = line.replaceAll("\r", "");
    var values = line.split(",");

    for (var i = 0; i < values.length; i++) {
      values[i] = values[i].trim();
    }

    if (
      Object.is(Number(values[1]), NaN) ||
      values.length != 2 ||
      values.includes("")
    ) {
      throw new Error("please refer to usage");
    }

    hits.push({ player: values[0], damage: Number(values[1]) });
  }

  if (hits.length == 0) {
    throw new Error("please refer to usage");
  }

  return hits;
}

function removeItemAll(arr, value) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
}

function createCounterArray() {
  var array = [];
  for (var i = 0; i < 16; i++) {
    array.push({ player: null, damage: 0 });
  }
  return array;
}

function attack(counterArray, player, damage) {
  for (counter of counterArray) {
    if (counter.player == null) {
      counter.player = player;
    }
    if (counter.player == player) {
      counter.damage += damage;
      return;
    }
  }
}

//source: https://gist.github.com/jaydenkieran/1bd6ddbd99ba22ccf21d0d67e7777ff0
function quicksort(low, high, arr, compare) {
  var pivot_index = ~~((low + high) / 2); // floor division
  var pivot_value = arr[pivot_index];
  arr[pivot_index] = arr[high];
  arr[high] = pivot_value;
  var counter = low;
  var loop_index = low;

  while (loop_index < high) {
    if (compare(arr[loop_index], pivot_value) < (loop_index & 1)) {
      var tmp = arr[loop_index];
      arr[loop_index] = arr[counter];
      arr[counter] = tmp;
      counter = counter + 1;
    }
    loop_index = loop_index + 1;
  }

  arr[high] = arr[counter];
  arr[counter] = pivot_value;

  if (low < counter - 1) {
    self.quicksort(low, counter - 1, arr, compare);
  }
  if (counter + 1 < high) {
    self.quicksort(counter + 1, high, arr, compare);
  }
}
