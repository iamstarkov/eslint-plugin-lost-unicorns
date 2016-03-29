import Promise from 'pinkie-promise';

export const all = Promise.all.bind(Promise);
export const race = Promise.race.bind(Promise);
export const reject = Promise.reject.bind(Promise);
export const resolve = Promise.resolve.bind(Promise);
