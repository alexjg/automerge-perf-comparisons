import * as Y from "yjs"
import { type Edit } from "./edits"
import { type Sample } from "./benchmark"

export default {
    name: "Yjs",
    run: <T>(edits: Array<Edit>, sample: Sample<T>): T => {
        sample.startRun()
        const doc = new Y.Doc()
        const text = doc.getText("text")

        for (let i = 0; i < edits.length; i++) {
            let edit = edits[i]
            let [start, del, values] = edit
            text.delete(start, del)
            if (values != null) {
                text.insert(start, values)
            }
            sample.oneOp?.()
        }

        return sample.endRun()
    }
}
