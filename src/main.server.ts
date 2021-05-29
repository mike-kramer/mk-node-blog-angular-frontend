/***************************************************************************************************
 * Initialize the server environment - for example, adding DOM built-in types to the global scope.
 *
 * NOTE:
 * This import must come before any imports (direct or transitive) that rely on DOM built-ins being
 * available, such as `@angular/elements`.
 */
import '@angular/platform-server/init';

import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

global.localStorage = {
    getItem(key: string): string | null {
        return null;
    },
    key(index: number): string | null {
        return null;
    }, length: 0, removeItem(key: string): void {
    }, setItem(key: string, value: string): void {
    }, clear(): void {
    }

}

export { AppServerModule } from './app/app.server.module';
export { renderModule, renderModuleFactory } from '@angular/platform-server';
