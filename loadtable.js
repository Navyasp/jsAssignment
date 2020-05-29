function LoadTable(doc, container, url) {
	this.doc = doc;
  this.url = url;
  this.pageNumber = 2;
	this.container = container;
  this.moreItemsBtn = this.doc.querySelector('.nextPage');
	this.prevItemsBtn = this.doc.querySelector('.previousPage');
  this.onNextPageClick = this.onNextPageClick.bind(this);
  this.onPreviousPageClick = this.onPreviousPageClick.bind(this);
  this.onHideButton = this.onHideButton.bind(this);
	this.container.addEventListener('click', this.onHideButton, false);
}


function getUrl(url) {
	return url.replace('http://','').replace('https://','').split('/')[0];
}


function drawGraph(xArray,dataArray){
  var title = {
    text: ''
 };
 var subtitle = {
    text: ''
 };
  var xAxis = {
     categories: xArray
 };
 var yAxis = {
  title: {
    text: 'Votes'
 },
};

 var series =  [
    {
       name:"ID",
       data: dataArray
    }
 ];

 var json = {};
 json.title = title;
 json.subtitle = subtitle;
 json.xAxis = xAxis;
 json.yAxis = yAxis;
 json.series = series;

 $('#highchart').highcharts(json);
}

LoadTable.prototype.hideValue = (function(id) {
  let removeData = JSON.parse(localStorage.getItem("post"));
    let d = removeData.filter(remove => remove.objectID !== id)

   return  localStorage.setItem("post",JSON.stringify(d))

})

LoadTable.prototype.onHideButton = (function(e) {
	let targetRow = e.target.closest('tr');
	this.hideValue(targetRow.dataset.id);
		targetRow.style.display = 'none';

})


LoadTable.prototype.onNextPageClick = (function(e) {
	this.pageNumber += 1;
	this.load();
})

LoadTable.prototype.onPreviousPageClick = (function(e) {
	this.pageNumber -= 1;
	this.load();
})

LoadTable.prototype.renderTable = (function(data) {
    let tbody = document.createElement('tbody');
	  let	value = data, xArray = [],dataValue = [],todos=[];
    tbody.classList.add('listvalues');
    for (const key in value) {
      let todo = value[key];
      let domain;
      if(todo.url != null){
         domain =  getUrl(todo.url);
      }
    todos.push({ id: key,
      author: todo.author,
      num_comments:todo.num_comments,
      title:todo.title,
      points:todo.points,
      url:todo.url && todo.url.replace('http://','').replace('https://','').split('/')[0],
      time:todo.created_at

   });
    localStorage.setItem("post",JSON.stringify(todos))
    xArray.push(todo.num_comments);
    dataValue.push(todo.points)
		let tableCreate = `<tr data-id="${todo.objectID}" class="table-list">
			<td><span class="comments">${todo.num_comments}</span><td>
			<td><span class="points">${todo.points}</span></td>&emsp;&emsp;
			<td><a aria-label="Upvote button" className="upvote-button">&#x25B4;</a></td>
			<td>
				<span class="title">${todo.title}</span>
				<span class="domain">(${domain})</span> by
				<span class="author">${todo.author}</span>
				<span class="createdat"> ${convertTime(todo.created_at)} <span>
        <span>[<button aria-label="Hide button" class="hide-button">hide</button>]</span>

			</td>
		</tr>`

		let tablelist = document.createElement('tbody');
    tablelist.innerHTML = tableCreate;
    tbody.appendChild(tablelist.firstChild);
	}
	this.container.innerHTML = '';
  this.container.appendChild(tbody);
  this.moreItemsBtn.addEventListener('click', this.onNextPageClick, false)
  this.prevItemsBtn.addEventListener('click', this.onPreviousPageClick, false)
  drawGraph(xArray,dataValue);

});

LoadTable.prototype.load = (function() {
  let url = this.url + this.pageNumber;
    fetch(url)
    .then(res=>res.json())
		.then(result=>this.renderTable(result.hits))
})
