---Returns a boolean that tells when a variable has changed.
---@param var number | string | boolean
---@return boolean
function hasChanged(var)
  local oldValue = state.GetValue("cache_" .. cacheCounter)
  cacheCounter = cacheCounter + 1
  local returnCondition = (oldValue == var)

  state.SetValue("cache_" .. cacheCounter, var)
  return returnCondition
end
