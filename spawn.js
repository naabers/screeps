/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn');
 * mod.thing == 'a thing'; // true
 */

function getRandomInt() {
    return Math.floor(Math.random() * Math.floor(50000));
}

function spawnCreep(construction_sites, harvesterCount, upgraderCount, builderCount, repairerCount) {
    if(construction_sites > 0 && upgraderCount > 0 && builderCount < 7){
        Game.spawns['home'].spawnCreep( [WORK, CARRY, MOVE], 'Builder' + getRandomInt(), {
            memory: { role: 'builder' }
        });
    }
    else if(upgraderCount > 0 && harvesterCount < 8) {
        Game.spawns['home'].spawnCreep([WORK, CARRY, MOVE], 'Harvester' + getRandomInt(), {
            memory: {role: 'harvester'}
        });
    }
    else if(upgraderCount < 5){
        if(upgraderCount > 1) {
            Game.spawns['home'].spawnCreep([WORK, WORK, CARRY, CARRY, MOVE], 'BigUpgrader' + getRandomInt(), {
                memory: {role: 'upgrader'}
            });
        }
        else {
            Game.spawns['home'].spawnCreep([WORK, CARRY, MOVE], 'Upgrader' + getRandomInt(), {
                memory: {role: 'upgrader'}
            });
        }
    }
    else if(Game.spawns['home'].room.memory.hasRoads && repairerCount < 3) {
        Game.spawns['home'].spawnCreep([WORK, CARRY, MOVE], 'Repairer' + getRandomInt(), {
            memory: {role: 'repairer'}
        });
    }
}

function spawnConstructionSite(construction_sites) {
    for(var roomName in Game.rooms) {
        var room = Game.rooms[roomName]
        if(room.controller.level == 2 && construction_sites < 5) {
            var x = Game.spawns['home'].pos.x + 1 + construction_sites
            var y = Game.spawns['home'].pos.y + 1 + construction_sites
            var status = room.createConstructionSite(x, y, STRUCTURE_EXTENSION)
        }
        else if(room.controller.level == 3 && construction_sites < 10) {
            var x = Game.spawns['home'].pos.x + construction_sites
            var y = Game.spawns['home'].pos.y + 1 + construction_sites
            var status = room.createConstructionSite(x, y, STRUCTURE_EXTENSION)
        }
        
        //TODO This requires repairing so maybe only do it when level 2 and no other
        //jobs to work on.
        if(!room.memory.hasRoads) {
            var sources = Game.spawns['home'].room.find(FIND_SOURCES);
            for(var source in sources) {
                createRoadsBetween(room, Game.spawns['home'].room.controller.pos, sources[source].pos);
                createRoadsBetween(room, Game.spawns['home'].pos, sources[source].pos);
                room.memory.hasRoads = true;
            }
        }
        
    }
}

function createRoadsBetween(room, apos, bpos) {
    paths = PathFinder.search(apos, bpos).path
    for(path in paths) {
        room.createConstructionSite(paths[path].x, paths[path].y, STRUCTURE_ROAD)   
    }
}

module.exports = {
    spawn: function(construction_sites, harvesterCount, upgraderCount, builderCount, repairerCount) {
        spawnCreep(construction_sites, harvesterCount, upgraderCount, builderCount, repairerCount);
        spawnConstructionSite(construction_sites);
    }
};