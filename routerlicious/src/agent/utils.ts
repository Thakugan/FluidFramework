import { EventEmitter } from "events";

/**
 * Invokes a callback based on boolean or waits for event to fire.
 */
export async function runAfterWait(
    dirty: boolean,
    eventSource: EventEmitter,
    eventName: string,
    callback: () => Promise<void>) {
    if (!dirty) {
        await callback();
    } else {
        return new Promise<void>((resolve, reject) => {
            eventSource.on(eventName, async () => {
                console.log(`${eventName} event fired!`);
                await callback();
                resolve();
            });
        });
    }
}

/**
 * Utility to run a forced garbage collector.
 * To expose gc, run node --expose-gc dist/paparazzi/index.js.
 */
export function runGC() {
    global.gc();
    setTimeout(() => {
        printMemoryUsage();
    }, 5000);
}

/**
 * Utility to print node memory usage.
 */
function printMemoryUsage() {
    const used = process.memoryUsage();
    // tslint:disable-next-line
    for (const key in used) {
        console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
    }
}
