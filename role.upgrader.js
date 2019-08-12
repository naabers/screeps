var creepUtil = require('creepUtil');

var lastSource = 0

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creepUtil.isDying(creep)) {
            return
        }
        else if(creep.memory.emptyEnergy) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
            if(creep.carry.energy == 0) {
                creep.memory.emptyEnergy = false
            }
        }
        else {
            if(creep.carry.energy < creep.carryCapacity) {
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(creepUtil.getEnergySource(creep)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creepUtil.getEnergySource(creep));
                }
            }
            else {
                creep.memory.emptyEnergy = true
            }
        }
	}
};

module.exports = roleUpgrader;