var lastSource = 0;

module.exports = {
  setEnergySource: function(creep) {
    // TODO if source is out of energy do we switch?
    var sources = creep.room.find(FIND_SOURCES_ACTIVE);

    if (creep.memory.source != undefined) {
      return sources[creep.memory.source];
    }

    if (sources.length - 1 > lastSource) {
      lastSource++;
    } else {
      lastSource = 0;
    }
    creep.memory.source = lastSource;
    return sources[lastSource];
  },

  getHarvestTargets: function(room) {
    return room.find(FIND_STRUCTURES, {
      filter: structure => {
        if (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) {
          if (structure.energy < structure.energyCapacity) {
            return true;
          }
        }
        return false;
      }
    });
  },

  getRepairTargets: function(room) {
    return room.find(FIND_STRUCTURES, {
      filter: function(object) {
        if (object.structureType != STRUCTURE_ROAD) {
          return false;
        }
        if (object.hits > object.hitsMax / 3) {
          return false;
        }
        return true;
      }
    });
  },

  setRepairTarget: function(creep) {
    var targets = getRepairTargets(creep.room);
    creep.memory.target = targets[0];
    return targets[0];
  }
};
