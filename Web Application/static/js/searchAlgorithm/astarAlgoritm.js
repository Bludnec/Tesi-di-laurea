/**
 * Funzione che restituisce la cella
 * dell'area richiesta più vicina all'agente
 * ex. area = cucina, restiuisce la cella più vicino all'agente
 * che ha zona = cucina,
 */
function nearestCell(agentI, agentJ, area) {
  var nearestCell;
  return nearestCell;
}

/**
 * @param {Cell} start
 * @param {Cell} end
 * @returns Se l'agente può arrivare alla cella ritorna un path:lista di celle, altrimenti -1.
 */
function astarAlg(start, end) {
  console.log("Calcolo il percorso con A*.");
  for (var x = 0; x < cols; x++) {
    for (var y = 0; y < rows; y++) {
      cellsList[cellIndex(x, y)].f = 0;
      cellsList[cellIndex(x, y)].g = 0;
      cellsList[cellIndex(x, y)].h = 0;
      cellsList[cellIndex(x, y)].visited = false;
      cellsList[cellIndex(x, y)].closed = false;
      cellsList[cellIndex(x, y)].parent = null;
    }
  }

  var openList = [];
  openList.push(start);
  while (openList.length > 0) {
    var lowInd = 0;
    // Grab the lowest f(x) to process next
    for (var i = 0; i < openList.length; i++) {
      if (openList[i].f < openList[lowInd].f) {
        lowInd = i;
      }
    }

    var currentNode = openList[lowInd];
    if (currentNode == end) {
      var curr = currentNode;
      var ret = [];
      while (curr.parent) {
        ret.push(curr);
        curr = curr.parent;
      }

      /* Return path list (cell's list.) */
      return ret.reverse();
    }

    // Normal case -- move currentNode from open to closed, process each of its neighbors
    openList.splice(lowInd, 1);
    currentNode.closed = true;

    var neighborsList = neighbors(currentNode);
    for (var i = 0; i < neighborsList.length; i++) {
      var neighbor = neighborsList[i];

      if (neighbor.closed) {
        // not a valid node to process, skip to next neighbor
        continue;
      }

      // g score is the shortest distance from start to current node, we need to check if
      //   the path we have arrived at this neighbor is the shortest one we have seen yet
      var gScore = currentNode.g + 1; // 1 is the distance from a node to it's neighbor
      var gScoreIsBest = false;

      if (!neighbor.visited) {
        // This the the first time we have arrived at this node, it must be the best
        // Also, we need to take the h (heuristic) score since we haven't done so yet

        gScoreIsBest = true;
        neighbor.h = heuristic(neighbor, end);
        neighbor.visited = true;
        openList.push(neighbor);
      } else if (gScore < neighbor.g) {
        // We have already seen the node, but last time it had a worse g (distance from start)
        gScoreIsBest = true;
      }
      if (gScoreIsBest) {
        // Found an optimal (so far) path to this node.  Store info on how we got here and
        //  just how good it really is...
        neighbor.parent = currentNode;
        neighbor.g = gScore;
        neighbor.f = neighbor.g + neighbor.h;
      }
    }
  }
  return -1;
}

/**
 * Ritorna la lista dei vicini dove l'agente può andare,
 * quindi esclude quelli dove ci sono oggetti dove non ci si
 * può camminare sopra oppure hanno il muro.
 */
