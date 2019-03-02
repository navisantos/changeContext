var openWorkspace;
var tabEvent;
var closeWorkspace;


function invoke(extension,acao,oldWS,newWS,objectType){
    if(objectType != 'Incident')
        return;
    extension.getGlobalContext().then(function(globalContext) {
        var param = {'acao': acao,'oldWS':oldWS,'newWS':newWS};
        globalContext.invokeAction('changeContext', param)
        .then(function(result) {})
        .catch(function(error) {console.log(error);});
    });
} 

ORACLE_SERVICE_CLOUD.extension_loader.load("changeContext" , "1.0")
.then(function(extensionProvider)
    {
    extensionProvider.registerWorkspaceExtension(function(workspaceRecord)
        {
        	workspaceRecord.addRecordClosingListener(function closedWorkspace(closedContext) {
                closeWorkspace = closedContext;
                console.log(closedWorkspace);
                invoke(extensionProvider,
                    closeWorkspace.event.event,
                    closeWorkspace.oldWorkspace.objectId,
                    closeWorkspace.newWorkspace.objectId,
                    closeWorkspace.newWorkspace.objectType);
            });
            workspaceRecord.addEditorLoadedListener(function loadedWorkspace(loadedParameter) {
                openWorkspace = loadedParameter;
                console.log(openWorkspace);
                invoke(extensionProvider,
                    openWorkspace.event.event,
                    openWorkspace.oldWorkspace.objectId,
                    openWorkspace.newWorkspace.objectId,
                    openWorkspace.newWorkspace.objectType);
            });

            workspaceRecord.addCurrentEditorTabChangedListener(function tabChanged(tabchangedParam) {
                tabEvent = tabchangedParam;
                console.log(tabEvent);
                invoke(extensionProvider,
                    tabEvent.event.event,
                    tabEvent.oldWorkspace.objectId,
                    tabEvent.newWorkspace.objectId,
                    tabEvent.newWorkspace.objectType);
            });

        }); 
});

