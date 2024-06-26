---Combines two tables with no nesting.
---@param t1 table
---@param t2 table
---@return table
function table.combine(t1, t2)
    for i = 1, #t2 do
        t1[#t1 + 1] = t2[i]
    end
    return t1
end
