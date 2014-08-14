
var fs = require('fs')
var path = require('path')
var jade = require('jade')
var yaml = require('js-yaml')
var marked = require('marked')

var index = path.join(__dirname, 'index.jade')
var out = path.join(__dirname, '../index.html')

var projects = yaml.safeLoad(fs.readFileSync(__dirname + '/projects.yaml')+'')
var maintainers = require('./maintainers.json')

projects = projects
// normalize the metadata
.map(function (project) {
  if (typeof project === 'string') project = { name: project }
  project.npm = project.npm || project.name.toLowerCase()
  project.repo = project.repo || ('jshttp/' + project.npm)
  project.node = project.node || '0.8'
  project.desc = marked(project.desc || '')
  project.maintainer = maintainers[project.maintainer || 'dougwilson']
  return project
})
// alphabetize
.sort().reverse()

var src = fs.readFileSync(index, 'utf8')

var fn = jade.compile(src, {
  compileDebug: false,
  filename: index,
})

var html = fn({
  projects: projects,
  style: 'flat-square'
})

fs.writeFileSync(out, html)
