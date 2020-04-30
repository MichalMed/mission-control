import { isActionOf } from 'typesafe-actions'
import { combineEpics } from 'redux-observable'
import { of, zip } from 'rxjs'
import { filter, map, switchMap, catchError } from 'rxjs/operators'

import { Epic } from 'app/types'
import Actions from 'app/actions'
import Routes from 'app/routes'
import { getJSON } from 'app/utils/ajax'
import { onRouteEnter } from 'app/utils/epic'

import { WORKSPACES_URL } from './constants'
import { Workspace } from './types'

const getDataOnRouteEnter: Epic = ($action, state$, dependencies) =>
  zip(
    $action.pipe(filter(isActionOf(Actions.App.initFinished))),
    onRouteEnter(Routes.Users, [Actions.Workspaces.getWorkspaces.request()])(
      $action,
      state$,
      dependencies
    )
  ).pipe(map(([init, action]) => action))

const getWorkspaces: Epic = ($action) =>
  $action.pipe(
    filter(isActionOf(Actions.Workspaces.getWorkspaces.request)),
    switchMap(() =>
      getJSON(WORKSPACES_URL).pipe(
        map((workspaces) =>
          Actions.Workspaces.getWorkspaces.success(workspaces as Workspace[])
        ),
        catchError((error: Error) =>
          of(
            Actions.Workspaces.getWorkspaces.failure(
              new Error(`Cannot load workspace: ${error.message}`)
            )
          )
        )
      )
    )
  )

export default combineEpics(getDataOnRouteEnter, getWorkspaces)
