/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creepUtil');
 * mod.thing == 'a thing'; // true
 */
 
var lastSource = 0

module.exports = {
    isDying: function(creep) {
        if(creep.memory.dying || creep.ticksToLive < 500) {
            creep.say('Im dying');
            //The spawner will let you know after youve been healed that you are no
            //longer dying
            creep.memory.dying = true
            creep.moveTo(Game.spawns['home'])
        }
        return creep.memory.dying
    },
    
    getEnergySource: function(creep) {
        // TODO if source is out of energy do we switch?
        var sources = creep.room.find(FIND_SOURCES_ACTIVE);
    
        if(creep.memory.source != undefined) {
            return sources[creep.memory.source];
        }
    
        if(sources.length - 1 > lastSource) {
            lastSource++;
        }
        else {
            lastSource = 0;
        }
        creep.memory.source = lastSource;
        return sources[lastSource];
    }
};
