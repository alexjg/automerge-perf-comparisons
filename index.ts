import { type Edit } from "./edits"
import * as fs from "fs"
import { AsciiTable3 } from "ascii-table3"
import { runTiming, runMemory, Benchmark } from "./benchmark"

import {default as am1} from "./automerge-1.0"
import {default as am2 } from "./automerge-2.0"
import {default as am21} from "./automerge-2.0.1"
import {default as am21Unstable} from "./automerge-2.0.1-unstable"
import {default as yjs} from "./yjs"


type Result = {
    name: string,
    timing: number,
    memory: number,
}

function run(b: Benchmark, edits: Array<Edit>): Result {
    console.log("Running timing for " + b.name)
    let timing = runTiming(b, edits)

    console.log("Running memory for " + b.name)
    let memory = runMemory(b, edits)
    return {
        name: b.name,
        timing,
        memory,
    }
}

const benchmarks = [am1, am2, am21, am21Unstable, yjs]
const edits: Array<Edit> = JSON.parse(fs.readFileSync("./edits.json", {encoding: "utf8"}))
const results = benchmarks.map(b => run(b, edits))

const table = new AsciiTable3()
    .setHeading("Benchmark", "Timing (ms)", "Memory (bytes)")
    .setTitle("Benchmark results")
    .addRowMatrix(Array.from(results.map(r => [r.name, r.timing, r.memory])))
console.log(table.toString())
