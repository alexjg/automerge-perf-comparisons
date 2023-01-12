import {unstable as Automerge} from "@automerge/automerge2.1"
import { type Edit } from "./edits"
import { type Sample } from "./benchmark"

export default {
    name: "Automerge 2.0.1-unstable",
    run: <T>(edits: Array<Edit>, sample: Sample<T>): T => {
        sample.startRun()
        let state = Automerge.from({text: ""})

        state = Automerge.change(state, doc => {
            for (let i = 0; i < edits.length; i++) {
                let edit = edits[i]
                let [start, del, values] = edit
                Automerge.splice(doc, "text", start, del, values)
                sample.oneOp?.()
            }
        })
        return sample.endRun()
    }
}
