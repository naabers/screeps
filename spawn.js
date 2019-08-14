function getRandomInt() {
  return Math.floor(Math.random() * Math.floor(50000));
}

function spawnCreep() {
  workerCount = Object.keys(Game.creeps).length;
  if (workerCount < 10) {
    Game.spawns["home"].spawnCreep([WORK, CARRY, MOVE], "Worker" + getRandomInt(), {
      memory: { role: "worker", taskComplete: true }
    });
  }
}

function spawnExtensions(spawn) {
  var yOffset = -4;
  while (yOffset <= 4) {
    var xOffset = -4;
    if (yOffset % 2) {
      xOffset = -3;
    }
    while (xOffset <= 4) {
      var newX = spawn.pos.x + xOffset;
      var newY = spawn.pos.y + yOffset;
      var result = spawn.room.createConstructionSite(newX, newY, STRUCTURE_EXTENSION);
      if (result == ERR_RCL_NOT_ENOUGH) {
        return;
      }
      xOffset += 2;
    }
    yOffset += 1;
  }
}

function spawnConstructionSite(constructionSites) {
  for (var roomName in Game.rooms) {
    var room = Game.rooms[roomName];
    var spawn = undefined;
    for (spawnName in Game.spawns) {
      if (room == Game.spawns[spawnName].room) {
        spawn = Game.spawns[spawnName];
      }
    }

    if (spawn == undefined) {
      return;
    }

    spawnExtensions(spawn);

    if (room.controller.level > 1 && !room.memory.hasRoads) {
      var sources = spawn.room.find(FIND_SOURCES);
      for (var source in sources) {
        createRoadsBetween(room, spawn.room.controller.pos, sources[source].pos);
        createRoadsBetween(room, spawn.pos, sources[source].pos);
        room.memory.hasRoads = true;
      }
    }
  }
}

function createRoadsBetween(room, apos, bpos) {
  paths = PathFinder.search(apos, bpos, { swampCost: 1 }).path;
  for (path in paths) {
    room.createConstructionSite(paths[path].x, paths[path].y, STRUCTURE_ROAD);
  }
}

module.exports = {
  spawn: function() {
    spawnCreep();
    var constructionSites = Object.keys(Game.constructionSites).length;
    spawnConstructionSite(constructionSites);
  }
};
