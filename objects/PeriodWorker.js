const PeriodWorker = new Worker('/workers/period.js', {type: 'module'});
export default PeriodWorker;