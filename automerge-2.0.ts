import * as Automerge from "@automerge/automerge2.0"
import { type Edit } from "./edits"
import { type Sample } from "./benchmark"

export default {
    name: "Automerge 2.0",
    run: <T>(edits: Array<Edit>, sample: Sample<T>): T => {
        sample.startRun()
        //@ts-ignore
        let state = Automerge.from({text: new Automerge.Text()})

        Automerge.change(state, doc => {
            for (let i = 0; i < edits.length; i++) {
                let edit = edits[i]
                let [start, del, values] = edit
                doc.text.deleteAt!(start, del)
                if (values != null) {
                    doc.text.insertAt!(start, values)
                }
                sample.oneOp?.()
            }
        })
        return sample.endRun()
    }
}
