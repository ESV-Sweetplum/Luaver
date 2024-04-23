function drawExtension()
    routerDictionary[routerHistory[#routerHistory]]() -- Handles page rendering (routerDictionary is generated on transpile)
    getSelectedObjectsState()                         -- Handles object selection and auto-cache (selected and region globals)
    inputCounter = 1                                  -- Ensures that all input keys remain the same
    refreshSZ()                                       -- Establishes sz global
end
