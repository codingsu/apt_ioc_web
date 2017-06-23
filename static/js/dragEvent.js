$(function(){
	if ($('.soutu-drop').length>0) {
		var dragContainer =$('.soutu-drop')[0];
		if (dragContainer.addEventListener) {
			//拖进
			dragContainer.addEventListener('dragenter',function(e){
				dragenterHandler(e)
			}, false);

			//拖离
			dragContainer.addEventListener('dragleave', function(e) {
				dragleaveHandler(e)
			}, false);

			//拖来拖去 
			dragContainer.addEventListener('dragover', function(e) {
				dragoverHandler(e)
			}, false);

			//扔下
			dragContainer.addEventListener('drop', function(e) {
				e.stopPropagation();
				e.preventDefault();
				$(".soutu-drop").removeClass("soutu-drop-dragover")
			
		 
				var files = e.target.files || e.dataTransfer.files;
				dropHandler(files)
			}, false);
		} else if(dragContainer.attachEvent){
			//拖进
			dragContainer.attachEvent('ondragenter',function(e){
				dragenterHandler(e)
			});

			//拖离
			dragContainer.attachEvent('ondragleave', function(e) {
				dragleaveHandler(e)
			});

			//拖来拖去 
			dragContainer.attachEvent('ondragover', function(e) {
				dragoverHandler(e)
			});

			//扔下
			dragContainer.attachEvent('ondrop', function(e) {
				e.returnValue = false
				// e.stopPropagation();
				// e.preventDefault();
				$(".soutu-drop").removeClass("soutu-drop-dragover")
			
		 
				var files = e.target.files || e.dataTransfer.files;
				dropHandler(files)
			});
		}
	};	
})



var dropHandler = function(files) {
	selectedFile =  files[0]
  selectedFileName =  selectedFile.name

	$('#no_file_info').addClass("hidden")
  $(".forFile").val(selectedFileName)

  if (files.length > 0) {
  	$(".forFile").css("font-weight","bold")
  	// $(".soutu-drop").addClass("soutu-drop-dragend")
  };
} 
// var dropHandler = function(e,files) {
// 	e.stopPropagation();
// 	e.preventDefault();
// 	$(".soutu-drop").removeClass("soutu-drop-dragover")
	
 
// 	var files = e.target.files || e.dataTransfer.files;

// 	var name = files[0].name
// 	$('#no_file_info').addClass("hidden")
//   $(".forFile").val(name)

//   selectedFile =  files[0]
//   selectedFileName =  files[0].name
// }  
var dragenterHandler = function(e){
　 if(e.preventDefault){
		e.preventDefault()
	}else {
		e.returnValue = false
	}
	// $(".soutu-drop").removeClass("soutu-drop-dragend")
	$(".soutu-drop").addClass("soutu-drop-dragover")

}
var dragleaveHandler = function(e){
		// var val = $("input.forFile").val()
		$(".soutu-drop").removeClass("soutu-drop-dragover")
		// alert(val)
		// if(val == ""){
			
		// } else {
		// 	$(".soutu-drop").addClass("soutu-drop-dragend")
		// }
　 	
}
var dragoverHandler = function(e){
	if(e.preventDefault){
		e.preventDefault()
	}else {
		e.returnValue = false
	}
　 $(".soutu-drop").addClass("soutu-drop-dragover")
}