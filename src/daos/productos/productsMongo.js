import Schema from "mongoose";
import MongoContainer from "../../contenedores/MongoContainer.js";

export default class ProductsMongo extends MongoContainer{
    constructor(){
        super(
            'productos',
            {
                title:{type:String},
                price:{type:Number},
                thumbnail:{type:String},
            },{timestamps:true}
        )
    }
}