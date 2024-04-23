function drawExtension()
    routerDictionary[routerHistory[#routerHistory]]()
    getSelectedObjectsState()
    inputCounter = 1
    refreshSZ()
end
