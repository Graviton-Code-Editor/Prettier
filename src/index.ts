import prettier from 'prettier'
import * as path from 'path'

const defaultConfig = { semi: false , useTabs: true }

export const entry = ({ Window, StaticConfig, RunningConfig, Menu, puffin, Notification, SideMenu, drac }) => {
	
	let configuration: any = StaticConfig.data.prettierPlugin || defaultConfig
	
	StaticConfig.data.prettierPlugin = configuration
	
	new Menu({
		button: 'Prettier',
		list:[
			{
				label: 'Configuration',
				action(){
					if (configuration != undefined) delete configuration.parser

					const goSave = () => {
						try {
							configuration = JSON.parse(
								(document.getElementById("textarea_config") as HTMLInputElement).value
							)
							StaticConfig.data.prettierPlugin = configuration
							StaticConfig.triggerChange()
							
						} catch {
							new Notification({
								title:'Prettier',
								content:'There were an error while parsing the configuration.'
							})
						}
					}
					const setDefaultConfig = () => {
						(document.getElementById("textarea_config") as HTMLInputElement).value = JSON.stringify(
							defaultConfig
						)
						configuration = defaultConfig
						StaticConfig.data.prettierPlugin = configuration
						StaticConfig.triggerChange()
					}
					
					const styledTextArea = puffin.style`
						 & {
								border-radius: 5px;
								display: block;
								height: 100px;
								width: 200px;
							}
					`
					
					const ConfigurationWindow = new Window({
						component(){
							return puffin.element({
								components:{
									SideMenu,
									Button: drac.Button
								}
							})`
								<SideMenu default="configure">
									<div>
										<h1>Prettier</h1>
										<label to="configure">Configure</label>
									</div>
									<div>
										<div href="configure">
											<textarea class="${styledTextArea} id="textarea_config">${JSON.stringify(configuration)}</textarea>
											<Button class="button1" :click="${goSave}">Save</Button>
											<Button class="button1" :click="${setDefaultConfig}">Default</Button>
										</div>
									</div>
								</SideMenu>
							`
						}
					})
					ConfigurationWindow.launch()
				}
			},
			{
				label: 'Format',
				action(){
					const focusedTab = RunningConfig.data.focusedTab
					if (!focusedTab) {
						new Notification({
							title: 'Issue', 
							content: 'Open a file before formatting.'
						})
						return
					}

					if ( typeof focusedTab.state.data.directory !== 'string' || focusedTab.state.data.isEditor === false ) {
						return 	new Notification({
							title: 'Issue',
							content: 'Cannot format the current file.'
						})
					}

					const focusedFileExt = path.parse(focusedTab.state.data.directory).ext
					
					const { instance, client } = focusedTab.state.data.instance
					
					switch (focusedFileExt) {
						case '.js':
							client.do('doChangeValue',{
								instance,
								value: prettier.format(client.do('getValue', instance), {
									...configuration,
									parse: 'babel'
								})
							})
							return
						case '.css':
							client.do('doChangeValue',{
								instance,
								value: prettier.format(client.do('getValue', instance), {
									...configuration,
									parse: 'css'
								})
							})
							return
						case '.html':
							client.do('doChangeValue',{
								instance,
								value: prettier.format(client.do('getValue', instance), {
									...configuration,
									parse: 'html'
								})
							})
							return
						case '.md':
							client.do('doChangeValue',{
								instance,
								value: prettier.format(client.do('getValue', instance), {
									...configuration,
									parse: 'markdown'
								})
							})
							return
						default:
							new Notification({
								title: 'Issue',
								content: 'The current language is not supported.'
							})
					}
				}
			}
		]
	})
}
