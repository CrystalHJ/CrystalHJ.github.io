(function(){
	
//1.从localStorage先获取数据
var datas = tools.store('cloud');

//2.如果localStorage没有的话，现根据data里边的数据存到本地存储里边去
if(datas && !datas.files){
	datas = data;
	tools.store('cloud',datas);
}

//新建文件夹按钮
var createNew = tools.$("#creat-folder");
//放文件夹的盒子
var folderList = tools.$('#folder-list');
//用来记录点击的文件夹的id值
var hiddenInput = tools.$('.hiddenInput')[0];
//点击全选
var checkall = tools.$('#checkall');
//点击删除文件夹按钮
var deleteFolder = tools.$('#delate');
//点击重命名按钮
var rename = tools.$('#rename');
//点击复制按钮
var copyFolder = tools.$('#copyFolder');


//3.点击新建文件夹按钮创建新文件夹
var names = null
tools.addEvent(createNew,'click',function(){
	selectInpNum = 0;
	tools.each(allLi,function(itemLi){
		cancelStyle(itemLi);
		checkall.checked = false;
		operateList.style.display = 'none'; 
		checkallShow.style.display = 'none';
	})
	
	
	//正在新建状态的时候，再点击新建文件夹按钮无效
	if(this.isCreating){
		names.select();
		return;
	}
	if(rename.isRename){
		alert('处于重命名状态，不能新建');
		return;
	}
	//每次都要获取事件戳，用来当做新建的文件夹的唯一的id值
	var random = new Date().getTime();
	var newLi = createLi({
		id:random
	});
	this.isCreating = true;
	
	//新建的时候对一些样式进行操作
	var strong = tools.$('strong',newLi)[0];
	var editor = tools.$('.edtor',newLi)[0];
	names = tools.$('.names',newLi)[0];
	
	strong.style.display = 'none';
	editor.style.display = 'block';
	
	
	folderList.appendChild(newLi);
	names.select();
	//在新建的时候，要给新建的li添加handleLi,并且还要给页面当中的其他Li添加handleLi,在getPidChild中实现
	handleLi(newLi);
	
	
})

var navArr = [
	{
		name:'返回上一级',
	},
	{
		name:'全部文件',
		currentId:0
	}
]

//封函数，对新建的文件夹进行一些操作
function handleLi(newLi){
	var ok = tools.$('.ok',newLi)[0];
	var cancel = tools.$(".cancel",newLi)[0];
	var strong = tools.$('strong',newLi)[0];
	var editor = tools.$('.edtor',newLi)[0];
	var icon = tools.$(".icon",newLi)[0];
	var checkInput = tools.$(".checkInput",newLi)[0];
	var nameInput = tools.$('.names',newLi)[0];
	names = tools.$('.names',newLi)[0]
	
	
	//点击确定
	tools.addEvent(ok,'click',function(ev){
//		console.log(names)
		//如果是在新建文件夹状态的话存储数据到localStorage
		if(createNew.isCreating){
			strong.innerHTML = uniqueName(datas.files,names.value,hiddenInput.value);
			datas.files.push({
				name:strong.innerHTML,
				id:newLi.id,
				pid:hiddenInput.value
			})
			tools.store('cloud',datas);
			createNew.isCreating = false;
		}
		strong.style.display = 'block';
		editor.style.display = 'none';
		
		//!!注意阻止冒泡，因为点击确定或者取消都是在点击li，所以会发生冒泡
		ev.stopPropagation();
//		console.log(createNew.isCreating)
			
	})
	
	//按下回车键确定
//	tools.addEvent(nameInput,'keydown',function(ev){
//		if(ev.keyCode == 13){
//			strong.innerHTML = uniqueName(hiddenInput.value,names.value);
//			strong.style.display = 'block';
//			editor.style.display = 'none';
//			//如果是在新建文件夹状态的话存储数据到localStorage
//			if(createNew.isCreating){
//				datas.files.push({
//					name:strong.innerHTML,
//					id:newLi.id,
//					pid:hiddenInput.value
//				})
//				tools.store('cloud',datas);
//				createNew.isCreating = false;
//			}else if(rename.isRename){
//			//如果不是在新建文件夹状态，也就是重命名状态的话，更新localStorage里边该条数据的name值
//				
//			}
//			//!!注意阻止冒泡，因为点击确定或者取消都是在点击li，所以会发生冒泡
//			ev.stopPropagation();
//	//		console.log(createNew.isCreating)
//		}
//			
//	})
	
	//点击取消
	tools.addEvent(cancel,'click',function(ev){
		if(createNew.isCreating){
			folderList.removeChild(newLi);
			createNew.isCreating = false;
		}else{
			strong.style.display = 'block';
			editor.style.display = 'none';
		}
		ev.stopPropagation();
//		console.log(createNew.isCreating)
	})
	
	//鼠标移入
	tools.addEvent(newLi,'mouseenter',function(ev){
		if(!createNew.isCreating){
			icon.style.borderColor = '#2e80dc';
			checkInput.style.display = 'block';
		}
	})
	//鼠标移出
	tools.addEvent(newLi,'mouseleave',function(ev){
		if(!checkInput.checked){
			icon.style.borderColor = '#fff';
			checkInput.style.display = 'none';
		}
	})
	//给每li添加点击事件
	tools.addEvent(newLi,'click',function(){
		checkall.checked = false;
		selectInpNum = 0;
		checkallShow.style.display = 'none';
		operateList.style.display = 'none';
		hiddenInput.value = this.id;
		folderList.innerHTML = '';
		getPidChild(this.id);
		
		//网navArr数组里边push数据，并根据该数组渲染导航
		navArr.push({
			name:strong.innerHTML,
			currentId:this.id
		})
//		console.log(navArr);
		renderNav(navArr);
	})
	//单选/////////////////////////////////////////////////////////////////////////////////////////
	checkInputs = tools.$(".checkInput",folderList);

	tools.addEvent(checkInput,'click',function(ev){
		if(this.checked){
			selectInpNum++;
//			console.log(selectInpNum)
			checkall.checked = true;
			tools.each(checkInputs,function(item,index){
				if(!item.checked){
					checkall.checked = false;
				}
			})
			operateList.style.display = 'block';
			checkallShow.style.display = 'inline-block';
		}else{
			checkall.checked = false;
			selectInpNum--;
			if(selectInpNum == 0){
				operateList.style.display = 'none';
				checkallShow.style.display = 'none';
			}
			choiceFolder.innerHTML = selectInpNum;
		}
		choiceFolder.innerHTML = selectInpNum;
		ev.stopPropagation();
		
	})
}

//封函数，新建文件夹
function createLi(options){
//做兼容，防止报错
	options = options || {};
	var defaults = {
		name:options.name || '新建文件夹',
		id:options.id || 0,
		pid:options.pid || 0
	}
	
	var li = document.createElement('li');
	var str = '<div class="icon">'
							+'<input type="checkbox"  class="checkInput" />'
						+'</div>'
						+'<strong>'+defaults.name+'</strong>'
						+'<div class="clearFix edtor">'
							+'<input type="text" value="'+defaults.name+'" class="names"  />'
							+'<input type="button" value="√" class="ok" />'
							+'<input type="button" value="×" class="cancel" />'
						+'</div>';
	li.innerHTML = str;
	li.id = defaults.id;
	return li;
}

//初始化页面
getPidChild(0);
//封函数，通过父id找到并渲染子目录
function getPidChild(id){
	tools.each(datas.files,function(item,index){
		if(item.pid == id){
			var newLi = createLi({
				name:item.name,
				id:item.id,
				pid:id
			});
			folderList.appendChild(newLi);
			handleLi(newLi);
		}
	})
}

//封函数判断是否重名
function uniqueName(arr,name,pid){
	var arr1 = [];
	var arr2 = [];
	var arr3 = [];
	var arr4 = [];
	var num1 = 0;
	for (var i = 0; i < arr.length; i++) {
		if(arr[i].pid == pid && arr[i].name.indexOf(name) != -1){
			arr1.push(arr[i]);
		}
	};
//	console.log(arr1);
	if(arr1.length == 0){
		return name;
	}
	for (var i = 0; i < arr1.length; i++) {
		arr2.push(arr1[i].name);
	};
	
//	console.log(arr2);
	//["新建文件夹","新建文件夹(5)","新建文件夹(2)","新建文件夹(3)","新建文件夹(4)"]
	for (var i = 0; i < arr2.length; i++) {
		if(arr2[i] == name){
			arr3.push(0);
		}else{
			
			arr3.push(arr2[i].split('(')[1].replace(/\)$/g,''));
		}
	};
	
//	console.log(arr3);
	if(arr3.length == 1 && arr3[0] == 0){
		return name+'(1)';
	}
	//[0,5,2,3,4,7,10]
	for (var i = 0; i < arr3.length; i++) {
		arr3[i] = Number(arr3[i]);
	}
	var num = Math.max.apply(Math,arr3);
	if(arr3.indexOf(0) != -1 && arr3.length == num+1){
		return name+'('+(num+1)+')'
	}
//	console.log(num);
	
	
	for (var i = 0; i <= num; i++) {
		if(arr3.indexOf(i) == -1){
			arr4.push(i);
		}
	}
//	console.log(arr4);
	return arr4[0]==0?name:name+'('+arr4[0]+')';
//		return name+'('+arr4[0]+')';
}

//点击全选按钮，全部选中或者取消选中当前页面的所有input
var allLi = tools.$('li',folderList);//当前页面中所有文件夹li
var icons = tools.$('.icon',folderList);
var checkInputs = tools.$(".checkInput",folderList);
var selectInpNum = 0;//定义变量，用来计算被选中的checkInputs个数
var checkallShow = tools.$('.checkall-show')[0];
var choiceFolder = tools.$("#choice-folder");
var operateList = tools.$(".operate-list")[0];

tools.addEvent(checkall,'click',function(){
	var _this = this;
	tools.each(allLi,function(item,index){
		icons[index].style.borderColor = _this.checked ? '#2e80dc' : '#fff';
		checkInputs[index].style.display = _this.checked ? 'block' : 'none';
		checkInputs[index].checked = _this.checked;
	})
	selectInpNum = this.checked ? allLi.length : 0;
	operateList.style.display = this.checked ? 'block' : 'none';
	checkallShow.style.display = this.checked ? 'inline-block' : 'none';
	choiceFolder.innerHTML = allLi.length;
	
})

//框选
tools.addEvent(folderList,'mousedown',function(ev){
	ev.preventDefault();//阻止默认事件
	var target = ev.target;
	
	//事件源目标找到为li
	if( target = tools.parents(target,"LI") ){
		var checkInput = tools.$(".checkInput",target)[0];
		
		if( checkInput.checked ) return;
	};
	checkall.checked = false;
	
	var lis = tools.$('li',folderList);
	var disX = ev.clientX;
	var disY = ev.clientY;
	var newDiv = null;
	tools.addEvent(document,'mousemove',moveHandle);
	tools.addEvent(document,'mouseup',upHandle);
	
	function upHandle(){
		tools.removeEvent(document,'mousemove',moveHandle);
		tools.removeEvent(document,'mouseup',upHandle)
		//移除生成的DIV
		if(newDiv){
			document.body.removeChild(newDiv);
		}
		if(selectInpNum == 0){
			checkall.checked = false;
			checkallShow.style.display = 'none';
			operateList.style.display = 'none';
			choiceFolder.innerHTML = 0;
		}
	};
	function moveHandle(ev){
		var w = ev.clientX-disX;
		var h = ev.clientY-disY;
		
		
		if(Math.abs(w) > 5 || Math.abs(h) > 5){
			if(!newDiv){
				newDiv = document.createElement('div');
				newDiv.className = 'collision';
				document.body.appendChild(newDiv);
			}
			
			var x = w < 0 ? ev.clientX : disX;
			var y = h < 0 ? ev.clientY : disY;
			
			newDiv.style.left = x +'px';
			newDiv.style.top = y +'px';
			
			newDiv.style.width = Math.abs(w)+'px';
			newDiv.style.height = Math.abs(h)+'px';
			selectInpNum = 0;
			tools.each(lis,function(item,index){
				if(collisionTest(newDiv,item)){
					manipulateLi(item,true);
					//当有了文件夹被选中的时候，checkallShow&operateList都要display为block
					checkallShow.style.display = 'inline-block';
					operateList.style.display = 'block';
					
					selectInpNum++;
					
					choiceFolder.innerHTML = selectInpNum;
				}else{
					manipulateLi(item);
				}
			})
			if(selectInpNum == lis.length){
				checkall.checked = true;
			}
		}
			
	};	
})

function cancelStyle(li){
	var icon = tools.$('.icon',li)[0];
	var checkInput = tools.$('.checkInput',li)[0];
	
	icon.style.borderColor = '#fff';
	checkInput.style.display = 'none';
	checkInput.checked = false;
}

function collisionTest(obj1,obj2){
	var pos1 = obj1.getBoundingClientRect();
	var pos2 = obj2.getBoundingClientRect();
	if(pos1.right < pos2.left || pos1.bottom <pos2.top || pos1.left > pos2.right || pos1.top > pos2.bottom){
		return false;//没碰撞到
	}
	return true;
}

function manipulateLi( li,bl ){
	var icon = tools.$(".icon",li)[0];	
	var checkInput = tools.$(".checkInput",li)[0];	
	if( bl ){
		icon.style.borderColor = "#2e80dc";
		checkInput.style.display = "block";
		checkInput.checked = true;
	}else{
		icon.style.borderColor = "#fff";
		checkInput.style.display = "none";
		checkInput.checked = false;
	}
};

//封函数，渲染导航
var mainAll = tools.$('#main-all');
var showAll = tools.$('#show-all');
var handleFolder = tools.$('div',mainAll)[0];
//console.log(handleFolder)
function renderNav(navArr,startIndex){
	var str = '';
	startIndex = startIndex || 0;
	showAll.style.display = 'none';
	handleFolder.style.display = 'block';
	for(var i = startIndex;i<navArr.length-1;i++){
		if(i == 0){
			str += '<a href="javascript:;" index="'+navArr[navArr.length-2].currentId+'">'+navArr[i].name+'</a>'+'<span>|</span>';
		}else{
			str += '<a href="javascript:;" index="'+navArr[i].currentId+'">'+navArr[i].name+'</a>'+'<span>></span>';
		}
	}
	str +=  '<span>'+navArr[navArr.length-1].name+'</span>';
	handleFolder.innerHTML = str; 

}

//导航的事件处理,因为每点击一次文件夹，导航都是重新渲染的，所以用事件委托比较好，防止出现每次重新渲染导航a标签上的事件又没有了
tools.addEvent(handleFolder,'click',function(ev){
	var target = ev.target;
	if(target.nodeName == 'A'){
		var currentId = target.getAttribute('index');
		hiddenInput.value = currentId;
		
//		navArr = ['返回上一级'，'全部文件'，'我的资源','新建文件夹']
			folderList.innerHTML = '';
			getPidChild(currentId);
			
			//循环数组中的所有项 判断出当前点击的id和数组中id是否一致

			// ["1"，2,3,4,5] length
			// ["上"，“全”]
			
			tools.each(navArr,function (item,index){
				if( item.currentId == currentId ){
					navArr.length = index+1;
				}
			});
			//如果点击的是 全部文件 那么从第二个开始渲染
			var startIndex = 0;
			if( currentId == 0 ){
				startIndex = 1;
			}
			renderNav(navArr,startIndex);
	}
})

//删除文件夹功能，点击删除文件夹按钮。。删除要做的事情就是删除数据，存储新数据到localStorage，然后刷新页面
tools.addEvent(deleteFolder,'click',function(){
//	alert(hiddenInput.value);
	var deleteArr = [];
	tools.each(allLi,function(item,index){
		var checkInput = tools.$('.checkInput',item)[0];
		if(checkInput.checked){
			var name = tools.$('strong',item)[0].innerHTML;
			deleteArr.push(name);
		}
	})
	
	deletedata(hiddenInput.value,deleteArr);
	tools.store('cloud',datas);
	folderList.innerHTML = '';
	getPidChild(hiddenInput.value);
})
//封装函数，用以删除数据
//！！！！注意，不但要删除被选中的文件夹，还要删除选中的文件夹里边的子文件夹，所以封函数需要用递归
function deletedata(hiddenInput,arr){
	for (var i = 0; i < arr.length; i++) {
		for (var j = 0; j < datas.files.length; j++) {
			if(datas.files[j].pid == hiddenInput && datas.files[j].name == arr[i]){
				var arr1 = [];
				var hiddenInput1 = datas.files[j].id;
				for (var k = 0; k < datas.files.length; k++) {
					if(datas.files[k].pid == hiddenInput1){
						arr1.push(datas.files[k].name);
					}
				}
				deletedata(hiddenInput1,arr1)
				datas.files.splice(j,1);
			}
		}
	}
}

//点击重命名按钮进行重命名
tools.addEvent(rename,'click',function(){
	//添加一个自定义属性，标记现在正处于重命名状态
	this.isRename = true;
	var arr = [];
	tools.each(allLi,function(item,index){
		var checkInput = tools.$('.checkInput',item)[0];
		if(checkInput.checked){
			arr.push(item);
		}
	})
	 if(arr.length>1){
	 	alert('选中了多个文件夹，当前不能进行重命名操作');
	 	return;
	 }else if(arr.length == 1){
	 	var strong1 = tools.$('strong',arr[0])[0];
	 	var editor1 = tools.$('.edtor',arr[0])[0];
	 	var names1 = tools.$('.names',editor1)[0];
	 	var ok1 = tools.$('.ok',editor1)[0];
	 	var cancel1 = tools.$('.cancel',editor1)[0];
	 	strong1.style.display = 'none';
	 	editor1.style.display = 'block';
	 	names1.select();
	 	
	 	//在重命名的时候点击ok只需要更新数据库里边的对应数据的name就可以了
	 	tools.addEvent(ok1,'click',function(){
	 		console.log(names1.value+'1111111');
	 		strong1.innerHTML = uniqueName(datas.files,names1.value,hiddenInput.value);
	 		tools.each(datas.files,function(item,index){
				if(item.id == arr[0].id){
					item.name = strong1.innerHTML;
				}
			})
	 		tools.store('cloud',datas);
	 		rename.isRename = false;
	 	})
	 }
})

var treeBox = tools.$('.treeBox')[0];
var treeList = tools.$('.treeList')[0];
var closeTreeBox = tools.$('.closeTreeBox');
var donotBtn = tools.$('.donotBtn')[0];
var doBtn = tools.$('.doBtn')[0];
//console.log(closeTreeBox,donotBtn)
//点击复制按钮
var copyPid = 0;
tools.addEvent(copyFolder,'click',function(){
	//在点击复制按钮的时候，把要复制的文件文件夹的名字和pid放到数组里边去
	var copyArr = [];
	copyPid = 0;
	//遍历folderList里边所有的li
	tools.each(allLi,function(item,index){
		var checkInput = tools.$('.checkInput',item)[0];
		if(checkInput.checked){
			var strong = tools.$('strong',item)[0];
			copyArr.push(strong.innerHTML);
		}
	})
//	console.log(copyArr);
	treeBox.style.display = 'block';
	//生成树形菜单内容
	treeList.innerHTML = '';
	treeList.innerHTML = createTreeMenu(datas.files,0);
	var aH5 = tools.$('h5',treeList);
	handleTreeMenu(aH5);
	//为什么会报错
//	tools.addEvent(closeTreeBox,'click',function(){
//		treeBox.style.display = 'none';
//	})
	tools.addEvent(donotBtn,'click',function(){//点击取消按钮
		treeBox.style.display = 'none';
	});
	tools.addEvent(doBtn,'click',function(){
		treeBox.style.display = 'none';
		if(copyPid == hiddenInput.value){
			alert('不能复制到当前文件夹及子目录下');
			return;
		}else{
			var random = new Date().getTime();
			var dataUnderCopyPid = [];
			//在存数据之前我还要判断一下datas里边pid = copyPid的数据的名字有没有跟要复制进去的文件夹目录重名的
			tools.each(datas.files,function(item,index){
				if(item.pid == copyPid){
					dataUnderCopyPid.push(item);
				}
			});
			
			for (var i = 0; i < copyArr.length; i++) {
				for (var j = 0; j < dataUnderCopyPid.length; j++) {
					if(dataUnderCopyPid[j].name == copyArr[i]){
						copyArr[i] = uniqueName(datas.files,copyArr[i].split('(')[0],copyPid);
						alert('要移入的文件夹中与当前复制的文件夹重名');
						break;
						console.log(1)
					}
				}
			}
			
			for (var i = 0; i  < copyArr.length; i++) {
				datas.files.push({
					id:random++,
					pid:copyPid,
					name:copyArr[i]
				})
			}
			tools.store('cloud',datas);
		}
		console.log(copyArr,dataUnderCopyPid);
	})
})

function createTreeMenu(data,pid){
	var str = '';
	for (var i = 0; i < datas.files.length; i++) {
		if(datas.files[i].pid == pid){
			var arr = [];
			for (var j = 0; j < datas.files.length; j++) {
				if(datas.files[j].pid == datas.files[i].id){
					arr.push(datas.files[j]);
				}
			}
			if(arr.length != 0){
				str += '<li><h5 id="'+datas.files[i].id+'" pid="'+datas.files[i].pid+'"><span>+</span>'+datas.files[i].name+'</h5>';
			}else{
				str += '<li><h5 id="'+datas.files[i].id+'" pid="'+datas.files[i].pid+'">'+datas.files[i].name+'</h5>';
			}
			if(arr != []){
				str += '<ul>';
				str += createTreeMenu(arr,datas.files[i].id);
				str += '</ul>';
			}
			str += '</li>';
		}
	}
	return str;
}
function handleTreeMenu(aH5){
	for (var i = 0; i < aH5.length; i++) {
		aH5[i].addEventListener('click',function(){
			copyPid = this.id;
//			console.log(copyPid);
			tools.each(aH5,function(item,index){
				item.className = '';
			})
			this.className = 'active';
			var next = this.nextElementSibling;
//			console.log(next);
			var parent = this.parentNode.parentNode;
			if(next.children.length != 0){
				for (var i = 0; i < parent.children.length; i++) {
					if(parent.children[i] != this.parentNode){
						var aUl = parent.children[i].getElementsByTagName('ul');
						for (var j = 0; j < aUl.length; j++) {
							aUl[j].className = 'hide';
							if(aUl[j].children.length != 0){
								aUl[j].previousElementSibling.getElementsByTagName('span')[0].innerHTML = '+';
							}
						}
					}
				}
				
				var oSpan = this.getElementsByTagName('span')[0];
				next.className = next.className.indexOf('show') == -1?'show':'hide';
				var nextUl = next.getElementsByTagName('ul');
				for (var m = 0; m < nextUl.length; m++) {
					if(next.className.indexOf('hide') != -1){
						nextUl[m].className = 'hide';
						if(nextUl[m].children.length != 0){
							nextUl[m].previousElementSibling.getElementsByTagName('span')[0].innerHTML = '+';
						}
					}
				}
				oSpan.innerHTML = next.className.indexOf('show') == -1?'+':'-';
			}
		})
	}
}




























})();
