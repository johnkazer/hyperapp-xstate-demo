
import 'pug-vdom/runtime' // runtime library is required and puts 'pugVDOMRuntime' into the global scope
const render = require('./app.pug.js')
export const pugToView = (h) => state =>
  render(state, (name, props, children) =>
    h(name, props.attributes, children)
  )[0]
