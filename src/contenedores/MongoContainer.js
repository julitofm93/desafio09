import mongoose from 'mongoose';
import config from '../config.js'
mongoose.connect(config.mongo.baseUrl,{useNewUrlParser:true,useUnifiedTopology:true})

export default class MongoContainer{
    constructor(collection,schema,timestamps){
        this.collection = mongoose.model(collection,new mongoose.Schema(schema,timestamps))
    }
    //OBTENER TODOS LOS ELEMENTOS
    getAll = async() =>{
      try{
        let documents = await this.collection.find()
        return {status:"succes",payload:documents}
      }catch(error){
          return {status:"error",message:"error" + error}
      }
    }
    //CREAR UN ELEMENTO
    save = async(object) => {
        try{
            let result = await this.collection.create(object);
            return {status:"succes",message:"creado",payload:result}
        }catch(error){
            return{status:"error",message:"error"+error}
        }
    }
    //CREAR UN CARRITO
    saveCart = async(object) => {
        try{
            let result = await this.collection.create(object);
            return {status:"succes",message:"creado",payload:result}
        }catch(error){
            return{status:"error",message:"error"+error}
        }
    }
    //AGREGAR UN PRODUCTO A UN CARRITO
    addProducto = async(cartId,productId) =>{
        try{
            let result = await this.collection.updateOne({_id:cartId},{$push:{productos:productId}})
            return {status:"succes",message:"succes",payload:result}
        }catch(error){
            return {status:"error",message:"Error"+error}
        }
    }
    
    //MODIFICAR UN ELEMENTO
    update = async(id,body) =>{
        try{
            let result = await this.collection.updateOne({_id:id},{$set: body})
            return {status:"succes",message:"succes",payload:result}
        }catch(error){
            return {status:"error",message:"Error"+error}
        }
    }

    getById = async(id) =>{
        try{
            let result = await this.collection.findById(id);
            return { status: 'Success', payload: result}
        }catch(error){
            return {status:"error",message:"Error"+error}
        }
    }
    
    deleteById = async(id) =>{
        try{
            const result = await this.collection.findOne({ _id: id });
            return {status:"succes",message:"succes",payload:result}
        }catch(error){
            return {status:"error",message:"Error"+error}
        }
    }
}