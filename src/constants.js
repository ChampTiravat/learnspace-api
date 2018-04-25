// ------------------------------------------------------------------
// Notification Events
// ------------------------------------------------------------------

// Classroom Invitation
export const RECIEVED_CLASSROOM_INVITATION = 'RECIEVED_CLASSROOM_INVITATION'
export const CANDIDATE_REFUSED_CLASSROOM_INVITATION = 'CANDIDATE_REFUSED_CLASSROOM_INVITATION'
export const CANDIDATE_ACCEPTED_CLASSROOM_INVITATION = 'CANDIDATE_ACCEPTED_CLASSROOM_INVITATION'

export const CLASSROOM_ACCEPTED_INVITATION = 'CLASSROOM_ACCEPTED_INVITATION'
export const CLASSROOM_REFUSED_INVITATION = 'CLASSROOM_REFUSED_INVITATION'

// Classroom
export const CLASSROOM_HAS_NEW_MEMBER = 'CLASSROOM_HAS_NEW_MEMBER'

// Post
export const CLASSROOM_HAS_NEW_POST = 'CLASSROOM_HAS_NEW_POST'

// ------------------------------------------------------------------
// Regular Expression Patterns
// ------------------------------------------------------------------
export const EMAIL_PATTERN = /.+@([a-zA-Zก-๙0-9-_]+)\.[a-zA-Z0-9-]+$/
export const ENG_THA_NUM_ALPHA = /^[a-zA-Z0-9ก-๙ ]+$/i
export const USER_ID_PATTERN = /^([0-9a-f]{24})$/i
export const PASSWORD_PATTERN = /[\w\d]{8,}/
