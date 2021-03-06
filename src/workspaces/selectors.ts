import { createSelector } from 'reselect'
import { values, sortBy } from 'lodash'

import { getWorkspaces as getState, getRoute } from 'app/selectors'
import { convertUserDataToUser } from 'users/selectors'

import { WorkspaceData, Workspace, VocabularyData, Vocabulary } from './types'
import getIdFromUri from 'app/utils/getIdFromUri'
import { VOCABULARY_CONTEXT_READ_ONLY } from 'app/vocabulary'

export const getWorkspacesLoading = createSelector(
  getState,
  (state) => state.isLoading
)

export const getVocabulariesLoading = createSelector(
  getState,
  (state) => state.isVocabulariesLoading
)

export const getVocabularies = createSelector(
  getState,
  (state) => state.vocabularies
)

const convertUnixTimestampToDate = (timestamp: number) => new Date(timestamp)

const convertVocabularyDataToVocabulary = (
  data: VocabularyData
): Vocabulary => ({
  uri: data.uri,
  id: getIdFromUri(data.uri),
  label: data.label,
  vocabulary: data.basedOnVocabularyVersion,
  isReadOnly: !!data.types && data.types.includes(VOCABULARY_CONTEXT_READ_ONLY),
  vocabularyContext: data.uri,
  changeTrackingContext: data.changeTrackingContext.uri,
  changeTrackingVocabulary: data.changeTrackingContext.changesVocabularyVersion,
})

const convertWorkspaceDataToWorkspace = ({
  author,
  lastEditor,
  created,
  lastModified,
  vocabularyContexts,
  ...rest
}: WorkspaceData): Workspace => ({
  ...rest,
  id: getIdFromUri(rest.uri),
  author: convertUserDataToUser(author),
  lastEditor: lastEditor && convertUserDataToUser(lastEditor),
  created: convertUnixTimestampToDate(created),
  lastModified:
    lastModified !== undefined
      ? convertUnixTimestampToDate(lastModified)
      : undefined,
  vocabularies: vocabularyContexts.map(convertVocabularyDataToVocabulary),
})

export const getWorkspaces = createSelector(getState, (state) =>
  values(state.workspaces).map(convertWorkspaceDataToWorkspace)
)

export const getIsAddWorkspaceFormOpen = createSelector(
  getState,
  (state) => state.isAddWorkspaceFormOpen
)

export const getIsEditWorkspaceFormOpen = createSelector(
  getState,
  (state) => state.isEditWorkspaceFormOpen
)

export const getIsDeleteWorkspaceFormOpen = createSelector(
  getState,
  (state) => state.isDeleteWorkspaceFormOpen
)

export const getIsPublishWorkspaceDialogOpen = createSelector(
  getState,
  (state) => state.isPublishWorkspaceDialogOpen
)

export const getPublishedWorkspacePRUri = createSelector(
  getState,
  (state) => state.publishedWorkspacePRUri
)

export const getIsAddVocabularyFormOpen = createSelector(
  getState,
  (state) => state.isAddVocabularyFormOpen
)

export const getIsDeleteVocabularyFormOpen = createSelector(
  getState,
  (state) => state.isDeleteVocabularyFormOpen
)

export const getWorkspace = createSelector(
  getState,
  getRoute,
  (state, route) => {
    const workspaceDataCandidate = state.workspaces[route?.params.id]
    return workspaceDataCandidate
      ? convertWorkspaceDataToWorkspace(workspaceDataCandidate)
      : undefined
  }
)

export const getWorkspaceVocabularies = createSelector(
  getWorkspace,
  (state) =>
    sortBy(state?.vocabularies, [(vocabulary) => vocabulary.isReadOnly]) || []
)

export const getTools = createSelector(getState, (state) => values(state.tools))
