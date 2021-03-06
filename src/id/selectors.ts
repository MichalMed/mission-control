import { createSelector } from 'reselect'

import { getId as getState } from 'app/selectors'

export const getIdentity = getState

export const getInitials = createSelector(
  getState,
  ({ firstName, lastName }) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`
  }
)

export const getUsername = createSelector(getState, ({ username }) => username)

export const getIsAdmin = createSelector(getState, ({ admin }) => admin)
