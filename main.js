const prettier = require("prettier")

const prettier_dm = new dropMenu({
	id:"prettier_dm"
});
prettier_dm.setList({
  "button": "Prettier",
  "list":{
  	"Format":{
		  click:function(){
            if(graviton.getCurrentEditor() == null) {
                new Notification("Issue","Open a file before formatting.");
                return;
            }
            if(graviton.getCurrentEditor().path == null || graviton.getCurrentEditor().type!="text") {
                new Notification("Issue","Cannot format the current file.");
                return;
            }
            
            switch(getFormat(path.basename(graviton.getCurrentFile().path))){
                case"js":
                    graviton.getCurrentEditor().editor.setValue(prettier.format(editor.getValue(), { semi: false, parser: "babel" }));
                    return;
                case"css":
                    graviton.getCurrentEditor().editor.setValue(prettier.format(editor.getValue(), { semi: false, parser: "css" }));
                    return;
                case"html":
                    graviton.getCurrentEditor().editor.setValue(prettier.format(editor.getValue(), { semi: false, parser: "html" }));
                    return;
                case"markdown":
                    graviton.getCurrentEditor().editor.setValue(prettier.format(editor.getValue(), { semi: false, parser: "html" }));
                    return;
                default:
                    new Notification("Issue","The current language is not supported.");
            }
           
		  }
	  }
  }
})