cacheCounter = 0

---Returns a boolean that tells when a variable has changed.
---@param var number | string | boolean
---@return boolean
function hasChanged(var)
  local oldValue = state.GetValue("cache_" .. cacheCounter)
  local returnCondition = (oldValue ~= var)

  if (oldValue == nil) then returnCondition = false end

  state.SetValue("cache_" .. cacheCounter, var)
  cacheCounter = cacheCounter + 1
  return returnCondition
end
