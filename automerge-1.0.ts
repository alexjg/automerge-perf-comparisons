//@ts-ignore
import * as Automerge from "automerge1"
import { type Edit } from "./edits"
import { type Benchmark, Sample } from "./benchmark"

export default {
    name: "Automerge 1.0",
    run: <T>(edits: Array<Edit>, sample: Sample<T>): T => {
        sample.startRun()
        let state = Automerge.from({text: new Automerge.Text()})

        Automerge.change(state, (doc: any) => {
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
