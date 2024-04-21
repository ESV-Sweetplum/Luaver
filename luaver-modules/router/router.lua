---@class Router
---@field push? function
---@field pop? function

router = {} ---@type Router --- Router object. Use `push` to navigate to a designated page, or `pop` to go to a previous page.
routerHistory = { "main" } ---The order of navigated pages can be found here. The first element should always be `main`.

---Go to a designated page. `path` will be identical as the relative file path.
---@param path string
function router.push(path)
    table.insert(routerHistory, path)
end

---Go to the previous page.
function router.pop()
    if (#routerHistory < 2) then return end
    table.remove(routerHistory, #routerHistory)
end