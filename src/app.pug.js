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
    n18Child.push(createVideoButtons());
    var props = {attributes: runtime.compileAttrs([{name:'class', val: 'align-centre'}], [])};
    if (props.attributes.id) props.key = props.attributes.id;
    var n18 = h('div', props, n18Child)
    n10Child.push(n18)
    n1Child.push(displayTab(showTab, 'videoSelection', n10Child));
    var n19Child = []
    var n20Child = []
    n20Child = n20Child.concat(recordingStatusMsg)
    var props = {attributes: runtime.compileAttrs([], [])};
    if (props.attributes.id) props.key = props.attributes.id;
    var n20 = h('p', props, n20Child)
    n19Child.push(n20)
    var n21Child = []
    n21Child.push(createAudioButtons());
    var props = {attributes: runtime.compileAttrs([{name:'class', val: 'align-centre'}], [])};
    if (props.attributes.id) props.key = props.attributes.id;
    var n21 = h('div', props, n21Child)
    n19Child.push(n21)
    if(audioUrl.length) {
      var v22 = audioUrl
      Object.keys(v22).forEach(function (k23) {
        var url = v22[k23]
        var n24Child = []
        var props = {attributes: runtime.compileAttrs([{name:'src', val: url},{name:'controls', val: 'controls'}], [])};
        if (props.attributes.id) props.key = props.attributes.id;
        var n24 = h('audio', props, n24Child)
        n19Child.push(n24)
        var n25Child = []
        var props = {attributes: runtime.compileAttrs([{name:'href', val: url}], [])};
        if (props.attributes.id) props.key = props.attributes.id;
        var n25 = h('a', props, n25Child)
        n19Child.push(n25)
      }.bind(this))
    }
    n1Child.push(displayTab(showTab, 'audioSelection', n19Child));
  function displayTab(showTab, tabName, __block) {
    var n26Child = []
    if((showTab === tabName)) {
      var n27Child = []
      n27Child.push(__block);
      var props = {attributes: runtime.compileAttrs([{name:'class', val: 'tabContent'},{name:'class', val: 'surround'},{name:'id', val: tabName},{name:'style', val: {display: 'block'}}], [])};
      if (props.attributes.id) props.key = props.attributes.id;
      var n27 = h('div', props, n27Child)
      n26Child.push(n27)
    } else {
      var n28Child = []
      n28Child.push(__block);
      var props = {attributes: runtime.compileAttrs([{name:'class', val: 'tabContent'},{name:'id', val: tabName},{name:'style', val: {display: 'none'}}], [])};
      if (props.attributes.id) props.key = props.attributes.id;
      var n28 = h('div', props, n28Child)
      n26Child.push(n28)
    }
    return n26Child
  }
  function createAudioButtons(__block) {
    var n29Child = []
    var v30 = audioButtons
    Object.keys(v30).forEach(function (k31) {
      var button = v30[k31]
      var display = button.active === audioState.value ? 'block' : 'none'
      var n32Child = []
      n32Child = n32Child.concat(button.txt)
      var props = {attributes: runtime.compileAttrs([{name:'class', val: 'btn'},{name:'class', val: 'btn-primary'},{name:'id', val: button.id},{name:'onclick', val: button.action},{name:'style', val: {display: display}}], [])};
      if (props.attributes.id) props.key = props.attributes.id;
      var n32 = h('button', props, n32Child)
      n29Child.push(n32)
    }.bind(this))
    return n29Child
  }
  function createVideoButtons(__block) {
    var n33Child = []
    var v34 = videoButtons
    Object.keys(v34).forEach(function (k35) {
      var button = v34[k35]
      var display = button.active === videoState.value ? 'block' : 'none'
      var n36Child = []
      n36Child = n36Child.concat(button.txt)
      var props = {attributes: runtime.compileAttrs([{name:'class', val: 'btn'},{name:'class', val: 'btn-primary'},{name:'id', val: button.id},{name:'onclick', val: button.action},{name:'style', val: {display: display}}], [])};
      if (props.attributes.id) props.key = props.attributes.id;
      var n36 = h('button', props, n36Child)
      n33Child.push(n36)
    }.bind(this))
    return n33Child
  }
  var props = {attributes: runtime.compileAttrs([], [])};
  if (props.attributes.id) props.key = props.attributes.id;
  var n1 = h('div', props, n1Child)
  n0Child.push(n1)
  pugVDOMRuntime.deleteExposedLocals()
  return n0Child
}

module.exports = render
