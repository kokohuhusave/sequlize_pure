import SQ, { Sequelize } from "sequelize";
import {User} from "../data/auth.js";
import {sequelize} from "../db/database.js";

const DataTypes = SQ.DataTypes;

export const Tweet = sequelize.define(
    "tweet",
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        text:{
            type:DataTypes.TEXT,
            allowNull:false
        }
    }
);

Tweet.belongsTo(User);
// 객체를 생성
// attributes 키값에 배열을 선언
// join문을 사용할 때 보고싶은 컬럼을 적음
// user테이블에 들어가 있는 컬럼들은 Sequelize.col로 밖으로 뺌

const INCLUDE_USER = {
    attributes:[
        "id",
        "text",
        "createdAt",
        "userId",
        [Sequelize.col("user.name"), "name"],
        [Sequelize.col("user.username"), "username"],
        [Sequelize.col("user.url"), "url"],
    ],
    include:{
        model:User,
        attributes: [] // 같은 키 이름 그대로 복사
    }
}

const ORDER_DESC ={
    order: [["createdAt", "DESC"]]
}

export async function getAllByUsername(username) { 
    return Tweet.findAll({
        ...INCLUDE_USER, 
        ...ORDER_DESC,
        include: {
            ...INCLUDE_USER.include,
            where:{username}
        }
    });
}

export async function getAll(){
    return Tweet.findAll({...INCLUDE_USER, ...ORDER_DESC});
}

export async function getById(id) {
    return Tweet.findOne({
        where:{id},
        ...INCLUDE_USER
    });
}

export async function addTweet(text, userId) {
    return Tweet.create({text,userId});
}

export async function setTweet(id,text) {
    return Tweet.findByPk(id, INCLUDE_USER).then((tweet) => {
        tweet.text = text;
        return tweet.save();
    });
    // return Tweet.update({text},{where: {id}}).then(() => getById(id));
}

export async function deleteTweet(id) {
    return Tweet.findByPk(id).then((tweet) => {
        tweet.destroy();
    });
    // return Tweet.destroy({where:{id}});
}