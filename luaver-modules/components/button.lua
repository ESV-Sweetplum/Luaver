---Creates an `imgui.Button()` element. `fn` is ran when the button is clicked. If `renderCondition` is passed, then the button will only render when `renderCondition` evaluates to true. Otherwise, renders a text element with `falsyText`.
---@param label string
---@param fn function
---@param renderCondition? boolean
---@param falsyText? string
function Button(label, fn, renderCondition, falsyText)
    renderCondition = renderCondition or true
    if (not renderCondition) and (type(falsyText) == "string") then
        Text(falsyText)
    end
    if (imgui.Button(label)) and renderCondition then
        fn()
    end
end
