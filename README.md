# Automerge implementation performance comparisons

This repository runs the edit history benchmark from [automerge-perf](https://github.com/automerge/automerge-perf) with the following implementations of automerge:

* `automerge@1.0.1-preview.7` - A pure JS rewrite of the original automerge implementation which does not use immutable-js and is consequently dramativally faster thant `automerge@1.0.0`
* `@automerge/automerge@2.0.0` - A reimplementation of automerge in Rust, compiled to WebAssembly and wrapped in a a JS API which is very similar to `automerge@1.0`
* `@automerge/automerge@2.0.1-alpha.3` - A considerably more efficient release of the Rust implementation, not yet ready for release
* `@automerge/automerge@2.0.1-alpha.3` using the `unstable` module - This is an alternative text API which uses a different representation for the text in question and is consequently backwards incompatible, but also much faster.
* [`yjs`](https://github.com/yjs/yjs) - 

## Measurements

The time to run the edit history is measured using wall clock time. Memory is measured using `process.memoryUsage.rss()` at the start of the run, and then measuring the difference between the start value and the current value after every op, this gives us an approximate peak memory usage. RSS is quite approximate but unfortunately it's hard to get good memory stats out of WebAssembly processes in Node because a) the WebAssembly memory is not included in `process.memoryUsage.heapUsed` and b) it's hard to use lower level tools like valgrind because Node mmaps a 10Gb chunk of memory up front for WebAssembly and then commits bits of it at a time so valgrind either underreports or massively over-reports memory depending on whether you use the `--pages-as-heap` option or not.

## Running

```bash
yarn install
yarn benchmark
```


## Results

This is the results running on my Ryzen 9 7900X

|        Benchmark         | Timing (ms) | Memory (bytes) |
| ------------------------ | ----------- | -------------- |
| Automerge 1.0            |       13052 |      184721408 |
| Automerge 2.0            |        4442 |      118263808 |
| Automerge 2.0.1          |        1816 |       44523520 |
| Automerge 2.0.1-unstable |         661 |       22953984 |
| Yjs                      |        1074 |       10141696 |


