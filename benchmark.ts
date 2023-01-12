import { type Edit } from "./edits"
import * as v8 from "node:v8"

export type Sample<T> = {
    startRun: () => void,
    oneOp?: () => void,
    endRun: () => T,
}

export type Benchmark = {
    name: string,
    run: <T>(edits: Array<Edit>, sample: Sample<T>) => T,
}

class TimingSample {
    start: Date | undefined
    startRun() {
        this.start = new Date()
    }
    endRun(): number {
        if (this.start == null) {
            throw new Error("startRun() was not called")
        }
        let elapsed = (new Date() as any) - (this.start as any)
        return elapsed
    }
}

export function runTiming(benchmark: Benchmark, edits: Array<Edit>): number {
    return benchmark.run(edits, new TimingSample())
}

class MemSample {
    startMem: number | undefined
    maxMem: number = 0
    startRun() {
        this.startMem = process.memoryUsage.rss()
    }
    oneOp() {
        let mem = process.memoryUsage.rss() - this.startMem!
        if (mem > this.maxMem) {
            this.maxMem = mem
        }
    }
    endRun(): number {
        return this.maxMem
    }
}

export function runMemory(benchmark: Benchmark, edits: Array<Edit>): number {
    return benchmark.run(edits, new MemSample())
}
