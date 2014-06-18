var entityTypes = {
	"1": {	// skeleton
		image: "Skeleton.png",
		width: 32,
		height: 48
	},
	"2": {	// goblin
		image: "Goblin.png",
		width: 32,
		height: 32
	},
	"7": {	// Arcanus
		image: "Arcanus.png",
		width: 32,
		height: 48
	},
	"8": {	// golem
		image: "Golem.png",
		width: 112,
		height: 80
	}
};

var loadMap;

window.onload = function () {
	var mouseCoordinates = {
		x: 0,
		y: 0
	};
	var currentDirection = 0;

	var loadedSpawnPoint = {
		x: 0,
		y: 0,
		direction: 0
	}

	var imageElement = document.createElement("img");
	imageElement.id = "visualMap";
	document.body.appendChild(imageElement);

	var collisionImageElement = document.createElement("img");
	collisionImageElement.id = "collisionMap";
	document.body.appendChild(collisionImageElement);

	var spawnPointImage = document.createElement("img");
	spawnPointImage.id            = "spawnPoint";
	spawnPointImage.src	          = "spawnImage.png";
	spawnPointImage.style.display = "none";
	document.body.appendChild(spawnPointImage);

	var exitAreas = [];
	var entities = [];

	var addEntity = function (entityType, entityTypeId, x, y, direction) {
		var thisDiv = document.createElement("div");
		thisDiv.style.left  = (x - entityType.width / 2) + "px";
		thisDiv.style.top   = (y - entityType.height / 2) + "px";
		thisDiv.style.width = entityType.width + "px";
		thisDiv.style.height = entityType.height + "px";

		thisDiv.className = "entity";

		thisDiv.style.backgroundImage = "url(" + entityType.image + ")";
		thisDiv.style.backgroundPosition = "0px " + (direction * entityType.height * -1) + "px";

		thisDiv.onmousedown = imageListener;

		document.body.appendChild(thisDiv);

		entities.push({
			div: thisDiv,
			type: entityTypeId,
			"direction": direction
		});
	}

	loadMap = function (mapName, json) {
		imageElement.src = mapName + ".png";
		collisionImageElement.src = mapName + "_collision.png";

		spawnPointImage.style.left = (json.spawnPoint.x - 16) + "px";
		spawnPointImage.style.top  = (json.spawnPoint.y - 24) + "px";
		spawnPointImage.style.display = "inline-block";
		
		loadedSpawnPoint.x = json.spawnPoint.x;
		loadedSpawnPoint.y = json.spawnPoint.y;
		loadedSpawnPoint.direction = json.spawnPoint.direction;

		for (var i = 0; i < exitAreas.length; i++) {
			document.body.removeChild(exitAreas[i].div);
		}
		exitAreas = [];

		for (var i = 0; i < entities.length; i++) {
			document.body.removeChild(entities[i].div);
		}
		entities = [];

		for (var exitAreaId in json.exitAreas) {
			var exitArea = json.exitAreas[exitAreaId];
			var thisDiv = document.createElement("div");
			thisDiv.style.left   = exitArea.x + "px";
			thisDiv.style.top    = exitArea.y + "px";
			thisDiv.style.width  = exitArea.width + "px";
			thisDiv.style.height = exitArea.height + "px";

			thisDiv.className = "exitArea";

			document.body.appendChild(thisDiv);

			exitAreas.push({
				div: thisDiv,
				newMapId: exitArea.newMapId
			});
		}

		for (var entityId in json.entities) {
			var entity = json.entities[entityId];
			addEntity(entityTypes[entity.type],
						entity.type,
						entity.location.x,
						entity.location.y,
						entity.location.direction);
		}

	};

	var imageListener = function (event) {
		// sorry
		if (event.button == 2) {
			for (var entityIndex in entities) {
				if (entities[entityIndex].div == this) {
					entities.splice(entityIndex, 1);
					document.body.removeChild(this);
					break;
				}
			}
		}
	}

	document.oncontextmenu = function (e) {
		return false;
	}

	document.onclick = function (event) {
		if (screen.width - event.screenX < 250 && screen.height - event.screenY < 300)
			return;

		var entityTypeId = document.getElementById("enemyTypeSelect").value;
		addEntity(entityTypes[entityTypeId], entityTypeId, mouseCoordinates.x, mouseCoordinates.y, currentDirection);
	}

	document.onkeydown = function (event) {
		switch (event.keyCode) {
			case 87:	// w
				currentDirection = 3;
				break;
			case 65:	// a
				currentDirection = 1;
				break;
			case 83:	// s
				currentDirection = 0;
				break;
			case 68:	// d
				currentDirection = 2;
				break;
			case 74:	// j
				getJson();
		}
	}

	document.onmousemove = function (event) {
		mouseCoordinates.x = event.pageX;
		mouseCoordinates.y = event.pageY;

		document.getElementById("currentCoordinates").innerText = event.pageX + ", " + event.pageY;
	}

	var getJson = function () {
		var jsonObject = {
			spawnPoint: {
				x: loadedSpawnPoint.x,
				y: loadedSpawnPoint.y,
				direction: loadedSpawnPoint.direction
			},
			exitAreas: [],
			entities: []
		};

		for (var i = 0; i < exitAreas.length; i++) {
			jsonObject.exitAreas.push({
				x: parseInt(exitAreas[i].div.style.left.slice(0, -2)),
				y: parseInt(exitAreas[i].div.style.top.slice(0, -2)),
				width: parseInt(exitAreas[i].div.style.width.slice(0, -2)),
				height: parseInt(exitAreas[i].div.style.height.slice(0, -2)),
				newMapId: exitAreas[i].newMapId
			});
		}

		for (var i = 0; i < entities.length; i++) {
			jsonObject.entities.push({
				type: parseInt(entities[i].type),
				location: {
					x: parseInt(entities[i].div.style.left.slice(0, -2)) + entityTypes[entities[i].type].width / 2,
					y: parseInt(entities[i].div.style.top.slice(0, -2)) + entityTypes[entities[i].type].height / 2,
					direction: entities[i].direction
				}
			});
		}

		console.log(JSON.stringify(jsonObject));
	}
};