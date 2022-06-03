var idCounter = 0;
var lastClickedIndex;

var infoName = document.getElementById("info-name");
var infoId = document.getElementById("info-id");
var infoCoord = document.getElementById("info-coord");
var infoLexRef = document.getElementById("info-lexRef");
var infoPoint = document.getElementById("item-info-point");

var cellInfoPoint = document.getElementById("cell-info-point");
var cellCoord = document.getElementById("cell-coord");
var cellZone = document.getElementById("cell-zone");

var checkWalls = document.getElementById("walls-checkbox");
var checkColor = document.getElementById("color-checkbox");
var modal = document.getElementById("myModal");

var xReleased, yReleased, zReleased;

var boolMousePressed = false;
var indexItemPressed, xItemPressed, yItemPressed;

var saveBtnModal = document
  .getElementById("save-btn-modal")
  .addEventListener("click", addEntity);
var checkColor = document
  .getElementById("cancel-btn-modal")
  .addEventListener("click", () => {
    modal.style.display = "none";
  });

function addEntity() {
  modal.style.display = "none";
  /* Create a new object on mouse release in mouseX, mouseY coordinates */
  if (possToPutObject(xReleased, yReleased)) {
    console.log(xReleased, yReleased, zReleased);
    console.log("cazz");
    console.log(classItemSelected);
    insertEntity(
      classItemSelected + idCounter,
      classItemSelected,
      classItemSelected,
      xReleased,
      yReleased,
      zReleased,
      "big",
      2,
      2
    );
  }
  getAllEntity();
  indexItemSelected = -1;
  classItemSelected = null;
  idCounter++;
  xReleased = null;
  yReleased = null;
  zReleased = null;
}
//
document
  .getElementById("delete-button")
  .addEventListener("click", deleteItemOnMap);

function mouseClicked() {
  /* Returns null if the click is done outside the canvas it.  */
  if (mouseX < 0 || mouseY < 0 || mouseX > cols * w || mouseY > rows * w) {
    return null;
  }

  /* Check if the click is done on the cell area. */
  var x = parseInt(mouseX / w);
  var y = parseInt(mouseY / w);

  var thisCell = cellsList[cellIndex(x, y)];

  /* Color the cell and assign the value "zone" to the cell. */
  if (thisCell != undefined && checkColor.checked == true) {
    colorCellMap(x, y);
  }
  /* Modifica dei muri */
  if (thisCell != undefined && checkWalls.checked == true) {
    editWalls(mouseX, mouseY);
  }
  /* Fa apparire tabella con info della cella */
  if (thisCell != undefined) {
    console.log(thisCell);
    cellInfoPoint.classList.remove("hidden");

    cellCoord.textContent = "x:" + thisCell.i + ", y:" + thisCell.j;
    cellZone.textContent = thisCell.zone;
  }
  /* Fa apparire tabella con info dell'oggetto */
  for (var k = 0; k < itemsList.length; k++) {
    if (itemsList[k].i == x && itemsList[k].j == y) {
      infoPoint.classList.remove("hidden");

      infoName.textContent = itemsList[k].name;
      infoId.textContent = itemsList[k].id;
      infoCoord.textContent = "x:" + itemsList[k].i + ", y:" + itemsList[k].j;
      infoLexRef.textContent = itemsList[k].lexical_references;
      lastClickedIndex = k;

      console.log(itemsList[k]);
    }
  }
  /* Serve per impedire lo spostamento se viene solamente clicato l'oggetto invece di essere draggato */
  boolMousePressed = false;
}

function mousePressed() {
  if (mouseX < 0 || mouseY < 0 || mouseX > cols * w || mouseY > rows * w) {
    return null;
  }

  var x = parseInt(mouseX / w);
  var y = parseInt(mouseY / w);

  for (var k = 0; k < itemsList.length; k++) {
    if (itemsList[k].i == x && itemsList[k].j == y) {
      boolMousePressed = true;
      indexItemPressed = k;
      xItemPressed = itemsList[k].i;
      yItemPressed = itemsList[k].j;
    }
  }
}

function mouseReleased() {
  /* Returns null if the click is done outside the canvas it.  */
  if (mouseX < 0 || mouseY < 0 || mouseX > cols * w || mouseY > rows * w) {
    return null;
  }
  var modal = document.getElementById("myModal");
  // Get the <span> element that closes the modal
  modal.style.display = "block";

  /* Check if the click is done on the cell area. */
  xReleased = parseInt(mouseX / w);
  yReleased = parseInt(mouseY / w);
  zReleased = 0;

  /* Moves the pressed element after release to the new coordinates */
  if (boolMousePressed && possToPutObject(x, y)) {
    itemsList[indexItemPressed].i = x;
    itemsList[indexItemPressed].j = y;

    itemsList[indexItemPressed].x = x * w;
    itemsList[indexItemPressed].y = y * w;

    boolMousePressed = false;
    indexItemPressed = null;
  }
}

function mouseDragged() {
  console.log("drag");
  if (mouseX < 0 || mouseY < 0 || mouseX > cols * w || mouseY > rows * w) {
    return null;
  }
  var x = parseInt(mouseX / w);
  var y = parseInt(mouseY / w);

  if (boolMousePressed) {
    itemsList[indexItemPressed].position.x = x * w;
    itemsList[indexItemPressed].position.y = y * w;
  }
}

/* Keyboard events */
function keyPressed() {
  /* Press "Escape" for unselect the selected item. */
  if (keyCode === ESCAPE && lastClickedIndex != null) {
    removeInfoPoint();
  }
}

function deleteItemOnMap() {
  if (lastClickedIndex != null) {
    removeInfoPoint();
    itemsList.splice(lastClickedIndex, 1);
    lastClickedIndex = null;
  } else {
    console.log(
      "Nessun elemento cancellato. Selezionane uno prima di cancellarlo."
    );
  }
}

/* Function for remove the info-point */
function removeInfoPoint() {
  infoName.textContent = "";
  infoId.textContent = "";
  infoCoord.textContent = "";
  infoLexRef.textContent = "";
  infoPoint.classList.add("hidden");
}
