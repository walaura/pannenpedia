var random = require('lib/random.js');
var types = ['blackout','table','photo','photofs'];

var posts = [];


var makeCss = function() {

	var css = require('template/post.css');

	var alignments = ['left','right'];
	var alignmentsWithCenter = ['left','right','center'];
	var verticalAlignments = ['top','bottom'];

	var alignment = random(alignments);
	var verticalAlignment = random(verticalAlignments);

	css = css
	.replace(new RegExp('-@align-vertical-alt-', 'g'),verticalAlignment)
	.replace(new RegExp('-@align-vertical-', 'g'),verticalAlignment === verticalAlignments[0]?verticalAlignments[1]:verticalAlignments[0])
	.replace(new RegExp('-@align-with-center-', 'g'),random(alignmentsWithCenter))
	.replace(new RegExp('-@align-alt-', 'g'),alignment)
	.replace(new RegExp('-@align-', 'g'),alignment === alignments[0]?alignments[1]:alignments[0])
	.replace(new RegExp('-@negaposi-alt-', 'g'),random(['-','']))
	.replace(new RegExp('-@negaposi-', 'g'),random(['-','']));

	css = css
	.replace(/\-@\-maybe\-\{([\s\S]+?)\}/mg,function(match,m1){
		return Math.random()>.5?m1:'';
	})

	$('head').append(
		$('<style></style>').text(css)
	);
}


var makePost = function() {

	var $post = $('<post></post>');

	var type = 0;

	/*art*/
	var rq = $.get('https://en.wikipedia.org/wiki/Special:Random');

	rq.done(function(data){
		var $data = $(data);
		var text = $($data.find('#mw-content-text p:not(:empty)')[0]).text().replace(/\[[0-9*]\]/gi,'');
		if(text.indexOf('.') > 60) { text = text.substr(0,text.indexOf('.'));}


		var imgSrc = $(random($data.find('#bodyContent img'))).attr('src');
		var title = $data.find('h1').text();
		var dataSize = random([1,2,3]);
		var $infobox = $data.find('.infobox tbody');

		if(imgSrc && imgSrc.length > 0) type = random([0,0,2,2,3]);
		if(type === 0 && $infobox.length > 0) type = 1;
		if(type === 0) type = 4;

		if(type == 1) {
			var actualData = {}
			$infobox.children().each(function(){
				if($(this).children().length === 2) {
					if(Object.keys(actualData).length < dataSize) {
						actualData[$($(this).children()[0]).text()] = $($(this).children()[1]).text()
					}
				}
			})
			var $table = '<table><thead><tr><td>'+title+'</td></tr></thead><tbody>';
			for(var i in actualData) {
				$table += '<tr><td>'+i+'</td><td>'+actualData[i]+'</td></tr>';
			}
			$table +='</tbody></table>';
			$post.append($('<infobox></infobox>').append($table));
		}
		else if(type === 2 ){
			$post.append($('<img class="cover">').attr('src','http:'+imgSrc));
		}
		else if(type === 3 ){
			$post.append($('<cover></cover>').css('background-image','url(http:'+imgSrc+')'));
			$post.addClass('fs');
		}
		else {
			$post.addClass('bk');
			$post.append($('<title></title>').text(text));
		}
		$post.append($('<caption></caption>').text(text));

		posts.push({
			'title': title
		})

	});

	$('body').append($post);

}


module.exports = (function(){

	var lib = {};

	lib.makePost = makePost;
	lib.posts = posts;

	makeCss();

	return lib;
})()
