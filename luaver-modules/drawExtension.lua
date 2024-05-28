function drawExtension()
    routerDictionary[routerHistory[#routerHistory]](paramHistory[#paramHistory]) -- Handles page rendering (routerDictionary is generated on transpile)
    getSelectedObjectsState()                                                    -- Handles object selection and auto-cache (selected and region globals)
    refreshSZ()                                                                  -- Establishes sz global
    cacheCounter = 0                                                             -- Reset cache counter
end
