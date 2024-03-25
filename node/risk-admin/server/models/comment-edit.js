class CommentEdit {
  constructor (commentData, authData) {
    this.comment = commentData.comment
    this.geometry = commentData.geometry
    this.capabilities = commentData.capabilities
    this.isApprover = authData.isApprover
    this.allowDelete = authData.isApprover ||
    commentData.comment.createdBy === authData.profile.email
    this.features = commentData.features
    this.id = commentData.id
    this.type = commentData.type
    this.selectedRadio = commentData.selectedRadio
    this.riskType = commentData.riskType
    this.textCommentRadio = commentData.textCommentRadio
  }
}

module.exports = CommentEdit
