var creepUtil = require('creepUtil');

var lastSource = 0

function getTarget(creep) {
    var targets = creep.room.find(FIND_STRUCTURES, {
       filter: function(object){
            if(object.structureType != STRUCTURE_ROAD ) {
                return false;
            }
            if(object.hits > object.hitsMax / 3) {
                return false;
            }
           return true;
       }
    });
    creep.memory.target = targets[0]
    return targets[0]
}

var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creepUtil.isDying(creep)) {
            return
        }
	    if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
	    }
	    if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.repairing = true;
	    }

	    if(creep.memory.repairing) {
	        //TODO how do I repair just my own buildings that arent roads
	        var target = creep.memory.target
	        if(target != undefined) {
	            target = getTarget(creep)
	        }
            if(target != undefined) {
                repair_value = creep.repair(target)
                if(repair_value == ERR_NOT_IN_RANGE) {
                    creep.say("repairing!")
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                else if(target.hits == target.maxHits) {
                    creep.memory.target == undefined;
                }
            }
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(creepUtil.getEnergySource(creep)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creepUtil.getEnergySource(creep), {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	    }
	}
};

module.exports = roleRepairer;