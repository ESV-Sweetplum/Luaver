---@class Router
---@field push? function
---@field pop? function

router = {} ---@type Router --- Router object. Use `push` to navigate to a designated page, or `pop` to go to a previous page.
routerHistory = { "main" } ---The order of navigated pages can be found here. The first element should always be `main`.

---Go to a designated page. `path` will be identical as the relative file path. If `path` is not given, returns to home page.
---@param path? string
function router.push(path)
    if (routerHistory[#routerHistory] == path) then return end
    table.insert(routerHistory, path or "main")
end

---Go to the previous page.
function router.pop()
    if (#routerHistory < 2) then return end
    table.remove(routerHistory, #routerHistory)
end
