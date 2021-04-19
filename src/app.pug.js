// PUG VDOM generated file
function render(context, h) {
  if (!pugVDOMRuntime) throw "pug-vdom runtime not found.";
  var runtime = pugVDOMRuntime
  var locals = context;
  var self = locals;
  var remainingKeys = pugVDOMRuntime.exposeLocals(locals);
  for (var prop in remainingKeys) {
    eval('var ' + prop + ' =  locals.' + prop);
  }
  var n0Child = []
  var n1Child = []
  var n2Child = []
  n2Child = n2Child.concat(title)
  var props = {attributes: runtime.compileAttrs([], [])};
  if (props.attributes.id) props.key = props.attributes.id;
  var n2 = h('h1', props, n2Child)
  n1Child.push(n2)
  if(!installed) {
    var n3Child = []
    n3Child.push("Install")
    var props = {attributes: runtime.compileAttrs([{name:'class', val: 'btn'},{name:'onclick', val: installAsPwa}], [])};
    if (props.attributes.id) props.key = props.attributes.id;
    var n3 = h('button', props, n3Child)
    n1Child.push(n3)
  }
  var n4Child = []
  n4Child = n4Child.concat(onlineStatusMsg)
  var props = {attributes: runtime.compileAttrs([{name:'class', val: status}], [])};
  if (props.attributes.id) props.key = props.attributes.id;
  var n4 = h('p', props, n4Child)
  n1Child.push(n4)
  var n5Child = []
  n5Child = n5Child.concat(uploadingStatusMsg)
  var props = {attributes: runtime.compileAttrs([], [])};
  if (props.attributes.id) props.key = props.attributes.id;
  var n5 = h('p', props, n5Child)
  n1Child.push(n5)
  var showTab
  var n6Child = []
  var v7 = tabs
  Object.keys(v7).forEach(function (k8) {
    var button = v7[k8]
    var n9Child = []
    n9Child = n9Child.concat(button.txt)
    var props = {attributes: runtime.compileAttrs([{name:'class', val: 'tabLinks'},{name:'id', val: button.id},{name:'onclick', val: button.action}], [])};
    if (props.attributes.id) props.key = props.attributes.id;
    var n9 = h('button', props, n9Child)
    n6Child.push(n9)
    if((button.active)) {
      showTab = button.tabName
    }
  }.bind(this))
  var props = {attributes: runtime.compileAttrs([{name:'class', val: 'tab'},{name:'class', val: 'align-centre'}], [])};
  if (props.attributes.id) props.key = props.attributes.id;
  var n6 = h('div', props, n6Child)
  n1Child.push(n6)
  var n10Child = []
  var n11Child = []
  var n12Child = []
  var props = {attributes: runtime.compileAttrs([{name:'autoPlay', val: true},{name:'playsInline', val: true},{name:'muted', val: true},{name:'id', val: "webcam"},{name:'width', val: "100%"},{name:'height', val: "200"}], [])};
  if (props.attributes.id) props.key = props.attributes.id;
  var n12 = h('video', props, n12Child)
  n11Child.push(n12)
  var n13Child = []
  var v14 = images
  Object.keys(v14).forEach(function (k15) {
    var img = v14[k15]
    var n16Child = []
    var props = {attributes: runtime.compileAttrs([{name:'src', val: img},{name:'alt', val: "captured"},{name:'height', val: "200"}], [])};
    if (props.attributes.id) props.key = props.attributes.id;
    var n16 = h('img', props, n16Child)
    n13Child.push(n16)
  }.bind(this))
  var props = {attributes: runtime.compileAttrs([{name:'id', val: 'imageCanvas'},{name:'class', val: 'imageCanvas'}], [])};
  if (props.attributes.id) props.key = props.attributes.id;
  var n13 = h('div', props, n13Child)
  n11Child.push(n13)
  var n17Child = []
  var props = {attributes: runtime.compileAttrs([], [])};
  if (props.attributes.id) props.key = props.attributes.id;
  var n17 = h('br', props, n17Child)
  n11Child.push(n17)
  var props = {attributes: runtime.compileAttrs([{name:'class', val: 'align-centre'}], [])};
  if (props.attributes.id) props.key = props.attributes.id;
  var n11 = h('div', props, n11Child)
  n10Child.push(n11)
  var n18Child = []
  var v19 = buttons
  Object.keys(v19).forEach(function (k20) {
    var button = v19[k20]
    var display = button.active ? 'block' : 'none'
    var n21Child = []
    n21Child = n21Child.concat(button.txt)
    var props = {attributes: runtime.compileAttrs([{name:'class', val: 'btn'},{name:'class', val: 'btn-primary'},{name:'id', val: button.id},{name:'onclick', val: button.action},{name:'style', val: {display: display}}], [])};
    if (props.attributes.id) props.key = props.attributes.id;
    var n21 = h('button', props, n21Child)
    n18Child.push(n21)
  }.bind(this))
  var props = {attributes: runtime.compileAttrs([{name:'class', val: 'align-centre'}], [])};
  if (props.attributes.id) props.key = props.attributes.id;
  var n18 = h('div', props, n18Child)
  n10Child.push(n18)
  var props = {attributes: runtime.compileAttrs([{name:'class', val: 'tabContent'},{name:'class', val: 'surround'},{name:'id', val: 'videoSelection'},{name:'style', val: showTab === 'videoSelection' ? {display: 'block'} : {display: 'none'}}], [])};
  if (props.attributes.id) props.key = props.attributes.id;
  var n10 = h('div', props, n10Child)
  n1Child.push(n10)
  var n22Child = []
  var n23Child = []
  n23Child = n23Child.concat(recordingStatusMsg)
  var props = {attributes: runtime.compileAttrs([], [])};
  if (props.attributes.id) props.key = props.attributes.id;
  var n23 = h('p', props, n23Child)
  n22Child.push(n23)
  var n24Child = []
  var v25 = buttons
  Object.keys(v25).forEach(function (k26) {
    var button = v25[k26]
    var display = button.active ? 'block' : 'none'
    var n27Child = []
    n27Child = n27Child.concat(button.txt)
    var props = {attributes: runtime.compileAttrs([{name:'class', val: 'btn'},{name:'class', val: 'btn-primary'},{name:'id', val: button.id},{name:'onclick', val: button.action},{name:'style', val: {display: display}}], [])};
    if (props.attributes.id) props.key = props.attributes.id;
    var n27 = h('button', props, n27Child)
    n24Child.push(n27)
  }.bind(this))
  var props = {attributes: runtime.compileAttrs([{name:'class', val: 'align-centre'}], [])};
  if (props.attributes.id) props.key = props.attributes.id;
  var n24 = h('div', props, n24Child)
  n22Child.push(n24)
  if(audioUrl.length) {
    var v28 = audioUrl
    Object.keys(v28).forEach(function (k29) {
      var url = v28[k29]
      var n30Child = []
      var props = {attributes: runtime.compileAttrs([{name:'src', val: url},{name:'controls', val: 'controls'}], [])};
      if (props.attributes.id) props.key = props.attributes.id;
      var n30 = h('audio', props, n30Child)
      n22Child.push(n30)
      var n31Child = []
      var props = {attributes: runtime.compileAttrs([{name:'href', val: url}], [])};
      if (props.attributes.id) props.key = props.attributes.id;
      var n31 = h('a', props, n31Child)
      n22Child.push(n31)
    }.bind(this))
  }
  var props = {attributes: runtime.compileAttrs([{name:'class', val: 'tabContent'},{name:'class', val: 'surround'},{name:'id', val: 'audioSelection'},{name:'style', val: showTab === 'audioSelection' ? {display: 'block'} : {display: 'none'}}], [])};
  if (props.attributes.id) props.key = props.attributes.id;
  var n22 = h('div', props, n22Child)
  n1Child.push(n22)
  var props = {attributes: runtime.compileAttrs([], [])};
  if (props.attributes.id) props.key = props.attributes.id;
  var n1 = h('div', props, n1Child)
  n0Child.push(n1)
  pugVDOMRuntime.deleteExposedLocals()
  return n0Child
}

module.exports = render
