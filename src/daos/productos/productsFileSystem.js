import FileContainer from "../../contenedores/FileContainer.js";

export default class ProductFileSystem extends FileContainer{
    constructor(){
        super('productos.txt')
    }
}