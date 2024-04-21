local router = {}
local routerHistory = { "main" }

function router.push(path)
    table.insert(routerHistory, path)
end

function router.pop()
    if (#routerHistory < 2) then return end
    table.remove(routerHistory, #routerHistory)
end
