let products;
let persistencia = "fileSystem";

switch(persistencia){
    case "fileSystem":
        const {default:ProductsFileSystem} = await import('./productos/productsFileSystem.js')
        products = new ProductsFileSystem();
        break;

    case "mongo":
        const {default:ProductsMongo} = await import ('./productos/productsMongo.js')
        products = new ProductsMongo();
        break;

    default:
    }

export {products}