#!/usr/bin/env node

/*eslint-disable no-multi-str */
var exec = require('child_process').exec
var content = '\
<div id="contentWrapper" class="wrapper">\
\r\t\t\t{{> insideContent }}\
\r\t\t\t<div id="content">\
\r\t\t\t\t{{{ content }}}\
\r\t\t\t</div>\
\r\t\t\t{{> afterBody }}\
\r\t\t</div>'

var cmd = "sed -i \
-e 's${{{ content }}}$" + content + "$g' \
-e 's${{{ topOfPage }}}${{> topOfPage }}$g' \
-e 's${{{ head }}}${{> head }}$g' \
-e 's${{{ bodyStart }}}${{> bodyStart }}$g' \
-e 's${{{ cookieMessage }}}${{> cookieMessage }}$g' \
-e 's${{{ insideHeader }}}${{> insideHeader }}$g' \
-e 's${{{ propositionHeader }}}${{> propositionHeader }}$g' \
-e 's${{{ afterHeader }}}${{> afterHeader }}$g' \
-e 's${{{ footerTop }}}${{> footerTop }}$g' \
-e 's${{{ footerSupportLinks }}}${{> footerSupportLinks }}$g' \
-e 's${{{ bodyEnd }}}${{> bodyEnd }}$g' \
views/layouts/govuk_template.html"

exec(cmd, function (err) {
  if (err) {
    throw err
  }
})
