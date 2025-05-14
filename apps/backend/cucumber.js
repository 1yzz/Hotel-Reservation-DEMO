module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['features/**/*.ts'],
    paths: ['features/**/*.feature'],
    format: ['progress-bar', 'html:cucumber-report.html'],
    publishQuiet: true
  }
} 