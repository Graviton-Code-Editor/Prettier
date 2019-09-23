const prettier = require("prettier")

const default_config = { semi: false , useTabs:true }

const prettier_instance = new Plugin({
  name: "Prettier"
})

prettier_instance.createData(default_config)

prettier_instance.getData(function(data) {
  let configuration = data

  const prettier_dm = new dropMenu({
    id: "prettier_dm"
  })

  prettier_dm.setList({
    button: "Prettier",
    list: {
      Configuration: {
        click: function() {
          if (configuration != undefined) delete configuration.parser
          console.log(configuration)
          const config_window = new Window({
            id: Math.random(),
            content: `
                <div class=section1>
                    <h1>Prettier<h1>
                    <div class=section1>
                        <textarea id=textarea_config>${JSON.stringify(
                          configuration
                        )}</textarea>
                    </div>
                    <button class=button1 id=save_config>Save</button1>
                    <button class=button1 id=restart_config>Restart</button1>
                </div>
                `
          })
          config_window.launch()
          document.getElementById("save_config").onclick = function() {
            try {
              configuration = JSON.parse(
                document.getElementById("textarea_config").value
              )
            } catch {
              new Notification({
                title:'Prettier',
                content:'There were an error while parsing the configuration.'
              })
            }

            prettier_instance.saveData(configuration)
          }
          document.getElementById("restart_config").onclick = function() {
            document.getElementById("textarea_config").value = JSON.stringify(
              default_config
            )
            configuration = default_config
            prettier_instance.saveData(default_config)
          }
        }
      },
      Format: {
        click: function() {
          if (graviton.getCurrentEditor() == null) {
            new Notification({title:"Issue", content: "Open a file before formatting."})
            return
          }
          if (
            graviton.getCurrentEditor().path == null ||
            graviton.getCurrentEditor().type != "text"
          ) {
            new Notification({title:"Issue",content: "Cannot format the current file."})
            return
          }

          switch (getFormat(path.basename(graviton.getCurrentFile().path)).format) {
            case "js":
              configuration.parser = "babel"
              graviton
                .getCurrentEditor()
                .editor.setValue(
                  prettier.format(editor.getValue(), configuration)
                )
              return
            case "css":
              configuration.parser = "css"
              graviton
                .getCurrentEditor()
                .editor.setValue(
                  prettier.format(editor.getValue(), configuration)
                )
              return
            case "html":
              configuration.parser = "html"
              graviton
                .getCurrentEditor()
                .editor.setValue(
                  prettier.format(editor.getValue(), configuration)
                )
              return
            case "md":
              configuration.parser = "markdown"
              graviton
                .getCurrentEditor()
                .editor.setValue(
                  prettier.format(editor.getValue(), configuration)
                )
              return
            default:
              new Notification({
                title:"Issue",
                content:"The current language is not supported."
              })
          }
        }
      }
    }
  })
})
