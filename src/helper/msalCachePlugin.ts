
import { storageService } from './../services/storageService';

 /**
 * Cache Plugin configuration
 */

/*module.exports = function (cacheLocation: any) {
    var _storageService = new storageService();
    
    const beforeCacheAccess = (cacheContext: any) => {
        return new Promise<void>(async (resolve, reject) => {
            cacheContext.tokenCache.deserialize(await _storageService.getFromStorage("tokenCache"));
            resolve();
        });
    }
    
    const afterCacheAccess = (cacheContext: any) => {
        return new Promise<void>(async (resolve, reject) => {
            if(cacheContext.cacheHasChanged){
                await _storageService.setToStorage("tokenCache", cacheContext.tokenCache.serialize());
                resolve();
            } else {
                resolve();
            }
        });
    };
    
    
    return {
        beforeCacheAccess,
        afterCacheAccess
    }
}*/

const _storageService = new storageService();

async function beforeCacheAccess(cacheContext: any) {
    return new Promise<void>(async (resolve, reject) => {
        cacheContext.tokenCache.deserialize(await _storageService.getFromStorage("tokenCache"));
        resolve();
    });
}

async function afterCacheAccess(cacheContext: any) {
    return new Promise<void>(async (resolve, reject) => {
        if(cacheContext.cacheHasChanged){
            await _storageService.setToStorage("tokenCache", cacheContext.tokenCache.serialize());
            resolve();
        } else {
            resolve();
        }
    });
}

module.exports = {
    beforeCacheAccess: beforeCacheAccess,
    afterCacheAccess: afterCacheAccess
}