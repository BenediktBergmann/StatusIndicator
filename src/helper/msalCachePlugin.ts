
import { storageService } from './../services/storageService';

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