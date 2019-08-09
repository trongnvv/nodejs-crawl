const BaseModel = require('../base/base_model');
const TABLE = 'item';
class UserModel extends BaseModel {

    constructor() {
        super(TABLE);
    }
}

module.exports = UserModel;