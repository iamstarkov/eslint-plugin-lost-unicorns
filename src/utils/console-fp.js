// https://github.com/DeveloperToolsWG/console-object/blob/master/api.md
const noop = () => {};

// Logging
export const assert = console.assert.bind(console);
export const clear = (console.clear || noop).bind(console);
export const count = (console.count || noop).bind(console);
export const debug = (console.debug || noop).bind(console);
export const dir = console.dir.bind(console);
export const dirxml = (console.dirxml || noop).bind(console);
export const error = console.error.bind(console);
export const exception = (console.exception || noop).bind(console);
export const group = (console.group || noop).bind(console);
export const groupCollapsed = (console.groupCollapsed || noop).bind(console);
export const groupEnd = (console.groupEnd || noop).bind(console);
export const info = console.info.bind(console);
export const log = console.log.bind(console);
export const table = (console.table || noop).bind(console);
export const trace = console.trace.bind(console);
export const warn = console.warn.bind(console);

// Profiling
export const profile = (console.profile || noop).bind(console);
export const profileEnd = (console.profileEnd || noop).bind(console);
export const timeline = (console.timeline || noop).bind(console);
export const timelineEnd = (console.timelineEnd || noop).bind(console);

// Timing
export const time = console.time.bind(console);
export const timeEnd = console.timeEnd.bind(console);
export const timeStamp = (console.timeStamp || noop).bind(console);

// Properties
export const profiles = console.profiles;

// console
export default console;
