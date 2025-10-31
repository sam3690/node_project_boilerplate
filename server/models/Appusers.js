const db = require('../database/connection')

class User {
        constructor(userData) {
        this.id = userData.id;
        this.full_name = userData.full_name;
        this.username = userData.username;
        this.passwordEnc = userData.passwordEnc;
        this.auth_level = userData.auth_level;
        this.enabled = userData.enabled;
        this.designation = userData.designation;
        this.pwdExpiry = userData.pwdExpiry;
        this.attempt = userData.attempt;
        this.attemptDateTime = userData.attemptDateTime;
        this.isNewUser = userData.isNewUser;
        this.lastPwdChangeBy = userData.lastPwdChangeBy;
        this.lastPwd_dt = userData.lastPwd_dt;
        this.createdBy = userData.createdBy;
        this.createdDateTime = userData.createdDateTime;
        this.updateBy = userData.updateBy;
        this.updatedDateTime = userData.updatedDateTime;
        this.deleteBy = userData.deleteBy;
        this.deletedDateTime = userData.deletedDateTime;
        this.isSendDB = userData.isSendDB;
        this.colflag = userData.colflag;
        this.dist_id = userData.dist_id;
    }


    static async index(limit=50, offset=0) {
        try {
            const query = `SELECT * FROM Appusers where colflag IS NULL and username NOT LIKE '%test%'`;
            const result = await db.query(query, {limit, offset});
            return result.recordset.map(userData => new User(userData));
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }
}