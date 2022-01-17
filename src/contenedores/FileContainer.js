import fs from 'fs';
import config from '../config.js'
export default class FileContainer{
    constructor(file_endpoint){
        this.url = `${config.fileSystem.baseUrl}${file_endpoint}`
    }

//OBTENER TODOS LOS ELEMENTOS
    getAll = async() =>{
        try{
            let data = await fs.promises.readFile(this.url,'utf-8')
            return{status:"succes",payload:JSON.parse(data)}
        }catch(err){
            return {status:"error",error:`No se pudo obtener: ${error}`}
        }
    }

//OBTENER UN ELEMENTO POR SU ID
    getById = async(id)=>{
        try{
            let data = await fs.promises.readFile(this.url,'utf-8');
            let objects = JSON.parse(data);
            let search = objects.find(object=>object.id===id)
            if(search){
                return{status:"succes",payload:search}
            }
        }catch(error){
            return {status:"error",error:`No se pudo obtener: ${error}`}
        }
    }

//CREAR UN ELEMENTO 
    save = async(event)=>{
        try{
            let data = await fs.promises.readFile(this.url, 'utf-8');
            let events = JSON.parse(data);
            let id = events[events.length-1].id+1;
            event = Object.assign({id:id},event)
            events.push(event)
            try{
                await fs.promises.writeFile(this.url,JSON.stringify(events,null,2));
                return {status:"succes", message:"creado con exito"};
            }catch{
                return {status:"error", message:"No se pudo crear"}
            }
        }catch{
            event = Object.assign({id:1},event)
                try{
                    await fs.promises.writeFile(this.url,JSON.stringify([event], null, 2));
                    return {status:"succes", message:"creado con exito"}
                }
                catch{
                    return {status:"error", message:"no se pudo crear"}
                }
        }
    }

//ELIMINAR TODOS LOS ELEMENTOS
    deleteAll = async()=>{
        try {
            await fs.promises.unlink(this.url, 'utf-8')
            return {status:"succes", message:"Archivo eliminado"}
        } catch (error) {
            return {status:"error", message:"error"+error}
        }
    }

//ELIMINAR UN ELEMENTO POR SU ID
    deleteById = async(id)=>{
        try{
            let data =  await fs.promises.readFile(this.url,'utf-8')
            let events = JSON.parse(data);
            if(!events.some(event=>event.id===id)) return {status:"error", message:"No hay producto con el id especificado"}
            let event = events.find(v=>v.id===id);
            let aux = events.filter(event=>event.id!==id);
            try{
                await fs.promises.writeFile(this.url,JSON.stringify(aux,null,2));
                return {status:"success",message:"eliminado"}
            }catch{
                return {status:"error", message:"No se pudo eliminar "}
            }
        }catch{
            return {status:"error",message:"Falló al eliminar"}
        }
    }

//ACTUALIZAR
    update = async(id,body)=>{
        try{
            let data = await fs.promises.readFile(this.url,'utf-8');
            let events = JSON.parse(data);
            if(!events.some(event=>event.id===id)) return {status:"error", message:"No hay ningún producto con el id especificado"}
            let result = events.map(event=>{
                if(event.id===id){
                        body = Object.assign({id:event.id,...body})
                        return body
                }else{
                    return event;
                }
            })
            try{
                await fs.promises.writeFile(this.url,JSON.stringify(result,null,2));
                return {status:"success", message:" actualizado"}
            }catch{
                return {status:"error", message:"Error al actualizar "}
            }
        }catch{
            return {status:"error",message:"Fallo al actualizar"}
        }
    }

//AGREGAR UN CARRITO
saveCart = async(cart)=>{
        try{
            let data = await fs.promises.readFile(this.url, 'utf-8');
            let carts = JSON.parse(data);
            let arrayProductos = []
            let id = carts[carts.length-1].id+1;
            cart = Object.assign({id:id, productos:arrayProductos},cart)
            carts.push(cart)
            try{
                await fs.promises.writeFile(this.url,JSON.stringify(carts,null,2));
                return {status:"success", cartId:cart.id, message:"Carrito creado con exito"};
            }catch{
                return {status:"error", message:"No se pudo crear el carrito"}
            }
            }catch{
                cart = Object.assign({id:1, productos:[]},cart)
                try{
                    await fs.promises.writeFile(this.url,JSON.stringify([cart], null, 2));
                    return {status:"success", cartId:cart.id, message:"Carrito creado con exito"}
                }
                catch{
                    return {status:"error", message:"No se pudo crear el carrito"}
                }
        }
    }

//AGREGAR PRODUCTOS A UN CARRITO
addProduct = async(idNumber, productId)=>{
    try{
        let data = await fs.promises.readFile(this.url, 'utf-8')
        let carts = JSON.parse(data)
        let cartIndex = carts.findIndex(cart => cart.id === idNumber)
        let cart = carts.find(cart => cart.id === idNumber)

        let dataProducts = await fs.promises.readFile(this.url, 'utf-8')
        let allProducts = JSON.parse(dataProducts)
        let productToAdd = allProducts.find(prod => prod.id === productId)
        
        cart.productos.push(productToAdd)
        carts.splice(cartIndex, 1, cart)

        try{
            await fs.promises.writeFile(this.url,JSON.stringify(carts,null,2))
            return {status:"success", message:`Product ${productId} added to Cart ${idNumber}`}
        }
        catch(err){
            return {status:"error", message:`Error to add product ${productId} in Cart ${idNumber}: ${err}`}
        }
    }
    catch(err){
        return {status:"error", message:`Error to add product ${productId} in Cart ${idNumber}: ${err}`}
    }
}

//OBTENER LOS PRODUCTOS DE UN CARRITO
getProductsByCartId = async(idNumber)=>{
        try{
            let data = await fs.promises.readFile(this.url, 'utf-8')
            let carts = JSON.parse(data)
            let cartIndex = carts.findIndex(cart => cart.id === idNumber)
            let productsInCart = carts[cartIndex].productos
            if(productsInCart){
                return productsInCart
            }else{
                console.log(null)
                return null
            }
        }
        catch(err){
            console.log(err)
        }
    }

//BORRAR UN PRODUCTO DE UN CARRITO
deleteProduct = async(idNumber, productId)=>{
    try{
        let data = await fs.promises.readFile(this.url, 'utf-8')
        let carts = JSON.parse(data)
        let cart = carts.find(cart => cart.id === idNumber)
        let cartIndex = carts.findIndex(cart => cart.id === idNumber)
        
        let productIndex = cart.productos.findIndex(prod => prod.id === productId)
        //let deletedProduct = productsinCart.find(prod => prod.id === productId)
        
        if(productIndex > -1){
            cart.productos.splice(productIndex, 1)
            carts.splice(cartIndex, 1, cart)
            try{
                await fs.promises.writeFile(this.url, JSON.stringify(carts, null, 2))
                console.log(`product deleted at cart ${cart.id}`)
                return {status:"success",message:`product deleted at cart ${cart.id}`}
            }
            catch(err){
                console.log(err)
                return {status:"error",message:err}
            }
        }
    }
    catch(err){
        return {status:"error",message:err}
    }
}

}