function neighbors(node) {
  var ret = [];
  var x = node.x;
  var y = node.y;
  var nodeUp = 0,
    nodeDown = 0,
    nodeLeft = 0,
    nodeRight = 0;
  /**
   * Prendo in riferimento le celle adiacenti per vedere se c'è un'entità
   * sopra di essi per poi vedere dopo se ha walkable_ability per
   * poter far passare l'agente sopra.
   */
  var doorBool = false;
  for (var i = 0; i < itemsList.length; i++) {
    if (itemsList[i].position.x == x + 1 && itemsList[i].position.y == y) {
      if (checkOpenDoor(itemsList[i])) {
        nodeRight = 0;
        doorBool = true;
      } else {
        nodeRight = itemsList[i].id;
      }
    }
    if (itemsList[i].position.x == x - 1 && itemsList[i].position.y == y) {
      if (checkOpenDoor(itemsList[i])) {
        nodeLeft = 0;
        doorBool = true;
      } else {
        nodeLeft = itemsList[i].id;
      }
    }
    if (itemsList[i].position.x == x && itemsList[i].position.y == y + 1) {
      if (checkOpenDoor(itemsList[i])) {
        nodeDown = 0;
        doorBool = true;
      } else {
        nodeDown = itemsList[i].id;
      }
    }
    if (itemsList[i].position.x == x && itemsList[i].position.y == y - 1) {
      if (checkOpenDoor(itemsList[i])) {
        nodeUp = 0;
        doorBool = true;
      } else {
        nodeUp = itemsList[i].id;
      }
    }
  }
  /**
   * fare controllo di occupied
   * assegnare a noderight quell'id
   */

  if (x + 1 < cols && !(cellsList[cellIndex(x + 1, y)].occupied == null)) {
    nodeRight = cellsList[cellIndex(x + 1, y)].occupied;
  }
  if (x - 1 >= 0 && !(cellsList[cellIndex(x - 1, y)].occupied == null)) {
    nodeLeft = cellsList[cellIndex(x - 1, y)].occupied;
  }
  if (y + 1 < rows && !(cellsList[cellIndex(x, y + 1)].occupied == null)) {
    nodeDown = cellsList[cellIndex(x, y + 1)].occupied;
  }
  if (y - 1 >= 0 && !(cellsList[cellIndex(x, y - 1)].occupied == null)) {
    nodeUp = cellsList[cellIndex(x, y - 1)].occupied;
  }

  if (!doorBool) {
    for (var i = 0; i < abilityList.length; i++) {
      if (abilityList[i][0] == nodeRight) {
        var found = abilityList[i].find(
          (element) => element == "walkable_ability"
        );
        if (found != undefined) {
          nodeRight = 0;
        }
      }
      if (abilityList[i][0] == nodeLeft) {
        var found = abilityList[i].find(
          (element) => element == "walkable_ability"
        );
        if (found != undefined) {
          nodeLeft = 0;
        }
      }
      if (abilityList[i][0] == nodeUp) {
        var found = abilityList[i].find(
          (element) => element == "walkable_ability"
        );
        if (found != undefined) {
          nodeUp = 0;
        }
      }
      if (abilityList[i][0] == nodeDown) {
        var found = abilityList[i].find(
          (element) => element == "walkable_ability"
        );
        if (found != undefined) {
          nodeDown = 0;
        }
      }
    }
  }

  /**
   * Controllo se possiamo considerare le celle adiacenti per il path in base
   * al muro e l'oggetto sopra.
   */
  if (x - 1 >= 0 && node.walls[3] == "false" && nodeLeft == 0) {
    ret.push(cellsList[cellIndex(x - 1, y)]);
  }
  if (x + 1 < cols && node.walls[1] == "false" && nodeRight == 0) {
    ret.push(cellsList[cellIndex(x + 1, y)]);
  }
  if (y - 1 >= 0 && node.walls[0] == "false" && nodeUp == 0) {
    ret.push(cellsList[cellIndex(x, y - 1)]);
  }
  if (y + 1 < rows && node.walls[2] == "false" && nodeDown == 0) {
    ret.push(cellsList[cellIndex(x, y + 1)]);
  }
  return ret;
}

/**
 * Heuristic = Manhattan heuristic
 */
function heuristic(pos0, pos1) {
  var d1 = Math.abs(pos1.i - pos0.i);
  var d2 = Math.abs(pos1.j - pos0.j);
  return d1 + d2;
}

function checkOpenDoor(entity) {
  if (entity.entClass == "door") {
    for (var j = 0; j < physicalStatusList.length; j++) {
      if (entity.id == physicalStatusList[j]["Id"]) {
        if (physicalStatusList[j]["Status"] == "open") {
          return true;
        } else {
          return false;
        }
      }
    }
  }
}
