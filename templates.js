define(['handlebars'], function(Handlebars) {

this["JST"] = this["JST"] || {};

this["JST"]["nav"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<ol class=\"carousel__nav pagination pagination--carousel\">\n\n 	<li class=\"pagination__prev\"><a href=\"#\" data-goto=\"--\">Previous</a></li>\n\n	<li class=\"pagination__item\">\n		<span class=\"carousel__current-page-count\">1</span>\n		/\n		<span class=\"carousel__page-count\">";
  if (helper = helpers.pageCount) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pageCount); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n	</li>\n\n	<li class=\"pagination__next\"><a href=\"#\" data-goto=\"++\">Next</a></li>\n\n</ol>\n";
  return buffer;
  });

return this["JST"];

});