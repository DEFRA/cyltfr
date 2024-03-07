class CommentEdit {
  constructor (comment, geometry, auth, capabilities, features) {
    this.comment = comment
    this.geometry = geometry
    this.capabilities = capabilities
    this.isApprover = auth.credentials.isApprover
    this.allowDelete = auth.credentials.isApprover ||
      comment.createdBy === auth.credentials.profile.email
    this.features = features
  }
}

module.exports = CommentEdit
