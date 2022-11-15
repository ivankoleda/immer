"use strict"

function formatBytes(bytes, decimals = 2) {
	if (!+bytes) return "0 Bytes"

	const k = 1024
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

	const i = Math.floor(Math.log(bytes) / Math.log(k))

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

global.gc && global.gc()

function measureTime(setup, fn) {
	if (!fn) {
		fn = setup
		setup = () => {}
	}
	const args = setup()
	const startTime = Date.now()
	fn(args)
	process.memoryUsage().heapUsed
	const endTime = Date.now()

	const beforeGcTime = Date.now()
	const heapUsed = process.memoryUsage().heapUsed
	global.gc && global.gc()

	return {
		time: endTime - startTime,
		heapUsed,
		gcTime: Date.now() - beforeGcTime
	}
}

export function measure(name, setup, fn) {
	const times = [...Array(5)].map(() => measureTime(setup, fn))
	const medianExecution = times.sort((a, b) => a.time - b.time)[
		Math.round(times.length / 2)
	]

	console.log(
		`${name}:\n time: ${medianExecution.time}ms\n GC took ${
			medianExecution.gcTime
		}ms\n heapUsed: ${formatBytes(medianExecution.heapUsed)}`
	)
}
