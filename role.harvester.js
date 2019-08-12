var creepUtil = require('creepUtil');

var lastSource = 0

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creepUtil.isDying(creep)) {
            return
        }
	    else if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(creepUtil.getEnergySource(creep)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creepUtil.getEnergySource(creep), {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
	}
};

module.exports = roleHarvester;