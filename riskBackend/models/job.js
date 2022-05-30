const db = require('../utils/database');

module.exports = {
    fetchJob :(async () => {
        return db.query('select * from job');
    })
}