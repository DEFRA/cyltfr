class CommentEdit {
  constructor (comment, geometry, auth) {
    this.comment = comment
    this.geometry = geometry
    this.isApprover = auth.credentials.isApprover
    this.allowDelete = auth.credentials.isApprover ||
      comment.createdBy === auth.credentials.profile.email
  }
}

module.exports = CommentEdit
