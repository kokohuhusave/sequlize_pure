import SQ from "sequelize";
import {sequelize} from "../db/database.js";
const DataTypes = SQ.DataTypes;

// 기존의 테이블이 없으면 테이블을 생성하고, 있으면 생성하지 않음
// 뒤에 s가 붙음
export const User = sequelize.define(
    "user",
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        username:{
            type:DataTypes.STRING(45),
            allowNull:false
        },
        password:{
            type:DataTypes.STRING(128),
            allowNull:false
        },
        name:{
            type:DataTypes.STRING(45),
            allowNull:false
        },
        email:{
            type:DataTypes.STRING(128),
            allowNull:false
        },
        url:DataTypes.TEXT,
        regdate:{
            type:DataTypes.DATE, 
            defaultValue: DataTypes.NOW
        }
        // regdate:날짜타입, 현재시간을 자동으로 등록
    },
    {timestamps: false} // true면 createdAt, updatedAt 컬럼이 자동으로 생김
);

export async function searchID(username) {
    return User.findOne({where: {username}});
}

export async function findById(id) {
    return User.findByPk(id);
}

export async function createUser(user) {
    return User.create(user).then((data)=>data.dataValues.id);
}