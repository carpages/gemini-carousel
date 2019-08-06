(function(factory) {

if (typeof define === 'function' && define.amd) {

define(['handlebars'], factory);

} else if (typeof exports === 'object') {

module.exports = factory(require('handlebars'));

} else {

factory(Handlebars);

}

}(function(Handlebars) {

this["Templates"] = this["Templates"] || {};
this["Templates"]["Default"] = this["Templates"]["Default"] || {};
this["Templates"]["Default"]["Carousel"] = this["Templates"]["Default"]["Carousel"] || {};

this["Templates"]["Default"]["Carousel"]["nav"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<ol class=\"carousel__nav pagination pagination--carousel\">\n\n 	<li class=\"pagination__prev\"><a href=\"#\" data-goto=\"--\">Previous</a></li>\n\n	<li class=\"pagination__item\">\n		<span class=\"carousel__current-page-count\">1</span>\n		/\n		<span class=\"carousel__page-count\">"
    + container.escapeExpression(((helper = (helper = helpers.pageCount || (depth0 != null ? depth0.pageCount : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pageCount","hash":{},"data":data}) : helper)))
    + "</span>\n	</li>\n\n	<li class=\"pagination__next\"><a href=\"#\" data-goto=\"++\">Next</a></li>\n\n</ol>\n";
},"useData":true});

return this["Templates"]["Default"]["Carousel"];

}));