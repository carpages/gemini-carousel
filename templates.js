define(['handlebars'], function(Handlebars) {

this["gemini"] = this["gemini"] || {};
this["gemini"]["carousel"] = this["gemini"]["carousel"] || {};

this["gemini"]["carousel"]["nav"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<ol class=\"carousel__nav pagination pagination--carousel\">\n\n 	<li class=\"pagination__prev\"><a href=\"#\" data-goto=\"--\">Previous</a></li>\n\n	<li class=\"pagination__item\">\n		<span class=\"carousel__current-page-count\">1</span>\n		/\n		<span class=\"carousel__page-count\">"
    + this.escapeExpression(((helper = (helper = helpers.pageCount || (depth0 != null ? depth0.pageCount : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"pageCount","hash":{},"data":data}) : helper)))
    + "</span>\n	</li>\n\n	<li class=\"pagination__next\"><a href=\"#\" data-goto=\"++\">Next</a></li>\n\n</ol>\n";
},"useData":true});

return this["gemini"];

});